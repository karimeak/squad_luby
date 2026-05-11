"""
Targeted probe for getgreatcareers — try to dismiss OneTrust cookie banner
then wait for Angular gc-jobs-tile elements to render.
"""
import asyncio
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from playwright.async_api import async_playwright
from playwright_stealth import Stealth


async def main():
    async with async_playwright() as pw:
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

        await page.goto("https://www.getgreatcareers.com", wait_until="domcontentloaded", timeout=45000)
        await page.wait_for_timeout(3000)

        # Try multiple cookie banner dismissal patterns
        banner_selectors = [
            "#onetrust-accept-btn-handler",
            "button:has-text('Accept All')",
            "button:has-text('Accept all')",
            "button:has-text('I Accept')",
            "[aria-label*='Accept']",
            ".ot-pc-acceptall, .save-preference-btn-handler",
        ]
        for sel in banner_selectors:
            try:
                btn = await page.query_selector(sel)
                if btn:
                    await btn.click()
                    print(f"[probe] Clicked cookie banner: {sel}")
                    break
            except Exception:
                continue

        await page.wait_for_timeout(5000)

        # Now look for job tiles
        for i in range(10):
            await page.wait_for_timeout(1500)
            try:
                tiles = await page.query_selector_all("gc-jobs-tile, gc-job-tile, [class*='jobs-tile'], [class*='job-tile'], [class*='job-card']")
                if tiles and len(tiles) >= 2:
                    print(f"[probe] Found {len(tiles)} tiles after {(i+1)*1.5 + 5}s")
                    break
            except Exception:
                pass
        else:
            print(f"[probe] No tiles found after 20+ seconds")

        # Probe broader
        candidates = {}
        for sel in ["gc-jobs-tile", "gc-job-tile", "[class*='jobs-tile']", "[class*='job-tile']",
                    "[class*='job-card']", "[class*='job-result']", ".job", "li[class*='job']",
                    "[data-job-id]", "[class*='listing']"]:
            try:
                els = await page.query_selector_all(sel)
                if els:
                    candidates[sel] = {"count": len(els), "samples": []}
                    for e in els[:3]:
                        try:
                            t = (await e.inner_text()).strip()
                            candidates[sel]["samples"].append(t[:100].replace("\n", " | "))
                        except Exception:
                            candidates[sel]["samples"].append("")
            except Exception:
                continue

        print(f"[probe] Candidates after cookie dismissal:")
        for sel, info in candidates.items():
            print(f"  [{info['count']}] {sel} -> {info['samples'][:2]}")

        # Save HTML
        html = await page.content()
        out = Path("squads/hunter-squad/_investigations") / f"probe-ggc-postcookie-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}.html"
        with open(out, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"[probe] HTML saved to {out}")

        await browser.close()


asyncio.run(main())
