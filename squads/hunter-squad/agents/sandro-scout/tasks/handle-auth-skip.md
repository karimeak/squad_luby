---
task: "Handle Auth Skip"
order: 1
input: |
  - sites_config: Full list of sites from sites-config.json
output: |
  - scrape_queue: Sites list with requires_auth removed
  - skipped_auth: List of skipped site names with reason
---

# Handle Auth Skip

**Description**: Filters out all `requires_auth` sites from the scraping queue BEFORE any browser is opened. This is the first task executed by Sandro Scout — it guarantees that no browser context is ever created for a site that requires login.

## Why This Task Exists

Sites with `scraper_type == "requires_auth"` cannot be scraped without credentials. Attempting to do so would result in login pages, CAPTCHAs, or account lockouts. This task acts as a hard gate: the scraping queue that leaves this task is guaranteed to contain zero auth-required sites.

## Process

1. **Read sites_config.json**: Load `squads/hunter-squad/output/sites-config.json` as JSON.
2. **Validate file**: Confirm the file exists, is valid JSON, and contains a non-empty `sites` array. If not, abort with a veto error.
3. **Filter**: Separate sites into two groups:
   - `to_scrape`: sites where `scraper_type != "requires_auth"`
   - `to_skip`: sites where `scraper_type == "requires_auth"`
4. **Build `skipped_auth` list**: For each site in `to_skip`, create an entry: `{name, priority, reason: "requires_auth"}`.
5. **Log skipped count**: Print to console `[handle-auth-skip] Skipped N sites (requires_auth): site1, site2, ...`
6. **Sort `scrape_queue`**: Order `to_scrape` by `priority` descending (highest priority first).
7. **Return** `scrape_queue`, `skipped_auth`, and `stats`.

## Output Format

```yaml
scrape_queue:
  - name: str
    base_url: str
    scraper_type: "generic_listing" | "spa_infinite_scroll"
    priority: int
    max_pages: int
    throttle_ms: int

skipped_auth:
  - name: str
    priority: int
    reason: "requires_auth"

stats:
  total_input: int
  skipped: int
  to_scrape: int
```

## Output Example

```json
{
  "scrape_queue": [
    { "name": "remoteok", "base_url": "https://remoteok.com/remote-dev-jobs", "scraper_type": "generic_listing", "priority": 10, "max_pages": 10, "throttle_ms": 1200 },
    { "name": "weworkremotely", "base_url": "https://weworkremotely.com/categories/remote-programming-jobs", "scraper_type": "generic_listing", "priority": 10, "max_pages": 10, "throttle_ms": 1000 },
    { "name": "wellfound", "base_url": "https://wellfound.com/jobs", "scraper_type": "spa_infinite_scroll", "priority": 9, "max_pages": 10, "throttle_ms": 1500 },
    { "name": "techinbrazil", "base_url": "https://techinbrazil.com/jobs", "scraper_type": "generic_listing", "priority": 9, "max_pages": 10, "throttle_ms": 800 },
    { "name": "remotehub", "base_url": "https://remotehub.com/jobs/tech", "scraper_type": "spa_infinite_scroll", "priority": 8, "max_pages": 10, "throttle_ms": 1000 },
    { "name": "himalayas", "base_url": "https://himalayas.app/jobs/engineering", "scraper_type": "generic_listing", "priority": 8, "max_pages": 10, "throttle_ms": 900 },
    { "name": "jobspresso", "base_url": "https://jobspresso.co/remote-work", "scraper_type": "generic_listing", "priority": 7, "max_pages": 5, "throttle_ms": 800 },
    { "name": "nodesk", "base_url": "https://nodesk.co/remote-jobs/engineering", "scraper_type": "generic_listing", "priority": 7, "max_pages": 5, "throttle_ms": 700 },
    { "name": "remotive", "base_url": "https://remotive.com/remote-jobs/software-dev", "scraper_type": "generic_listing", "priority": 7, "max_pages": 5, "throttle_ms": 1000 },
    { "name": "freshremote", "base_url": "https://freshremote.work/jobs", "scraper_type": "spa_infinite_scroll", "priority": 6, "max_pages": 5, "throttle_ms": 1200 },
    { "name": "4dayweek", "base_url": "https://4dayweek.io/remote-jobs/tech", "scraper_type": "generic_listing", "priority": 6, "max_pages": 5, "throttle_ms": 800 },
    { "name": "workew", "base_url": "https://workew.com/jobs/engineering", "scraper_type": "generic_listing", "priority": 5, "max_pages": 2, "throttle_ms": 600 },
    { "name": "remoteco", "base_url": "https://remote.co/remote-jobs/developer", "scraper_type": "generic_listing", "priority": 5, "max_pages": 2, "throttle_ms": 700 },
    { "name": "jobicy", "base_url": "https://jobicy.com/jobs/remote", "scraper_type": "generic_listing", "priority": 5, "max_pages": 2, "throttle_ms": 600 }
  ],
  "skipped_auth": [
    {
      "name": "linkedin",
      "priority": 10,
      "reason": "requires_auth"
    }
  ],
  "stats": {
    "total_input": 45,
    "skipped": 1,
    "to_scrape": 44
  }
}
```

## Quality Criteria

- [ ] `scrape_queue` contains zero `requires_auth` sites — verify `scraper_type` for all entries
- [ ] Each skipped site has `name` + `reason` in log output
- [ ] `scrape_queue` is ordered by `priority` DESC
- [ ] `stats.to_scrape + stats.skipped == stats.total_input`
- [ ] This task runs BEFORE any browser context is opened

## Veto Conditions

1. **`scrape_queue` is empty after filtering** — Abort the entire pipeline with error: `"handle-auth-skip: scrape_queue is empty after filtering. Check sites-config.json for valid non-auth sites."` This should never happen with 44 valid sites, but must be guarded.
2. **`sites-config.json` is not found or not parseable** — Abort with error: `"handle-auth-skip: Cannot read sites-config.json at squads/hunter-squad/output/sites-config.json. Ensure Marcos Maestro step completed successfully."` Do not attempt scraping without the config file.
