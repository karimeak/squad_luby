---
task: "Prepare Scout Dispatch Manifest"
order: 2
input: |
  - sites_by_tier: Output from read-sites task
  - skipped_sites: Auth-skipped sites list
  - estimated_minutes: Estimated duration
output: |
  - sites_config_file: Written to squads/hunter-squad/output/sites-config.json
  - dispatch_summary: Human-readable summary for checkpoint
---

# Prepare Scout Dispatch Manifest

Assembles the final `sites-config.json` manifest that the Scout agent will consume for scraping execution. Takes the tiered site list from `read-sites`, flattens it into an ordered array, appends global pipeline parameters (job titles filter, cutoff date, run timestamp), and writes the file. Also builds the pre-scraping checkpoint summary table for user approval.

## Process

1. **Flatten tier dict into ordered list**: Iterate through `sites_by_tier` in tier order (tier_1 → tier_2 → tier_3 → tier_4 → tier_5), appending each site's config object to a flat `sites` array. Priority ordering within each tier is preserved from `read-sites` output.

2. **Append job_titles filter**: Add the full `job_titles` list from the squad config. This list must contain at minimum 20 titles. Scout uses these titles to filter collected jobs before inserting into bronze. If the config is unavailable, abort with error — do not dispatch with an empty job_titles list.

3. **Compute cutoff_date**: `cutoff_date = run_at - 7 days` in ISO-8601 UTC format. Example: if `run_at = "2026-04-28T09:00:00Z"`, then `cutoff_date = "2026-04-21T09:00:00Z"`. Scout skips any job posting older than this date.

4. **Write `sites-config.json`** to `squads/hunter-squad/output/sites-config.json`. The file must be valid JSON. If the write fails, abort with error — do not proceed to Scout dispatch.

5. **Build `dispatch_summary`**: Construct a markdown table summarizing the manifest for display at the pre-scraping checkpoint:
   - Total sites by tier
   - Estimated duration
   - Skipped sites with reason
   - Cutoff date
   - File path written

## Output Format

```yaml
sites_config:
  run_at: "ISO-8601 timestamp"             # UTC, set at pipeline start
  cutoff_date: "ISO-8601 7-days-ago"       # run_at minus 7 days
  total_sites: int                          # active_sites + auth_skip_count
  active_sites: int                         # sites included in dispatch
  auth_skip_count: int                      # requires_auth sites excluded
  estimated_minutes: int                    # from read-sites output
  sites:                                    # ordered list, tier1 first
    - name: string
      base_url: string
      scraper_type: string
      priority: int
      max_pages: int
      throttle_ms: int
      max_days_back: int
      stop_if_older_than: int
  skipped:                                  # requires_auth sites
    - name: string
      priority: int
      reason: string
  job_titles:                               # full filter list (90+ items)
    - string
```

## Output Example

```json
{
  "run_at": "2026-04-28T09:00:00Z",
  "cutoff_date": "2026-04-21T09:00:00Z",
  "total_sites": 14,
  "active_sites": 12,
  "auth_skip_count": 2,
  "estimated_minutes": 12,
  "sites": [
    {
      "name": "remoteok",
      "base_url": "https://remoteok.com/remote-dev-jobs",
      "scraper_type": "playwright",
      "priority": 95,
      "max_pages": 10,
      "throttle_ms": 1500,
      "max_days_back": 7,
      "stop_if_older_than": 7
    },
    {
      "name": "weworkremotely",
      "base_url": "https://weworkremotely.com/categories/remote-programming-jobs",
      "scraper_type": "requests",
      "priority": 92,
      "max_pages": 10,
      "throttle_ms": 1000,
      "max_days_back": 7,
      "stop_if_older_than": 7
    },
    {
      "name": "remotive",
      "base_url": "https://remotive.com/remote-jobs/software-dev",
      "scraper_type": "requests",
      "priority": 78,
      "max_pages": 10,
      "throttle_ms": 1000,
      "max_days_back": 7,
      "stop_if_older_than": 7
    }
  ],
  "skipped": [
    { "name": "linkedin", "priority": 88, "reason": "requires_auth" },
    { "name": "glassdoor", "priority": 72, "reason": "requires_auth" }
  ],
  "job_titles": [
    "Software Engineer",
    "Backend Engineer",
    "Frontend Engineer",
    "Full Stack Engineer",
    "Full Stack Developer",
    "Senior Software Engineer",
    "Staff Engineer",
    "Principal Engineer",
    "Engineering Manager",
    "Python Developer",
    "Node.js Developer",
    "React Developer",
    "TypeScript Engineer",
    "DevOps Engineer",
    "Site Reliability Engineer",
    "Platform Engineer",
    "Cloud Engineer",
    "Data Engineer",
    "Machine Learning Engineer",
    "AI Engineer",
    "Mobile Engineer",
    "iOS Developer",
    "Android Developer",
    "Solutions Architect",
    "Technical Lead"
  ]
}
```

## Quality Criteria

- [ ] Sites in the `sites` array are ordered by priority DESC (tier_1 first, tier_5 last)
- [ ] `cutoff_date` is exactly 7 days before `run_at` (same time, same timezone offset)
- [ ] `job_titles` list contains at least 20 entries — never empty or null
- [ ] `sites-config.json` file written successfully to `squads/hunter-squad/output/sites-config.json`
- [ ] `auth_skip_count` matches `len(skipped)` array — no discrepancy between header count and array contents

## Veto Conditions

1. **`active_sites == 0` after filtering `requires_auth`** — Abort with error: `"All active sites require authentication. Cannot dispatch Scout with empty sites list."` Do not write file.

2. **`cutoff_date` would be in the future** — This indicates a system clock error or invalid `run_at` value. Abort with config error: `"cutoff_date is in the future. Check system clock and run_at value."` Do not write file.
