"""
Sandro Scout — Hunter Squad Web Scraper (CANONICAL TEMPLATE)

This is the canonical template used by Sandro Scout. Each pipeline run COPIES
this file to output/{run_id}/v1/scraper.py and patches the run-specific
constants (BASE_DIR, RUN_ID, CUTOFF_DATE_STR) before executing.

Coverage:
- 10 site-specific extractors (remoteok, weworkremotely, ycombinator,
  remotive, toptal, techstars_jobs, startup_jobs, crunchbase_jobs, aijobs,
  wellfound)
- 7 site-specific selectors via SITE_SPECIFIC_SELECTORS dict (builtin,
  braintrust, infosec_jobs, getgreatcareers, plus 3 disabled-recommend)
- Generic best-effort scraper for any other generic_listing/spa site
- Wellfound uses launch_persistent_context with the saved profile

Tuning (post-run 2026-05-06 corrections):
- SEMAPHORE = 8 (was 5) — more parallelism
- PER_SITE_TIMEOUT_SEC = 300 (was 180) — 5min hard cap per site
- GENERIC_NAV_TIMEOUT_MS = 45000 (was 25000) — slower sites
- generic scraper now requires inner a[href*='/job'] to accept a card

Failure modes are logged with detailed error_type and never abort the pipeline.
"""

import asyncio
import io
import json
import random
import re
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Force UTF-8 stdout/stderr to avoid UnicodeEncodeError on Windows cp1252
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True)

from playwright.async_api import async_playwright, TimeoutError as PWTimeoutError, Error as PWError
from playwright_stealth import Stealth

# ─── Config ──────────────────────────────────────────────────────────────────
BASE_DIR = Path("C:/Users/Karime/OneDrive/Documentos/Squad/.claude/worktrees/festive-babbage-adaff2/squads/hunter-squad/output/2026-05-06-090110/v1")
SITES_CONFIG_PATH = BASE_DIR / "sites-config.json"
OUTPUT_PATH = BASE_DIR / "scraped-jobs.json"
CUTOFF_DATE_STR = "2026-04-29T00:00:00Z"
RUN_ID = "2026-05-06-090110"

WELLFOUND_PROFILE_DIR = Path("C:/Users/Karime/OneDrive/Documentos/Squad/_opensquad/_browser_profile/wellfound")

CUTOFF_DATE = datetime.fromisoformat(CUTOFF_DATE_STR.replace("Z", "+00:00"))
RETRYABLE_ERRORS = (PWTimeoutError, PWError)
SEMAPHORE = asyncio.Semaphore(8)  # was 5 — bumped after run 2026-05-06 (15 timeouts in mass)
PER_SITE_TIMEOUT_SEC = 300  # was 180 — bumped to 5min after run 2026-05-06 (tier 4-5 timeouts)
GENERIC_NAV_TIMEOUT_MS = 45000  # was 25000 — bumped after datayoshi/builtin slow loads

stealth_instance = Stealth()

# Sites that have a dedicated extractor below
IMPLEMENTED_SITES = {
    "remoteok",
    "weworkremotely",
    "ycombinator",
    "remotive",
    "toptal",
    "techstars_jobs",
    "startup_jobs",
    "crunchbase_jobs",
    "aijobs",
    "wellfound",
}


# ─── Helpers ─────────────────────────────────────────────────────────────────
def strip_html(text):
    clean = re.sub(r"<[^>]+>", "", text or "")
    clean = clean.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&nbsp;", " ")
    return clean.strip()


def parse_date(date_str):
    if not date_str:
        return None
    date_str = str(date_str).strip()
    try:
        normalized = date_str.replace("Z", "+00:00")
        dt = datetime.fromisoformat(normalized)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except (ValueError, AttributeError):
        pass
    for fmt in [
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S+00:00",
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%d",
        "%B %d, %Y",
        "%b %d, %Y",
        "%d %B %Y",
        "%d %b %Y",
    ]:
        try:
            dt = datetime.strptime(date_str, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            continue
    relative = re.match(r"(\d+)\s+(hour|day|week|month)s?\s+ago", date_str, re.IGNORECASE)
    if relative:
        n = int(relative.group(1))
        unit = relative.group(2).lower()
        now = datetime.now(timezone.utc)
        if unit == "hour":
            return now - timedelta(hours=n)
        if unit == "day":
            return now - timedelta(days=n)
        if unit == "week":
            return now - timedelta(weeks=n)
        if unit == "month":
            return now - timedelta(days=n * 30)
    now = datetime.now(timezone.utc)
    if date_str.lower() in ("today", "just now", "new"):
        return now
    if date_str.lower() == "yesterday":
        return now - timedelta(days=1)
    return None


def title_matches(title, job_titles):
    title_lower = (title or "").lower()
    for jt in job_titles:
        if jt.lower() in title_lower:
            return True
    return False


def classify_error(exc, page_content_sample=""):
    """Best-effort classification of the failure for the per_site_stats.errors field."""
    if exc is None:
        return None
    name = type(exc).__name__
    msg = str(exc) or ""
    sample = (page_content_sample or "").lower()

    if "Timeout" in name or "timeout" in msg.lower():
        return f"TimeoutError: {msg[:200]}"
    if "403" in msg or "Forbidden" in msg:
        return f"HTTP 403 Forbidden: {msg[:200]}"
    if "404" in msg:
        return f"HTTP 404 Not Found: {msg[:200]}"
    if "ERR_NAME_NOT_RESOLVED" in msg:
        return f"DNS resolution failed: {msg[:200]}"
    if "ERR_CERT" in msg or "certificate" in msg.lower():
        return f"TLS/cert error: {msg[:200]}"
    if "ERR_CONNECTION" in msg or "ERR_ABORTED" in msg:
        return f"Connection error: {msg[:200]}"
    if any(kw in sample for kw in ["cloudflare", "challenge-platform", "cf-chl-"]):
        return "anti_bot: Cloudflare challenge detected"
    if any(kw in sample for kw in ["captcha", "g-recaptcha", "hcaptcha", "press and hold to confirm"]):
        return "anti_bot: CAPTCHA detected"
    if "access denied" in sample or "forbidden" in sample:
        return "anti_bot: access denied page"
    return f"{name}: {msg[:200]}"


def build_error_result(site, error, attempts=1, duration_ms=0, error_str=None):
    return {
        "site_name": site["name"],
        "jobs": [],
        "error": error_str or classify_error(error),
        "pages_scraped": 0,
        "stop_reason": "error",
        "xhr_intercepted": False,
        "duration_ms": duration_ms,
        "attempts": attempts,
    }


# ─── Site-specific extractors (carried over from previous run) ───────────────
async def safe_text(el, sel):
    try:
        sub = await el.query_selector(sel)
        if sub:
            return (await sub.inner_text()).strip()
    except Exception:
        pass
    return ""


async def safe_attr(el, sel, attr):
    try:
        sub = await el.query_selector(sel) if sel else el
        if sub:
            return (await sub.get_attribute(attr) or "").strip()
    except Exception:
        pass
    return ""


async def extract_remoteok(page):
    jobs = []
    try:
        rows = await page.query_selector_all("tr.job")
        for row in rows:
            try:
                title = await safe_text(row, "h2[itemprop='title']")
                if not title:
                    title = await safe_text(row, ".position h2")
                company = await safe_text(row, "h3[itemprop='name']")
                url_el = await row.query_selector("a.preventLink[href]")
                url = ""
                if url_el:
                    href = await url_el.get_attribute("href") or ""
                    url = "https://remoteok.com" + href if href.startswith("/") else href
                location = await safe_text(row, ".location")
                date_el = await row.query_selector("time[datetime]")
                posted_at = ""
                if date_el:
                    posted_at = await date_el.get_attribute("datetime") or ""
                desc = await safe_text(row, ".description")
                if title and company:
                    jobs.append({
                        "title": strip_html(title),
                        "company": strip_html(company),
                        "url": url,
                        "description": strip_html(desc),
                        "location": strip_html(location) or "Remote",
                        "posted_at": posted_at,
                    })
            except Exception:
                continue
    except Exception as e:
        print(f"[extract_remoteok] Error: {e}")
    return jobs


async def extract_weworkremotely(page):
    jobs = []
    try:
        link_wrappers = await page.query_selector_all("a.listing-link--unlocked, a.listing-link--locked")
        if not link_wrappers:
            link_wrappers = await page.query_selector_all("ul.jobs li a")

        for wrapper in link_wrappers:
            try:
                href = await wrapper.get_attribute("href") or ""
                url = "https://weworkremotely.com" + href if href.startswith("/") else href
                item = await wrapper.query_selector(".new-listing")
                if not item:
                    item = wrapper

                title = await safe_text(item, ".new-listing__header__title, h2, h3, [class*='title']")
                company = await safe_text(item, ".new-listing__company-name, span.company, [class*='company-name']")
                location = await safe_text(item, ".new-listing__company-headquarters, .region, [class*='headquarters'], [class*='location']")

                date_el = await item.query_selector(".new-listing__header__icons__date, time[datetime]")
                posted_at = ""
                if date_el:
                    dt_attr = await date_el.get_attribute("datetime") or ""
                    if dt_attr:
                        posted_at = dt_attr
                    else:
                        date_text = (await date_el.inner_text()).strip()
                        m = re.match(r"(\d+)([dhwm])", date_text)
                        if m:
                            n = int(m.group(1))
                            unit = m.group(2)
                            now = datetime.now(timezone.utc)
                            delta = {"d": timedelta(days=n), "h": timedelta(hours=n), "w": timedelta(weeks=n), "m": timedelta(days=n * 30)}.get(unit, timedelta(days=n))
                            posted_at = (now - delta).isoformat()

                if title and company and url:
                    jobs.append({
                        "title": strip_html(title),
                        "company": strip_html(company),
                        "url": url,
                        "description": "",
                        "location": strip_html(location) or "Remote",
                        "posted_at": posted_at,
                    })
            except Exception:
                continue
    except Exception as e:
        print(f"[extract_weworkremotely] Error: {e}")
    return jobs


async def extract_ycombinator(page):
    jobs = []
    try:
        cards = await page.query_selector_all(".job-card, [class*='JobCard'], [class*='job_card']")
        if not cards:
            cards = await page.query_selector_all("li.company-listing, .company")
        for card in cards:
            try:
                title = await safe_text(card, ".title, .job-title, h3, h4")
                company = await safe_text(card, ".company-name, .company, h2")
                link_el = await card.query_selector("a[href]")
                url = ""
                if link_el:
                    href = await link_el.get_attribute("href") or ""
                    url = "https://www.ycombinator.com" + href if href.startswith("/") else href
                location = await safe_text(card, ".location, .region")
                posted_at = ""
                date_el = await card.query_selector("time, [class*='date']")
                if date_el:
                    posted_at = await date_el.get_attribute("datetime") or await date_el.inner_text()
                if title:
                    jobs.append({
                        "title": strip_html(title),
                        "company": strip_html(company),
                        "url": url,
                        "description": "",
                        "location": strip_html(location) or "Remote",
                        "posted_at": posted_at,
                    })
            except Exception:
                continue
    except Exception as e:
        print(f"[extract_ycombinator] Error: {e}")
    return jobs


async def extract_remotive(page):
    jobs = []
    try:
        cards = await page.query_selector_all("li.job, .job-list li, [class*='job-card']")
        if not cards:
            cards = await page.query_selector_all("ul li")
        for card in cards:
            try:
                title = await safe_text(card, "h2, h3, .job-title, [class*='title']")
                company = await safe_text(card, ".company, [class*='company']")
                link_el = await card.query_selector("a[href]")
                url = ""
                if link_el:
                    href = await link_el.get_attribute("href") or ""
                    url = "https://remotive.com" + href if href.startswith("/") else href
                location = await safe_text(card, ".location, [class*='location']")
                date_el = await card.query_selector("time, [class*='date']")
                posted_at = ""
                if date_el:
                    posted_at = await date_el.get_attribute("datetime") or await date_el.inner_text()
                if title:
                    jobs.append({
                        "title": strip_html(title),
                        "company": strip_html(company),
                        "url": url,
                        "description": "",
                        "location": strip_html(location) or "Remote",
                        "posted_at": posted_at,
                    })
            except Exception:
                continue
    except Exception as e:
        print(f"[extract_remotive] Error: {e}")
    return jobs


async def extract_techstars(page):
    jobs = []
    try:
        cards = await page.query_selector_all("[class*='job'], [data-job-id], article")
        for card in cards:
            try:
                title = await safe_text(card, "h2, h3, [class*='title']")
                company = await safe_text(card, "[class*='company'], [class*='org']")
                link_el = await card.query_selector("a[href]")
                url = ""
                if link_el:
                    href = await link_el.get_attribute("href") or ""
                    url = "https://jobs.techstars.com" + href if href.startswith("/") else href
                location = await safe_text(card, "[class*='location']")
                date_el = await card.query_selector("time")
                posted_at = ""
                if date_el:
                    posted_at = await date_el.get_attribute("datetime") or await date_el.inner_text()
                if title:
                    jobs.append({
                        "title": strip_html(title),
                        "company": strip_html(company),
                        "url": url,
                        "description": "",
                        "location": strip_html(location) or "Remote",
                        "posted_at": posted_at,
                    })
            except Exception:
                continue
    except Exception as e:
        print(f"[extract_techstars] Error: {e}")
    return jobs


async def extract_startup_jobs(page):
    jobs = []
    try:
        cards = await page.query_selector_all(".job-listing, .listing, article, [class*='job']")
        for card in cards:
            try:
                title = await safe_text(card, "h2, h3, [class*='title'], .position")
                company = await safe_text(card, "[class*='company']")
                link_el = await card.query_selector("a[href]")
                url = ""
                if link_el:
                    href = await link_el.get_attribute("href") or ""
                    url = "https://startup.jobs" + href if href.startswith("/") else href
                location = await safe_text(card, "[class*='location']")
                date_el = await card.query_selector("time, [class*='date']")
                posted_at = ""
                if date_el:
                    posted_at = await date_el.get_attribute("datetime") or await date_el.inner_text()
                if title:
                    jobs.append({
                        "title": strip_html(title),
                        "company": strip_html(company),
                        "url": url,
                        "description": "",
                        "location": strip_html(location) or "Remote",
                        "posted_at": posted_at,
                    })
            except Exception:
                continue
    except Exception as e:
        print(f"[extract_startup_jobs] Error: {e}")
    return jobs


async def extract_crunchbase(page):
    jobs = []
    try:
        cards = await page.query_selector_all("[class*='job'], [data-job], article, li.listing")
        for card in cards:
            try:
                title = await safe_text(card, "h2, h3, [class*='title']")
                company = await safe_text(card, "[class*='company']")
                link_el = await card.query_selector("a[href]")
                url = ""
                if link_el:
                    href = await link_el.get_attribute("href") or ""
                    url = "https://jobs.crunchbase.com" + href if href.startswith("/") else href
                location = await safe_text(card, "[class*='location']")
                date_el = await card.query_selector("time")
                posted_at = ""
                if date_el:
                    posted_at = await date_el.get_attribute("datetime") or await date_el.inner_text()
                if title:
                    jobs.append({
                        "title": strip_html(title),
                        "company": strip_html(company),
                        "url": url,
                        "description": "",
                        "location": strip_html(location) or "Remote",
                        "posted_at": posted_at,
                    })
            except Exception:
                continue
    except Exception as e:
        print(f"[extract_crunchbase] Error: {e}")
    return jobs


async def extract_aijobs(page):
    jobs = []
    try:
        cards = await page.query_selector_all(".job-listings-item")
        if not cards:
            cards = await page.query_selector_all("[class*='job-listings']")
        for card in cards:
            try:
                title = await safe_text(card, "h3, h2, .job-tile-title, [class*='title']")
                company_links = await card.query_selector_all("a.job-info-link-item")
                company = ""
                if company_links:
                    company = (await company_links[0].inner_text()).strip()
                location = ""
                if len(company_links) > 1:
                    location = (await company_links[1].inner_text()).strip()
                link_el = await card.query_selector("a.job-details-link, a[href*='/jobs/']")
                url = ""
                if link_el:
                    href = await link_el.get_attribute("href") or ""
                    url = "https://aijobs.com" + href if href.startswith("/") else href
                date_text = await safe_text(card, ".job-meta-info, [class*='date'], [class*='age']")
                posted_at = ""
                if date_text:
                    m = re.match(r"(\d+)\s*(h|d|w|m)", date_text.lower().strip())
                    if m:
                        n = int(m.group(1))
                        unit = m.group(2)
                        now = datetime.now(timezone.utc)
                        delta = {"h": timedelta(hours=n), "d": timedelta(days=n), "w": timedelta(weeks=n), "m": timedelta(days=n * 30)}.get(unit, timedelta(days=n))
                        posted_at = (now - delta).isoformat()
                    else:
                        posted_at = date_text
                if title and company:
                    jobs.append({
                        "title": strip_html(title),
                        "company": strip_html(company),
                        "url": url,
                        "description": "",
                        "location": strip_html(location) or "Remote",
                        "posted_at": posted_at,
                    })
            except Exception:
                continue
    except Exception as e:
        print(f"[extract_aijobs] Error: {e}")
    return jobs


async def extract_toptal(page):
    print("[extract_toptal] Toptal blog page, no job cards expected")
    return []


async def extract_wellfound(page):
    """Wellfound (AngelList) listings — uses logged-in profile.

    Run 2026-05-06: list selector timeout. Added wider fallback selectors and
    explicit wait for list container before extracting cards.
    """
    jobs = []
    try:
        # Wait for any of these wrapper selectors before extracting (3s soft wait)
        try:
            await page.wait_for_selector(
                "div[class*='JobSearchResults'], div[class*='styles_component'], main, [data-test='JobSearchResult']",
                timeout=8000,
                state="attached",
            )
        except PWTimeoutError:
            pass  # continue with whatever rendered
        # Wellfound's job page renders as React; cards are typically <a> wrappers
        # Added wider selector list for run 2026-05-06 fix
        cards = await page.query_selector_all(
            "[data-test='JobSearchResult'], [class*='JobSearchResult'], "
            "div[class*='styles_jobListingCard'], div[class*='ListingCard'], "
            "a[href*='/jobs/']"
        )
        seen = set()
        for card in cards:
            try:
                link_el = card if (await card.evaluate("el => el.tagName")) == "A" else await card.query_selector("a[href*='/jobs/']")
                href = ""
                if link_el:
                    href = await link_el.get_attribute("href") or ""
                if not href or "/jobs/" not in href:
                    continue
                url = "https://wellfound.com" + href if href.startswith("/") else href
                if url in seen:
                    continue
                seen.add(url)

                title = await safe_text(card, "h2, h3, [class*='title'], [data-test='JobTitle']")
                company = await safe_text(card, "[data-test='StartupName'], [class*='startup'], [class*='company']")
                location = await safe_text(card, "[data-test='LocationsList'], [class*='location']")
                posted_at = ""
                date_el = await card.query_selector("time, [class*='date'], [class*='Date']")
                if date_el:
                    posted_at = await date_el.get_attribute("datetime") or await date_el.inner_text()
                if title:
                    jobs.append({
                        "title": strip_html(title),
                        "company": strip_html(company),
                        "url": url,
                        "description": "",
                        "location": strip_html(location) or "Remote",
                        "posted_at": posted_at,
                    })
            except Exception:
                continue
    except Exception as e:
        print(f"[extract_wellfound] Error: {e}")
    return jobs


# ─── Remotive API (public, no auth) ─────────────────────────────────────────
async def scrape_remotive_api(site, job_titles):
    import urllib.request as urlreq
    start = time.time()
    jobs = []
    pages_scraped = 0
    stop_reason = "api_complete"

    try:
        limit = 100
        offset = 0
        max_pages = site.get("max_pages", 10)
        for page_num in range(max_pages):
            api_url = f"https://remotive.com/api/remote-jobs?category=software-dev&limit={limit}&offset={offset}"
            req = urlreq.Request(api_url, headers={"User-Agent": "Mozilla/5.0"})
            resp = urlreq.urlopen(req, timeout=15)
            data = json.loads(resp.read().decode("utf-8"))
            page_jobs = data.get("jobs", [])
            pages_scraped += 1

            if not page_jobs:
                stop_reason = "no_more_jobs"
                break

            oldest_dt = None
            for j in page_jobs:
                posted_str = j.get("publication_date", "")
                dt = parse_date(posted_str)
                if dt:
                    if oldest_dt is None or dt < oldest_dt:
                        oldest_dt = dt
                jobs.append({
                    "title": strip_html(j.get("title", "")),
                    "company": strip_html(j.get("company_name", "")),
                    "url": j.get("url", ""),
                    "description": strip_html(j.get("description", ""))[:500],
                    "location": strip_html(j.get("candidate_required_location", "Remote")) or "Remote",
                    "posted_at": posted_str,
                    "source": "remotive",
                    "_source_site": "remotive",
                })

            if oldest_dt and oldest_dt < CUTOFF_DATE:
                stop_reason = "date_cutoff"
                break

            offset += limit
            await asyncio.sleep(site.get("throttle_ms", 1500) / 1000)

    except Exception as e:
        print(f"[scrape_remotive_api] Error: {e}")
        return build_error_result(site, e, duration_ms=int((time.time() - start) * 1000))

    filtered_date = []
    for j in jobs:
        dt = parse_date(j.get("posted_at"))
        if dt is None or dt >= CUTOFF_DATE:
            filtered_date.append(j)

    filtered_title = [j for j in filtered_date if title_matches(j.get("title", ""), job_titles)]

    duration_ms = int((time.time() - start) * 1000)
    print(f"[remotive-api] {len(jobs)} raw -> {len(filtered_date)} after date -> {len(filtered_title)} after title | stop={stop_reason} | {duration_ms}ms")

    return {
        "site_name": "remotive",
        "jobs": filtered_title,
        "error": None,
        "pages_scraped": pages_scraped,
        "stop_reason": stop_reason,
        "xhr_intercepted": True,
        "duration_ms": duration_ms,
    }


# ─── Wellfound (persistent context) ──────────────────────────────────────────
async def scrape_wellfound(site, job_titles):
    start = time.time()
    jobs = []
    pages_scraped = 0
    stop_reason = "max_pages"
    error_msg = None
    page_sample = ""

    if not WELLFOUND_PROFILE_DIR.exists():
        return build_error_result(
            site,
            None,
            duration_ms=int((time.time() - start) * 1000),
            error_str="profile_missing: wellfound profile not found at " + str(WELLFOUND_PROFILE_DIR),
        )

    async with SEMAPHORE:
        try:
            async with async_playwright() as pw:
                # 2026-05-11 fix: wellfound uses DataDome anti-bot which fingerprinted
                # the default headless Chromium ("Access is temporarily restricted"
                # CAPTCHA page). Three changes vs original:
                #   (1) explicit Chrome UA — Playwright default includes "HeadlessChrome"
                #   (2) locale + extra http headers — look like a US visitor
                #   (3) stealth applied AFTER context creation (was missing here while
                #       other scrapers apply it; ensures navigator.webdriver etc are masked)
                context = await pw.chromium.launch_persistent_context(
                    user_data_dir=str(WELLFOUND_PROFILE_DIR),
                    headless=True,
                    viewport={"width": 1280, "height": 900},
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    locale="en-US",
                    timezone_id="America/New_York",
                    extra_http_headers={
                        "Accept-Language": "en-US,en;q=0.9",
                        "Sec-Ch-Ua": '"Chromium";v="120", "Not(A:Brand";v="24", "Google Chrome";v="120"',
                        "Sec-Ch-Ua-Mobile": "?0",
                        "Sec-Ch-Ua-Platform": '"Windows"',
                    },
                    args=[
                        "--disable-blink-features=AutomationControlled",
                        "--disable-features=AutomationControlled",
                    ],
                )
                try:
                    await stealth_instance.apply_stealth_async(context)
                except Exception as _e:
                    print(f"[wellfound] stealth apply warning: {_e}")
                try:
                    page = context.pages[0] if context.pages else await context.new_page()
                    await page.goto(site["base_url"], wait_until="domcontentloaded", timeout=GENERIC_NAV_TIMEOUT_MS)
                    pages_scraped = 1
                    try:
                        page_sample = (await page.content())[:4000]
                    except Exception:
                        page_sample = ""

                    # DataDome detection — fail fast with clear error instead of
                    # waiting 10s for a selector that will never appear
                    if "captcha-delivery.com" in page_sample or "Access is temporarily restricted" in page_sample:
                        error_msg = "anti_bot: DataDome CAPTCHA — headless fingerprint detected (stealth insufficient)"
                        return build_error_result(site, None, duration_ms=int((time.time() - start) * 1000), error_str=error_msg)

                    # Wait briefly for SPA to render
                    try:
                        await page.wait_for_selector("a[href*='/jobs/'], [data-test='JobSearchResult']", timeout=10000)
                    except PWTimeoutError:
                        error_msg = classify_error(PWTimeoutError("wellfound list selector timeout"), page_sample)
                        return build_error_result(site, None, duration_ms=int((time.time() - start) * 1000), error_str=error_msg)

                    # Light scroll a few times to load more
                    prev_count = 0
                    for _ in range(3):
                        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                        await page.wait_for_timeout(2000)
                        cur = await page.locator("a[href*='/jobs/']").count()
                        if cur == prev_count:
                            break
                        prev_count = cur

                    raw_jobs = await extract_wellfound(page)
                    for j in raw_jobs:
                        j["source"] = "wellfound"
                        j["_source_site"] = "wellfound"
                    jobs = raw_jobs
                    stop_reason = "scrolled"
                finally:
                    try:
                        await context.close()
                    except Exception:
                        pass
        except Exception as e:
            print(f"[wellfound] Error: {e}")
            return build_error_result(site, e, duration_ms=int((time.time() - start) * 1000))

    filtered_date = [j for j in jobs if (parse_date(j.get("posted_at")) is None or parse_date(j.get("posted_at")) >= CUTOFF_DATE)]
    filtered_title = [j for j in filtered_date if title_matches(j.get("title", ""), job_titles)]

    duration_ms = int((time.time() - start) * 1000)
    print(f"[wellfound] {len(jobs)} raw -> {len(filtered_date)} after date -> {len(filtered_title)} after title | {duration_ms}ms")
    return {
        "site_name": "wellfound",
        "jobs": filtered_title,
        "error": error_msg,
        "pages_scraped": pages_scraped,
        "stop_reason": stop_reason,
        "xhr_intercepted": False,
        "duration_ms": duration_ms,
    }


# ─── Specific scraper for the 9 implemented non-wellfound sites ─────────────
async def scrape_implemented_site(site, job_titles):
    if site["name"] == "remotive":
        return await scrape_remotive_api(site, job_titles)
    if site["name"] == "wellfound":
        return await scrape_wellfound(site, job_titles)

    start = time.time()
    intercepted_data = []
    xhr_intercepted = False
    jobs = []
    pages_scraped = 0
    stop_reason = "max_pages"
    error_msg = None
    page_sample = ""

    async with SEMAPHORE:
        try:
            async with async_playwright() as pw:
                browser = await pw.chromium.launch(headless=True)
                context = await browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    viewport={"width": 1280, "height": 800},
                )
                await stealth_instance.apply_stealth_async(context)
                page = await context.new_page()

                async def handle_response(response):
                    nonlocal xhr_intercepted
                    ct = response.headers.get("content-type", "")
                    if "json" in ct and any(kw in response.url for kw in ["job", "position", "listing", "vacancy", "search"]):
                        try:
                            body = await response.json()
                            intercepted_data.append(body)
                            xhr_intercepted = True
                        except Exception:
                            pass

                page.on("response", handle_response)

                try:
                    current_url = site["base_url"]
                    max_pages = site.get("max_pages", 5)
                    throttle_ms = site.get("throttle_ms", 1500)

                    wait_until = "networkidle"
                    if site["name"] in ("weworkremotely", "toptal", "techstars_jobs"):
                        wait_until = "domcontentloaded"

                    for page_num in range(max_pages):
                        try:
                            await page.goto(current_url, wait_until=wait_until, timeout=GENERIC_NAV_TIMEOUT_MS)
                        except Exception as e:
                            print(f"[{site['name']}] Navigation error page {page_num + 1}: {e}")
                            try:
                                page_sample = (await page.content())[:4000]
                            except Exception:
                                pass
                            error_msg = classify_error(e, page_sample)
                            stop_reason = "nav_error"
                            break

                        pages_scraped += 1

                        try:
                            page_sample = (await page.content())[:4000]
                        except Exception:
                            pass

                        page_jobs = await dispatch_extractor(page, site)
                        print(f"[{site['name']}] page {page_num + 1}: {len(page_jobs)} raw jobs")

                        if not page_jobs:
                            stop_reason = "no_jobs_found"
                            break

                        oldest_dt = None
                        for j in page_jobs:
                            dt = parse_date(j.get("posted_at"))
                            if dt and (oldest_dt is None or dt < oldest_dt):
                                oldest_dt = dt

                        jobs.extend(page_jobs)

                        if oldest_dt and oldest_dt < CUTOFF_DATE:
                            stop_reason = "date_cutoff"
                            break

                        next_sel = "a[rel='next'], button.next-page, .pagination-next, a.next, [aria-label='Next'], .next-page"
                        next_btn = await page.query_selector(next_sel)
                        if not next_btn:
                            stop_reason = "no_next_page"
                            break

                        try:
                            await next_btn.click()
                            await page.wait_for_load_state("networkidle", timeout=15000)
                            await page.wait_for_timeout(throttle_ms)
                            current_url = page.url
                        except Exception:
                            stop_reason = "pagination_failed"
                            break

                finally:
                    try:
                        await page.close()
                    except Exception:
                        pass
                    try:
                        await context.close()
                    except Exception:
                        pass
                    try:
                        await browser.close()
                    except Exception:
                        pass
        except Exception as e:
            return build_error_result(site, e, duration_ms=int((time.time() - start) * 1000))

    filtered_date = [j for j in jobs if (parse_date(j.get("posted_at")) is None or parse_date(j.get("posted_at")) >= CUTOFF_DATE)]
    filtered_title = [j for j in filtered_date if title_matches(j.get("title", ""), job_titles)]

    duration_ms = int((time.time() - start) * 1000)
    print(f"[{site['name']}] {len(jobs)} raw -> {len(filtered_date)} after date -> {len(filtered_title)} after title | stop={stop_reason} | {duration_ms}ms")

    return {
        "site_name": site["name"],
        "jobs": filtered_title,
        "error": error_msg,
        "pages_scraped": pages_scraped,
        "stop_reason": stop_reason,
        "xhr_intercepted": xhr_intercepted,
        "duration_ms": duration_ms,
    }


async def dispatch_extractor(page, site):
    site_name = site["name"]
    if site_name == "remoteok":
        jobs = await extract_remoteok(page)
    elif site_name == "weworkremotely":
        jobs = await extract_weworkremotely(page)
    elif site_name == "ycombinator":
        jobs = await extract_ycombinator(page)
    elif site_name == "remotive":
        jobs = await extract_remotive(page)
    elif site_name == "techstars_jobs":
        jobs = await extract_techstars(page)
    elif site_name == "startup_jobs":
        jobs = await extract_startup_jobs(page)
    elif site_name == "crunchbase_jobs":
        jobs = await extract_crunchbase(page)
    elif site_name == "aijobs":
        jobs = await extract_aijobs(page)
    elif site_name == "toptal":
        jobs = await extract_toptal(page)
    else:
        jobs = []

    for j in jobs:
        j["source"] = site_name
        j["_source_site"] = site_name
    return jobs


# ─── Generic best-effort scraper for the 34 unimplemented sites ──────────────
GENERIC_CARD_SELECTORS = [
    "[data-test*='job']",
    "[data-testid*='job']",
    "[data-job-id]",
    "[data-job]",
    "article.job",
    "li.job",
    "li.job-listing",
    ".job-card",
    "[class*='job-card']",
    "[class*='JobCard']",
    "[class*='job-listing']",
    "[class*='JobListing']",
    "a[href*='/job/']",
    "a[href*='/jobs/']",
    "article",
]


# ─── Run 2026-05-06 fix: site-specific selectors for sites that previously hit
# ─── selector_not_found in the generic loop. Investigated via Playwright DOM
# ─── probe (see _investigate_selectors.py and _selector_probe*.json artifacts).
SITE_SPECIFIC_SELECTORS = {
    # builtin.com/jobs/remote — visible Bootstrap card wrapper. The previously
    # detected `[data-job-id]` actually points to a hidden details panel; use
    # `.job-bounded-responsive` (count ~20 per page) which wraps the tile. The
    # company link (`a[href*="/company/"]`) is image-only with empty inner text;
    # derive the company name from the href slug.
    "builtin": {
        "card": ".job-bounded-responsive",
        "title": "a[data-id='job-card-title'], h2 a, .left-side-tile-item-3 a",
        "company": "a[href*='/company/']",
        "company_from_link_slug": True,
        "url": "a[data-id='job-card-title']",
        "location": "[class*='location'], .right-side-tile [class*='text-gray']",
        "posted_at": "time, [class*='date'], [class*='posted']",
        "url_origin": "https://builtin.com",
    },

    # braintrust — single-page-app, jobs are <a href="/jobs/{id}"> with title in
    # an inner div. Use the specific Mui title-link class to avoid matching the
    # "View job" button (which duplicates the same href). The list view does NOT
    # expose the underlying client company name (Braintrust is a marketplace);
    # synthesize "Braintrust" so jobs survive the required-fields filter.
    "braintrust": {
        "card": "a[href*='/jobs/'][class*='styles_title']",
        "title": "div.capitalize-first-letter, div",
        "company": "",
        "company_fallback": "Braintrust",
        "url": "self",  # the card itself IS the link
        "location": "",
        "posted_at": "",
        "url_origin": "https://app.usebraintrust.com",
    },

    # infosec_jobs / isecjobs.com — each job is a <li> with a stretched-link
    # anchor pointing at /job/<slug>-<id>/. Company name is not exposed at the
    # list level (only title/skills/location/age); use a sentinel fallback.
    "infosec_jobs": {
        "card": "li:has(a.stretched-link[href*='/job/'])",
        "title": "a.stretched-link",
        "company": "",
        "company_fallback": "infosec-jobs.com",
        "url": "a.stretched-link",
        "location": ".text-end div, [class*='location']",
        "posted_at": ".text-muted, [class*='ago']",
        "url_origin": "https://isecjobs.com",
    },

    # getgreatcareers — Angular custom element <gc-jobs-tile>; tiles have NO
    # extractable URL (clicks are handled by Angular router with no href). We
    # capture title/company/location and synthesize a URL using the search-page
    # URL plus an index anchor; downstream apply links won't work.
    # Also requires geolocation context (US) to return any results — homepage
    # auto-detects user location and shows zero matches outside the US.
    "getgreatcareers": {
        "card": "gc-jobs-tile",
        "title": ".title",
        "company": ".campaign",
        "url": "self",  # synthesized
        "location": ".address",
        "posted_at": "",
        "url_origin": "https://www.getgreatcareers.com",
        "requires_us_geolocation": True,
        "no_extractable_url": True,
    },

    # The following three sites are effectively dead/unreachable as of run
    # 2026-05-06; flagged so the scraper short-circuits with a clearer error.
    "remotetechjobs": {
        "investigation_failed": (
            "site is a parked WordPress template (Avenir/123 Fifth Avenue placeholder); "
            "all /jobs* paths return 404; no real listings present"
        ),
        "recommend_disable": True,
    },
    "hired": {
        "investigation_failed": (
            "domain redirects to lhh.com/en-us/about-us/our-story; Hired.com appears "
            "discontinued / merged into LHH and no longer hosts a public jobs board"
        ),
        "recommend_disable": True,
    },
    "mljobs": {
        "investigation_failed": (
            "machinelearningjobs.com is parked: redirects to "
            "searchhounds.com 'Access Denied' page; domain not operational"
        ),
        "recommend_disable": True,
    },
}


def resolve_site_spec(site):
    """Adaptive selector resolution (Fase 5.1, 2026-05-11).

    Precedence (highest wins, per-key):
      1. site["config"]["selectors"]  — DB-driven override per site (hot-reloadable, no code deploy)
      2. SITE_SPECIFIC_SELECTORS[name] — hardcoded recipes maintained in this file
      3. {}                            — empty dict, caller handles fallback

    Merge strategy: DB config keys overlay the hardcoded recipe. Lets you fix one
    field (e.g. just the title selector) in the DB without redefining the whole
    recipe. Returns the merged dict; never None — callers check for specific keys
    (e.g. "card" for extraction; "recommend_disable" for skip).
    """
    hardcoded = SITE_SPECIFIC_SELECTORS.get(site["name"], {}) or {}
    db_override = (site.get("config") or {}).get("selectors") or {}
    merged = {**hardcoded, **db_override}
    if merged:
        merged["_source"] = "db_override" if db_override else "hardcoded"
    return merged


async def extract_with_site_specific(page, site):
    """Run 2026-05-06 fix: try the site-specific recipe first, before the generic loop.
    Fase 5.1 (2026-05-11): now reads from DB config.selectors with hardcoded fallback.

    Returns (jobs, used_selector_or_none). Returns ([], None) if no recipe exists or
    the recipe matched no cards (caller falls back to generic).
    """
    spec = resolve_site_spec(site)
    if not spec or "card" not in spec:
        return [], None

    base = spec.get("url_origin") or site["base_url"]
    try:
        cards = await page.query_selector_all(spec["card"])
    except Exception as e:
        print(f"[site-specific][{site['name']}] selector error: {e}")
        return [], None

    if not cards:
        return [], None

    jobs = []
    title_regex = spec.get("title_regex")
    title_regex_compiled = re.compile(title_regex) if title_regex else None
    title_from_url_slug = spec.get("title_from_url_slug", False)
    url_slug_pattern = spec.get("url_slug_pattern", r'/jobs/([^/?#]+)')
    url_slug_pattern_compiled = re.compile(url_slug_pattern) if title_from_url_slug else None

    for card in cards[:200]:
        try:
            # Title — four strategies, in precedence order:
            # (1) title_regex on full card text — for sites where title is buried in
            #     concatenated text (e.g. dice: "Co | | Apply Now | TITLE | | Loc").
            #     Set this in spec via "title_regex". Capture group 1 is the title.
            # (2) title selector — explicit CSS selector
            # (3) title_from_url_slug — extract from URL path slug, e.g. hiretechladies
            #     where the <a> is an empty wrapper but href contains the title slug.
            #     Set "title_from_url_slug": true and optionally "url_slug_pattern"
            #     (default: r'/jobs/([^/?#]+)'). Slug is title-cased with - → space.
            # (4) fallback to card inner_text first line
            title = ""
            if title_regex_compiled:
                try:
                    full_text = (await card.inner_text()) or ""
                    m = title_regex_compiled.search(full_text)
                    if m:
                        title = m.group(1).strip()
                except Exception:
                    pass
            if not title:
                tsel = spec.get("title")
                if tsel:
                    title = (await safe_text(card, tsel)) or ""
            if not title and url_slug_pattern_compiled:
                # Defer to URL extraction after url is known (handled below)
                pass
            if not title:
                # Fall back to card's own text first line
                try:
                    txt = (await card.inner_text()).strip()
                    title = txt.split("\n")[0][:200] if txt else ""
                except Exception:
                    pass

            # Company
            company = ""
            csel = spec.get("company")
            if csel:
                company = (await safe_text(card, csel)) or ""
                # Special: derive company from the link slug when text is empty
                if not company and spec.get("company_from_link_slug"):
                    try:
                        co_link = await card.query_selector(csel)
                        if co_link:
                            href = await co_link.get_attribute("href") or ""
                            m = re.search(r"/company/([^/?#]+)", href)
                            if m:
                                slug = m.group(1).replace("-", " ").replace("_", " ").strip()
                                company = " ".join(w.capitalize() for w in slug.split())
                    except Exception:
                        pass
            if not company and spec.get("company_fallback"):
                company = spec["company_fallback"]

            # URL
            url = ""
            usel = spec.get("url")
            if usel == "self":
                # The card itself is the link
                try:
                    href = await card.get_attribute("href") or ""
                    if href:
                        if href.startswith("http"):
                            url = href
                        elif href.startswith("/"):
                            url = base + href
                        else:
                            url = base + "/" + href
                except Exception:
                    pass
            elif usel:
                try:
                    link_el = await card.query_selector(usel)
                    if link_el:
                        href = await link_el.get_attribute("href") or ""
                        if href:
                            if href.startswith("http"):
                                url = href
                            elif href.startswith("/"):
                                url = base + href
                            else:
                                url = base + "/" + href
                except Exception:
                    pass
            if not url:
                # Generic fallback: any <a href> inside the card
                try:
                    a = await card.query_selector("a[href]")
                    if a:
                        href = await a.get_attribute("href") or ""
                        if href.startswith("http"):
                            url = href
                        elif href.startswith("/"):
                            url = base + href
                except Exception:
                    pass
            if not url and spec.get("no_extractable_url"):
                # synthesize a stable but fake URL so downstream filtering doesn't drop the row
                url = f"{base}#tile-{len(jobs)}"

            # Title strategy (3): extract from URL slug. Runs after URL is known.
            # Use for sites like hiretechladies where the <a> wrapper has no inner text
            # but the href contains the title encoded as a slug.
            if not title and url_slug_pattern_compiled and url:
                m_slug = url_slug_pattern_compiled.search(url)
                if m_slug:
                    slug = m_slug.group(1)
                    # Convert kebab-case slug to title case; preserve common job-modifier words
                    raw_title = slug.replace("-", " ").replace("_", " ").strip()
                    title = " ".join(w.capitalize() if not w.isupper() else w for w in raw_title.split())

            location = ""
            lsel = spec.get("location")
            if lsel:
                location = (await safe_text(card, lsel)) or ""

            posted_at = ""
            psel = spec.get("posted_at")
            if psel:
                try:
                    de = await card.query_selector(psel)
                    if de:
                        posted_at = (await de.get_attribute("datetime")) or (await de.inner_text()) or ""
                except Exception:
                    pass

            if title and url:
                jobs.append({
                    "title": strip_html(title),
                    "company": strip_html(company),
                    "url": url,
                    "description": "",
                    "location": strip_html(location) or "",
                    "posted_at": posted_at,
                    "source": site["name"],
                    "_source_site": site["name"],
                })
        except Exception:
            continue

    return jobs, f"site_specific[{spec.get('_source', 'hardcoded')}]:{spec['card']}"


async def extract_generic_best_effort(page, site):
    """Try a parade of common selectors. Returns (jobs, used_selector_or_none, sample).

    Run 2026-05-06 fix: check SITE_SPECIFIC_SELECTORS FIRST. If the recipe yields
    jobs, return them. Otherwise fall through to the generic loop.

    Run 2026-05-06 fix (earlier): when the matched selector includes UI controls (e.g.
    data-testid="job-search-button"), tighten by requiring an inner <a href="/job">.
    """
    # Try site-specific recipe first
    site_jobs, site_sel = await extract_with_site_specific(page, site)
    if site_jobs:
        return site_jobs, site_sel

    used_selector = None
    cards = []
    for sel in GENERIC_CARD_SELECTORS:
        try:
            found = await page.query_selector_all(sel)
        except Exception:
            found = []
        if found and len(found) >= 3:
            # Filter: keep only elements that contain a job link
            filtered = []
            for el in found:
                try:
                    has_job_link = await el.query_selector("a[href*='/job']")
                    if has_job_link:
                        filtered.append(el)
                except Exception:
                    continue
            if len(filtered) >= 3:
                cards = filtered
                used_selector = sel + " [tightened: has a[href*=/job]]"
                break
            elif len(found) >= 5:  # last resort: keep raw if many matches
                cards = found
                used_selector = sel
                break

    jobs = []
    base = site["base_url"]
    # derive origin (scheme://host)
    origin_match = re.match(r"(https?://[^/]+)", base)
    origin = origin_match.group(1) if origin_match else base

    for card in cards[:200]:  # cap to avoid runaway
        try:
            title = await safe_text(card, "h2, h3, h4, [class*='title'], [class*='Title']")
            if not title:
                # If the card itself is an <a>, use its text as fallback title
                try:
                    text = (await card.inner_text()).strip()
                    title = text.split("\n")[0][:120] if text else ""
                except Exception:
                    title = ""
            company = await safe_text(card, "[class*='company'], [class*='Company'], [class*='employer']")
            link_el = await card.query_selector("a[href]")
            url = ""
            if link_el:
                href = await link_el.get_attribute("href") or ""
                if href.startswith("http"):
                    url = href
                elif href.startswith("/"):
                    url = origin + href
                else:
                    url = origin + "/" + href
            location = await safe_text(card, "[class*='location'], [class*='Location']")
            date_el = await card.query_selector("time, [class*='date'], [class*='Date'], [datetime]")
            posted_at = ""
            if date_el:
                posted_at = await date_el.get_attribute("datetime") or await date_el.inner_text()
            if title and url:
                jobs.append({
                    "title": strip_html(title),
                    "company": strip_html(company),
                    "url": url,
                    "description": "",
                    "location": strip_html(location) or "",
                    "posted_at": posted_at,
                    "source": site["name"],
                    "_source_site": site["name"],
                })
        except Exception:
            continue

    return jobs, used_selector


async def scrape_generic_unknown_site(site, job_titles):
    start = time.time()
    jobs = []
    pages_scraped = 0
    error_msg = None
    stop_reason = "error"
    page_sample = ""
    used_selector = None

    # Run 2026-05-06 fix: short-circuit sites flagged as dead/disabled during
    # selector investigation. Skips network round-trip and reports a stable error
    # that the collector can route to skipped_auth.
    # Fase 5.1 (2026-05-11): resolve_site_spec merges DB config.selectors with hardcoded.
    spec = resolve_site_spec(site) or {}
    if spec.get("recommend_disable"):
        return {
            "site_name": site["name"],
            "jobs": [],
            "error": f"disabled_after_investigation: {spec.get('investigation_failed', 'site dead')}",
            "pages_scraped": 0,
            "stop_reason": "disabled",
            "xhr_intercepted": False,
            "duration_ms": int((time.time() - start) * 1000),
        }

    # Run 2026-05-06 fix: getgreatcareers requires US geolocation context to
    # return any matches; otherwise it auto-detects the user's IP location and
    # shows zero results.
    extra_ctx_kwargs = {}
    if spec.get("requires_us_geolocation"):
        extra_ctx_kwargs = {
            "geolocation": {"latitude": 40.7128, "longitude": -74.0060},
            "permissions": ["geolocation"],
            "locale": "en-US",
        }

    async with SEMAPHORE:
        try:
            async with async_playwright() as pw:
                browser = await pw.chromium.launch(headless=True)
                context = await browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    viewport={"width": 1280, "height": 800},
                    **extra_ctx_kwargs,
                )
                await stealth_instance.apply_stealth_async(context)
                page = await context.new_page()

                http_status = None
                try:
                    response = await page.goto(site["base_url"], wait_until="domcontentloaded", timeout=GENERIC_NAV_TIMEOUT_MS)
                    if response is not None:
                        http_status = response.status
                except Exception as e:
                    try:
                        page_sample = (await page.content())[:4000]
                    except Exception:
                        page_sample = ""
                    error_msg = classify_error(e, page_sample)
                    return build_error_result(site, e, duration_ms=int((time.time() - start) * 1000), error_str=error_msg)
                finally:
                    pages_scraped = 1

                # Capture sample for anti-bot detection
                try:
                    page_sample = (await page.content())[:4000]
                except Exception:
                    page_sample = ""

                if http_status and http_status >= 400:
                    error_msg = f"HTTP {http_status}: server returned error status"
                    return {
                        "site_name": site["name"],
                        "jobs": [],
                        "error": error_msg,
                        "pages_scraped": pages_scraped,
                        "stop_reason": "http_error",
                        "xhr_intercepted": False,
                        "duration_ms": int((time.time() - start) * 1000),
                    }

                # Check anti-bot signals — Fase 5.1 (2026-05-11): more precise checks
                # to avoid false positives. The previous loose "cloudflare" / "captcha"
                # keyword scan flagged real listings pages (e.g. workingnomads) that
                # merely had CDN references or class names containing those tokens.
                # We now require explicit challenge-page markers OR an interactive
                # widget being present in the DOM, not just keyword appearance.
                lower_sample = page_sample.lower()
                cf_challenge_markers = [
                    "just a moment...", "checking your browser before",
                    "<title>just a moment", "cf-mitigated", "cf_chl_opt",
                    "ray id:", "please complete the security check"
                ]
                if any(kw in lower_sample for kw in cf_challenge_markers):
                    return {
                        "site_name": site["name"],
                        "jobs": [],
                        "error": "anti_bot: Cloudflare challenge page",
                        "pages_scraped": pages_scraped,
                        "stop_reason": "anti_bot",
                        "xhr_intercepted": False,
                        "duration_ms": int((time.time() - start) * 1000),
                    }
                # Check for visible CAPTCHA widgets (not just keyword in CDN URLs)
                try:
                    has_recaptcha = await page.query_selector("div.g-recaptcha, iframe[src*='recaptcha/api2']")
                    has_hcaptcha  = await page.query_selector("div.h-captcha, iframe[src*='hcaptcha.com']")
                    press_hold    = "press and hold to confirm" in lower_sample
                    if has_recaptcha or has_hcaptcha or press_hold:
                        return {
                            "site_name": site["name"],
                            "jobs": [],
                            "error": "anti_bot: CAPTCHA widget present",
                            "pages_scraped": pages_scraped,
                            "stop_reason": "anti_bot",
                            "xhr_intercepted": False,
                            "duration_ms": int((time.time() - start) * 1000),
                        }
                except Exception:
                    pass

                # Wait briefly for content
                await page.wait_for_timeout(min(site.get("throttle_ms", 2000), 3000))

                # For SPA-like sites, do a small scroll to load content
                if site.get("scraper_type") == "spa_infinite_scroll":
                    try:
                        for _ in range(3):
                            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                            await page.wait_for_timeout(1500)
                    except Exception:
                        pass

                try:
                    raw_jobs, used_selector = await extract_generic_best_effort(page, site)
                except Exception as e:
                    error_msg = classify_error(e, page_sample)
                    return build_error_result(site, e, duration_ms=int((time.time() - start) * 1000), error_str=error_msg)

                if not raw_jobs:
                    error_msg = "selector_not_found: no job cards matched any common selector (a[href*='/job(s)/'], .job-card, [data-job-id], article, li.job, etc.)"
                    return {
                        "site_name": site["name"],
                        "jobs": [],
                        "error": error_msg,
                        "pages_scraped": pages_scraped,
                        "stop_reason": "selector_not_found",
                        "xhr_intercepted": False,
                        "duration_ms": int((time.time() - start) * 1000),
                    }

                # Generic best-effort: include all jobs (since posted_at is unreliable)
                jobs = raw_jobs
                stop_reason = "page_cap"

                try:
                    await page.close()
                except Exception:
                    pass
                try:
                    await context.close()
                except Exception:
                    pass
                try:
                    await browser.close()
                except Exception:
                    pass
        except Exception as e:
            return build_error_result(site, e, duration_ms=int((time.time() - start) * 1000))

    # Apply filters; for generic sites, accept jobs with no posted_at (we can't tell)
    filtered_date = []
    for j in jobs:
        dt = parse_date(j.get("posted_at"))
        if dt is None or dt >= CUTOFF_DATE:
            filtered_date.append(j)
    filtered_title = [j for j in filtered_date if title_matches(j.get("title", ""), job_titles)]

    duration_ms = int((time.time() - start) * 1000)
    print(f"[generic][{site['name']}] {len(jobs)} raw -> {len(filtered_date)} date -> {len(filtered_title)} title | sel={used_selector} | {duration_ms}ms")

    note = None
    if used_selector and len(filtered_title) == 0 and len(jobs) > 0:
        note = f"no_title_match: matched {len(jobs)} cards with selector '{used_selector}' but no titles match job_titles whitelist"

    return {
        "site_name": site["name"],
        "jobs": filtered_title,
        "error": note,
        "pages_scraped": pages_scraped,
        "stop_reason": stop_reason,
        "xhr_intercepted": False,
        "duration_ms": duration_ms,
    }


# ─── Per-site driver with retry + hard timeout ──────────────────────────────
async def scrape_single_site(site, job_titles):
    """Dispatch to the right scraper, with a 3-min hard cap."""
    name = site["name"]
    is_implemented = name in IMPLEMENTED_SITES

    async def runner():
        if is_implemented:
            return await scrape_implemented_site(site, job_titles)
        return await scrape_generic_unknown_site(site, job_titles)

    try:
        return await asyncio.wait_for(runner(), timeout=PER_SITE_TIMEOUT_SEC)
    except asyncio.TimeoutError:
        msg = f"TimeoutError: site exceeded {PER_SITE_TIMEOUT_SEC}s hard cap"
        print(f"[{name}] {msg}")
        return {
            "site_name": name,
            "jobs": [],
            "error": msg,
            "pages_scraped": 0,
            "stop_reason": "error",
            "xhr_intercepted": False,
            "duration_ms": PER_SITE_TIMEOUT_SEC * 1000,
        }
    except Exception as e:
        return build_error_result(site, e)


# ─── Task 1: handle-auth-skip ────────────────────────────────────────────────
def task1_handle_auth_skip(sites_config):
    print("\n[handle-auth-skip] Starting...")
    all_sites = sites_config["sites"]
    skipped_auth = []
    scrape_queue = []

    # Skipped from config
    for skip_entry in sites_config.get("skipped", []):
        skipped_auth.append({"name": skip_entry["name"], "reason": skip_entry.get("reason", "unknown")})

    for site in all_sites:
        requires_auth = (
            site.get("scraper_type") == "requires_auth"
            or site.get("config", {}).get("requires_auth") is True
        )
        if requires_auth and site["name"] != "wellfound":
            skipped_auth.append({"name": site["name"], "reason": "requires_auth"})
        else:
            scrape_queue.append(site)

    scrape_queue.sort(key=lambda s: s.get("priority", 0), reverse=True)
    print(f"[handle-auth-skip] Skipped (auth): {[s['name'] for s in skipped_auth]}")
    print(f"[handle-auth-skip] Scrape queue ({len(scrape_queue)} sites)")
    return scrape_queue, skipped_auth


# ─── Task 2/3 fused: run ALL sites with concurrency cap ──────────────────────
async def task_scrape_all(scrape_queue, job_titles):
    print("\n[scrape-all] Running all sites under Semaphore(5)...")
    tasks = [scrape_single_site(site, job_titles) for site in scrape_queue]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    processed = []
    for i, r in enumerate(results):
        if isinstance(r, Exception):
            site = scrape_queue[i]
            print(f"[{site['name']}] UNEXPECTED EXCEPTION: {r}")
            processed.append(build_error_result(site, r))
        else:
            processed.append(r)
    return processed


# ─── Task 4: collect-results ─────────────────────────────────────────────────
def task4_collect_results(all_results, skipped_auth, job_titles):
    print("\n[collect-results] Starting...")
    all_jobs_raw = []
    per_site_stats = []
    sites_succeeded = 0
    sites_failed = 0

    # 2026-05-11 fix: company removed from required fields. Wellfound listing page
    # doesn't expose company name (jobs are presented as "title-only" cards), so
    # all 79 wellfound jobs were silently dropped at collect-results. Downstream
    # LLM enrichment can derive company from the job detail page, URL, or
    # description — losing the row entirely is much worse. Sites that DO surface
    # company explicitly (dice, infosec_jobs, etc.) get company_fallback in spec.
    required_fields = {"title", "url", "source", "_source_site"}

    for result in all_results:
        site_name = result.get("site_name", "unknown")
        result_jobs = result.get("jobs", []) or []
        error = result.get("error")
        stop_reason = result.get("stop_reason", "")
        duration_ms = result.get("duration_ms", 0)

        had_jobs = len(result_jobs) > 0
        if had_jobs:
            sites_succeeded += 1
        else:
            sites_failed += 1

        valid_jobs = []
        for j in result_jobs:
            j["title"] = strip_html(j.get("title", ""))
            j["company"] = strip_html(j.get("company", ""))
            j["description"] = strip_html(j.get("description", ""))
            j["location"] = strip_html(j.get("location", ""))

            missing = required_fields - set(k for k, v in j.items() if v)
            if missing:
                continue
            valid_jobs.append(j)

        final_jobs = []
        for j in valid_jobs:
            dt = parse_date(j.get("posted_at"))
            if dt is None or dt >= CUTOFF_DATE:
                final_jobs.append(j)

        per_site_stats.append({
            "site": site_name,
            "found": len(result_jobs),
            "after_filter": len(final_jobs),
            "errors": error,
            "stop_reason": stop_reason,
            "duration_ms": duration_ms,
        })

        all_jobs_raw.extend(final_jobs)

    # Skipped-auth sites also get a per_site_stats entry
    for skipped in skipped_auth:
        per_site_stats.append({
            "site": skipped["name"],
            "found": 0,
            "after_filter": 0,
            "errors": f"skipped: {skipped.get('reason', 'unknown')}",
            "stop_reason": "skipped",
            "duration_ms": 0,
        })

    # Deduplicate by URL
    seen_urls = set()
    deduped_jobs = []
    for j in all_jobs_raw:
        url = j.get("url", "")
        if url and url in seen_urls:
            continue
        if url:
            seen_urls.add(url)
        deduped_jobs.append(j)

    total_raw = sum(s["found"] for s in per_site_stats)
    after_date_filter = len(all_jobs_raw)
    after_title_filter = len(deduped_jobs)

    print(f"[collect-results] total_raw={total_raw} | after_filters={after_title_filter} | ok={sites_succeeded} | fail={sites_failed}")

    if not deduped_jobs:
        raise SystemExit("[collect-results] VETO: jobs array is empty across all 44 sites")
    if sites_succeeded == 0:
        raise SystemExit("[collect-results] VETO: every site failed")

    output = {
        "metadata": {
            "collected_at": datetime.now(timezone.utc).isoformat(),
            "cutoff_date": CUTOFF_DATE_STR,
            "run_id": RUN_ID,
            "total_raw": total_raw,
            "after_date_filter": after_date_filter,
            "after_title_filter": after_title_filter,
            "sites_succeeded": sites_succeeded,
            "sites_failed": sites_failed,
            "sites_skipped_auth": len(skipped_auth),
        },
        "per_site_stats": per_site_stats,
        "skipped_auth": skipped_auth,
        "jobs": deduped_jobs,
    }

    OUTPUT_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[collect-results] Wrote {OUTPUT_PATH}")
    return output


# ─── Main ────────────────────────────────────────────────────────────────────
async def main():
    print(f"[Sandro Scout] run_id={RUN_ID} | cutoff={CUTOFF_DATE_STR}")

    sites_config = json.loads(SITES_CONFIG_PATH.read_text(encoding="utf-8"))
    job_titles = sites_config["job_titles"]

    scrape_queue, skipped_auth = task1_handle_auth_skip(sites_config)
    all_results = await task_scrape_all(scrape_queue, job_titles)
    output = task4_collect_results(all_results, skipped_auth, job_titles)

    print(f"\n[Sandro Scout] DONE - {len(output['jobs'])} jobs collected")
    print(f"[Sandro Scout] Output: {OUTPUT_PATH}")


if __name__ == "__main__":
    asyncio.run(main())
