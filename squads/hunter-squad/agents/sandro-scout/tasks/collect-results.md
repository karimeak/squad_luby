---
task: "Collect and Consolidate Results"
order: 4
input: |
  - generic_results: Output from scrape-generic task
  - spa_results: Output from scrape-spa task
  - skipped_auth: Auth-skipped sites list
  - cutoff_date: Date filter for final validation
output: |
  - scraped_jobs_file: Written to squads/hunter-squad/output/scraped-jobs.json
  - collection_summary: Stats for checkpoint display
---

# Collect and Consolidate Results

**Description**: Merges all site results from `scrape-generic` and `scrape-spa` into a single flat array, applies final validation passes, builds per-site statistics, and writes the output file `scraped-jobs.json`. This is the last task executed by Sandro Scout — its output is the entry point for all downstream agents in the Hunter Squad pipeline.

## Process

1. **Merge all jobs into a flat array**:
   - Iterate all entries in `generic_results` and `spa_results`.
   - For each site: extend the flat `all_jobs` list with `site_result["jobs"]`.
   - Track `sites_succeeded` (sites with `error == null`) and `sites_failed` (sites with `error != null`).

2. **Final date validation** (safety net):
   ```python
   all_jobs = [j for j in all_jobs if j["posted_at"] >= cutoff_date]
   ```
   This is a redundant check — each scrape task already applies date filtering. It exists to catch any edge case where a job slipped through with a stale date.

3. **Strip HTML from all string fields**:
   ```python
   import re

   def strip_html(text: str) -> str:
       clean = re.sub(r"<[^>]+>", "", text or "")
       clean = clean.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&nbsp;", " ").replace("&#39;", "'").replace("&quot;", '"')
       return clean.strip()

   for job in all_jobs:
       job["title"] = strip_html(job["title"])
       job["company"] = strip_html(job["company"])
       job["description"] = strip_html(job.get("description", ""))
       job["location"] = strip_html(job.get("location", ""))
   ```

4. **Validate required fields**: For each job, ensure the following fields are non-empty strings: `title`, `company`, `url`, `source`, `_source_site`. Log and discard any job missing a required field.

5. **Build `per_site_stats`**: For each site in `generic_results` and `spa_results`, create a stats entry:
   ```python
   {
     "site": site_name,
     "found": len(site_result["jobs"]),
     "after_filter": len([j for j in site_result["jobs"] if passes_final_validation(j)]),
     "error": site_result["error"],
     "duration_ms": site_result["duration_ms"]
   }
   ```

6. **Build `metadata`**:
   ```python
   metadata = {
     "collected_at": datetime.utcnow().isoformat() + "Z",
     "cutoff_date": cutoff_date,
     "total_raw": total_before_final_filter,
     "after_date_filter": total_after_date_filter,
     "after_title_filter": len(all_jobs),  # title filter was applied upstream
     "sites_succeeded": sites_succeeded,
     "sites_failed": sites_failed,
     "sites_skipped_auth": len(skipped_auth)
   }
   ```

7. **Build `collection_summary`** (markdown string for checkpoint display):
   ```markdown
   ## Sandro Scout — Scraping Complete

   | Metric | Value |
   |---|---|
   | Sites attempted | 44 |
   | Sites succeeded | 41 |
   | Sites failed | 3 |
   | Sites skipped (auth) | 1 |
   | Raw jobs collected | 1,847 |
   | After date filter | 1,203 |
   | After title filter | 612 |
   | Collected at | 2026-04-28T06:14:22Z |

   ### Failed Sites
   - weworkremotely: TimeoutError after 30s
   - remotehub: SelectorNotFound — .job-card not found within 15000ms
   - jobicy: NetworkError — connection refused

   ### Top Sources
   - remoteok: 142 jobs
   - wellfound: 98 jobs
   - himalayas: 87 jobs
   ```

8. **Write to `squads/hunter-squad/output/scraped-jobs.json`**:
   ```python
   output = {
     "metadata": metadata,
     "per_site_stats": per_site_stats,
     "skipped_auth": skipped_auth,
     "jobs": all_jobs
   }
   with open("squads/hunter-squad/output/scraped-jobs.json", "w", encoding="utf-8") as f:
       json.dump(output, f, ensure_ascii=False, indent=2)
   ```

## Output Format

```yaml
# scraped-jobs.json schema
metadata:
  collected_at: "ISO-8601"
  cutoff_date: "ISO-8601"
  total_raw: int
  after_date_filter: int
  after_title_filter: int
  sites_succeeded: int
  sites_failed: int
  sites_skipped_auth: int

per_site_stats:
  - site: str
    found: int
    after_filter: int
    error: null | str
    duration_ms: int

skipped_auth:
  - name: str
    priority: int
    reason: "requires_auth"

jobs:
  - title: str
    company: str
    url: str
    description: str
    location: str
    posted_at: "ISO-8601"
    source: str
    _source_site: str
```

## Output Example

```json
{
  "metadata": {
    "collected_at": "2026-04-28T06:14:22Z",
    "cutoff_date": "2026-04-21T06:14:22Z",
    "total_raw": 1847,
    "after_date_filter": 1203,
    "after_title_filter": 612,
    "sites_succeeded": 41,
    "sites_failed": 3,
    "sites_skipped_auth": 1
  },
  "per_site_stats": [
    {
      "site": "remoteok",
      "found": 142,
      "after_filter": 89,
      "error": null,
      "duration_ms": 8420
    },
    {
      "site": "wellfound",
      "found": 98,
      "after_filter": 62,
      "error": null,
      "duration_ms": 22150
    },
    {
      "site": "weworkremotely",
      "found": 0,
      "after_filter": 0,
      "error": "TimeoutError: wait_for_load_state networkidle exceeded 30000ms",
      "duration_ms": 30000
    }
  ],
  "skipped_auth": [
    {
      "name": "linkedin",
      "priority": 10,
      "reason": "requires_auth"
    }
  ],
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
      "title": "Backend Software Engineer",
      "company": "Cloudflare",
      "url": "https://remoteok.com/remote-jobs/backend-software-engineer-cloudflare-1294601",
      "description": "Join our core infrastructure team to build high-performance services in Go and Rust. You will design APIs used by millions of developers.",
      "location": "Remote — US/EU",
      "posted_at": "2026-04-24T17:45:00Z",
      "source": "RemoteOK",
      "_source_site": "remoteok"
    }
  ]
}
```

## Quality Criteria

- [ ] All jobs have required fields: `title`, `company`, `url`, `source`, `_source_site` — jobs missing any required field are discarded with a warning log
- [ ] Zero HTML tags in any string field — `strip_html()` applied to `title`, `company`, `description`, `location`
- [ ] `metadata.sites_succeeded + metadata.sites_failed + metadata.sites_skipped_auth == 45` (total sites in config)
- [ ] `jobs` array not empty — warn if `len(jobs) < 100` with message: `[collect-results] WARNING: Only N jobs in final output. Possible widespread scraping failure.`
- [ ] `scraped-jobs.json` written with UTF-8 encoding and `indent=2` for readability
- [ ] `collection_summary` markdown includes failed sites list with error types

## Veto Conditions

1. **`jobs` array is empty** — Abort with error: `"collect-results: Zero jobs collected across all sites. Pipeline aborted. Check per_site_stats for error details. All 44 scrape-queue sites may have failed."` Do not write an empty `scraped-jobs.json` — downstream agents cannot proceed with zero data.

2. **`scraped-jobs.json` write fails** — Abort with file system error: `"collect-results: Failed to write scraped-jobs.json at squads/hunter-squad/output/scraped-jobs.json. Check disk space and directory permissions."` Without the output file, no downstream agent can run.
