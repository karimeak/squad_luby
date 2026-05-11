"""
Natalia Norm — Normalization and Dedup for Hunter Squad (CANONICAL TEMPLATE).

This is the canonical template used by Natalia Norm. Each pipeline run COPIES
this file to output/{run_id}/v1/normalize.py and patches the run-specific
constants (BASE_DIR) before executing.

Output schema (per record in normalized-batch.json):
- id              : alias for source_job_id, written ONLY when high-confidence.
                    Required for RPC ingest_apify_jobs_bronze Path 1 routing.
                    Path 1 reads item->>'id' to enable proper insert/update counters.
                    Records without id fall through to Path 2 (silent inserts).
- source          : platform name (remoteok, weworkremotely, etc.)
- source_job_id   : same as id (kept for backward compat with consumers)
- url             : normalized URL (lowercase scheme/host, no trailing slash, no utm_*)
- url_sha256      : SHA-256 hex of normalized URL — dedup key for Path 2
- raw_payload     : full original job object with HTML stripped from text fields
- fetched_at      : ISO-8601 timestamp from scraping
- scrapy_query_id : always null (managed elsewhere)

ID confidence rules (extract_source_job_id):
- HIGH: source field explicitly provided 'source_job_id', 'id', 'job_id', or 'external_id'.
- HIGH: URL contains 6+ consecutive digits after a slash (typical job IDs are 6-9 digits;
        4-digit numbers are filtered to avoid matching years like 2026).
- NONE: no source-provided ID and no high-confidence URL match → record uses Path 2.
"""

import io
import json
import hashlib
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True)

# ─── Config ──────────────────────────────────────────────────────────────────
BASE_DIR = Path("C:/Users/Karime/OneDrive/Documentos/Squad/squads/hunter-squad/output/REPLACE_WITH_RUN_ID/v1")
INPUT_PATH = BASE_DIR / "scraped-jobs.json"
OUTPUT_PATH = BASE_DIR / "normalized-batch.json"
CHUNK_SIZE = 500


def normalize_url(url: str) -> str:
    if not url:
        return ""
    try:
        parsed = urlparse(url.strip())
        query = [(k, v) for k, v in parse_qsl(parsed.query, keep_blank_values=False) if not k.lower().startswith("utm_")]
        path = parsed.path.rstrip("/") or "/"
        normalized = urlunparse((
            parsed.scheme.lower(),
            parsed.netloc.lower(),
            path,
            "",
            urlencode(query),
            ""
        ))
        return normalized
    except Exception:
        return url.strip().lower().rstrip("/")


def sha256_hex(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def strip_html(text):
    if not isinstance(text, str):
        return text
    return re.sub(r"<[^>]+>", "", text).strip()


def extract_source_job_id(job: dict) -> str | None:
    """Returns the job ID with high confidence, or None if not safely extractable.

    Avoid regex on URLs with <6 digits (catches years like 2026) to prevent
    false IDs that would cause silent overwrites via the RPC's UPSERT path.
    """
    for k in ("source_job_id", "id", "job_id", "external_id"):
        v = job.get(k)
        if v is not None and str(v).strip():
            return str(v).strip()
    url = job.get("url") or ""
    m = re.search(r"/(\d{6,})(?:[/?#]|$)", url)
    if m:
        return m.group(1)
    return None


def main():
    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        scraped = json.load(f)

    raw_jobs = scraped.get("jobs", [])
    fetched_at = scraped.get("metadata", {}).get("collected_at") or datetime.now(timezone.utc).isoformat()
    print(f"[normalize] Loaded {len(raw_jobs)} raw jobs from {INPUT_PATH.name}")

    records = []
    path1_count = 0
    path2_count = 0

    for job in raw_jobs:
        source = job.get("source") or job.get("_source_site") or "unknown"
        raw_url = job.get("url") or ""
        norm_url = normalize_url(raw_url)
        url_hash = sha256_hex(norm_url) if norm_url else sha256_hex(f"{source}::{job.get('title','')}::{job.get('company','')}")

        cleaned_payload = dict(job)
        for key in ("title", "company", "description", "location"):
            if key in cleaned_payload:
                cleaned_payload[key] = strip_html(cleaned_payload[key])

        sid = extract_source_job_id(job)
        if sid:
            path1_count += 1
        else:
            path2_count += 1

        records.append({
            "id": sid,
            "source": source,
            "source_job_id": sid,
            "url": norm_url or raw_url,
            "url_sha256": url_hash,
            "raw_payload": cleaned_payload,
            "fetched_at": fetched_at,
            "scrapy_query_id": None,
        })

    total_input = len(records)

    seen = {}
    for rec in records:
        if rec.get("source_job_id"):
            key = f"{rec['source']}::sid::{rec['source_job_id']}"
        else:
            key = f"{rec['source']}::hash::{rec['url_sha256']}"
        if key not in seen:
            seen[key] = rec
    deduped = list(seen.values())

    dupe_count = total_input - len(deduped)
    dedup_rate = f"{(dupe_count / total_input * 100):.1f}%" if total_input else "0.0%"

    valid = []
    bad = 0
    for rec in deduped:
        if not rec["source"] or not rec["url"] or not rec["url_sha256"] or len(rec["url_sha256"]) != 64:
            bad += 1
            continue
        valid.append(rec)

    chunks = (len(valid) + CHUNK_SIZE - 1) // CHUNK_SIZE if valid else 0

    routing = {
        "path1_with_id": sum(1 for r in valid if r.get("id")),
        "path2_no_id":   sum(1 for r in valid if not r.get("id")),
    }

    out = {
        "metadata": {
            "normalized_at": datetime.now(timezone.utc).isoformat(),
            "total_input": total_input,
            "after_dedup": len(deduped),
            "duplicate_count": dupe_count,
            "dedup_rate": dedup_rate,
            "invalid_records_dropped": bad,
            "final_batch_size": len(valid),
            "chunks": chunks,
            "rpc_routing": routing,
        },
        "records": valid,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False, default=str)

    print(f"[normalize] DONE")
    print(f"  total_input         = {total_input}")
    print(f"  after_dedup         = {len(deduped)}")
    print(f"  duplicate_count     = {dupe_count} ({dedup_rate})")
    print(f"  invalid_dropped     = {bad}")
    print(f"  final_batch_size    = {len(valid)}")
    print(f"  chunks (size={CHUNK_SIZE}) = {chunks}")
    print(f"  rpc_routing         = path1(id)={routing['path1_with_id']}  path2(no-id)={routing['path2_no_id']}")
    print(f"  output              = {OUTPUT_PATH}")

    if not valid:
        print("[ABORT] Veto: empty records — normalization produced zero records")
        sys.exit(1)


if __name__ == "__main__":
    main()
