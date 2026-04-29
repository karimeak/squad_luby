---
task: "Normalize to Bronze Schema"
order: 1
input: |
  - scraped_jobs: Array of raw job objects from Scout
output: |
  - normalized_records: Array of bronze-schema records with url_sha256
---

# Normalize to Bronze Schema

Reads the raw jobs array from Scout's output file and transforms each entry into a bronze-schema record. For each job, this task extracts the canonical source_job_id (or sets it to null), normalizes the URL, computes the url_sha256, and builds the final bronze record with a UTC timestamp and null scrapy_query_id. The result is a fully typed, consistently structured array ready for deduplication.

## Process

1. Read `squads/hunter-squad/output/scraped-jobs.json`
   - Abort with error if file does not exist or is empty array
   - Log `total_input = len(scraped_jobs)`

2. For each raw job object:

   a. **Extract source_job_id** from raw data using site-specific field resolution:
      - Try fields in order: `id`, `job_id`, `jobId`, `posting_id`, `requisition_id`
      - If none found, attempt to extract from URL path (e.g., `/jobs/12345/` → `"12345"`)
      - If still not resolvable, set `source_job_id = null` (url fallback will be used in dedup)

   b. **Normalize URL** — apply all transformations in sequence:
      - Lowercase the full URL string
      - Strip trailing slash: `url.rstrip("/")`
      - Parse query string and remove tracking params: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `ref`, `source`
      - Rebuild URL from scheme + netloc + path + cleaned query string
      - Example: `https://Gupy.io/jobs/123/?utm_source=linkedin&ref=nav` → `https://gupy.io/jobs/123`

   c. **Calculate url_sha256**:
      ```python
      import hashlib
      url_sha256 = hashlib.sha256(normalized_url.encode("utf-8")).hexdigest()
      ```
      Result must be exactly 64 hex characters.

   d. **Build bronze record**:
      ```python
      {
          "source": raw_job["source"],          # e.g. "gupy", "linkedin", "indeed"
          "source_job_id": source_job_id,        # str or null
          "url": normalized_url,                 # normalized URL string
          "url_sha256": url_sha256,              # 64-char hex SHA-256
          "raw_payload": raw_job,                # full original object (datetime fields → ISO-8601)
          "fetched_at": now_utc(),               # datetime.utcnow().isoformat() + "Z"
          "scrapy_query_id": null                # always null in v2
      }
      ```
      Before embedding raw_job in raw_payload, recursively convert any datetime/date objects to ISO-8601 strings.

3. Skip records where `source` or `url` is missing — log warning with record index.

4. Return `normalized_records` array.

## Output Format

```yaml
normalized_records:
  - source: str              # job board or scraper source identifier
    source_job_id: str|null  # canonical job ID from source, or null
    url: str                 # normalized URL (lowercase, no trailing slash, no utm params)
    url_sha256: str          # 64-char hex SHA-256 of normalized URL
    raw_payload: object      # full original job data (datetime fields as ISO-8601 strings)
    fetched_at: str          # ISO-8601 UTC timestamp, e.g. "2026-04-28T14:32:00Z"
    scrapy_query_id: null    # always null in v2
```

## Output Example

```json
[
  {
    "source": "gupy",
    "source_job_id": "84921",
    "url": "https://luby.gupy.io/jobs/84921",
    "url_sha256": "a3f5c2e1b7d94082f6c3a1e8b5d2f7c4a9e3b1d5f8c2a4e7b9d3f1c5a8e2b6d4",
    "raw_payload": {
      "id": "84921",
      "title": "Desenvolvedor Backend Python",
      "company": "Luby Software",
      "location": "Recife, PE — Remoto",
      "type": "CLT",
      "posted_at": "2026-04-25T09:00:00Z",
      "url": "https://Luby.gupy.io/jobs/84921/?utm_source=linkedin&ref=apply_btn",
      "source": "gupy"
    },
    "fetched_at": "2026-04-28T14:32:00Z",
    "scrapy_query_id": null
  },
  {
    "source": "linkedin",
    "source_job_id": null,
    "url": "https://linkedin.com/jobs/view/senior-data-engineer-at-luby-software",
    "url_sha256": "d7e2a9b4c1f8e3a6b5d2c9f4e7a1b8d5c3f6e2a9b4d7c1f5e8a3b6d2c9f7e4a1",
    "raw_payload": {
      "title": "Senior Data Engineer",
      "company": "Luby Software",
      "location": "Brasil — Remoto",
      "seniority": "Senior",
      "url": "https://LinkedIn.com/jobs/view/senior-data-engineer-at-luby-software?utm_source=jobs_homepage&utm_medium=web",
      "source": "linkedin",
      "scraped_at": "2026-04-28T14:30:00Z"
    },
    "fetched_at": "2026-04-28T14:32:01Z",
    "scrapy_query_id": null
  }
]
```

Note the second record has `source_job_id: null` because LinkedIn's search result page does not expose the canonical numeric job ID in this scraping context. The dedup task will use `source::url_sha256` as the fallback key for this record.

## Quality Criteria

- [ ] All records have `url_sha256` (exactly 64-char hex string)
- [ ] `scrapy_query_id` = `null` for all records (field must be present, not omitted)
- [ ] `raw_payload` preserves original data with no fields dropped (only datetime → ISO-8601 conversion allowed)
- [ ] `fetched_at` in ISO-8601 UTC format ending in `Z`
- [ ] Normalized URL is lowercase, no trailing slash, no utm/tracking params
- [ ] Records missing `source` or `url` are skipped and logged — not silently dropped

## Veto Conditions

1. **Any record missing `url` or `source`** — skip individual record and log: `"WARNING: record[{i}] skipped — missing required field '{field}'"`. Do not abort the entire task unless all records are invalid.
2. **`url_sha256` length != 64 chars** — recalculate. If recalculation still fails, skip record and log error. A malformed url_sha256 corrupts the entire dedup chain and must never be passed downstream.
3. **`scraped-jobs.json` is empty or missing** — abort task immediately with error: `"ABORT: scraped-jobs.json not found or empty — Scout output required"`.
