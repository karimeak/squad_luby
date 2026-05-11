"""
Ines Insert — Bronze ingest for Hunter Squad (CANONICAL TEMPLATE).

Each pipeline run COPIES this file to output/{run_id}/v1/ingest_bronze.py and
patches BASE_DIR before executing.

Telemetry (added 2026-05-11 — Fase 1.2):
Before the RPC, snapshots existing url_sha256 ∈ our batch that already live
in apify_jobs. After the RPC, snapshots again. The delta = records actually
inserted by Path 2 (silent inserts), which the RPC counter does not report.

When all records use the new `id` field (Path 1), the RPC counter is accurate
and the telemetry diff should match `inserted + updated` reported by the RPC.
"""

import json
import os
import time
import sys
import io
from datetime import datetime, timezone
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True)

# ─── Config ──────────────────────────────────────────────────────────────────
BASE_DIR = Path("C:/Users/Karime/OneDrive/Documentos/Squad/squads/hunter-squad/output/REPLACE_WITH_RUN_ID/v1")
INPUT_PATH = BASE_DIR / "normalized-batch.json"
OUTPUT_PATH = BASE_DIR / "ingest-result.json"
CHUNK_SIZE = 500


def count_existing(client, hashes):
    """How many of our url_sha256s already exist in apify_jobs?"""
    if not hashes:
        return 0
    total = 0
    for i in range(0, len(hashes), 500):
        chunk = hashes[i:i+500]
        response = client.table("apify_jobs").select("url_sha256", count="exact").in_("url_sha256", chunk).limit(500).execute()
        total += getattr(response, "count", None) or len(response.data or [])
    return total


def run():
    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    records = data["records"]
    total_records = len(records)
    routing = data.get("metadata", {}).get("rpc_routing", {})
    all_hashes = [r["url_sha256"] for r in records]

    print(f"[INFO] Loaded {total_records} records from normalized-batch.json")
    print(f"[INFO] RPC routing forecast: path1(id)={routing.get('path1_with_id','?')}  path2(no-id)={routing.get('path2_no_id','?')}")

    from supabase import create_client, Client, ClientOptions

    supabase_url = os.environ["SUPABASE_URL"]
    supabase_key = os.environ["SUPABASE_KEY"]

    client: Client = create_client(
        supabase_url,
        supabase_key,
        options=ClientOptions(postgrest_client_timeout=30)
    )
    print(f"[INFO] Supabase client created (timeout=30s)")

    # ── Telemetry: pre-snapshot ──────────────────────────────────────────
    print(f"[TELEMETRY] Counting existing url_sha256 in apify_jobs before RPC...")
    pre_count = count_existing(client, all_hashes)
    print(f"[TELEMETRY] pre_count = {pre_count} of {total_records}")

    # ── Process chunks ───────────────────────────────────────────────────
    chunks = [records[i:i+CHUNK_SIZE] for i in range(0, total_records, CHUNK_SIZE)]
    print(f"[INFO] {len(chunks)} chunk(s) to process")

    rpc_inserted = 0
    rpc_updated = 0
    failed_chunks = []
    start_time = time.time()

    for idx, chunk in enumerate(chunks):
        attempt = 0
        delays = [0, 1, 2]
        success = False
        last_error = None

        while attempt < 3:
            if delays[attempt] > 0:
                print(f"[RETRY] Chunk {idx} attempt {attempt+1}, sleeping {delays[attempt]}s ...")
                time.sleep(delays[attempt])
            try:
                print(f"[INFO] RPC ingest_apify_jobs_bronze — chunk {idx}, {len(chunk)} records, attempt {attempt+1}")
                response = client.rpc(
                    "ingest_apify_jobs_bronze",
                    {"p_items": chunk, "p_scrapy_query_id": None, "p_default_source": None}
                ).execute()

                result = response.data
                print(f"[INFO] RPC response: {result}")

                if isinstance(result, list) and len(result) > 0:
                    row = result[0]
                    rpc_inserted += int(row.get("inserted", 0) or 0)
                    rpc_updated += int(row.get("updated", 0) or 0)
                elif isinstance(result, dict):
                    rpc_inserted += int(result.get("inserted", 0) or 0)
                    rpc_updated += int(result.get("updated", 0) or 0)
                success = True
                break
            except Exception as e:
                last_error = str(e)
                print(f"[WARN] Chunk {idx} attempt {attempt+1} failed: {last_error}")
                attempt += 1

        if not success:
            failed_chunks.append({
                "chunk_index": idx,
                "records_in_chunk": len(chunk),
                "error": last_error
            })
            print(f"[ERROR] Chunk {idx} permanently failed after 3 attempts")

    duration_ms = int((time.time() - start_time) * 1000)

    # ── Telemetry: post-snapshot ─────────────────────────────────────────
    print(f"[TELEMETRY] Counting existing url_sha256 in apify_jobs after RPC...")
    post_count = count_existing(client, all_hashes)
    actual_inserts = post_count - pre_count
    print(f"[TELEMETRY] post_count = {post_count}  actual_inserts = {actual_inserts}")

    rpc_total = rpc_inserted + rpc_updated
    silent_inserts = max(0, actual_inserts - rpc_inserted)

    if rpc_total != actual_inserts:
        print(f"[TELEMETRY] DIVERGENCE: RPC reported {rpc_inserted}+{rpc_updated}={rpc_total} but actual diff={actual_inserts} (silent_inserts={silent_inserts})")
    else:
        print(f"[TELEMETRY] CONSISTENT: RPC counters match actual DB changes")

    # ── Veto ─────────────────────────────────────────────────────────────
    if rpc_inserted == 0 and actual_inserts == 0 and len(failed_chunks) > 0:
        print("[ABORT] Veto: nothing inserted AND failed_chunks non-empty")
        sys.exit(1)

    # ── Output ───────────────────────────────────────────────────────────
    output = {
        "rpc": "ingest_apify_jobs_bronze",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "total_records_sent": total_records,
        "rpc_inserted": rpc_inserted,
        "rpc_updated": rpc_updated,
        "telemetry": {
            "pre_count_in_bronze": pre_count,
            "post_count_in_bronze": post_count,
            "actual_inserts": actual_inserts,
            "silent_inserts_path2": silent_inserts,
            "rpc_counter_consistent": (rpc_total == actual_inserts),
        },
        "skipped_duplicates_estimate": total_records - actual_inserts - rpc_updated,
        "failed_chunks": failed_chunks,
        "chunks_processed": len(chunks) - len(failed_chunks),
        "duration_ms": duration_ms,
        # Legacy compatibility fields:
        "inserted": rpc_inserted + silent_inserts,
        "updated":  rpc_updated,
        "skipped_duplicates": total_records - actual_inserts - rpc_updated,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n[RESULT] sent={total_records} | rpc_inserted={rpc_inserted} | rpc_updated={rpc_updated} | silent_inserts={silent_inserts} | actual_inserts={actual_inserts} | failed_chunks={len(failed_chunks)} | duration_ms={duration_ms}")
    print(f"[RESULT] Written to: {OUTPUT_PATH}")


if __name__ == "__main__":
    run()
