---
execution: subagent
agent: ines-insert
model_tier: fast
inputFile: squads/hunter-squad/output/normalized-batch.json
outputFile: squads/hunter-squad/output/ingest-result.json
---

# Step 06: Inês Insert — Ingest Bronze

> ⚠️ **Task instruction**: In this step, Inês Insert runs ONLY the `call-bronze.md` task. Do NOT run `call-promote-pipeline.md`.

## Context Loading

- `squads/hunter-squad/output/normalized-batch.json` — bronze records to ingest (chunked at 500)
- `squads/hunter-squad/pipeline/data/anti-patterns.md` — Supabase anti-patterns: on_conflict as string, 30s timeout, no chunking = 10MB limit, Python SDK has no built-in retry

## Instructions

### Process

1. **ONLY RUN**: `call-bronze.md` task
2. Read `normalized-batch.json` — extract records array and metadata
3. Create Supabase client with `ClientOptions(postgrest_client_timeout=30)` — override default 4s httpx timeout
4. Process records in chunks of 500:
   - Call `supabase.rpc("ingest_apify_jobs_bronze", {"p_items": chunk, "p_scrapy_query_id": None, "p_default_source": None}).execute()`
   - `on_conflict` parameter must be passed as a string, not a list
   - On chunk failure: add to dead_letter list with error detail; retry with exponential backoff (max 3 attempts, 1s/2s/4s delays)
5. Collect ingest totals: inserted + skipped_duplicates + failed_chunks
6. Write result to `squads/hunter-squad/output/ingest-result.json`

## Output Format

```json
{
  "rpc": "ingest_apify_jobs_bronze",
  "timestamp": "ISO-8601 UTC",
  "total_records_sent": 1847,
  "inserted": 1423,
  "skipped_duplicates": 424,
  "failed_chunks": [],
  "duration_ms": 8400
}
```

## Output Example

```json
{
  "rpc": "ingest_apify_jobs_bronze",
  "timestamp": "2026-04-28T09:52:30Z",
  "total_records_sent": 1847,
  "inserted": 1423,
  "skipped_duplicates": 424,
  "failed_chunks": [],
  "chunks_processed": 4,
  "duration_ms": 8400
}
```

## Veto Conditions

Reject and redo if ANY are true:
1. `inserted == 0` AND `failed_chunks` is not empty — all chunks failed; abort pipeline and alert user with error details
2. `normalized-batch.json` not found at expected path — abort: "Normalization output missing. Re-run from Step 04."

## Quality Criteria

- [ ] `chunk_size ≤ 500` for every chunk sent to Supabase
- [ ] Supabase client initialized with `postgrest_client_timeout=30` (not default 4s)
- [ ] `ingest-result.json` written with `inserted`, `skipped_duplicates`, `failed_chunks`, `duration_ms`
- [ ] `inserted + skipped_duplicates` approximately equals `total_records_sent` (small discrepancy from failed_chunks acceptable)
