---
task: "Read Active Sites"
order: 1
input: |
  - supabase_connection: Active Supabase client for project pbvjsixlqnuzcnqahbxu
output: |
  - sites_by_tier: Dict of tier -> list of site configs
  - skipped_sites: List of requires_auth sites
  - active_count: Total active sites count
  - estimated_minutes: Estimated pipeline duration
---

# Read Active Sites

Queries the `hunter_sites` table in Supabase to retrieve all active job board configurations. Results are categorized into priority tiers that determine scraping depth and execution order. Sites requiring authentication are extracted to a separate skipped list before dispatch.

## Process

1. Execute query against Supabase project `pbvjsixlqnuzcnqahbxu`:
   ```sql
   SELECT name, base_url, scraper_type, priority, config, requires_auth
   FROM hunter_sites
   WHERE active = true
   ORDER BY priority DESC
   ```

2. Categorize each site into a priority tier based on the `priority` field value:
   - **Tier 1**: priority 90–100 → `max_pages = 10`
   - **Tier 2**: priority 70–89 → `max_pages = 10`
   - **Tier 3**: priority 50–69 → `max_pages = 5`
   - **Tier 4**: priority 30–49 → `max_pages = 5`
   - **Tier 5**: priority 0–29 → `max_pages = 2`

3. Extract all sites where `requires_auth = true` from the active list and move them to `skipped_sites` with `reason: "requires_auth"`. These sites are never included in `sites_by_tier`.

4. Merge the `config` JSONB field for each site into flat fields:
   - `throttle_ms`: use value from config, default to `1000` if absent
   - `max_days_back`: use value from config, default to `7` if absent
   - `stop_if_older_than`: use value from config, default to `7` if absent
   - Any other config keys are passed through as-is for Scout consumption

5. Calculate estimated pipeline duration: `estimated_minutes = ceil(len(active_sites) * 60 / 60)` where `active_sites` excludes `requires_auth` entries.

## Output Format

```yaml
sites_by_tier:
  tier_1:
    - name: string
      base_url: string
      scraper_type: string          # "playwright" | "requests" | "rss"
      priority: int
      max_pages: int
      throttle_ms: int
      max_days_back: int
      stop_if_older_than: int
  tier_2:
    - name: string
      base_url: string
      scraper_type: string
      priority: int
      max_pages: int
      throttle_ms: int
      max_days_back: int
      stop_if_older_than: int
  tier_3: [...]
  tier_4: [...]
  tier_5: [...]
skipped_sites:
  - name: string
    priority: int
    reason: string                  # always "requires_auth" from this task
active_count: int                   # total sites in sites_by_tier (excludes skipped)
estimated_minutes: int
```

## Output Example

```yaml
sites_by_tier:
  tier_1:
    - name: "remoteok"
      base_url: "https://remoteok.com/remote-dev-jobs"
      scraper_type: "playwright"
      priority: 95
      max_pages: 10
      throttle_ms: 1500
      max_days_back: 7
      stop_if_older_than: 7
    - name: "weworkremotely"
      base_url: "https://weworkremotely.com/categories/remote-programming-jobs"
      scraper_type: "requests"
      priority: 92
      max_pages: 10
      throttle_ms: 1000
      max_days_back: 7
      stop_if_older_than: 7
  tier_2:
    - name: "remotive"
      base_url: "https://remotive.com/remote-jobs/software-dev"
      scraper_type: "requests"
      priority: 78
      max_pages: 10
      throttle_ms: 1000
      max_days_back: 7
      stop_if_older_than: 7
    - name: "jobspresso"
      base_url: "https://jobspresso.co/remote-work/"
      scraper_type: "requests"
      priority: 75
      max_pages: 10
      throttle_ms: 1200
      max_days_back: 7
      stop_if_older_than: 7
  tier_3:
    - name: "hiretechladies"
      base_url: "https://www.hiretechladies.com/jobs"
      scraper_type: "playwright"
      priority: 60
      max_pages: 5
      throttle_ms: 2000
      max_days_back: 7
      stop_if_older_than: 7
skipped_sites:
  - name: "linkedin"
    priority: 88
    reason: "requires_auth"
  - name: "glassdoor"
    priority: 72
    reason: "requires_auth"
active_count: 5
estimated_minutes: 5
```

## Quality Criteria

- [ ] Query includes `ORDER BY priority DESC` — execution order within each tier preserved from DB
- [ ] Zero sites with `requires_auth = true` present in any key of `sites_by_tier`
- [ ] `throttle_ms` defaults to `1000` when the `config` JSONB field is null or does not contain `throttle_ms`
- [ ] `max_days_back` defaults to `7` when absent from `config`
- [ ] Each site in `sites_by_tier` has all required fields: `name`, `base_url`, `scraper_type`, `priority`, `max_pages`, `throttle_ms`, `max_days_back`

## Veto Conditions

1. **`active_count == 0`** — Abort pipeline immediately with error message: `"No active sites in hunter_sites. Add at least one site with active = true before running the pipeline."` Do not proceed to prepare-dispatch.

2. **Supabase query returns an error** — Abort and surface the literal error message from the Supabase client response. Do not attempt to continue with empty or partial data.
