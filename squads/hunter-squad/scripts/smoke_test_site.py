"""
Smoke Test — single-site scraper validation.

Loads hunter_sites row from Supabase for the given site name, then runs the
canonical scraper.py extraction pipeline against that single site. Reports
counts (raw, after_date, after_title) without touching bronze.

Use this whenever you change hunter_sites.config.selectors for a site —
run this script first to verify the new config produces extractable cards
before triggering a full squad run.

Usage:
  python squads/hunter-squad/scripts/smoke_test_site.py <site_name>
"""

import asyncio
import io
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Note: scraper.py wraps sys.stdout/stderr at module level with UTF-8 — don't
# pre-wrap here, it causes "I/O operation on closed file" at interpreter exit.

# Make scraper.py importable
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

# Patch scraper.py constants BEFORE other imports run
import scraper  # noqa
scraper.CUTOFF_DATE = datetime.now(timezone.utc) - timedelta(days=7)
scraper.CUTOFF_DATE_STR = scraper.CUTOFF_DATE.isoformat()

from supabase import create_client, ClientOptions


async def main():
    if len(sys.argv) < 2:
        print("Usage: python smoke_test_site.py <site_name>")
        sys.exit(1)

    site_name = sys.argv[1].strip()

    url = os.environ["SUPABASE_URL"]
    key = os.environ["SUPABASE_KEY"]
    client = create_client(url, key, options=ClientOptions(postgrest_client_timeout=30))

    row = client.table("hunter_sites").select("*").eq("name", site_name).execute()
    if not row.data:
        print(f"[smoke] Site '{site_name}' not found in hunter_sites")
        sys.exit(1)

    site_row = row.data[0]
    config = site_row.get("config") or {}
    site = {
        "name": site_row["name"],
        "base_url": site_row["base_url"],
        "scraper_type": site_row["scraper_type"],
        "priority": site_row.get("priority", 50),
        "tier": "tier1",
        "max_pages": 3,
        "throttle_ms": config.get("throttle_ms", 2000),
        "config": config,
    }

    print(f"[smoke] Testing site={site_name}")
    print(f"[smoke] base_url={site['base_url']}")
    print(f"[smoke] config.selectors present: {'yes' if config.get('selectors') else 'no'}")
    if config.get("selectors"):
        print(f"[smoke]   card        = {config['selectors'].get('card')}")
        print(f"[smoke]   title       = {config['selectors'].get('title')}")
        print(f"[smoke]   title_regex = {config['selectors'].get('title_regex')}")
        print(f"[smoke]   url         = {config['selectors'].get('url')}")

    # Load a small job_titles list — match common dev terms
    job_titles = [
        "Software Engineer", "Backend Engineer", "Frontend Engineer", "Full Stack",
        "Data Engineer", "DevOps", "SRE", "Site Reliability", "Cloud Engineer",
        "AI Engineer", "ML Engineer", "Machine Learning", "Security Engineer",
        "Java", "Python", "Node", "React", "Angular", "Vue", "TypeScript",
        "Mobile Developer", "iOS", "Android", "Product Manager", "Tech Lead",
        "Database", "DBA", "QA Engineer", "Test Engineer",
    ]

    result = await scraper.scrape_single_site(site, job_titles)
    print(f"\n[smoke] RESULT for {site_name}:")
    print(f"  site_name      = {result.get('site_name')}")
    print(f"  error          = {result.get('error')}")
    print(f"  jobs_extracted = {len(result.get('jobs', []))}")
    print(f"  stop_reason    = {result.get('stop_reason')}")
    print(f"  duration_ms    = {result.get('duration_ms')}")

    jobs = result.get("jobs", [])
    if jobs:
        print(f"\n[smoke] Sample jobs (first 3):")
        for j in jobs[:3]:
            print(f"  title   = {j.get('title','')[:100]!r}")
            print(f"  company = {j.get('company','')!r}")
            print(f"  url     = {j.get('url','')!r}")
            print(f"  ---")

    out_path = Path(f"squads/hunter-squad/_investigations/smoke-{site_name}-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json")
    out_path.parent.mkdir(exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False, default=str)
    print(f"\n[smoke] Full result saved to: {out_path}")


if __name__ == "__main__":
    asyncio.run(main())
