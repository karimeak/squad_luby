---
execution: subagent
agent: ana-analyst
model_tier: powerful
inputFile: squads/hunter-squad/output/ingest-result.json
outputFile: squads/hunter-squad/output/analyst-samples.json
---

# Step 07: Ana Analyst — LLM Enrichment

## Context Loading

- `squads/hunter-squad/output/ingest-result.json` — bronze insert result (verify `inserted > 0` before proceeding)
- `squads/hunter-squad/pipeline/data/research-brief.md` — LLM extraction patterns: structured outputs, chunk_size=15, 4s delay, betas flag placement
- `squads/hunter-squad/pipeline/data/quality-criteria.md` — extraction thresholds: ai_key_skills > 85%, experience_level enum compliance, 0 rate limit errors

## Instructions

### Process

1. **TASKS TO RUN IN ORDER**: `chunk-and-batch.md` → `extract-fields.md` → `update-raw-payload.md`
2. Verify `ingest-result.json` exists and `inserted > 0`; if `inserted == 0`, skip enrichment gracefully (no new records)
3. Execute `chunk-and-batch.md`: query Supabase for records WHERE `raw_payload->>'ai_key_skills' IS NULL AND fetched_at >= now() - interval '24 hours'`. Pre-clean HTML from descriptions. Split into chunks of 15.
4. Execute `extract-fields.md`: for each chunk, call `client.messages.parse(model="claude-sonnet-4-5", response_format=JobEnrichment, ...)`. Apply 4-second delay between chunks. Log failed extractions.

   > ⚠️ **CRITICAL BUG NOTICE**: If using the Batch API, the `betas=["structured-outputs-2025-11-13"]` parameter MUST be passed at the top-level `create()` call — NOT inside the `params` dict of individual requests. Placing it inside `params` causes silent failure (GitHub issue #1118).

5. Execute `update-raw-payload.md`: merge extracted `ai_*` fields into `raw_payload` using JSONB merge (`raw_payload || ai_fields::jsonb`). Collect 3 sample enriched records. Write to `squads/hunter-squad/output/analyst-samples.json`.

## Output Format

```json
{
  "update_stats": {
    "total_updates": 1423,
    "success": 1411,
    "failed": 12,
    "skipped": 0
  },
  "sample_enriched_jobs": [
    {
      "id": "uuid",
      "source": "string",
      "title": "string",
      "company": "string",
      "ai_key_skills": ["list of skills"],
      "ai_experience_level": "junior|mid|senior|staff|principal",
      "ai_salary_minvalue": "number or null",
      "ai_salary_unittext": "HOUR|YEAR|null",
      "remote_derived": "bool or null",
      "extraction_confidence": "high|medium|low"
    }
  ]
}
```

## Output Example

```json
{
  "update_stats": {
    "total_updates": 1423,
    "success": 1411,
    "failed": 12,
    "skipped": 0
  },
  "sample_enriched_jobs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "source": "remoteok",
      "title": "Senior Data Engineer",
      "company": "Stripe",
      "ai_key_skills": ["Python", "Spark", "Kafka", "dbt", "Airflow", "AWS", "Redshift"],
      "ai_keywords": ["data pipeline", "streaming", "distributed systems"],
      "ai_experience_level": "senior",
      "ai_core_responsibilities": "Design and maintain data pipelines processing billions of events daily.",
      "ai_requirements_summary": "5+ years data engineering. Python, Spark, Kafka. AWS cloud infrastructure.",
      "ai_salary_minvalue": 180000,
      "ai_salary_unittext": "YEAR",
      "remote_derived": true,
      "domain_derived": "stripe.com",
      "locations_derived": ["United States"],
      "cities_derived": [],
      "regions_derived": [],
      "countries_derived": ["United States"],
      "extraction_confidence": "high"
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "source": "wellfound",
      "title": "ML Engineer",
      "company": "Anthropic",
      "ai_key_skills": ["Python", "PyTorch", "RLHF", "Transformer architectures", "CUDA"],
      "ai_keywords": ["safety research", "language models", "alignment"],
      "ai_experience_level": "senior",
      "ai_core_responsibilities": "Research and develop ML systems for AI safety.",
      "ai_requirements_summary": "PhD or equivalent. Strong Python and PyTorch. Experience training large models.",
      "ai_salary_minvalue": 200000,
      "ai_salary_unittext": "YEAR",
      "remote_derived": true,
      "domain_derived": "anthropic.com",
      "locations_derived": ["United States"],
      "cities_derived": ["San Francisco"],
      "regions_derived": ["California"],
      "countries_derived": ["United States"],
      "extraction_confidence": "high"
    },
    {
      "id": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
      "source": "builtin",
      "title": "Backend Engineer",
      "company": "Linear",
      "ai_key_skills": ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
      "ai_keywords": ["microservices", "REST API", "scalability"],
      "ai_experience_level": "mid",
      "ai_core_responsibilities": "Build and maintain backend services for project management platform.",
      "ai_requirements_summary": "3+ years backend. Strong TypeScript. Familiarity with cloud infrastructure.",
      "ai_salary_minvalue": null,
      "ai_salary_unittext": null,
      "remote_derived": true,
      "domain_derived": "linear.app",
      "locations_derived": ["United States"],
      "cities_derived": [],
      "regions_derived": [],
      "countries_derived": ["United States"],
      "extraction_confidence": "medium"
    }
  ]
}
```

## Veto Conditions

Reject and redo if ANY are true:
1. `ingest-result.json` shows `inserted == 0` — exit gracefully: "No new records to enrich. Bronze ingestion had 0 new inserts."
2. Anthropic API authentication fails (401 error) — abort: "ANTHROPIC_API_KEY not configured or invalid."

## Quality Criteria

- [ ] `ai_experience_level` only contains values from: junior/mid/senior/staff/principal/null
- [ ] Rate limit errors: 0 (chunk_size=15 with 4s inter-chunk delay enforced)
- [ ] `analyst-samples.json` contains exactly 3 enriched job samples
- [ ] Failed extractions logged with `job_id` and `error_type`
