---
task: "Build Supabase Batch"
order: 3
input: |
  - unique_records: Deduplicated bronze-schema records
  - dedup_stats: Stats from dedup task
output: |
  - normalized_batch_file: Written to squads/hunter-squad/output/normalized-batch.json
  - batch_summary: Stats for checkpoint display
---

# Build Supabase Batch

Chunks the deduplicated records into groups of 500, validates each record for required fields and JSON serializability, attaches a metadata header with full pipeline stats, and writes the result to `normalized-batch.json`. Also returns a batch_summary object for display in the Step 04 checkpoint.

## Process

1. **Chunk unique_records into groups of 500**:
   ```python
   import math
   chunk_size = 500
   chunks = [
       unique_records[i : i + chunk_size]
       for i in range(0, len(unique_records), chunk_size)
   ]
   num_chunks = math.ceil(len(unique_records) / chunk_size)
   ```

2. **Validate each record** across all chunks — check required fields:
   ```python
   REQUIRED_FIELDS = ["source", "url", "url_sha256", "raw_payload"]
   for chunk in chunks:
       for record in chunk:
           for field in REQUIRED_FIELDS:
               assert field in record and record[field] is not None
   ```
   Records failing validation: log warning and remove (do not abort unless all records in a chunk fail).

3. **Convert any non-serializable types** to JSON-safe equivalents:
   - `datetime` / `date` objects → `.isoformat() + "Z"` (UTC assumed)
   - `set` objects → `sorted(list(s))` (deterministic ordering)
   - `Decimal` / `numpy.float64` → `float(v)`
   - Any object with `__dict__` → `vars(obj)`
   Apply recursively to `raw_payload`.

4. **Build metadata object**:
   ```python
   metadata = {
       "normalized_at": datetime.utcnow().isoformat() + "Z",
       "total_input": dedup_stats["total_input"],
       "after_dedup": dedup_stats["unique_count"],
       "final_batch_size": len(unique_records),
       "chunks": num_chunks,
       "dedup_rate": dedup_stats["dedup_rate"],
       "duplicates_removed": dedup_stats["duplicates_removed"]
   }
   ```

5. **Write to `squads/hunter-squad/output/normalized-batch.json`**:
   ```python
   import json
   output = {
       "metadata": metadata,
       "records": unique_records   # flat array, not nested by chunk
   }
   with open("squads/hunter-squad/output/normalized-batch.json", "w", encoding="utf-8") as f:
       json.dump(output, f, ensure_ascii=False, indent=2)
   ```
   Note: `records` is a single flat array. Chunking is handled by the Supabase ingestor at Step 04 using `metadata.chunks` and `chunk_size = 500` to slice the array at ingest time.

6. **Build batch_summary** for checkpoint:
   ```python
   batch_summary = {
       "status": "ready",
       "normalized_at": metadata["normalized_at"],
       "total_input": metadata["total_input"],
       "after_dedup": metadata["after_dedup"],
       "final_batch_size": metadata["final_batch_size"],
       "chunks": metadata["chunks"],
       "dedup_rate": metadata["dedup_rate"],
       "output_file": "squads/hunter-squad/output/normalized-batch.json"
   }
   ```

7. Return `batch_summary`.

## Output Format

```yaml
# normalized-batch.json structure
metadata:
  normalized_at: str        # ISO-8601 UTC timestamp of this normalization run
  total_input: int          # raw records received from Scout
  after_dedup: int          # records after intra-batch dedup
  final_batch_size: int     # records written to output (= after_dedup, minus any validation drops)
  chunks: int               # ceil(final_batch_size / 500)
  dedup_rate: str           # e.g. "2.4%"
  duplicates_removed: int   # count of records discarded during dedup

records:
  - source: str
    source_job_id: str|null
    url: str
    url_sha256: str          # 64-char hex SHA-256
    raw_payload: object      # full original job data, JSON-serializable
    fetched_at: str          # ISO-8601 UTC
    scrapy_query_id: null    # always null in v2
```

## Output Example

```json
{
  "metadata": {
    "normalized_at": "2026-04-28T14:33:45Z",
    "total_input": 1892,
    "after_dedup": 1847,
    "final_batch_size": 1847,
    "chunks": 4,
    "dedup_rate": "2.4%",
    "duplicates_removed": 45
  },
  "records": [
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
        "source": "gupy",
        "salary_range": null,
        "description_html": "<p>Buscamos um desenvolvedor Python...</p>",
        "requirements": ["Python 3.10+", "FastAPI", "PostgreSQL"],
        "benefits": ["VR", "VT", "Plano de saúde"]
      },
      "fetched_at": "2026-04-28T14:32:00Z",
      "scrapy_query_id": null
    }
  ]
}
```

In this example: 1892 raw records → 45 deduped → 1847 final records → 4 chunks (500 + 500 + 500 + 347). The Step 04 ingestor will slice `records[0:500]`, `records[500:1000]`, `records[1000:1500]`, `records[1500:1847]` for sequential Supabase upserts.

## Quality Criteria

- [ ] All chunks <= 500 records (enforced by `chunk_size = 500` slicing)
- [ ] `records` array is fully JSON-serializable — no `datetime` objects, no `set` objects, no custom Python types
- [ ] `metadata.chunks` == `math.ceil(final_batch_size / 500)`
- [ ] `metadata.final_batch_size` == `len(records)` in output file
- [ ] File written to exact path: `squads/hunter-squad/output/normalized-batch.json`
- [ ] `scrapy_query_id` = `null` on every record in output
- [ ] `batch_summary.status` = `"ready"` on successful write

## Veto Conditions

1. **Any chunk > 500 records** — this should never happen with correct slicing logic, but if detected: abort with error `"ABORT: chunk {i} has {n} records — exceeds 500-row PostgREST limit. Recalculate chunks before proceeding."` Do not write partial output.

2. **`normalized-batch.json` write fails** — abort with error: `"ABORT: failed to write normalized-batch.json — {error_message}. Step 04 cannot proceed without output file."` Surface the OS-level error (permissions, disk space, path not found) for diagnosis.
