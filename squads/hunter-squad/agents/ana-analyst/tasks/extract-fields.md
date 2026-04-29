---
task: "Extract AI Fields via Claude API"
order: 2
input: |
  - job_chunks: List of job batches from chunk-and-batch task
output: |
  - extraction_results: Dict of job_id -> extracted ai_* fields
  - extraction_stats: {total, success, failed, high_confidence_rate}
---

# Extract AI Fields via Claude API

Description: Calls Claude API with structured outputs (Pydantic schema) to extract 13 `ai_*` fields from each job description. Processes in chunks of 15 with a 4-second delay between chunks to comply with rate limits. Uses `claude-sonnet-4-5` with `betas=["structured-outputs-2025-11-13"]` at the TOP LEVEL of each API call.

---

## Process

**Step 1 — Initialize Anthropic client**

```python
import anthropic
import os

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
```

**Step 2 — Define Pydantic schema with all 13 ai_* fields**

```python
from pydantic import BaseModel
from typing import Literal, Optional

class JobEnrichment(BaseModel):
    ai_key_skills: list[str]
    ai_keywords: list[str]
    ai_experience_level: Optional[Literal["junior", "mid", "senior", "staff", "principal"]]
    ai_core_responsibilities: Optional[str]
    ai_requirements_summary: Optional[str]
    ai_salary_minvalue: Optional[float]
    ai_salary_unittext: Optional[Literal["HOUR", "YEAR"]]
    remote_derived: Optional[bool]
    domain_derived: Optional[str]
    locations_derived: list[str]
    cities_derived: list[str]
    regions_derived: list[str]
    countries_derived: list[str]
```

> `ai_experience_level` as `Optional[Literal[...]]` ensures enum enforcement at schema level — structured outputs will reject any value outside the closed set.

**Step 3 — Extraction loop with chunking and delay**

```python
import time

EXTRACTION_PROMPT = """You are a precise data extractor for job postings.

Rules:
- Only extract information explicitly stated in the text
- Return null for any field not clearly mentioned — do not infer or guess
- ai_key_skills: only named technologies/tools/frameworks explicitly listed
- ai_experience_level: normalize to exactly: "junior"|"mid"|"senior"|"staff"|"principal"|null
- ai_salary_minvalue: extract number only if explicit salary mentioned; null for "competitive salary"
- remote_derived: true only if "remote" explicitly stated; null if ambiguous
- domain_derived: extract from company URL if visible in description; else null
- countries_derived: include "United States" if US-based role is explicit"""

extraction_results = {}
failed_extractions = []

for chunk in job_chunks:
    for job in chunk["jobs"]:
        try:
            response = client.messages.parse(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                system=EXTRACTION_PROMPT,
                messages=[{"role": "user", "content": job["description"]}],
                response_format=JobEnrichment,
                betas=["structured-outputs-2025-11-13"],  # TOP LEVEL — NEVER inside params
            )
            extraction_results[job["id"]] = response.parsed.model_dump()
        except Exception as e:
            failed_extractions.append({
                "job_id": job["id"],
                "error_type": type(e).__name__,
                "message": str(e),
                "chunk_index": chunk["chunk_index"],
            })

    # Rate limit compliance — mandatory 4s delay between chunks
    time.sleep(4)
```

**CRITICAL — betas flag placement**:

```python
# CORRECT — betas at top level
client.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],   # <-- here
    response_format=JobEnrichment,
    ...
)

# WRONG — betas inside params (silent failure, schema ignored)
client.messages.parse(
    model="claude-sonnet-4-5",
    params={"betas": ["structured-outputs-2025-11-13"]},  # NEVER
    ...
)
```

**Step 4 — Calculate extraction_stats**

```python
total = len(extraction_results) + len(failed_extractions)
success = len(extraction_results)
failed = len(failed_extractions)
high_confidence_rate = f"{(success / total * 100):.1f}%" if total > 0 else "N/A"

extraction_stats = {
    "total": total,
    "success": success,
    "failed": failed,
    "high_confidence_rate": high_confidence_rate,
}
```

**Step 5 — Return results**

Return `extraction_results` (dict of `job_id -> ai_fields`) and `extraction_stats`.

---

## Extraction System Prompt (full text)

```
You are a precise data extractor for job postings.

Rules:
- Only extract information explicitly stated in the text
- Return null for any field not clearly mentioned — do not infer or guess
- ai_key_skills: only named technologies/tools/frameworks explicitly listed
- ai_experience_level: normalize to exactly: "junior"|"mid"|"senior"|"staff"|"principal"|null
- ai_salary_minvalue: extract number only if explicit salary mentioned; null for "competitive salary"
- remote_derived: true only if "remote" explicitly stated; null if ambiguous
- domain_derived: extract from company URL if visible in description; else null
- countries_derived: include "United States" if US-based role is explicit
```

---

## Output Format

```yaml
extraction_results:
  "<job_uuid>":
    ai_key_skills: list[str]
    ai_keywords: list[str]
    ai_experience_level: "junior"|"mid"|"senior"|"staff"|"principal"|null
    ai_core_responsibilities: str|null
    ai_requirements_summary: str|null
    ai_salary_minvalue: float|null
    ai_salary_unittext: "HOUR"|"YEAR"|null
    remote_derived: bool|null
    domain_derived: str|null
    locations_derived: list[str]
    cities_derived: list[str]
    regions_derived: list[str]
    countries_derived: list[str]

extraction_stats:
  total: int
  success: int
  failed: int
  high_confidence_rate: "X.X%"
```

---

## Output Example

```yaml
extraction_results:
  "3f8a1c2d-4e5b-6789-abcd-ef0123456789":
    ai_key_skills: ["Python", "Apache Spark", "Kafka", "dbt", "AWS"]
    ai_keywords: ["data pipeline", "streaming", "cloud platform", "distributed systems"]
    ai_experience_level: "senior"
    ai_core_responsibilities: "Design and maintain large-scale data pipelines using Spark and Kafka; collaborate with platform team on infrastructure improvements."
    ai_requirements_summary: "5+ years of Python experience, strong SQL skills, familiarity with AWS, experience with Apache Spark and Kafka required."
    ai_salary_minvalue: 170000.0
    ai_salary_unittext: "YEAR"
    remote_derived: true
    domain_derived: null
    locations_derived: []
    cities_derived: []
    regions_derived: []
    countries_derived: []

  "7b2e9f3a-1d4c-5678-bcde-f01234567890":
    ai_key_skills: ["PyTorch", "TensorFlow", "BigQuery", "Python"]
    ai_keywords: ["machine learning", "recommendations", "model deployment", "large-scale data"]
    ai_experience_level: "senior"
    ai_core_responsibilities: "Build and deploy ML models for recommendations infrastructure; work with large-scale data in BigQuery; collaborate with data science team."
    ai_requirements_summary: "Experience with PyTorch and TensorFlow, familiarity with BigQuery, background in ML model deployment required."
    ai_salary_minvalue: null
    ai_salary_unittext: null
    remote_derived: null
    domain_derived: "stripe.com"
    locations_derived: ["San Francisco, CA"]
    cities_derived: ["San Francisco"]
    regions_derived: ["CA"]
    countries_derived: ["United States"]

extraction_stats:
  total: 1423
  success: 1411
  failed: 12
  high_confidence_rate: "99.2%"
```

---

## Quality Criteria

- [ ] Schema validation 100% — format guaranteed by structured outputs + Pydantic
- [ ] `ai_experience_level` only in: `junior / mid / senior / staff / principal / null` for all records
- [ ] Rate limit errors: 0 (chunk_size=15 and 4s delay enforced throughout)
- [ ] All failed extractions logged with `job_id`, `error_type`, `chunk_index`, and error `message`
- [ ] `betas=["structured-outputs-2025-11-13"]` present at top level for every API call
- [ ] `null` returned for fields not explicitly stated — no inference or guessing

---

## Veto Conditions

1. **`failed > 20% of total`** — Abort and surface error. Possible causes: invalid `ANTHROPIC_API_KEY`, malformed prompt, schema mismatch, or API outage. Do not proceed to update step with incomplete data.

2. **Anthropic API authentication fails** (`AuthenticationError`) — Abort immediately. Log: `"ANTHROPIC_API_KEY invalid or missing. Check environment variable."` Do not attempt retries on auth failure.
