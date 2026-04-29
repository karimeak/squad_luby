---
task: "Scrape Generic Listing Sites"
order: 2
input: |
  - scrape_queue: Sites filtered to scraper_type == "generic_listing"
  - cutoff_date: ISO-8601 datetime, 7 days before run_at
  - job_titles: List of 90+ target job titles
output: |
  - generic_results: Dict of site_name -> {jobs: [], error: null|str, duration_ms: int}
---

# Scrape Generic Listing Sites

**Description**: Uses Playwright with `asyncio.Semaphore(5)` to scrape all `generic_listing` sites in parallel. Applies date-based pagination stop and title filtering on every page before collecting results. Generic listing sites use classic server-rendered pagination (next/prev buttons or numbered pages).

## Process

1. **Filter queue**: Reduce `scrape_queue` to sites where `scraper_type == "generic_listing"`.
2. **Initialize concurrency**: Create `semaphore = asyncio.Semaphore(5)`. All site coroutines share this semaphore.
3. **For each site in parallel** (`asyncio.gather(*[scrape_site(s) for s in generic_sites])`):

   a. **Acquire semaphore** — `async with semaphore:` wraps the entire site scrape.

   b. **Open stealth browser context**:
      ```python
      browser = await playwright.chromium.launch(headless=True)
      context = await browser.new_context(user_agent=random_ua())
      await stealth_async(context)  # playwright-stealth
      page = await context.new_page()
      ```

   c. **Navigate to `base_url`**:
      ```python
      await page.goto(site.base_url, wait_until="networkidle", timeout=30000)
      ```

   d. **Try XHR interception first**: Set up `page.on("response", capture_json_response)` handler before navigation. If the handler captures structured job data (JSON array with title/company fields), use that instead of DOM parsing.

   e. **If no XHR captured**: Parse DOM job cards using site-specific selectors from `sites-config.json`. Common patterns: `.job-card`, `[data-job-id]`, `article.job`, `li.listing-item`.

   f. **Pagination loop**:
      ```python
      page_count = 0
      all_jobs = []
      while page_count < site.max_pages:
          jobs_on_page = extract_jobs(page)
          all_jobs.extend(jobs_on_page)
          oldest = min(j["posted_at"] for j in jobs_on_page) if jobs_on_page else None
          if oldest and oldest < cutoff_date:
              stop_reason = "date_cutoff"
              break
          next_btn = page.locator("a[rel='next'], button.next-page, .pagination-next")
          if await next_btn.count() == 0:
              stop_reason = "no_more_results"
              break
          await next_btn.click()
          await page.wait_for_load_state("networkidle")
          await page.wait_for_timeout(site.throttle_ms)
          page_count += 1
      else:
          stop_reason = "max_pages"
      ```

   g. **Apply date filter**: Discard all jobs where `posted_at < cutoff_date`.

   h. **Apply title filter**: Keep only jobs where `title` contains (case-insensitive substring) any string from `job_titles` list.

   i. **Build per-site result** with stats.

4. **Close pages in `finally` blocks**:
   ```python
   try:
       # scraping logic
   except Exception as e:
       result = build_error_result(site, e)
   finally:
       await page.close()
       await context.close()
   ```

5. **Return** `generic_results` dict after all coroutines complete.

## Output Format

```yaml
generic_results:
  "<site_name>":
    jobs:
      - title: str
        company: str
        url: str
        description: str
        location: str
        posted_at: "ISO-8601"
        source: str         # site display name, e.g. "RemoteOK"
        _source_site: str   # site key name, e.g. "remoteok"
    error: null | str
    pages_scraped: int
    stop_reason: "date_cutoff" | "max_pages" | "no_more_results"
    xhr_intercepted: bool
    duration_ms: int
```

## Output Example

```json
{
  "generic_results": {
    "remoteok": {
      "jobs": [
        {
          "title": "Senior Data Engineer",
          "company": "Stripe",
          "url": "https://remoteok.com/remote-jobs/senior-data-engineer-stripe-1294823",
          "description": "Design and maintain large-scale data pipelines using Apache Spark and dbt. Work closely with analytics and ML teams to deliver reliable data products.",
          "location": "Worldwide / Remote",
          "posted_at": "2026-04-27T14:30:00Z",
          "source": "RemoteOK",
          "_source_site": "remoteok"
        },
        {
          "title": "ML Engineer",
          "company": "Hugging Face",
          "url": "https://remoteok.com/remote-jobs/ml-engineer-hugging-face-1294756",
          "description": "Build and deploy machine learning models at scale. Experience with PyTorch and transformer architectures required.",
          "location": "Remote — Americas",
          "posted_at": "2026-04-26T09:15:00Z",
          "source": "RemoteOK",
          "_source_site": "remoteok"
        },
        {
          "title": "Backend Software Engineer",
          "company": "Cloudflare",
          "url": "https://remoteok.com/remote-jobs/backend-software-engineer-cloudflare-1294601",
          "description": "Join our core infrastructure team to build high-performance services in Go and Rust. You will design APIs used by millions of developers.",
          "location": "Remote — US/EU",
          "posted_at": "2026-04-24T17:45:00Z",
          "source": "RemoteOK",
          "_source_site": "remoteok"
        }
      ],
      "error": null,
      "pages_scraped": 3,
      "stop_reason": "date_cutoff",
      "xhr_intercepted": false,
      "duration_ms": 8420
    },
    "weworkremotely": {
      "jobs": [],
      "error": "TimeoutError: wait_for_load_state networkidle exceeded 30000ms",
      "pages_scraped": 0,
      "stop_reason": null,
      "xhr_intercepted": false,
      "duration_ms": 30000
    }
  }
}
```

## Quality Criteria

- [ ] `asyncio.Semaphore(5)` enforced — max 5 concurrent browser tabs at any moment
- [ ] All pages closed in `finally` blocks — no memory leaks on exception paths
- [ ] Stop condition: BOTH `posted_at < cutoff_date` check AND `page_count >= max_pages` cap present in every pagination loop
- [ ] Title filter applied: no jobs with titles not matching the `job_titles` list reach `generic_results`
- [ ] `throttle_ms` respected between page navigations — verified by `duration_ms` being > `pages_scraped * throttle_ms`
- [ ] `xhr_intercepted` field always present (true/false) in every result
- [ ] `stop_reason` always set to one of: `"date_cutoff"`, `"max_pages"`, `"no_more_results"`, or `null` on error

## Veto Conditions

1. **Any site result has `error: null` but `jobs: []` AND `stop_reason != "date_cutoff"`** — This indicates a silent selector failure. Log a warning: `[scrape-generic][site_name] WARNING: 0 jobs returned without error and without date cutoff — possible selector failure. Verify selectors in sites-config.json.` Do not abort; continue, but flag for investigation.

2. **Total successful jobs across all sites < 100** — Warn at collection level: `[scrape-generic] WARNING: Only N total jobs collected. Possible widespread selector failures or sites changed their HTML structure. Review per_site_stats.` Do not abort; let collect-results handle the veto decision.
