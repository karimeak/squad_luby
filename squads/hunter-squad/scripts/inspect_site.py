"""
Site Inspector — Hunter Squad

Loads a job board's listing page with stealth Playwright and reports candidate
selectors based on actual DOM. For each candidate, returns:
- match_count: how many elements match
- sample_text: first 3 inner_text() values (truncated)
- sample_hrefs: first 3 href attributes found inside
- looks_like_card: heuristic — multiple matches with text & link

Usage:
  python squads/hunter-squad/scripts/inspect_site.py <site_name|url>

Output: writes JSON report to squads/hunter-squad/_investigations/inspect-<site>-<ts>.json
plus a human-readable summary on stdout.
"""

import asyncio
import io
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True)

from playwright.async_api import async_playwright, TimeoutError as PWTimeoutError
from playwright_stealth import Stealth

BASE_DIR = Path("C:/Users/Karime/OneDrive/Documentos/Squad/squads/hunter-squad")
INV_DIR = BASE_DIR / "_investigations"
INV_DIR.mkdir(exist_ok=True)

CARD_CANDIDATES = [
    'a[href*="/job/"]', 'a[href*="/jobs/"]', 'a[href*="/posting/"]',
    'a[href*="/positions/"]', 'a[href*="/career"]', 'a[href*="/vacancy"]',
    'a[href*="/role"]', 'a[href*="/listing"]', 'a[href*="/opportunit"]',
    '[data-testid*="job"]', '[data-testid*="card"]', '[data-cy*="job"]',
    '[data-cy*="card"]', '[class*="job-card"]', '[class*="job-tile"]',
    '[class*="job-listing"]', '[class*="job-row"]', '[class*="job-item"]',
    '[class*="posting"]', '[class*="position-card"]', '[class*="vacancy"]',
    'article', 'li.job', 'li[class*="job"]', '[data-job-id]',
    '[role="article"]', '.list-item', 'tr.job',
]

TITLE_CANDIDATES = [
    'h1', 'h2', 'h3', 'h4',
    '[class*="title"]', '[data-cy*="title"]', '[data-testid*="title"]',
    '[class*="job-title"]', '[class*="position-title"]',
    'a[class*="title"]', 'a > span',
]


async def safe_text(scope, sel):
    try:
        el = await scope.query_selector(sel)
        if el:
            t = (await el.inner_text()).strip()
            return t[:200]
    except Exception:
        pass
    return ""


async def safe_attr(scope, sel, attr):
    try:
        el = await scope.query_selector(sel)
        if el:
            return await el.get_attribute(attr)
    except Exception:
        pass
    return None


async def inspect_url(name, url):
    print(f"\n[inspector] === {name} ===")
    print(f"[inspector] URL: {url}")

    stealth = Stealth()
    report = {
        "site_name": name,
        "url": url,
        "inspected_at": datetime.now(timezone.utc).isoformat(),
        "http_status": None,
        "error": None,
        "title_tag": None,
        "page_title": None,
        "has_captcha": False,
        "card_candidates": [],
        "title_candidates_in_top_card": [],
        "sample_jobs": [],
        "recommendation": None,
    }

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="en-US",
        )
        await stealth.apply_stealth_async(context)
        page = await context.new_page()

        try:
            resp = await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            report["http_status"] = resp.status if resp else None
            await page.wait_for_timeout(2500)
            # Small scroll for SPA
            try:
                for _ in range(3):
                    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    await page.wait_for_timeout(800)
            except Exception:
                pass

            report["page_title"] = await page.title()
            body_text = (await page.content())[:6000].lower()
            report["has_captcha"] = any(
                kw in body_text for kw in
                ["captcha", "g-recaptcha", "hcaptcha", "press and hold", "cloudflare", "challenge-platform"]
            )

            # Run candidates
            for sel in CARD_CANDIDATES:
                try:
                    els = await page.query_selector_all(sel)
                except Exception:
                    continue
                count = len(els)
                if count < 2:
                    continue  # not a list

                samples_text = []
                samples_href = []
                for el in els[:3]:
                    try:
                        t = (await el.inner_text()).strip()
                        samples_text.append(t[:120].replace("\n", " | "))
                    except Exception:
                        samples_text.append("")
                    try:
                        h = await el.get_attribute("href")
                        if not h:
                            inner_a = await el.query_selector("a[href]")
                            if inner_a:
                                h = await inner_a.get_attribute("href")
                        samples_href.append(h or "")
                    except Exception:
                        samples_href.append("")

                report["card_candidates"].append({
                    "selector": sel,
                    "count": count,
                    "sample_text": samples_text,
                    "sample_hrefs": samples_href,
                })

            # Sort candidates: prefer those with non-empty text AND href
            def score(c):
                with_text = sum(1 for t in c["sample_text"] if t)
                with_href = sum(1 for h in c["sample_hrefs"] if h)
                return (with_text * 10 + with_href * 5 + min(c["count"], 50))

            report["card_candidates"].sort(key=score, reverse=True)

            # For top candidate, probe title-within-card
            if report["card_candidates"]:
                top = report["card_candidates"][0]
                try:
                    cards = await page.query_selector_all(top["selector"])
                    if cards:
                        first_card = cards[0]
                        for tsel in TITLE_CANDIDATES:
                            t = await safe_text(first_card, tsel)
                            if t:
                                report["title_candidates_in_top_card"].append({
                                    "selector": tsel,
                                    "sample": t,
                                })

                        # Build a few sample jobs
                        for c in cards[:5]:
                            j = {
                                "raw_text": (await c.inner_text())[:200].replace("\n", " | ") if c else "",
                                "href": await c.get_attribute("href"),
                            }
                            if not j["href"]:
                                inner_a = await c.query_selector("a[href]")
                                if inner_a:
                                    j["href"] = await inner_a.get_attribute("href")
                            for tsel in TITLE_CANDIDATES[:5]:
                                t = await safe_text(c, tsel)
                                if t:
                                    j[f"title_via_{tsel}"] = t
                                    break
                            report["sample_jobs"].append(j)
                except Exception as e:
                    print(f"[inspector] title probe error: {e}")

            # Synthesize recommendation
            if report["card_candidates"]:
                top = report["card_candidates"][0]
                title_sel = (
                    report["title_candidates_in_top_card"][0]["selector"]
                    if report["title_candidates_in_top_card"] else "self"
                )
                # Detect if card itself is the link
                card_is_link = (top["selector"].startswith("a[") or "tagName" in top.get("sample_text", []))
                report["recommendation"] = {
                    "card_selector": top["selector"],
                    "title_selector": title_sel,
                    "url_selector": "self" if top["selector"].startswith("a[") else "a[href]",
                    "card_count": top["count"],
                    "confidence": "high" if top["count"] >= 5 and report["title_candidates_in_top_card"] else "medium",
                }

        except PWTimeoutError as e:
            report["error"] = f"timeout: {e}"
            print(f"[inspector] TIMEOUT")
        except Exception as e:
            report["error"] = f"{type(e).__name__}: {e}"
            print(f"[inspector] ERROR: {report['error']}")
        finally:
            try: await page.close()
            except: pass
            try: await context.close()
            except: pass
            try: await browser.close()
            except: pass

    # Pretty print
    print(f"[inspector] http_status: {report['http_status']}")
    print(f"[inspector] page_title:  {report['page_title']!r}")
    print(f"[inspector] has_captcha: {report['has_captcha']}")
    print(f"[inspector] top 5 card candidates:")
    for c in report["card_candidates"][:5]:
        text_preview = c["sample_text"][0] if c["sample_text"] else ""
        print(f"  ({c['count']:3}) {c['selector']:50} | {text_preview[:60]}")
    print(f"[inspector] title candidates in top card:")
    for t in report["title_candidates_in_top_card"][:5]:
        print(f"  {t['selector']:35} -> {t['sample'][:80]}")
    print(f"[inspector] recommendation: {report['recommendation']}")

    return report


SITE_URLS = {
    "dice":           "https://www.dice.com/jobs?q=software+engineer&location=Remote",
    "theladders":     "https://www.theladders.com/jobs/search-jobs?searchKeyword=software+engineer",
    "getgreatcareers":"https://www.getgreatcareers.com",
    "workingnomads": "https://workingnomads.co/jobs",
    "hiretechladies":"https://www.hiretechladies.com/jobs",
    "myvisajobs":    "https://www.myvisajobs.com/Software-Engineer_JT.htm",
    "h1bdata":       "https://h1bdata.info",
}


async def main():
    if len(sys.argv) < 2:
        print("Usage: python inspect_site.py <site_name>|<url>|all")
        print(f"Known sites: {', '.join(SITE_URLS.keys())}, all")
        sys.exit(1)

    target = sys.argv[1].strip()
    sites = []
    if target == "all":
        sites = list(SITE_URLS.items())
    elif target in SITE_URLS:
        sites = [(target, SITE_URLS[target])]
    elif target.startswith("http"):
        sites = [("custom", target)]
    else:
        print(f"Unknown site: {target}")
        sys.exit(1)

    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d-%H%M%S")
    reports = []
    for name, url in sites:
        try:
            r = await inspect_url(name, url)
            reports.append(r)
        except Exception as e:
            print(f"[inspector] {name} crashed: {e}")
            reports.append({"site_name": name, "url": url, "error": str(e)})

    out_path = INV_DIR / f"inspect-{target}-{ts}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(reports, f, indent=2, ensure_ascii=False, default=str)
    print(f"\n[inspector] Report saved to: {out_path}")


if __name__ == "__main__":
    asyncio.run(main())
