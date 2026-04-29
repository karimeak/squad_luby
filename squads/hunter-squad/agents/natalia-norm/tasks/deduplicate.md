---
task: "Deduplicate Records"
order: 2
input: |
  - normalized_records: Array of bronze-schema records
output: |
  - unique_records: Array with intra-batch duplicates removed
  - dedup_stats: {total_input, duplicates_removed, unique_count, dedup_rate}
---

# Deduplicate Records

Removes intra-batch duplicates from the normalized_records array using a composite key strategy. The dedup key is computed per-record: `source::source_job_id` when source_job_id is available, falling back to `source::url_sha256` for records without a canonical job ID. First occurrence wins; subsequent duplicates are discarded. Returns the deduplicated array alongside stats for checkpoint reporting.

## Process

1. Initialize tracking structures:
   ```python
   seen_keys = set()
   unique_records = []
   duplicates_removed = 0
   ```

2. For each record in `normalized_records`, compute `dedup_key`:
   ```python
   if record["source_job_id"] is not None:
       dedup_key = f"{record['source']}::{record['source_job_id']}"
   else:
       dedup_key = f"{record['source']}::{record['url_sha256']}"
   ```

3. Iterate records and apply first-occurrence rule:
   ```python
   for record in normalized_records:
       dedup_key = compute_dedup_key(record)
       if dedup_key not in seen_keys:
           seen_keys.add(dedup_key)
           unique_records.append(record)
       else:
           duplicates_removed += 1
   ```

4. Calculate dedup_stats:
   ```python
   total_input = len(normalized_records)
   unique_count = len(unique_records)
   dedup_rate = f"{(duplicates_removed / total_input * 100):.1f}%"
   dedup_stats = {
       "total_input": total_input,
       "duplicates_removed": duplicates_removed,
       "unique_count": unique_count,
       "dedup_rate": dedup_rate
   }
   ```

5. Check veto conditions (see below).

6. Return `unique_records` and `dedup_stats`.

## Output Format

```yaml
unique_records:
  - source: str
    source_job_id: str|null
    url: str
    url_sha256: str
    raw_payload: object
    fetched_at: str
    scrapy_query_id: null

dedup_stats:
  total_input: int       # count of records received from normalize-schema task
  duplicates_removed: int  # count of records discarded as duplicates
  unique_count: int      # count of records in unique_records
  dedup_rate: str        # percentage string, e.g. "2.4%"
```

## Output Example

```json
{
  "unique_records": [
    {
      "source": "gupy",
      "source_job_id": "84921",
      "url": "https://luby.gupy.io/jobs/84921",
      "url_sha256": "a3f5c2e1b7d94082f6c3a1e8b5d2f7c4a9e3b1d5f8c2a4e7b9d3f1c5a8e2b6d4",
      "raw_payload": { "...": "..." },
      "fetched_at": "2026-04-28T14:32:00Z",
      "scrapy_query_id": null
    },
    {
      "source": "linkedin",
      "source_job_id": null,
      "url": "https://linkedin.com/jobs/view/senior-data-engineer-at-luby-software",
      "url_sha256": "d7e2a9b4c1f8e3a6b5d2c9f4e7a1b8d5c3f6e2a9b4d7c1f5e8a3b6d2c9f7e4a1",
      "raw_payload": { "...": "..." },
      "fetched_at": "2026-04-28T14:32:01Z",
      "scrapy_query_id": null
    }
  ],
  "dedup_stats": {
    "total_input": 1892,
    "duplicates_removed": 45,
    "unique_count": 1847,
    "dedup_rate": "2.4%"
  }
}
```

In this example, 45 of 1892 records were identified as intra-batch duplicates. The dedup_rate of 2.4% is within the normal range (< 40%), indicating a healthy scraping run with minor overlap across sources.

Duplicate scenario examples:
- Gupy job `84921` appeared in both the direct Gupy scrape and a LinkedIn Easy Apply redirect → same `source::source_job_id` key → second occurrence discarded
- LinkedIn job with no source_job_id scraped twice due to pagination overlap → same `source::url_sha256` key → second occurrence discarded

## Quality Criteria

- [ ] Zero duplicate `dedup_key` values in `unique_records`
- [ ] `dedup_rate` reported as percentage string (not float, not integer)
- [ ] No records dropped for missing `source_job_id` — url fallback used instead
- [ ] `dedup_stats.unique_count` == `len(unique_records)`
- [ ] `dedup_stats.total_input` == `len(normalized_records)` (received input count)
- [ ] `dedup_stats.duplicates_removed + dedup_stats.unique_count == dedup_stats.total_input`

## Veto Conditions

1. **`unique_records` is empty after dedup** — abort pipeline with error: `"ABORT: deduplicate returned 0 unique records from {total_input} input — check Scout output for validity"`. An empty batch must never be passed to build-batch.

2. **`dedup_rate` > 40%** — do not abort, but emit a prominent warning: `"WARNING: dedup_rate {dedup_rate} exceeds 40% threshold — possible upstream scraping issue (pagination loop, duplicate source feeds, or Scout re-run on same window). Proceeding with {unique_count} unique records."` Pipeline continues; human review is recommended before Supabase ingest.
