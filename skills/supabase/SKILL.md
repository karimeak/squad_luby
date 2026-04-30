---
name: "Supabase"
description: "Supabase MCP integration — execute SQL queries, call RPCs, manage tables. Used by Hunter Squad for bronze ingest and promote pipeline operations."
type: mcp
version: "0.1.1"
mcp:
  server_name: supabase
categories:
  - database
  - analytics
---

# Supabase Skill

This skill provides Supabase MCP integration for database operations.

## Core Principles

1. **Use `mcp__supabase__execute_sql` for all read queries** — SELECT, COUNT, SHOW, EXPLAIN.
2. **Use `mcp__supabase__execute_sql` for DDL** — CREATE, ALTER, DROP (with care).
3. **For RPC calls via Python SDK** — use `supabase.rpc(name, params).execute()` with explicit timeouts.

## Hunter Squad RPCs

| RPC | Step | Timeout |
|-----|------|---------|
| `ingest_apify_jobs_bronze` | Step 06 | 30s |
| `promote_apify_jobs_to_jobs_analyzed` | Step 09 | 30s |
| `upsert_targets_from_jobs_analyzed` | Step 09 | 30s |
| `refresh_target_jobs_all` | Step 09 | **180s** |

## Python SDK Gotchas

- **`on_conflict` must be a string**, never a list (`on_conflict="col1,col2"` not `["col1","col2"]`)
- **Default httpx timeout is 4s** — always use `ClientOptions(postgrest_client_timeout=30)` or `180` for heavy RPCs
- **No automatic retry** — implement exponential backoff manually (max 3 attempts)
- **Chunk size ≤ 500 rows** — PostgREST hard limit of 10MB per request

## Environment Variables

- `SUPABASE_URL` — project URL (e.g., `https://pbvjsixlqnuzcnqahbxu.supabase.co`)
- `SUPABASE_KEY` — service_role key (required for RPC calls that bypass RLS)
