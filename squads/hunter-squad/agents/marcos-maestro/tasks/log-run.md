---
task: "Log Pipeline Run"
order: 3
input: |
  - execution_results: Aggregated results from all pipeline steps (sites, bronze insert count, promote count, errors)
  - succeeded_sites: List of site names that completed without error
output: |
  - run_log_file: Written to squads/hunter-squad/output/run-log.json
  - last_run_at: Updated in hunter_sites for all succeeded_sites
---

# Log Pipeline Run

Final step of the Hunter Squad pipeline — persists execution results to both Supabase and the local output directory. Updates `last_run_at` in `hunter_sites` for all sites that completed successfully, then writes `run-log.json` with full per-site stats and a pipeline summary. This step always runs, even if earlier steps had partial failures.

## Process

1. **Collect execution stats from pipeline context**: Read aggregated output from all pipeline step files (Scout results, bronze insert stats, silver promotion counts, RPC outputs). Build a unified `execution_results` dict. Missing fields default to `0` — never `null`.

2. **Build `run_log` dict**: Assemble the complete log object with all pipeline stats, per-site results, error entries (if any), and metadata. Use current timestamp for `run_at`.

3. **UPDATE Supabase `hunter_sites`**: Execute:
   ```sql
   UPDATE hunter_sites
   SET last_run_at = now()
   WHERE name = ANY(ARRAY[...succeeded_sites...])
   ```
   Collect the list of site names that were successfully updated. If the UPDATE fails, log a warning (`"last_run_at UPDATE failed: <error message>"`) and continue — do not abort. Data already ingested must not be discarded due to a metadata write failure.

4. **Write `run-log.json`** to `squads/hunter-squad/output/run-log.json`. If the write fails, log the error to console and continue — do not abort.

5. **Return final summary** for display at the pipeline closing checkpoint: table with all numeric stats, list of any errors, and confirmation of which sites had `last_run_at` updated.

## Output Format

```yaml
run_summary:
  run_at: "ISO-8601"                      # timestamp when pipeline was initiated
  duration_minutes: int                   # total wall-clock time for the run
  sites_succeeded: int                    # sites with no errors
  sites_failed: int                       # sites with at least one error
  sites_skipped_auth: int                 # requires_auth sites from skipped list
  raw_collected: int                      # total jobs scraped before dedup
  after_dedup: int                        # jobs remaining after deduplication
  bronze_inserted: int                    # jobs inserted into bronze table
  silver_promoted: int                    # jobs promoted from bronze to silver
  targets_upserted: int                   # jobs upserted into targets table
  target_jobs_refreshed: int              # existing target jobs refreshed/updated
  errors:
    - site: string
      error_type: string                  # "timeout" | "http_error" | "parse_error" | "unknown"
      message: string                     # literal error message
      duration_ms: int                    # time elapsed before failure
  last_run_at_updated:
    - string                              # site names where UPDATE succeeded
```

## Output Example

```json
{
  "run_at": "2026-04-28T09:00:00Z",
  "duration_minutes": 14,
  "sites_succeeded": 10,
  "sites_failed": 2,
  "sites_skipped_auth": 2,
  "raw_collected": 847,
  "after_dedup": 614,
  "bronze_inserted": 601,
  "silver_promoted": 203,
  "targets_upserted": 47,
  "target_jobs_refreshed": 31,
  "errors": [
    {
      "site": "glassdoor",
      "error_type": "timeout",
      "message": "Playwright page.waitForSelector timeout after 30000ms — selector '.job-listing' not found",
      "duration_ms": 30241
    },
    {
      "site": "hiretechladies",
      "error_type": "http_error",
      "message": "HTTP 403 Forbidden after 3 retry attempts — server returned 403 on all requests",
      "duration_ms": 8750
    }
  ],
  "last_run_at_updated": [
    "remoteok",
    "weworkremotely",
    "remotive",
    "jobspresso",
    "hiretechladies",
    "wfh_io",
    "nodesk",
    "authentic_jobs",
    "pangian",
    "outsourcely"
  ]
}
```

## Quality Criteria

- [ ] `last_run_at` updated only for sites in `succeeded_sites` — never for failed or skipped sites
- [ ] All numeric stats present and set to `0` if none occurred — never `null` or absent
- [ ] Each error entry contains all three required fields: `site`, `error_type`, `message` (plus `duration_ms`)
- [ ] `sites_succeeded + sites_failed + sites_skipped_auth` equals `total_sites` from `sites-config.json`
- [ ] `run-log.json` written to `squads/hunter-squad/output/run-log.json` (not to a temp path)

## Veto Conditions

1. **Supabase UPDATE for `last_run_at` fails** — Log warning to console: `"WARNING: last_run_at UPDATE failed for succeeded sites: <error message>. Data already ingested — proceeding."` Do not abort the step or the pipeline. The ingestion data in bronze/silver/targets is the primary output.

2. **`run-log.json` write fails** — Log the error to console: `"WARNING: run-log.json write failed: <error message>."` Do not abort. The pipeline has already completed its core work. Absence of the log file is an operational inconvenience, not a data loss event.
