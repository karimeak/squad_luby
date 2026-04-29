# Anti-Patterns — Hunter Squad
# Common mistakes, why they happen, and how to avoid them

---

## Sandro Scout — Scraping Anti-Patterns

### Never Do

1. **Using `time.sleep()` instead of Playwright event-based waits**
   Why harmful: Creates race conditions. The page may not be ready after a fixed sleep,
   causing selector failures. Or wastes time sleeping when the page already loaded.
   Fix: Always use `page.wait_for_selector()`, `page.wait_for_load_state("networkidle")`,
   or `page.wait_for_timeout()` with Playwright's auto-waiting.

2. **Opening unlimited browser contexts without a Semaphore**
   Why harmful: 45 sites × uncapped contexts = RAM exhaustion, OOM kill of the process.
   Fix: `asyncio.Semaphore(5)` — max 5 concurrent tabs. Adjust based on available memory.

3. **Infinite scroll loop without date + page-count termination**
   Why harmful: SPA sites with large catalogs can serve thousands of pages. Loop never
   terminates, pipeline hangs for hours.
   Fix: Always check BOTH conditions: `oldest_visible_date < cutoff` AND `page_count >= max_pages`.

4. **Attempting to scrape `requires_auth` sites without a session**
   Why harmful: LinkedIn bot detection bans the IP within minutes. Auth failures create
   noisy errors that obscure real scraping failures.
   Fix: Check `scraper_type == "requires_auth"` FIRST. Log the skip. Never attempt.

5. **Parsing HTML DOM when an XHR/fetch API response is available**
   Why harmful: DOM parsing is brittle. A CSS class rename breaks the scraper.
   API responses are structured, stable, and faster to parse.
   Fix: Use `page.on("response", ...)` to intercept network calls. Parse JSON directly.

6. **No `finally` block around `page.close()`**
   Why harmful: If scraping throws an exception, the browser page leaks. After 200+
   exceptions, the browser process exhausts OS file descriptors.
   Fix: Always `try: ... finally: await page.close()`.

7. **Logging errors by swallowing them**
   Why harmful: `except: pass` makes failures invisible. One site timing out looks the
   same as a successful zero-result site.
   Fix: Log `{site, error_type, error_message, duration_ms}` for every failure.

### Always Do

1. **Pre-clean extracted text before returning** — strip HTML tags, normalize whitespace,
   remove embedded scripts. The Normalizer expects clean strings, not HTML soup.

2. **Respect `throttle_ms` from site config** — inter-request delays prevent IP bans
   and respect the target site's server. Aggressive scrapers get blocked.

3. **Report partial results** — if 40/45 sites succeed and 5 fail, still return the 40.
   Do not abort the entire run because one site timed out.

---

## Natália Norm — Normalization Anti-Patterns

### Never Do

1. **Deduplicating on raw URL strings without normalization**
   Why harmful: `https://Jobs.Example.Com/123` and `https://jobs.example.com/123/`
   are the same job but produce different strings. False duplicates accumulate.
   Fix: Lowercase, strip trailing slash, remove tracking params BEFORE hashing.

2. **Using the raw scraped URL as the database primary key**
   Why harmful: URLs can change (redirects, CDN URLs). SHA-256 hash is stable.
   Fix: Always compute `url_sha256 = SHA256(normalized_url)` and use it as dedup key.

3. **Discarding records with missing source_job_id**
   Why harmful: Many sites don't expose job IDs. Discarding them loses 20-40% of data.
   Fix: Fall back to `source::url_sha256` composite key for sites without job IDs.

4. **Passing non-serializable Python types in `raw_payload`**
   Why harmful: `datetime` objects, `set` types, and `Decimal` crash JSON serialization.
   Fix: Convert all values to JSON-safe types before assembling `raw_payload`.

5. **Normalizing without reporting stats**
   Why harmful: Silent normalization makes it impossible to detect upstream scraping regressions.
   Fix: Always report `{total_input, after_filter, after_dedup, final_batch_size}`.

---

## Ana Analyst — LLM Extraction Anti-Patterns

### Never Do

1. **Using Batch API + Structured Outputs without `betas` at top-level call**
   Why harmful: Silent failure. The API returns `Extra inputs are not permitted` error.
   The batch processes but returns unstructured text, not the expected JSON schema.
   Fix: Pass `betas=["structured-outputs-2025-11-13"]` at the top-level `create()` call,
   NOT inside the `params` dict of each request.

2. **Treating structured output as a guarantee of correctness**
   Why harmful: Structured outputs guarantee FORMAT, not semantic accuracy. The model
   can return a perfectly valid JSON with incorrect skill extraction.
   Fix: Add `extraction_confidence` field. Flag records where critical fields are all null.

3. **Passing raw HTML or 50KB+ job pages to the model**
   Why harmful: Long context degrades extraction accuracy. Boilerplate (nav menus, footer
   text, cookie banners) confuses the model about what the actual job description says.
   Fix: Pre-clean: strip HTML tags, remove boilerplate, truncate to 4,000 tokens max.

4. **Not specifying null instructions for optional fields**
   Why harmful: Without explicit null instructions, the model infers plausible values.
   "competitive salary" becomes `ai_salary_minvalue: 120000`. Hallucinated data.
   Fix: "Return null for any field not explicitly stated in the text."

5. **Processing 1,000+ jobs without chunking**
   Why harmful: Hitting Claude API rate limits (429 errors) stalls the entire batch.
   A single rate limit error with no retry logic fails the entire enrichment run.
   Fix: Process in chunks of 15 with 4s inter-chunk delay. Implement exponential backoff.

6. **Using vague seniority labels in the schema**
   Why harmful: Without a closed enum, the model returns "Senior+", "L5", "Experienced",
   "Mid-Level", etc. Inconsistent values break downstream filtering.
   Fix: Normalize to exactly: `"junior"|"mid"|"senior"|"staff"|"principal"|null`.

### Always Do

1. **Log failed extractions with job_id** — if a record fails structured extraction,
   log the job_id so it can be retried or reviewed. Never silently discard.

2. **Pre-clean descriptions before sending** — consistent input quality dramatically
   improves extraction accuracy (measured: 70% → 88%+ accuracy with clean input).

---

## Inês Insert — Database Anti-Patterns

### Never Do

1. **Passing `on_conflict` as a Python list**
   Why harmful: `on_conflict=["url_sha256"]` causes silent failure or `42P10 error`.
   The PostgREST API expects a comma-separated string.
   Fix: Always `on_conflict="url_sha256"` (string, not list).

2. **Using default 4-second httpx timeout for large batches**
   Why harmful: 500-row chunks with heavy JSON payloads regularly exceed 4 seconds.
   The SDK raises `ReadTimeout` and the chunk silently fails.
   Fix: `ClientOptions(postgrest_client_timeout=30)` for normal RPCs;
   `postgrest_client_timeout=180` for `refresh_target_jobs_all`.

3. **Sending all records in one API call**
   Why harmful: PostgREST has a 10 MB request body limit. Large batches hit this limit
   and fail. No partial success — entire batch is lost.
   Fix: Always chunk at 500 rows maximum.

4. **Running RPC 2-4 if RPC 1 failed**
   Why harmful: `promote_apify_jobs_to_jobs_analyzed` reads from bronze. If bronze
   ingest failed, promote runs on stale data. Corrupts silver layer.
   Fix: Check RPC 1 result explicitly. Raise and stop if it failed.

5. **Assuming Python SDK retries automatically**
   Why harmful: The Supabase JavaScript SDK has built-in retries. Python SDK does NOT.
   Transient 503s and network timeouts fail permanently without manual retry logic.
   Fix: Implement exponential backoff wrapper around every RPC call.

6. **No dead-letter logging for failed chunks**
   Why harmful: If chunk 3/10 fails and you abort, you have no record of which jobs
   were not ingested. Re-running risks duplicates for chunks 1-2.
   Fix: Collect failed chunks, log with error details, report in execution summary.

---

## Marcos Maestro — Orchestration Anti-Patterns

### Never Do

1. **Querying `hunter_sites` with `ORDER BY` missing**
   Why harmful: PostgreSQL does not guarantee row order without `ORDER BY`.
   Tier 1 sites (high priority) might be scraped last, wasting early pipeline capacity.
   Fix: Always `ORDER BY priority DESC`.

2. **Updating `last_run_at` before the pipeline completes**
   Why harmful: If the pipeline fails after Maestro updates the timestamp, the next
   scheduled run sees a recent `last_run_at` and may skip sites that weren't actually scraped.
   Fix: Update `last_run_at` only in Step 10, after all RPCs complete successfully.

3. **Treating estimated time as a hard deadline**
   Why harmful: SPA sites with infinite scroll can take significantly longer than estimates.
   If Maestro cancels Scout after the estimate, valid data is lost.
   Fix: Estimate is informational only for the user at the checkpoint. Never use as a timeout.
