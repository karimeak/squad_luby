---
execution: subagent
agent: sandro-scout
model_tier: powerful
inputFile: squads/hunter-squad/output/sites-config.json
outputFile: squads/hunter-squad/output/scraped-jobs.json
---

# Step 03: Sandro Scout — Playwright Web Scraping

## Context Loading

Load these files before executing:
- `squads/hunter-squad/output/sites-config.json` — site manifest: 43 active sites ordered by priority, cutoff_date (7 days ago), job_titles filter list, max_pages per tier
- `squads/hunter-squad/pipeline/data/research-brief.md` — Playwright best practices: asyncio.Semaphore(5), stealth, date-based stop conditions, XHR interception
- `squads/hunter-squad/pipeline/data/anti-patterns.md` — Scraping anti-patterns: never time.sleep(), never skip finally blocks, never ignore requires_auth sites

## Instructions

### Process

1. Read `sites-config.json` — extract: ordered site list, cutoff_date, job_titles list
2. Execute task `handle-auth-skip.md`: filter all `scraper_type == "requires_auth"` sites into skipped list. Zero auth attempts — log and remove.
3. Execute task `scrape-generic.md`: use asyncio.Semaphore(5) to scrape all `generic_listing` sites in parallel. For each site: navigate → wait for load → try XHR interception → fallback to DOM → paginate while `oldest_job_date >= cutoff_date` AND `page_count < max_pages` → apply throttle_ms.
4. Execute task `scrape-spa.md`: use asyncio.Semaphore(5) for `spa_infinite_scroll` sites. Scroll loop with three stop conditions: `no_new_items`, `oldest_date < cutoff_date`, `scroll_count >= max_pages`. Apply playwright-stealth.
5. Execute task `collect-results.md`: merge all site results into flat array. Apply final date safety-net filter. Strip HTML from string fields. Validate required fields (title, company, url, source). Write to `squads/hunter-squad/output/scraped-jobs.json`.

## Output Format

```json
{
  "metadata": {
    "collected_at": "2026-04-28T09:38:22Z",
    "total_raw": 5847,
    "after_date_filter": 4203,
    "after_title_filter": 1892,
    "sites_succeeded": 41,
    "sites_failed": 2,
    "sites_skipped_auth": 1
  },
  "per_site_stats": [
    {"site": "remoteok", "found": 312, "after_filter": 187, "errors": null, "duration_ms": 8400}
  ],
  "jobs": [
    {
      "title": "Senior Data Engineer",
      "company": "Stripe",
      "url": "https://remoteok.com/remote-jobs/data-engineer-stripe-123456",
      "description": "We are looking for a Senior Data Engineer...",
      "location": "Remote, United States",
      "posted_at": "2026-04-25T14:30:00Z",
      "source": "remoteok",
      "_source_site": "remoteok"
    }
  ]
}
```

## Output Example

```json
{
  "metadata": {
    "collected_at": "2026-04-28T09:38:22Z",
    "total_raw": 5847,
    "after_date_filter": 4203,
    "after_title_filter": 1892,
    "sites_succeeded": 41,
    "sites_failed": 2,
    "sites_skipped_auth": 1
  },
  "per_site_stats": [
    {"site": "remoteok", "found": 312, "after_filter": 187, "errors": null, "stop_reason": "date_cutoff", "duration_ms": 8400},
    {"site": "weworkremotely", "found": 204, "after_filter": 143, "errors": null, "stop_reason": "date_cutoff", "duration_ms": 6200},
    {"site": "wellfound", "found": 518, "after_filter": 312, "errors": null, "stop_reason": "date_cutoff", "api_intercepted": true, "duration_ms": 14200},
    {"site": "glassdoor", "found": 0, "after_filter": 0, "errors": "TimeoutError: 30s exceeded", "duration_ms": 30000},
    {"site": "linkedin", "found": 0, "after_filter": 0, "errors": "skipped: requires_auth", "duration_ms": 0}
  ],
  "jobs": [
    {
      "title": "Senior Data Engineer",
      "company": "Stripe",
      "url": "https://remoteok.com/remote-jobs/data-engineer-stripe-123456",
      "description": "We are looking for a Senior Data Engineer to join our data infrastructure team. You will design and maintain pipelines processing billions of events daily.",
      "location": "Remote, United States",
      "posted_at": "2026-04-25T14:30:00Z",
      "source": "remoteok",
      "_source_site": "remoteok"
    },
    {
      "title": "ML Engineer",
      "company": "Anthropic",
      "url": "https://wellfound.com/jobs/anthropic-ml-engineer-789012",
      "description": "Anthropic is hiring a Machine Learning Engineer to work on safety research and model training infrastructure.",
      "location": "Remote",
      "posted_at": "2026-04-24T11:00:00Z",
      "source": "wellfound",
      "_source_site": "wellfound"
    },
    {
      "title": "Backend Engineer",
      "company": "Linear",
      "url": "https://weworkremotely.com/remote-jobs/linear-backend-345678",
      "description": "Linear is looking for a Backend Engineer to build our project management infrastructure at scale.",
      "location": "Remote - US",
      "posted_at": "2026-04-23T09:15:00Z",
      "source": "weworkremotely",
      "_source_site": "weworkremotely"
    }
  ]
}
```

## Veto Conditions

Reject and redo if ANY are true:
1. `jobs` array is empty (0 jobs collected across all 43 sites) — abort pipeline: "Zero jobs collected. Check Playwright connectivity and site selectors."
2. `sites_succeeded == 0` (every site failed) — abort pipeline: "All sites failed. Check browser environment and network connectivity."

## Quality Criteria

- [ ] `scraped-jobs.json` written with `metadata`, `per_site_stats`, and `jobs` sections
- [ ] All jobs have required fields: `title`, `company`, `url`, `source`, `_source_site`
- [ ] Zero HTML tags in `title`, `company`, `description`, or `location` fields
- [ ] `requires_auth` sites appear in `per_site_stats` with `errors: "skipped: requires_auth"` and `found: 0`
- [ ] `metadata.sites_succeeded + sites_failed + sites_skipped_auth` equals total sites attempted
