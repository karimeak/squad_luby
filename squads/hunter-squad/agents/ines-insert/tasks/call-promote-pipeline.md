---
task: "RPCs 2-4 — Promote Pipeline"
order: 2
input: |
  - analyst_completion: Confirmation that Ana Analyst enrichment completed (analyst-samples.json exists)
  - supabase_url: https://pbvjsixlqnuzcnqahbxu.supabase.co
  - supabase_key: From environment variable SUPABASE_SERVICE_KEY
output: |
  - promote_result: Results from all 3 sequential RPCs
  - promote_result_file: Written to squads/hunter-squad/output/promote-result.json
---

# RPCs 2-4 — Promote Pipeline

Executes the three promote RPCs in strict sequential order. Each RPC depends on the previous one completing successfully. Stops immediately if any critical RPC fails.

## Process

1. Verify `squads/hunter-squad/output/analyst-samples.json` exists (confirms enrichment ran)
2. Create two Supabase clients:
   ```python
   from supabase import create_client, ClientOptions
   
   # For RPCs 2 and 3 (expected < 30s)
   supabase_normal = create_client(
       SUPABASE_URL, SUPABASE_KEY,
       options=ClientOptions(postgrest_client_timeout=30)
   )
   
   # For RPC 4 (can take up to 2 minutes)
   supabase_long = create_client(
       SUPABASE_URL, SUPABASE_KEY,
       options=ClientOptions(postgrest_client_timeout=180)
   )
   ```
3. **RPC 2** — `promote_apify_jobs_to_jobs_analyzed`:
   ```python
   result_2 = supabase_normal.rpc("promote_apify_jobs_to_jobs_analyzed", {}).execute()
   ```
   - Record: `{success: True, rows_promoted: N, duration_ms: N}`
   - **IF FAILS**: write partial result to `promote-result.json`, raise error, ABORT — do NOT proceed to RPC 3 or 4
4. **RPC 3** — `upsert_targets_from_jobs_analyzed`:
   ```python
   result_3 = supabase_normal.rpc("upsert_targets_from_jobs_analyzed", {}).execute()
   ```
   - Record: `{success: True, new_targets: N, updated_targets: M, duration_ms: N}`
   - **IF FAILS**: write partial result, raise error, ABORT — do NOT proceed to RPC 4
5. **RPC 4** — `refresh_target_jobs_all`:
   ```python
   result_4 = supabase_long.rpc("refresh_target_jobs_all", {}).execute()
   ```
   - Uses 180s timeout
   - **IF FAILS or TIMES OUT**: record as warning (data integrity maintained — pivot is stale but not corrupt), do NOT abort
6. Build `promote_result` dict with all RPC outcomes
7. Write to `squads/hunter-squad/output/promote-result.json`

## Output Format

```yaml
promote_result:
  executed_at: "ISO-8601 UTC"
  overall_success: bool

  rpc_2_promote:
    rpc_name: "promote_apify_jobs_to_jobs_analyzed"
    success: bool
    rows_promoted: int
    duration_ms: int
    error: null | str

  rpc_3_upsert_targets:
    rpc_name: "upsert_targets_from_jobs_analyzed"
    success: bool
    new_targets: int
    updated_targets: int
    duration_ms: int
    error: null | str

  rpc_4_refresh:
    rpc_name: "refresh_target_jobs_all"
    success: bool
    total_target_jobs: int
    duration_ms: int
    error: null | str
    warning: null | str  # populated if timeout/partial success
```

## Output Example

```json
{
  "executed_at": "2026-04-28T11:52:10Z",
  "overall_success": true,

  "rpc_2_promote": {
    "rpc_name": "promote_apify_jobs_to_jobs_analyzed",
    "success": true,
    "rows_promoted": 1389,
    "duration_ms": 4200,
    "error": null
  },

  "rpc_3_upsert_targets": {
    "rpc_name": "upsert_targets_from_jobs_analyzed",
    "success": true,
    "new_targets": 47,
    "updated_targets": 123,
    "duration_ms": 3800,
    "error": null
  },

  "rpc_4_refresh": {
    "rpc_name": "refresh_target_jobs_all",
    "success": true,
    "total_target_jobs": 8203,
    "duration_ms": 94000,
    "error": null,
    "warning": null
  }
}
```

## Quality Criteria

- [ ] Sequential execution enforced: RPC 3 only runs after RPC 2 succeeds; RPC 4 only runs after RPC 3 succeeds
- [ ] RPC 4 uses 180-second timeout client (not the 30s client used for RPCs 2-3)
- [ ] Each RPC result includes `duration_ms` (measured, not estimated)
- [ ] `promote-result.json` written even on partial failure (to preserve what succeeded)
- [ ] `overall_success: false` if ANY of RPCs 2-3 failed (RPC 4 timeout alone does not make overall_success false)

## Veto Conditions

Reject and redo if ANY are true:
1. RPC 2 (`promote_apify_jobs_to_jobs_analyzed`) fails — write error to `promote-result.json`, abort with clear error message; pipeline cannot continue without silver promotion
2. RPC 3 (`upsert_targets_from_jobs_analyzed`) fails — write partial result (RPC 2 outcome + RPC 3 error), abort; target data would be stale
