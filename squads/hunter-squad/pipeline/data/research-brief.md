# Research Brief — Hunter Squad
Date: 2026-04-28
Domains: Playwright Scraping · LLM Structured Extraction · ETL Normalization · Supabase REST API

---

## Domain 1: Playwright Web Scraping

### Key Frameworks & Patterns

**Browser Setup**
- Always use Chromium — fastest, most compatible with modern SPAs
- Run in headless mode; block images/fonts/stylesheets via `route()` interception → 40–70% faster page load
- Use persistent browser contexts (`browser.new_context()`) to reuse cookies/sessions across requests

**Async Concurrency with Semaphore**
```python
import asyncio
from playwright.async_api import async_playwright

sem = asyncio.Semaphore(5)  # max 5 concurrent tabs

async def scrape_url(browser, url):
    async with sem:
        page = await browser.new_page()
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        finally:
            await page.close()
```
- 5 concurrent contexts = ~5x throughput, ~50–100 MB RAM per context
- Always close pages in `finally` blocks to prevent memory leaks

**Infinite Scroll Handling**
```python
prev_count = 0
while True:
    items = await page.query_selector_all(".job-card")
    if len(items) == prev_count or len(items) > MAX_ITEMS:
        break
    prev_count = len(items)
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    await page.wait_for_timeout(1500)
```
- Prefer intercepting underlying XHR/fetch calls over DOM parsing when available
- Always cap loops with `MAX_ITEMS` AND date-based stop condition

**Date-Based Pagination Stop**
```python
async def should_stop(page, min_date: datetime) -> bool:
    """Stop pagination when oldest visible job is before min_date."""
    dates = await page.evaluate("""
        () => Array.from(document.querySelectorAll('[data-posted-at]'))
                   .map(el => el.getAttribute('data-posted-at'))
    """)
    if not dates:
        return False
    oldest = min(datetime.fromisoformat(d) for d in dates if d)
    return oldest < min_date
```

**Retry Logic with Exponential Backoff**
```python
async def scrape_with_retry(url, max_retries=3, base_delay=1.0):
    for attempt in range(max_retries):
        try:
            return await scrape_url(url)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait = base_delay * (2 ** attempt) * random.uniform(0.5, 1.5)
            await asyncio.sleep(wait)
```

**Anti-Bot Evasion**
- Use `playwright-stealth` (Python v2.0.2+) — patches `navigator.webdriver`, removes `HeadlessChrome` UA, spoofs screen resolution
- Randomize: scroll speeds, mouse trajectory, click timing
- Rotate residential proxies for high-priority sites (LinkedIn, Indeed, Glassdoor)
- Limitation: stealth does NOT bypass Cloudflare v2 challenges

**Wait Strategies**
- Use `wait_for_selector()` and `wait_for_load_state("networkidle")` — never fixed `sleep()`
- Use `expect(locator).to_be_visible(timeout=10000)` for assertions

### Anti-Patterns (Never Do)
1. Using `time.sleep()` instead of Playwright's event-based waits
2. Opening too many contexts without a semaphore (memory exhaustion)
3. Parsing rendered DOM when an XHR call returns clean JSON
4. No `finally` block around `page.close()` — leaks browser processes
5. Fixed retry intervals instead of exponential backoff with jitter
6. Infinite scroll without a hard date + page-count termination condition

### Quality Criteria
- Page load success rate > 95% across 100 URLs
- Retry coverage: all 429/503/timeout errors caught and retried
- Memory stable after 1,000 pages
- All pagination loops terminate (date stop + page cap enforced)
- Zero `page.close()` omissions

---

## Domain 2: LLM Structured Extraction (Claude API)

### Key Frameworks & Patterns

**Native Claude Structured Outputs (claude-sonnet-4-5+)**
```python
import anthropic
from pydantic import BaseModel
from typing import Optional

class JobEnrichment(BaseModel):
    ai_key_skills: list[str]
    ai_keywords: list[str]
    ai_experience_level: Optional[str]  # "junior"|"mid"|"senior"|"staff"|"principal"
    ai_core_responsibilities: Optional[str]
    ai_requirements_summary: Optional[str]
    ai_salary_minvalue: Optional[float]
    ai_salary_unittext: Optional[str]   # "HOUR"|"YEAR"|null
    remote_derived: Optional[bool]
    domain_derived: Optional[str]
    locations_derived: list[str]
    cities_derived: list[str]
    regions_derived: list[str]
    countries_derived: list[str]

client = anthropic.Anthropic()
response = client.messages.parse(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=EXTRACTION_SYSTEM_PROMPT,
    messages=[{"role": "user", "content": job_description}],
    response_format=JobEnrichment,
)
result = response.parsed_output  # typed JobEnrichment instance
```

**System Prompt for Job Field Extraction**
```
You are a precise data extractor for job postings.

Rules:
- Only extract information explicitly stated in the text
- Return null for any field not clearly mentioned — do not infer or guess
- ai_key_skills: only named technologies, tools, and frameworks explicitly listed
- ai_experience_level: normalize to exactly one of: "junior"|"mid"|"senior"|"staff"|"principal"
- For salary: return null if only mentioned vaguely ("competitive salary")
- remote_derived: true only if "remote" is explicitly stated; null if ambiguous
- domain_derived: extract from company URL if present, else null
- countries_derived: always include "United States" if US-based role
```

**Batch Processing with Claude Message Batches API (50% cost reduction)**
```python
# CRITICAL: betas flag must be at top-level call, NOT inside params
batch = client.beta.messages.batches.create(
    requests=[
        {
            "custom_id": f"job_{job_id}",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "system": EXTRACTION_SYSTEM_PROMPT,
                "messages": [{"role": "user", "content": description[:4000]}],
            }
        }
        for job_id, description in job_batch
    ],
    betas=["structured-outputs-2025-11-13"]  # at top level, not in params
)
```

**Chunking Strategy (for 1,000+ jobs)**
```python
def chunk_jobs(jobs: list, chunk_size: int = 15) -> list[list]:
    """Split job list into chunks for rate-limit-safe processing."""
    return [jobs[i:i+chunk_size] for i in range(0, len(jobs), chunk_size)]

# Rate limit: ~60 req/min on Sonnet → 15 jobs/chunk, 4s delay between chunks
```

**Handling Malformed Outputs**
- Add `extraction_confidence` field to schema: `"high"|"medium"|"low"`
- Flag records where both `ai_key_skills` and `ai_experience_level` are null
- Pre-clean HTML before sending: strip tags, remove boilerplate, keep < 4,000 tokens

### Anti-Patterns (Never Do)
1. Combining Batch API + Structured Outputs without `betas` at top-level (silent failure)
2. Treating structured output as guarantee of *correctness* — it only guarantees *format*
3. Not specifying `null` instructions for optional fields — model hallucinates plausible values
4. Passing raw 50KB HTML pages to the model — pre-clean to < 4,000 tokens
5. Using vague seniority labels — always normalize to closed enum

### Quality Criteria
- Schema validation pass rate: 100% (enforced by `output_config.format`)
- Field accuracy on test set of 50 annotated job postings: > 88%
- Null rate for `ai_key_skills` < 15% on well-formatted postings
- Batch job completion rate: > 98% within 24h window
- Rate limit errors: 0 with chunk_size=15 + 4s inter-chunk delay

---

## Domain 3: Data Normalization & Deduplication (ETL)

### Key Frameworks & Patterns

**URL Deduplication via SHA-256**
```python
import hashlib

def url_fingerprint(url: str) -> str:
    """Normalize and hash a URL to a stable 64-char dedup key."""
    normalized = url.strip().lower().rstrip("/")
    # Remove common tracking params
    from urllib.parse import urlparse, urlencode, parse_qs
    parsed = urlparse(normalized)
    clean_params = {k: v for k, v in parse_qs(parsed.query).items()
                    if k not in ('utm_source', 'utm_medium', 'ref', 'source')}
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()
```

**Bronze Schema Mapping**
```python
def map_to_bronze(raw: dict, source: str) -> dict:
    return {
        "source": source,
        "source_job_id": raw.get("id") or raw.get("job_id"),
        "url": raw["url"],
        "url_sha256": url_fingerprint(raw["url"]),
        "raw_payload": raw,  # full raw object preserved
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "scrapy_query_id": None,  # v2: always null
    }
```

**Deduplication by Composite Key**
```python
def deduplicate(records: list[dict]) -> list[dict]:
    """Dedup by source::source_job_id, fallback to source::url_sha256."""
    seen = set()
    unique = []
    for r in records:
        if r.get("source_job_id"):
            key = f"{r['source']}::{r['source_job_id']}"
        else:
            key = f"{r['source']}::{r['url_sha256']}"
        if key not in seen:
            seen.add(key)
            unique.append(r)
    return unique
```

**Medallion Architecture Applied**
- Bronze: `apify_jobs` — raw ingested records, no transformation
- Silver: `jobs_analyzed` — normalized, deduplicated, LLM-enriched
- Gold: `targets` + `target_jobs` — ranked, ready for application

**Incremental Loading via Date Filter**
```python
# Only include jobs posted in last 7 days
cutoff = datetime.now(timezone.utc) - timedelta(days=7)
fresh_jobs = [j for j in scraped if parse_date(j.get("posted_at")) >= cutoff]
```

### Anti-Patterns (Never Do)
1. Deduplicating on raw URL strings — normalize first (case, trailing slashes, tracking params)
2. Full-table reloads on every run — use incremental watermark loads
3. No idempotency — re-running same data should produce zero new inserts
4. Skipping data quality assertions — silent corruption propagates downstream

### Quality Criteria
- Dedup effectiveness: re-running same dataset → 0 new inserts
- URL hash collision rate: effectively 0 with SHA-256
- Normalization coverage: > 95% of records successfully mapped to bronze schema
- Pipeline idempotency: 3 consecutive runs of same batch = identical DB state

---

## Domain 4: Supabase REST API & Batch Operations

### Key Frameworks & Patterns

**Batch Upsert with Chunking (Python SDK)**
```python
from supabase import create_client, ClientOptions

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY,
    options=ClientOptions(postgrest_client_timeout=30)  # override 4s default!
)

def batch_upsert(table: str, records: list[dict], conflict_col: str, chunk_size: int = 500):
    for i in range(0, len(records), chunk_size):
        chunk = records[i:i + chunk_size]
        result = (
            supabase.table(table)
            .upsert(chunk, on_conflict=conflict_col)
            .execute()
        )
        if result.data is None:
            raise RuntimeError(f"Upsert failed on chunk {i//chunk_size}: {result}")
```
- `on_conflict` MUST be a comma-separated string, not a list
- Conflict column(s) MUST have a UNIQUE constraint (else `42P10` error)
- Recommended chunk_size: 500 rows

**RPC Calls (Stored Procedures)**
```python
result = supabase.rpc(
    "ingest_apify_jobs_bronze",
    {"p_items": records_json, "p_scrapy_query_id": None, "p_default_source": None}
).execute()
```

**RPC with Extended Timeout (for `refresh_target_jobs_all`)**
```python
from supabase import create_client, ClientOptions
supabase_long = create_client(
    SUPABASE_URL,
    SUPABASE_KEY,
    options=ClientOptions(postgrest_client_timeout=180)  # 180s for slow RPC
)
result = supabase_long.rpc("refresh_target_jobs_all", {}).execute()
```

**Retry with Exponential Backoff (Python SDK has NO built-in retry)**
```python
def rpc_with_retry(fn_name: str, params: dict, max_retries=3) -> dict:
    for attempt in range(max_retries):
        try:
            return supabase.rpc(fn_name, params).execute()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait = (2 ** attempt) * random.uniform(0.8, 1.2)
            time.sleep(wait)
```

**Error Recovery: Dead-Letter Pattern**
```python
failed_chunks = []
for chunk in chunks:
    try:
        supabase.table("apify_jobs").upsert(chunk, on_conflict="url_sha256").execute()
    except Exception as e:
        failed_chunks.append({"chunk": chunk, "error": str(e)})
# Log failed_chunks, don't abort entire batch
```

### Anti-Patterns (Never Do)
1. `on_conflict` as Python list instead of comma-separated string (silent failure)
2. Using default 4s httpx timeout for large payloads (ReadTimeout on chunks > 50 rows)
3. No chunking — hits PostgREST's 10 MB request body limit
4. Missing UNIQUE constraint on conflict column (upsert inserts duplicates)
5. Not collecting failed chunks (one bad row aborts entire batch)
6. Assuming Python SDK has built-in retries (it does NOT — JS SDK does, Python does not)

### Quality Criteria
- Upsert idempotency: running same batch twice → identical row count
- No ReadTimeout errors at chunk_size=500
- Failed chunk rate < 1% under normal conditions
- All upserts wrapped in try/except with dead-letter logging
- RPC 4 (`refresh_target_jobs_all`) uses 180s timeout

---

## Sources

**Domain 1 — Playwright**
- Scrapfly Blog: Web Scraping with Playwright and Python
- ScraperAPI: Playwright Web Scraping Complete Guide 2025
- Browserless: Scalable Web Scraping with Playwright 2025
- Scrapfly Blog: Playwright Stealth — Bypass Bot Detection in Python
- Bright Data: Avoiding Bot Detection with Playwright Stealth

**Domain 2 — LLM Extraction**
- Anthropic Docs: Structured Outputs (official)
- Anthropic Docs: Batch Processing (official)
- Instructor Docs: Anthropic Integration
- Towards Data Science: Anthropic Structured Output Capabilities
- GitHub Issue #1118: Batch + Structured Outputs betas flag bug

**Domain 3 — ETL Normalization**
- Airbyte: Best Way to Handle Data Deduplication in ETL
- Mage AI: Ultimate Guide to ETL/ELT Pipelines in Python
- Towards Data Science: ETL Pipelines Best Practices
- Talent500: Data Deduplication Strategies

**Domain 4 — Supabase**
- Supabase Docs: Python Upsert (official)
- Supabase Discussions #11349: Best Practices for Large Row Inserts
- Supabase Docs: Timeouts (official)
- Supabase Discussions #13977: Read operation timed out
