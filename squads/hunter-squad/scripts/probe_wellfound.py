"""
Diagnose wellfound headless session — opens persistent context (same way scraper
does) and dumps page state to figure out why list selector times out.
"""
import asyncio
import sys, io
from pathlib import Path
from datetime import datetime, timezone

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)

from playwright.async_api import async_playwright
from playwright_stealth import Stealth

PROFILE_DIR = Path("C:/Users/Karime/OneDrive/Documentos/Squad/_opensquad/_browser_profile/wellfound")
INV_DIR = Path("C:/Users/Karime/OneDrive/Documentos/Squad/squads/hunter-squad/_investigations")


async def main():
    headless = sys.argv[1] != "visible" if len(sys.argv) > 1 else True
    print(f"[probe-wellfound] headless={headless}  profile={PROFILE_DIR}")
    print(f"[probe-wellfound] profile exists: {PROFILE_DIR.exists()}")
    if PROFILE_DIR.exists():
        files = list(PROFILE_DIR.iterdir())
        print(f"[probe-wellfound] profile has {len(files)} items")

    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=str(PROFILE_DIR),
            headless=headless,
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
            args=["--disable-blink-features=AutomationControlled", "--disable-features=AutomationControlled"],
        )
        try:
            await Stealth().apply_stealth_async(context)
        except Exception as e:
            print(f"[probe] stealth warning: {e}")
        page = context.pages[0] if context.pages else await context.new_page()
        await page.goto("https://wellfound.com/jobs", wait_until="domcontentloaded", timeout=45000)

        print(f"[probe] After domcontentloaded:")
        print(f"  URL:   {page.url}")
        print(f"  Title: {await page.title()}")

        # Wait longer
        await page.wait_for_timeout(8000)
        print(f"[probe] After 8s wait:")
        print(f"  URL:   {page.url}")
        print(f"  Title: {await page.title()}")

        # Try selectors used by scraper
        for sel in [
            "a[href*='/jobs/']",
            "[data-test='JobSearchResult']",
            "[data-test*='Job']",
            "[class*='job-search']",
            "[class*='styles_jobCard']",
            "[class*='job-listing']",
            "article",
            "[role='article']",
            "div[data-test*='Result']",
        ]:
            try:
                count = await page.locator(sel).count()
                if count:
                    print(f"  [{count:3}] {sel}")
            except Exception:
                continue

        # Check if logged in — look for sign-in CTA vs profile/avatar
        for sel in [
            "a[href*='/login']", "a[href*='/signin']",
            "button:has-text('Log In')", "button:has-text('Sign In')",
            "[data-test*='UserMenu']", "[class*='avatar']",
            "[data-test='LoggedInHeader']",
        ]:
            try:
                count = await page.locator(sel).count()
                if count:
                    print(f"  AUTH-INDICATOR [{count}] {sel}")
            except Exception:
                continue

        # Save snapshot
        ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
        html_path = INV_DIR / f"probe-wellfound-{('visible' if not headless else 'headless')}-{ts}.html"
        png_path  = INV_DIR / f"probe-wellfound-{('visible' if not headless else 'headless')}-{ts}.png"
        try:
            html = await page.content()
            html_path.write_text(html, encoding="utf-8")
            print(f"[probe] HTML saved: {html_path}")
        except Exception as e:
            print(f"[probe] HTML save error: {e}")
        try:
            await page.screenshot(path=str(png_path), full_page=False)
            print(f"[probe] Screenshot saved: {png_path}")
        except Exception as e:
            print(f"[probe] Screenshot error: {e}")

        await context.close()


asyncio.run(main())
