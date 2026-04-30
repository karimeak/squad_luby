---
name: "Playwright"
description: "Playwright MCP integration — browser automation for web scraping. Used by Hunter Squad's Sandro Scout to scrape 45 job sites with asyncio.Semaphore(5), stealth mode, and date-based pagination stop."
type: mcp
version: "1.0.0"
mcp:
  server_name: playwright
categories:
  - scraping
  - automation
---

# Playwright Skill

This skill provides Playwright browser automation for web scraping pipelines.

## Core Principles

1. **Never use `time.sleep()`** — always use `await page.wait_for_timeout()`, `wait_for_selector()`, or `wait_for_load_state()` to keep the asyncio event loop alive.
2. **Always apply `playwright-stealth`** — call `await stealth_async(context)` before any navigation to avoid bot detection.
3. **Always close pages in `finally` blocks** — `await page.close()` + `await context.close()` to prevent memory leaks.
4. **Semaphore(5)** — never open more than 5 concurrent browser contexts. Use `asyncio.Semaphore(5)`.

## Scraping Patterns

### Generic Listing (server-rendered pagination)
```python
await page.goto(url, wait_until="networkidle", timeout=30000)
# Paginate with: click next → wait_for_load_state("networkidle")
# Stop when: oldest_job_date < cutoff_date OR page_count >= max_pages
```

### SPA Infinite Scroll (React/Vue/Angular)
```python
await page.goto(url, wait_until="domcontentloaded", timeout=30000)
await page.wait_for_selector(".job-card, [data-job], article.job", timeout=15000)
# Scroll loop: window.scrollTo(0, document.body.scrollHeight) → wait 1500ms → check count
# Stop when: no_new_items OR oldest_date < cutoff OR scroll_count >= max_pages
```

### XHR Interception (preferred over DOM parsing)
```python
page.on("response", capture_api_calls)  # Set BEFORE page.goto()
# If JSON response with jobs array captured → use intercepted_jobs instead of DOM
```

## Retry Pattern

```python
RETRYABLE_ERRORS = (TimeoutError, PlaywrightError)
# Retry up to 3 times with exponential backoff: ~2s, ~4s
# SelectorNotFound → non-retryable (structural failure)
```
