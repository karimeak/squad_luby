---
execution: inline
agent: marcos-maestro
inputFile: null
outputFile: squads/hunter-squad/output/sites-config.json
---

# Step 01: Orchestrate — Read Active Sites

## Context Loading

- `squads/hunter-squad/pipeline/data/domain-framework.md` — ETL framework reference
- Supabase `hunter_sites` table — source of truth for active sites

## Instructions

### Process

1. Query Supabase `hunter_sites` table:
   ```sql
   SELECT name, base_url, scraper_type, priority, config
   FROM hunter_sites
   WHERE active = true
   ORDER BY priority DESC
   ```

2. Categorize each site into a priority tier based on `priority` value:
   - **tier1**: priority 90–100 → `max_pages = 10`
   - **tier2**: priority 70–89 → `max_pages = 10`
   - **tier3**: priority 50–69 → `max_pages = 5`
   - **tier4**: priority 30–49 → `max_pages = 5`
   - **tier5**: priority < 30 → `max_pages = 2`

3. Extract sites where `config->>'requires_auth' = 'true'` → move to `skipped` list. Do NOT include these in the dispatch manifest.

4. For each remaining active site, extract `throttle_ms` from the `config` JSONB field. Default: `1000` if not present.

5. Calculate `estimated_minutes = count(active_sites) * 1`.

6. Write the complete `sites-config.json` file to `squads/hunter-squad/output/sites-config.json`.

## Output Format

```json
{
  "generated_at": "<ISO 8601 timestamp>",
  "cutoff_date": "<ISO 8601 date, 30 days ago>",
  "job_titles": ["<title1>", "<title2>"],
  "estimated_minutes": <number>,
  "sites_total": <number>,
  "sites_active": <number>,
  "sites_skipped": <number>,
  "skipped": [
    {
      "name": "<site_name>",
      "base_url": "<url>",
      "reason": "requires_auth"
    }
  ],
  "sites": [
    {
      "name": "<site_name>",
      "base_url": "<url>",
      "scraper_type": "<generic_listing | spa_infinite_scroll | api_json>",
      "priority": <number>,
      "tier": "<tier1 | tier2 | tier3 | tier4 | tier5>",
      "max_pages": <number>,
      "throttle_ms": <number>,
      "config": {}
    }
  ]
}
```

## Output Example

```json
{
  "generated_at": "2026-04-28T09:00:00Z",
  "cutoff_date": "2026-03-29T00:00:00Z",
  "job_titles": ["Desenvolvedor", "Engenheiro de Software", "Analista de Sistemas", "Tech Lead", "DevOps", "Data Engineer"],
  "estimated_minutes": 43,
  "sites_total": 44,
  "sites_active": 43,
  "sites_skipped": 1,
  "skipped": [
    {
      "name": "linkedin",
      "base_url": "https://www.linkedin.com/jobs",
      "reason": "requires_auth"
    }
  ],
  "sites": [
    {
      "name": "gupy",
      "base_url": "https://portal.gupy.io",
      "scraper_type": "api_json",
      "priority": 98,
      "tier": "tier1",
      "max_pages": 10,
      "throttle_ms": 800,
      "config": { "api_path": "/api/job", "requires_auth": false }
    },
    {
      "name": "infojobs",
      "base_url": "https://www.infojobs.com.br",
      "scraper_type": "generic_listing",
      "priority": 95,
      "tier": "tier1",
      "max_pages": 10,
      "throttle_ms": 1200,
      "config": { "requires_auth": false }
    },
    {
      "name": "catho",
      "base_url": "https://www.catho.com.br",
      "scraper_type": "generic_listing",
      "priority": 93,
      "tier": "tier1",
      "max_pages": 10,
      "throttle_ms": 1000,
      "config": { "requires_auth": false }
    },
    {
      "name": "vagas",
      "base_url": "https://www.vagas.com.br",
      "scraper_type": "generic_listing",
      "priority": 91,
      "tier": "tier1",
      "max_pages": 10,
      "throttle_ms": 1000,
      "config": { "requires_auth": false }
    },
    {
      "name": "indeed_br",
      "base_url": "https://br.indeed.com",
      "scraper_type": "generic_listing",
      "priority": 88,
      "tier": "tier2",
      "max_pages": 10,
      "throttle_ms": 1500,
      "config": { "requires_auth": false }
    },
    {
      "name": "trampos",
      "base_url": "https://trampos.co",
      "scraper_type": "spa_infinite_scroll",
      "priority": 84,
      "tier": "tier2",
      "max_pages": 10,
      "throttle_ms": 1000,
      "config": { "requires_auth": false }
    },
    {
      "name": "programathor",
      "base_url": "https://programathor.com.br",
      "scraper_type": "generic_listing",
      "priority": 78,
      "tier": "tier2",
      "max_pages": 10,
      "throttle_ms": 1000,
      "config": { "requires_auth": false }
    },
    {
      "name": "adzuna_br",
      "base_url": "https://www.adzuna.com.br",
      "scraper_type": "api_json",
      "priority": 72,
      "tier": "tier2",
      "max_pages": 10,
      "throttle_ms": 900,
      "config": { "requires_auth": false }
    },
    {
      "name": "remotar",
      "base_url": "https://remotar.com.br",
      "scraper_type": "spa_infinite_scroll",
      "priority": 65,
      "tier": "tier3",
      "max_pages": 5,
      "throttle_ms": 1000,
      "config": { "requires_auth": false }
    },
    {
      "name": "solides",
      "base_url": "https://solides.com.br/vagas",
      "scraper_type": "generic_listing",
      "priority": 55,
      "tier": "tier3",
      "max_pages": 5,
      "throttle_ms": 1000,
      "config": { "requires_auth": false }
    }
  ]
}
```

> Note: The real output will contain all 43 active sites, truncated here for brevity.

## Veto Conditions

1. `hunter_sites` query returns 0 active sites → abort pipeline with error: `"No active sites found in hunter_sites table."`
2. Supabase connection fails → abort pipeline with error: `"Supabase connection failed. Check credentials and network."`

## Quality Criteria

- [ ] Sites ordered by priority DESC in the `sites` array
- [ ] No `requires_auth` sites included in the `sites` array
- [ ] `estimated_minutes` calculated as `count(active_sites) * 1`
- [ ] Every site has `throttle_ms` set (default 1000 if not in config)
- [ ] Every site has correct `tier` and `max_pages` assigned
