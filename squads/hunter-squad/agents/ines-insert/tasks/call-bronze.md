---
task: "RPC 1 — Ingest Bronze"
order: 1
input: |
  - normalized_batch: Records from squads/hunter-squad/output/normalized-batch.json
output: |
  - ingest_result: {inserted, skipped_duplicates, failed_chunks}
  - ingest_result_file: Written to squads/hunter-squad/output/ingest-result.json
---

# RPC 1 — Ingest Bronze

Calls `ingest_apify_jobs_bronze` RPC with chunked batch of normalized job records. Uses explicit 30s timeout and manual exponential backoff retry. Writes full result to `ingest-result.json`.

---

## Process

1. **Read input**: Load `squads/hunter-squad/output/normalized-batch.json`. If file not found, abort immediately with veto condition 2.

2. **Create Supabase client** with explicit timeout override:
   ```python
   from supabase import create_client, ClientOptions

   supabase = create_client(
       supabase_url,
       supabase_key,
       options=ClientOptions(postgrest_client_timeout=30)
   )
   ```
   Never use the default client — default httpx timeout is 4s and will `ReadTimeout` on real payloads.

3. **Split records into chunks of 500**:
   ```python
   CHUNK_SIZE = 500
   chunks = [records[i:i+CHUNK_SIZE] for i in range(0, len(records), CHUNK_SIZE)]
   ```

4. **For each chunk**, call the RPC with retry logic:

   a. Attempt up to 3 times with exponential backoff (0s, 2s, 4s delays):
      ```python
      result = supabase.rpc(
          "ingest_apify_jobs_bronze",
          {
              "p_items": chunk,
              "p_scrapy_query_id": None,
              "p_default_source": None
          }
      ).execute()
      ```

   b. **On success**: add `result.data["inserted"]` to `total_inserted`, add `result.data["skipped_duplicates"]` to `total_skipped`.

   c. **On failure after 3 attempts**: append to `dead_letter` list:
      ```python
      dead_letter.append({
          "chunk_index": i,
          "records_count": len(chunk),
          "error": str(exception)
      })
      ```
      Do NOT abort the remaining chunks — continue processing.

5. **Build `ingest_result`** with all totals and dead-letter list.

6. **Write to** `squads/hunter-squad/output/ingest-result.json`.

7. **Check veto condition 1**: if `inserted == 0` AND `len(dead_letter) == len(chunks)`, all chunks failed — abort pipeline and alert.

---

## Retry Logic (Exponential Backoff)

```python
import time

def call_with_retry(supabase, chunk, chunk_index, dead_letter):
    delays = [0, 2, 4]  # seconds before each attempt
    last_error = None
    for attempt, delay in enumerate(delays):
        if delay > 0:
            time.sleep(delay)
        try:
            result = supabase.rpc(
                "ingest_apify_jobs_bronze",
                {
                    "p_items": chunk,
                    "p_scrapy_query_id": None,
                    "p_default_source": None
                }
            ).execute()
            return result.data  # success
        except Exception as e:
            last_error = e
            continue
    # All 3 attempts failed
    dead_letter.append({
        "chunk_index": chunk_index,
        "records_count": len(chunk),
        "error": str(last_error)
    })
    return None
```

---

## Output Format

```yaml
ingest_result:
  rpc: "ingest_apify_jobs_bronze"
  timestamp: str           # ISO 8601, e.g. "2026-04-28T10:34:22Z"
  total_records_sent: int  # total rows in normalized-batch.json
  inserted: int            # rows newly inserted
  skipped_duplicates: int  # rows skipped due to on_conflict match
  failed_chunks:           # list of chunks that failed after 3 retries
    - chunk_index: int
      records_count: int
      error: str
  duration_ms: int         # total wall-clock time for all chunks
```

---

## Output Example

```json
{
  "rpc": "ingest_apify_jobs_bronze",
  "timestamp": "2026-04-28T10:34:22Z",
  "total_records_sent": 1847,
  "inserted": 1423,
  "skipped_duplicates": 424,
  "failed_chunks": [],
  "duration_ms": 8400
}
```

Breakdown: 1847 records sent across 4 chunks (3x 500 + 1x 347). 1423 were new rows inserted. 424 were existing rows skipped by `on_conflict` idempotency. 0 chunks failed. Total time: 8.4 seconds.

---

## Critical Implementation Notes

- **`on_conflict` is handled server-side** inside the `ingest_apify_jobs_bronze` RPC — do not pass `on_conflict` as a client-side parameter to this RPC. The RPC itself manages deduplication logic.
- **Timeout is set at the client level** via `ClientOptions(postgrest_client_timeout=30)`, not per-request. Create the client once and reuse for all chunks.
- **Upsert idempotency**: running the same batch twice produces the same inserted count (second run = 0 inserted, N skipped). This is by design — safe to re-run on failure.
- **Never pass `on_conflict` as a Python list** to any Supabase call: `on_conflict=["col1"]` causes PostgREST error `42P10`. Always use string: `on_conflict="col1"`.

---

## Quality Criteria

- [ ] `chunk_size` <= 500 rows per RPC call
- [ ] Supabase client created with `postgrest_client_timeout=30` (not default 4s)
- [ ] Exponential backoff implemented: max 3 attempts per chunk, delays 0s / 2s / 4s
- [ ] `failed_chunks` logged with `chunk_index`, `records_count`, and full `error` string
- [ ] `ingest-result.json` written to `squads/hunter-squad/output/` at task completion
- [ ] Total `inserted + skipped_duplicates` equals `total_records_sent - (sum of failed_chunks.records_count)`

---

## Veto Conditions

1. **All chunks failed** — `inserted == 0` AND `failed_chunks` contains all chunks (every chunk failed after 3 retries): abort pipeline immediately. Write error state to `ingest-result.json`, surface alert to orchestrator. Do not proceed to Step 07.

2. **`normalized-batch.json` not found** — file missing at `squads/hunter-squad/output/normalized-batch.json`: abort task immediately. This indicates upstream step (normalization) did not complete. Alert orchestrator.
