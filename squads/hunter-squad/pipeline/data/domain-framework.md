# Domain Framework — Hunter Squad
# ETL Pipeline: Web Scraping → LLM Enrichment → Supabase

---

## Operational Framework: Job Scraping ETL Pipeline

### Architecture: Medallion Pattern

```
Bronze Layer: apify_jobs
  └─ Raw scraped data, no transformation
  └─ Fields: source, source_job_id, url, url_sha256, raw_payload, fetched_at

Silver Layer: jobs_analyzed
  └─ Normalized, deduplicated, LLM-enriched
  └─ Fields: title, company, skills[], experience, salary, location, ...

Gold Layer: targets + target_jobs
  └─ Company profiles + job→company relationships
  └─ Ready for application/presentation
```

---

## Phase 1: Site Orchestration (Marcos Maestro)

### Process
1. Query `hunter_sites WHERE active = true ORDER BY priority DESC`
2. Categorize sites by tier and scraper_type:
   - Tier 1 (priority 90-100): max_pages=10, throttle_ms from config
   - Tier 2 (priority 70-89): max_pages=10
   - Tier 3 (priority 50-69): max_pages=5
   - Tier 4 (priority 30-49): max_pages=5
   - Tier 5-9 (priority < 30): max_pages=2
3. Separate `requires_auth` sites (skip + log)
4. Estimate execution time: ~30-90 seconds per site
5. Build dispatch manifest: list of site configs for Scout
6. Write manifest to `sites-config.json`

### Output Schema
```yaml
sites_config:
  total_sites: int
  active_sites: int
  auth_skip_sites: int
  estimated_minutes: int
  tiers:
    tier_1: [{name, url, scraper_type, priority, max_pages, throttle_ms}]
    tier_2: [...]
  skipped: [{name, reason: "requires_auth"}]
```

---

## Phase 2: Web Scraping (Sandro Scout)

### Auth-Skip Protocol
1. Read scraper_type from config
2. For `requires_auth` sites: log skip with reason, add to skipped_sites list
3. NEVER attempt to authenticate — skip silently and continue

### Generic Listing Scraping
1. Navigate to base_url with stealth browser context
2. Wait for job cards to appear (`wait_for_selector`)
3. Extract job data from DOM or intercept XHR responses
4. Apply date filter: discard jobs with `posted_at < now() - 7 days`
5. **Stop pagination condition**: `oldest_job_on_page < cutoff_date OR page_count >= max_pages`
6. Apply throttle_ms between page requests
7. Return array of raw job objects

### SPA Infinite Scroll Scraping
1. Navigate with stealth context
2. Intercept network responses to capture API calls when available
3. Scroll: `window.scrollTo(0, document.body.scrollHeight)` + wait 1.5s
4. Check: new items loaded? If count unchanged → stop
5. Date check: if oldest visible item < cutoff_date → stop
6. Hard stop: `page_count >= max_pages`
7. Return array of raw job objects

### Error Handling Per Site
- Timeout (>30s): log error, continue to next site
- 403/429: log rate-limit error, add to failed_sites, continue
- Selector not found: log scraping-failure, continue
- Result: `{site_name: {jobs: [...], error: null|string, duration_ms: int}}`

### Consolidation (collect-results.md)
1. Merge all site result arrays into single flat array
2. Filter: only include jobs with `posted_at >= cutoff_date`
3. Filter: only include jobs matching job title list (case-insensitive substring match)
4. Build execution summary: per-site stats (found, filtered, errors)
5. Write to `scraped-jobs.json`

---

## Phase 3: Normalization & Dedup (Natália Norm)

### Schema Mapping (Bronze)
```python
for raw in scraped_jobs:
    record = {
        "source": raw["_source_site"],
        "source_job_id": extract_job_id(raw),  # site-specific ID extraction
        "url": normalize_url(raw["url"]),
        "url_sha256": sha256(normalize_url(raw["url"])),
        "raw_payload": raw,
        "fetched_at": now_utc(),
        "scrapy_query_id": None,
    }
```

### Deduplication
1. Primary key: `source::source_job_id` (when source_job_id available)
2. Fallback key: `source::url_sha256` (when no source_job_id)
3. Within-batch dedup first (in-memory), then cross-run dedup handled by DB upsert

### Batch Assembly
1. Chunk final array into groups of 500 for Supabase
2. Validate: all records have `source`, `url`, `url_sha256`, `raw_payload`
3. Write to `normalized-batch.json`

---

## Phase 4: Database Ingestion — Bronze (Inês Insert, Step 06)

### RPC 1: ingest_apify_jobs_bronze
```python
result = supabase.rpc(
    "ingest_apify_jobs_bronze",
    {"p_items": normalized_batch, "p_scrapy_query_id": None, "p_default_source": None}
).execute()
```
- Chunk batch into 500-row groups
- Use 30s timeout
- On failure: abort and alert (do NOT proceed to Analyst)
- Log: `{inserted: N, skipped_duplicates: M}`

---

## Phase 5: LLM Enrichment (Ana Analyst)

### Fetch Target Records
```sql
SELECT id, raw_payload->>'description' as description
FROM apify_jobs
WHERE raw_payload->>'ai_key_skills' IS NULL
  AND fetched_at >= now() - interval '24 hours'
ORDER BY fetched_at DESC
```

### Chunking Strategy
1. Split records into chunks of 15
2. Process each chunk: call Claude API with structured output schema
3. Wait 4 seconds between chunks (rate limit compliance)
4. For each result: UPDATE `apify_jobs SET raw_payload = raw_payload || ai_fields WHERE id = ?`

### Extraction Schema (ai_* fields)
```yaml
ai_key_skills: [list of explicit technical skills/tools]
ai_keywords: [list of required keywords]
ai_experience_level: "junior"|"mid"|"senior"|"staff"|"principal"|null
ai_core_responsibilities: "summary text"|null
ai_requirements_summary: "summary text"|null
ai_salary_minvalue: number|null
ai_salary_unittext: "HOUR"|"YEAR"|null
remote_derived: true|false|null
domain_derived: "company.com"|null
locations_derived: ["United States"]
cities_derived: ["San Francisco"]
regions_derived: ["California"]
countries_derived: ["United States"]
```

---

## Phase 6: Database Promote Pipeline (Inês Insert, Step 09)

### Execution Order (MUST be sequential)
1. `promote_apify_jobs_to_jobs_analyzed({})` — bronze → silver (30s timeout)
2. `upsert_targets_from_jobs_analyzed({})` — extract company profiles (30s timeout)
3. `refresh_target_jobs_all({})` — rebuild target_jobs pivot (180s timeout)

### Failure Policy
- If RPC 2 fails: alert and stop (do NOT run 3 or 4)
- If RPC 3 fails: alert and stop (do NOT run 4)
- If RPC 4 fails: alert (data integrity maintained, but pivot stale)
- NEVER skip a failed RPC silently

---

## Phase 7: Run Logging (Marcos Maestro, Step 10)

### Update hunter_sites
```sql
UPDATE hunter_sites
SET last_run_at = now()
WHERE name = ANY(successfully_scraped_sites)
```

### Execution Log
```yaml
run_summary:
  run_at: "2026-04-28T09:00:00Z"
  total_sites_attempted: 45
  sites_succeeded: N
  sites_skipped_auth: 2  # LinkedIn + 1 other
  sites_failed: M
  raw_jobs_collected: N
  after_dedup: M
  bronze_inserted: K
  silver_promoted: J
  targets_upserted: I
  errors: [{site: "glassdoor", error: "timeout after 30s"}]
```
