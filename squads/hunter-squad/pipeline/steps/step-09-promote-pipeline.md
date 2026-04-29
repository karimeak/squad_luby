---
execution: subagent
agent: ines-insert
model_tier: fast
inputFile: squads/hunter-squad/output/analyst-samples.json
outputFile: squads/hunter-squad/output/promote-result.json
---

# Step 09: Inês Insert — Promote Pipeline

> ⚠️ **Task instruction**: In this step, Inês Insert runs ONLY the `call-promote-pipeline.md` task. Do NOT run `call-bronze.md`.

## Context Loading

- `squads/hunter-squad/output/analyst-samples.json` — analyst completion confirmation (must exist)
- `squads/hunter-squad/pipeline/data/anti-patterns.md` — RPC sequencing: never run RPC N+1 if RPC N failed; use 180s timeout for refresh_target_jobs_all

## Instructions

### Process

1. **ONLY RUN**: `call-promote-pipeline.md` task
2. Verify `analyst-samples.json` exists at expected path
3. Create two Supabase clients:
   - `supabase_normal`: `ClientOptions(postgrest_client_timeout=30)` — for RPCs 2 and 3
   - `supabase_long`: `ClientOptions(postgrest_client_timeout=180)` — for RPC 4 only
4. **RPC 2** — `promote_apify_jobs_to_jobs_analyzed({})`: execute with 30s timeout. IF FAILS → write error to promote-result.json, ABORT (do not run RPCs 3 or 4).
5. **RPC 3** — `upsert_targets_from_jobs_analyzed({})`: execute with 30s timeout. IF FAILS → write partial result, ABORT (do not run RPC 4).
6. **RPC 4** — `refresh_target_jobs_all({})`: execute with 180s timeout. Timeout/failure here is a WARNING (pivot stale, data not corrupt) — do NOT abort.
7. Write complete results to `squads/hunter-squad/output/promote-result.json`

## Output Format

```json
{
  "executed_at": "ISO-8601 UTC",
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

## Veto Conditions

Reject and redo if ANY are true:
1. RPC 2 (`promote_apify_jobs_to_jobs_analyzed`) fails — write `{overall_success: false, rpc_2_promote: {error: "..."}}` to promote-result.json, abort pipeline with error message
2. RPC 3 (`upsert_targets_from_jobs_analyzed`) fails — write partial result (RPC 2 success + RPC 3 error), abort pipeline

## Quality Criteria

- [ ] Sequential execution: RPC 3 only runs after RPC 2 succeeds; RPC 4 only after RPC 3 succeeds
- [ ] `supabase_long` client (180s timeout) used exclusively for RPC 4
- [ ] `promote-result.json` written even on partial failure
- [ ] `overall_success: false` if RPCs 2 or 3 failed (RPC 4 timeout alone does not set overall_success to false)
