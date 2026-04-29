# Quality Criteria — Hunter Squad
# Measurable acceptance thresholds per agent and per pipeline phase

---

## Sandro Scout — Scraping Quality

### Per-Site Criteria
- [ ] Page load success rate > 95% (across test set of 100 URLs)
- [ ] All 429/503/timeout errors caught and retried (max 3 attempts, exponential backoff)
- [ ] Memory stable after scraping 1,000+ pages (no unbounded context leak)
- [ ] Date-based stop condition enforced: no jobs older than 7 days in output
- [ ] Page-count hard cap enforced: max_pages respected per tier
- [ ] Zero sites cause pipeline to crash — all errors are caught, logged, and skipped
- [ ] `requires_auth` sites: 100% skipped with log entry (no auth attempts)

### Output Quality
- [ ] Every job has `url`, `title`, `company` (minimum required fields)
- [ ] `posted_at` present and parseable for > 90% of jobs
- [ ] `source` field correctly set to site name for 100% of records
- [ ] No HTML tags or script content in `title` or `description` fields
- [ ] Volume in expected range: 3,000–8,000 raw jobs per run (warn if < 500 or > 15,000)

### Per-Site Error Budget
- Tier 1 sites (priority 90-100): 0 scraping failures acceptable
- Tier 2 sites (priority 70-89): ≤ 1 failure acceptable
- Tier 3-5 sites (priority 30-69): ≤ 3 failures acceptable

---

## Natália Norm — Normalization Quality

### Schema Completeness
- [ ] 100% of records have `source`, `url`, `url_sha256`, `raw_payload`
- [ ] `url_sha256` = SHA-256 of normalized URL (lowercase, no trailing slash, no tracking params)
- [ ] `source_job_id` present for > 70% of records (sites that expose job IDs)
- [ ] `fetched_at` in ISO-8601 UTC format for 100% of records

### Deduplication Effectiveness
- [ ] Re-running same scraped batch → 0 new records added to output
- [ ] Dedup key coverage: 100% of records have either source_job_id or url_sha256 key
- [ ] Within-batch duplicate rate reported (expected < 5%)

### Batch Integrity
- [ ] Batch JSON valid and parseable
- [ ] No records with null `url` or null `source`
- [ ] Chunk boundaries at 500 rows (never exceed 500 per chunk)

---

## Inês Insert — Database Operation Quality

### Bronze Ingestion (RPC 1)
- [ ] Upsert idempotency: same batch run twice → identical row count in `apify_jobs`
- [ ] No ReadTimeout errors at chunk_size=500 (validated in staging)
- [ ] Failed chunk rate < 1% under normal conditions
- [ ] All failed chunks logged with error detail (dead-letter pattern)
- [ ] Insert result logged: `{inserted: N, skipped_duplicates: M}`

### Promote Pipeline (RPCs 2-4)
- [ ] RPC 2 (`promote_apify_jobs_to_jobs_analyzed`) completes without error
- [ ] RPC 3 (`upsert_targets_from_jobs_analyzed`) completes without error
- [ ] RPC 4 (`refresh_target_jobs_all`) completes within 180s timeout
- [ ] Sequential order enforced: RPC N+1 only runs if RPC N succeeded
- [ ] Row counts from each RPC logged in execution summary

---

## Ana Analyst — LLM Enrichment Quality

### Extraction Accuracy
- [ ] Schema validation pass rate: 100% (format guaranteed by structured outputs)
- [ ] `ai_key_skills` populated for > 85% of records with valid descriptions
- [ ] `ai_experience_level` in valid enum for 100% of non-null values
- [ ] `ai_salary_unittext` in ("HOUR", "YEAR", null) for 100% of non-null values
- [ ] Null rate for `ai_key_skills`: < 15% on well-formatted postings
- [ ] No HTML tags or escaped characters in extracted text fields

### Processing Reliability
- [ ] Rate limit errors: 0 with chunk_size=15 + 4s inter-chunk delay
- [ ] Batch completion rate: > 98% of target records enriched per run
- [ ] UPDATE operations: all successful (no records left with null ai_* after run)
- [ ] Failed extractions logged with job_id and error type

### Sample Validation (Checkpoint 3)
- [ ] 3 sample jobs shown cover different seniority levels
- [ ] All 13 target fields populated in at least 1 of 3 samples
- [ ] Extracted skills are technical terms, not generic phrases

---

## Marcos Maestro — Orchestration Quality

### Pre-Run
- [ ] `hunter_sites` query returns ≥ 1 active site
- [ ] Site config includes: url, scraper_type, priority, config.throttle_ms
- [ ] Auth-skip sites correctly identified and excluded
- [ ] Estimated time calculation: reasonable (30-90s/site × active_sites)

### Post-Run Logging
- [ ] `last_run_at` updated for all successfully scraped sites
- [ ] Error log entries for all failed sites (with error type, not just "failed")
- [ ] Execution summary matches actual pipeline results

---

## Pipeline-Level Quality

### Checkpoint Gate Criteria
- Checkpoint 1 (pre-scraping): user sees ≥ 3 tiers of sites, time estimate, site count
- Checkpoint 2 (post-norm): user sees per-site job counts, dedup stats, total
- Checkpoint 3 (post-analyst): user sees 3 enriched sample jobs, extraction scores
- Checkpoint 4 (final report): user sees rows by table, errors, duration

### End-to-End Pipeline
- [ ] Total run time < 4 hours for full 45-site run
- [ ] Bronze table growth: +1,500 to +4,000 rows per run (after dedup)
- [ ] Silver table growth: proportional to bronze (expect 60-80% promote rate)
- [ ] Zero data corruption: no records with malformed JSON in `raw_payload`
- [ ] Idempotent pipeline: running twice on same week → near-zero new inserts on 2nd run
