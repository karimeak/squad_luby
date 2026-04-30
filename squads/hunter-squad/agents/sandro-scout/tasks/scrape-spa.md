---
task: "Scrape SPA Infinite Scroll Sites"
order: 3
input: |
  - scrape_queue: Sites filtered to scraper_type == "spa_infinite_scroll"
  - cutoff_date: ISO-8601 datetime, 7 days before run_at
  - job_titles: List of 90+ target job titles
output: |
  - spa_results: Dict of site_name -> {jobs: [], error: null|str, duration_ms: int}
---

# Scrape SPA Infinite Scroll Sites

**Description**: Scrapes React/Vue/Angular SPAs with infinite scroll using Playwright's JavaScript execution and network interception. More complex than `generic_listing` due to client-side rendering — the DOM is built dynamically via JS, so standard pagination navigation does not apply. Uses scroll simulation with hard stop conditions to prevent infinite loops.

## Why SPAs Are Different

Generic listing sites serve pre-rendered HTML — Playwright can navigate pages with `click("next")`. SPAs render content in the browser using JavaScript: clicking "next" may not trigger a navigation, and new jobs may load via fetch/XHR as the user scrolls. This task handles both the scroll simulation and the API interception strategy.

## Process

1. **Filter queue**: Reduce `scrape_queue` to sites where `scraper_type == "spa_infinite_scroll"`.
2. **Initialize concurrency**: Reuse `asyncio.Semaphore(5)` from the outer scraping context.
3. **Define retry wrapper** — same pattern as `scrape-generic`, applied at site level:
   ```python
   import random

   RETRYABLE_ERRORS = (TimeoutError, PlaywrightError)

   async def scrape_spa_with_retry(site, semaphore, cutoff_date, job_titles, max_retries=3, base_delay=2.0):
       last_error = None
       for attempt in range(max_retries):
           try:
               return await scrape_spa_site(site, semaphore, cutoff_date, job_titles)
           except RETRYABLE_ERRORS as e:
               last_error = e
               if attempt == max_retries - 1:
                   break
               wait = base_delay * (2 ** attempt) * random.uniform(0.8, 1.2)
               print(f"[scrape-spa][{site.name}] attempt {attempt + 1} failed ({type(e).__name__}), retrying in {wait:.1f}s...")
               await asyncio.sleep(wait)
           except Exception as e:
               # Non-retryable: SelectorNotFound (page structure changed), ParseError
               return build_error_result(site, e, attempts=attempt + 1)
       return build_error_result(site, last_error, attempts=max_retries)
   ```
   - SPA sites are more prone to `TimeoutError` on initial load — retry especially useful here
   - `SelectorNotFound` (initial job cards never appeared) → **non-retryable**: structural failure, not transient
   - **Delays**: ~2s, ~4s before 3rd attempt → total max wait ~6s before declaring failure

4. **For each site in parallel** (`asyncio.gather(*[scrape_spa_with_retry(s, ...) for s in spa_sites])`):

   a. **Acquire semaphore** — `async with semaphore:` wraps the entire site scrape.

   b. **Open stealth browser context**:
      ```python
      browser = await playwright.chromium.launch(headless=True)
      context = await browser.new_context(user_agent=random_ua())
      await stealth_async(context)  # playwright-stealth
      page = await context.new_page()
      ```

   c. **Set up network interception BEFORE navigation**:
      ```python
      intercepted_jobs = []
      api_intercepted = False

      async def capture_api_calls(response):
          nonlocal api_intercepted
          if response.status == 200 and "json" in response.headers.get("content-type", ""):
              try:
                  data = await response.json()
                  jobs = extract_jobs_from_api(data)  # heuristic extraction
                  if jobs:
                      intercepted_jobs.extend(jobs)
                      api_intercepted = True
              except Exception:
                  pass

      page.on("response", capture_api_calls)
      ```

   d. **Navigate to `base_url`**:
      ```python
      await page.goto(site.base_url, wait_until="domcontentloaded", timeout=30000)
      ```

   e. **Wait for initial job cards**:
      ```python
      await page.wait_for_selector(
          ".job-card, [data-job], [data-job-id], article.job, li.job-listing",
          timeout=15000
      )
      ```

   f. **Infinite scroll loop**:
      ```python
      scroll_count = 0
      prev_count = 0

      while scroll_count < site.max_pages:
          # Scroll to bottom
          await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
          await page.wait_for_timeout(1500)  # wait for lazy load

          # Check: no new items loaded (SPA finished)
          current_items = await page.locator(".job-card, [data-job], article.job").count()
          if current_items == prev_count:
              stop_reason = "no_new_items"
              break
          prev_count = current_items

          # Check: oldest visible job date exceeded cutoff
          oldest_visible = get_oldest_job_date(page)
          if oldest_visible and oldest_visible < cutoff_date:
              stop_reason = "date_cutoff"
              break

          # Throttle between scrolls
          await page.wait_for_timeout(site.throttle_ms)
          scroll_count += 1
      else:
          stop_reason = "max_pages"
      ```

   g. **Extract all visible job cards** after scroll stops:
      ```python
      if api_intercepted:
          raw_jobs = intercepted_jobs
      else:
          raw_jobs = await extract_dom_jobs(page)
      ```

   h. **Apply date filter**: Discard all jobs where `posted_at < cutoff_date`.

   i. **Apply title filter**: Keep only jobs where `title` contains (case-insensitive substring) any string from `job_titles` list.

   j. **Build per-site result** with stats.

5. **Close pages in `finally` blocks**:
   ```python
   try:
       # scraping logic
   except Exception as e:
       result = build_error_result(site, e)
   finally:
       await page.close()
       await context.close()
   ```

6. **Return** `spa_results` dict after all coroutines complete.

## Output Format

```yaml
spa_results:
  "<site_name>":
    jobs:
      - title: str
        company: str
        url: str
        description: str
        location: str
        posted_at: "ISO-8601"
        source: str         # site display name, e.g. "Wellfound"
        _source_site: str   # site key name, e.g. "wellfound"
    error: null | str
    scroll_count: int
    stop_reason: "date_cutoff" | "no_new_items" | "max_pages"
    api_intercepted: bool
    duration_ms: int
```

## Output Example

```json
{
  "spa_results": {
    "wellfound": {
      "jobs": [
        {
          "title": "Senior Data Engineer",
          "company": "Notion",
          "url": "https://wellfound.com/jobs/3021847-senior-data-engineer",
          "description": "Build the data infrastructure powering Notion's analytics and ML teams. Own our Kafka and Spark pipelines. Strong Python and SQL required.",
          "location": "Remote — Worldwide",
          "posted_at": "2026-04-27T11:00:00Z",
          "source": "Wellfound",
          "_source_site": "wellfound"
        },
        {
          "title": "ML Engineer — Inference",
          "company": "Cohere",
          "url": "https://wellfound.com/jobs/3021612-ml-engineer-inference",
          "description": "Optimize model inference at scale. Work on quantization, batching, and hardware-aware optimizations for our LLM serving stack.",
          "location": "Remote — North America",
          "posted_at": "2026-04-26T14:30:00Z",
          "source": "Wellfound",
          "_source_site": "wellfound"
        },
        {
          "title": "Backend Engineer — Platform",
          "company": "Linear",
          "url": "https://wellfound.com/jobs/3020944-backend-engineer-platform",
          "description": "Build the core backend infrastructure for Linear's project management product. TypeScript, PostgreSQL, and Redis experience preferred.",
          "location": "Remote — US/EU",
          "posted_at": "2026-04-25T09:45:00Z",
          "source": "Wellfound",
          "_source_site": "wellfound"
        },
        {
          "title": "Data Scientist — Growth",
          "company": "Figma",
          "url": "https://wellfound.com/jobs/3020301-data-scientist-growth",
          "description": "Drive experimentation and analytics for Figma's growth team. Design A/B tests, build dashboards, and surface insights from our user data.",
          "location": "Remote — Americas",
          "posted_at": "2026-04-24T16:20:00Z",
          "source": "Wellfound",
          "_source_site": "wellfound"
        }
      ],
      "error": null,
      "scroll_count": 7,
      "stop_reason": "date_cutoff",
      "api_intercepted": true,
      "duration_ms": 22150
    },
    "remotehub": {
      "jobs": [],
      "error": "SelectorNotFound: .job-card not found within 15000ms — page structure may have changed",
      "scroll_count": 0,
      "stop_reason": null,
      "api_intercepted": false,
      "duration_ms": 15000
    }
  }
}
```

## Quality Criteria

- [ ] `stop_reason` always recorded — every site result has a non-null `stop_reason` (or `null` only when `error` is non-null)
- [ ] `api_intercepted: true` logged when XHR/fetch used instead of DOM — enables downstream audit of data quality
- [ ] Scroll wait uses `await page.wait_for_timeout(1500)` — not `time.sleep()` — verified in code review
- [ ] No raw HTML in returned job fields — title, company, description, location must be plain text strings
- [ ] Three-condition loop guard present: `no_new_items` check + `date_cutoff` check + `max_pages` hard cap
- [ ] `asyncio.Semaphore(5)` applied — SPA sites share the same semaphore as generic sites
- [ ] Retry applied: `TimeoutError` and `PlaywrightError` retried up to 3 times with exponential backoff
- [ ] `SelectorNotFound` (initial cards never appeared) fails immediately — non-retryable structural error
- [ ] Each retry logged: `[scrape-spa][site_name] attempt N failed (ErrorType), retrying in Xs...`

## Veto Conditions

1. **Infinite scroll loop exceeds `max_pages` without any date-based stop** — If the loop exits only via `max_pages` and `oldest_visible` was never older than `cutoff_date`, log a warning: `[scrape-spa][site_name] WARNING: hit max_pages without date cutoff — data may be incomplete. Consider increasing max_pages in config.` Abort the individual site scrape if `scroll_count > max_pages * 2` (safety circuit breaker for config errors).

2. **`spa_results` is empty dict (all SPA sites failed)** — Abort the pipeline with error: `"scrape-spa: All SPA sites returned errors. Possible Playwright issue or network problem. Check per-site error_type in logs."` An empty SPA results dict combined with generic_results is acceptable, but zero SPA results when SPA sites were in the queue indicates a systemic failure.
