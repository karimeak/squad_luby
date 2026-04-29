---
task: "Chunk and Prepare Extraction Batches"
order: 1
input: |
  - supabase_connection: Active Supabase client
output: |
  - job_chunks: List of job batches (max 15 jobs each) ready for LLM extraction
  - total_jobs: Total count of jobs to enrich
  - chunk_count: Number of chunks
---

# Chunk and Prepare Extraction Batches

Description: Fetches new bronze records from `apify_jobs` where `ai_key_skills` is still null, pre-cleans HTML from descriptions, filters out records too short to extract from, and splits the remainder into chunks of 15 for LLM processing.

---

## Process

**Step 1 — Query Supabase for unenriched records**

```sql
SELECT
  id,
  raw_payload->>'description' AS description,
  raw_payload->>'title'       AS title
FROM apify_jobs
WHERE raw_payload->>'ai_key_skills' IS NULL
  AND fetched_at >= now() - interval '24 hours'
ORDER BY fetched_at DESC
```

> Note: The 24-hour window targets the latest ingestion cycle. Adjust if running a backfill.

**Step 2 — Pre-clean each description**

For every record returned:
1. Strip all HTML tags (use `BeautifulSoup(description, "html.parser").get_text()` or equivalent regex)
2. Normalize whitespace: collapse multiple spaces/newlines into single space, strip leading/trailing whitespace
3. Truncate to 4000 tokens (~16000 characters) — hard limit to stay within Claude context window

```python
import re
from bs4 import BeautifulSoup

def clean_description(raw: str) -> str:
    if not raw:
        return ""
    # Strip HTML
    text = BeautifulSoup(raw, "html.parser").get_text(separator=" ")
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Truncate to ~16000 chars (approx 4000 tokens)
    return text[:16000]
```

**Step 3 — Filter short descriptions**

Exclude records where `len(cleaned_description) < 50`. These are too sparse for meaningful extraction and would generate mostly-null outputs. Count them as `skipped_short_descriptions`.

**Step 4 — Split into chunks of 15**

```python
chunk_size = 15
job_chunks = [
    {
        "chunk_index": i // chunk_size,
        "jobs": records[i:i + chunk_size]
    }
    for i in range(0, len(records), chunk_size)
]
```

**Step 5 — Return output with metadata**

Return `job_chunks`, `chunk_count`, `total_jobs`, and `skipped_short_descriptions` for downstream processing and checkpoint display.

---

## Output Format

```yaml
job_chunks:
  - chunk_index: int           # 0-based index
    jobs:
      - id: uuid               # apify_jobs primary key
        description: str       # cleaned, stripped, <= 16000 chars
        title: str             # job title (raw, for context)
chunk_count: int               # total number of chunks
total_jobs: int                # total records to enrich (after filtering)
skipped_short_descriptions: int  # records excluded (description < 50 chars)
```

---

## Output Example

```yaml
total_jobs: 1423
chunk_count: 95
skipped_short_descriptions: 8

job_chunks:
  - chunk_index: 0
    jobs:
      - id: "3f8a1c2d-4e5b-6789-abcd-ef0123456789"
        title: "Senior Data Engineer"
        description: "We are looking for a Senior Data Engineer to join our platform team. You will design and maintain data pipelines using Apache Spark, Kafka, and dbt. Requirements include 5+ years experience with Python, strong SQL skills, and familiarity with cloud platforms (AWS preferred). Remote position. Compensation: $170,000–$190,000/year..."

      - id: "7b2e9f3a-1d4c-5678-bcde-f01234567890"
        title: "ML Engineer – Recommendations"
        description: "Stripe is hiring an ML Engineer to work on our recommendations infrastructure. You'll build and deploy models using PyTorch and TensorFlow, work with large-scale data in BigQuery, and collaborate closely with the data science team. Senior level. Hybrid (San Francisco, CA). Salary not disclosed..."

      - id: "c4d7e8f1-2a3b-4567-cdef-012345678901"
        title: "Backend Engineer (Python)"
        description: "Plaid is looking for a mid-level Backend Engineer with strong Python and PostgreSQL skills. You'll contribute to our core banking integration layer. Experience with REST APIs, async Python (FastAPI or equivalent), and distributed systems required. Full remote. $130,000–$150,000 YEAR..."

  - chunk_index: 1
    jobs:
      - id: "e5f6a7b8-3c4d-5678-def0-123456789012"
        title: "Data Analyst"
        description: "Join our analytics team at Notion. You will work with Looker, Snowflake, and dbt to deliver business insights across product and growth. SQL expertise required. Mid-level. New York or remote..."
      # ... 14 more jobs in chunk_index: 1

  # ... 93 more chunks
```

---

## Quality Criteria

- [ ] All descriptions stripped of HTML tags (no `<p>`, `<div>`, `<ul>`, `<li>` tags in output)
- [ ] All descriptions trimmed to ≤ 4000 tokens (approximately ≤ 16000 characters)
- [ ] Chunk size ≤ 15 jobs per chunk (last chunk may have fewer)
- [ ] Records with `description < 50 chars` excluded and counted in `skipped_short_descriptions`
- [ ] `chunk_count` equals `ceil(total_jobs / 15)`
- [ ] All record IDs are valid UUIDs matching `apify_jobs.id`

---

## Veto Conditions

1. **`total_jobs == 0`** — Log info message: `"No new records to enrich — all apify_jobs already have ai_key_skills populated or no records in last 24h"`. Exit gracefully. This is NOT an error; it means the previous run was complete.

2. **Supabase query fails** — Abort immediately with error. Do not proceed to extraction. Surface connection string, project ID (`pbvjsixlqnuzcnqahbxu`), and error message for diagnosis.
