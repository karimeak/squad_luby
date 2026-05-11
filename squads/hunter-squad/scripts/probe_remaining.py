"""
Probe remaining broken sites — per-site deep investigation.

Differs from inspect_site.py: applies site-specific context (geo, wait, scroll,
parent-container probing) instead of one-size-fits-all heuristics.

Run once after Fase 5.1 to gather data for getgreatcareers, theladders,
hiretechladies. Output goes to _investigations/ as JSON + HTML snapshot.

Usage: python squads/hunter-squad/scripts/probe_remaining.py [site_name|all]
"""

import asyncio
import io
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from playwright.async_api import async_playwright, TimeoutError as PWTimeoutError
from playwright_stealth import Stealth

INV_DIR = Path("C:/Users/Karime/OneDrive/Documentos/Squad/squads/hunter-squad/_investigations")
INV_DIR.mkdir(exist_ok=True)


async def probe_getgreatcareers(pw):
    """Angular custom element <gc-jobs-tile>. Requires US geolocation.
    Previous run got 0 cards — inspect_site.py didn't apply geo.
    """
    print("[probe][getgreatcareers] using US geo + 8s wait")
    browser = await pw.chromium.launch(headless=True)
    context = await browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport={"width": 1280, "height": 800},
        geolocation={"latitude": 40.7128, "longitude": -74.0060},
        permissions=["geolocation"],
        locale="en-US",
    )
    await Stealth().apply_stealth_async(context)
    page = await context.new_page()

    findings = {"site": "getgreatcareers", "candidates": [], "html_snippet": ""}
    try:
        resp = await page.goto("https://www.getgreatcareers.com", wait_until="domcontentloaded", timeout=45000)
        findings["http_status"] = resp.status if resp else None

        # Long wait for Angular hydration
        for i in range(8):
            await page.wait_for_timeout(1500)
            try:
                tiles = await page.query_selector_all("gc-jobs-tile")
                if tiles:
                    findings["wait_until_tiles_loaded_s"] = (i + 1) * 1.5
                    break
            except Exception:
                pass

        for sel in ["gc-jobs-tile", "gc-job-tile", "[class*='jobs-tile']", "[class*='job-tile']",
                    "[class*='gc-jobs']", "[class*='job-result']", "[class*='job-card']",
                    "ul.jobs li", "div.job", "article", "li[class*='job']"]:
            try:
                els = await page.query_selector_all(sel)
                if els:
                    sample = []
                    for e in els[:3]:
                        try:
                            t = (await e.inner_text()).strip()
                            sample.append(t[:150].replace("\n", " | "))
                        except: sample.append("")
                    findings["candidates"].append({"selector": sel, "count": len(els), "samples": sample})
            except Exception:
                continue

        # Probe first tile's children to find title
        try:
            tile = await page.query_selector("gc-jobs-tile, [class*='jobs-tile']")
            if tile:
                for tsel in [".title", "h2", "h3", "h4", "[class*='Title']", "[class*='position']", "[class*='job-name']", "[class*='heading']"]:
                    t = ""
                    try:
                        el = await tile.query_selector(tsel)
                        if el:
                            t = (await el.inner_text()).strip()[:100]
                    except: pass
                    if t:
                        findings.setdefault("title_in_tile", []).append({"selector": tsel, "sample": t})
                # Also dump tile's HTML structure
                findings["tile_outer_html"] = (await tile.inner_html())[:2000]
        except Exception as e:
            findings["tile_probe_error"] = str(e)

        findings["html_snippet"] = (await page.content())[:8000]
    except Exception as e:
        findings["error"] = f"{type(e).__name__}: {e}"
    finally:
        try: await page.close()
        except: pass
        try: await context.close()
        except: pass
        try: await browser.close()
        except: pass

    return findings


async def probe_theladders(pw):
    """Landing page was returned in inspector. Try waiting longer for SPA hydration
    and explicit scroll to trigger any lazy-load."""
    print("[probe][theladders] extended wait + scroll")
    browser = await pw.chromium.launch(headless=True)
    context = await browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport={"width": 1280, "height": 800},
        locale="en-US",
    )
    await Stealth().apply_stealth_async(context)
    page = await context.new_page()

    findings = {"site": "theladders", "candidates": []}
    urls_to_try = [
        "https://www.theladders.com/jobs/search-jobs?searchKeyword=software+engineer",
        "https://www.theladders.com/jobs/search-jobs?searchKeyword=software+engineer&locationName=Remote",
        "https://www.theladders.com/jobs",
    ]

    for url in urls_to_try:
        try:
            resp = await page.goto(url, wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(5000)
            for _ in range(4):
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await page.wait_for_timeout(2000)

            # Probe for actual job listing containers (not nav)
            for sel in ["[data-testid*='job']", "[data-cy*='job']", "[class*='job-card']",
                        "[class*='JobCard']", "[class*='posting']", "article",
                        "li[class*='job']", "div[class*='listing']", "a[href*='/jobs/job-']"]:
                try:
                    els = await page.query_selector_all(sel)
                    if len(els) >= 3:
                        sample = []
                        hrefs = []
                        for e in els[:3]:
                            try:
                                t = (await e.inner_text()).strip()
                                sample.append(t[:150].replace("\n", " | "))
                            except: sample.append("")
                            try:
                                h = await e.get_attribute("href")
                                if not h:
                                    a = await e.query_selector("a[href]")
                                    h = await a.get_attribute("href") if a else ""
                                hrefs.append(h or "")
                            except: hrefs.append("")
                        findings["candidates"].append({"url": url, "selector": sel, "count": len(els), "samples": sample, "hrefs": hrefs})
                except Exception:
                    continue

            findings["page_title"] = await page.title()
            findings["final_url"] = page.url
            if findings["candidates"]:
                break  # found something
        except Exception as e:
            findings.setdefault("url_errors", {})[url] = f"{type(e).__name__}: {e}"

    findings["html_snippet"] = (await page.content())[:5000]
    try: await page.close()
    except: pass
    try: await context.close()
    except: pass
    try: await browser.close()
    except: pass
    return findings


async def probe_hiretechladies(pw):
    """34 a[href*='/jobs/'] found in inspector but empty inner_text. Title is
    likely in a sibling/parent element, not nested in the <a>. Probe parents."""
    print("[probe][hiretechladies] parent-container probe for empty-text hrefs")
    browser = await pw.chromium.launch(headless=True)
    context = await browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport={"width": 1280, "height": 800},
        locale="en-US",
    )
    await Stealth().apply_stealth_async(context)
    page = await context.new_page()

    findings = {"site": "hiretechladies", "candidates": []}
    try:
        resp = await page.goto("https://www.hiretechladies.com/jobs", wait_until="domcontentloaded", timeout=45000)
        findings["http_status"] = resp.status if resp else None
        await page.wait_for_timeout(5000)
        for _ in range(3):
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_timeout(1500)

        # Check the [class*='job-item'] selector that inspector found (26 matches)
        for card_sel in ["[class*='job-item']", "[class*='JobItem']", "[class*='job-card']", "[class*='listing-item']",
                          "[class*='vacancy']", "li[class*='job']", "div[class*='job']"]:
            try:
                cards = await page.query_selector_all(card_sel)
                if len(cards) >= 3:
                    samples = []
                    for c in cards[:5]:
                        sample = {"selector": card_sel}
                        try: sample["text"] = (await c.inner_text())[:200].replace("\n", " | ")
                        except: sample["text"] = ""
                        # Find href anywhere inside
                        try:
                            a = await c.query_selector("a[href*='/jobs/']")
                            sample["href"] = await a.get_attribute("href") if a else ""
                        except: sample["href"] = ""
                        # Probe title in card
                        for tsel in ["h1", "h2", "h3", "h4", "[class*='title']", "[class*='Title']", "[class*='job-name']", "[class*='heading']"]:
                            try:
                                el = await c.query_selector(tsel)
                                if el:
                                    t = (await el.inner_text()).strip()
                                    if t and t.lower() not in ("apply now", "view job"):
                                        sample[f"title_via_{tsel}"] = t[:100]
                                        break
                            except: continue
                        samples.append(sample)
                    findings["candidates"].append({"card_selector": card_sel, "count": len(cards), "samples": samples})
            except Exception:
                continue

        # Also try: parent of a[href*='/jobs/'] elements
        try:
            anchors = await page.query_selector_all("a[href*='/jobs/']:not([href*='greenhouse'])")
            findings["anchor_count"] = len(anchors)
            if anchors:
                # For first 5, walk up to parent and inspect
                for i, a in enumerate(anchors[:5]):
                    try:
                        href = await a.get_attribute("href")
                        # Get parent's inner_text
                        parent_text = await a.evaluate("el => el.parentElement ? el.parentElement.innerText.substring(0, 300) : ''")
                        grand_text = await a.evaluate("el => el.parentElement?.parentElement ? el.parentElement.parentElement.innerText.substring(0, 300) : ''")
                        findings.setdefault("anchor_parent_probes", []).append({
                            "href": href, "parent_text": parent_text.replace("\n", " | "), "grandparent_text": grand_text.replace("\n", " | ")
                        })
                    except Exception as e:
                        findings.setdefault("anchor_parent_probes", []).append({"error": str(e)})
        except Exception as e:
            findings["anchor_probe_error"] = str(e)
    except Exception as e:
        findings["error"] = f"{type(e).__name__}: {e}"
    finally:
        try: await page.close()
        except: pass
        try: await context.close()
        except: pass
        try: await browser.close()
        except: pass

    return findings


async def main():
    sites = sys.argv[1] if len(sys.argv) > 1 else "all"

    results = []
    async with async_playwright() as pw:
        if sites in ("all", "getgreatcareers"):
            results.append(await probe_getgreatcareers(pw))
        if sites in ("all", "theladders"):
            results.append(await probe_theladders(pw))
        if sites in ("all", "hiretechladies"):
            results.append(await probe_hiretechladies(pw))

    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d-%H%M%S")
    out_path = INV_DIR / f"probe-remaining-{ts}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False, default=str)
    print(f"\n[probe] Report saved to: {out_path}")

    # Pretty-print summary
    for r in results:
        print(f"\n=== {r.get('site')} ===")
        if r.get("error"):
            print(f"  ERROR: {r['error']}")
            continue
        if r.get("http_status"):
            print(f"  http_status: {r['http_status']}")
        if r.get("wait_until_tiles_loaded_s"):
            print(f"  tiles_loaded_at: {r['wait_until_tiles_loaded_s']}s")
        for c in r.get("candidates", [])[:5]:
            ct = c.get('count', '?')
            sel = c.get('selector') or c.get('card_selector', '?')
            print(f"  [{ct:3}] {sel}")
            samples = c.get("samples") or []
            for s in samples[:2] if isinstance(samples[0], dict) else []:
                print(f"      text={s.get('text','')[:80]!r}  href={s.get('href','')[:60]!r}")
                for k, v in s.items():
                    if k.startswith("title_via_"):
                        print(f"      {k}: {v!r}")
        if r.get("title_in_tile"):
            print(f"  title_in_tile:")
            for t in r["title_in_tile"][:3]:
                print(f"    {t['selector']:25} -> {t['sample']!r}")
        if r.get("anchor_parent_probes"):
            print(f"  anchor_parent_probes (first 3):")
            for p in r["anchor_parent_probes"][:3]:
                print(f"    href={p.get('href','')!r}")
                print(f"      parent={p.get('parent_text','')[:100]!r}")
                print(f"      grandparent={p.get('grandparent_text','')[:100]!r}")


if __name__ == "__main__":
    asyncio.run(main())
