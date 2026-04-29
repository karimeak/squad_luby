---
task: "Update raw_payload with AI Fields"
order: 3
input: |
  - extraction_results: Dict of job_id (uuid) -> ai_* fields from extract-fields task
  - supabase_connection: Active Supabase client for project pbvjsixlqnuzcnqahbxu
output: |
  - update_stats: {total_updates, success, failed, skipped}
  - sample_enriched_jobs: 3 sample records for checkpoint display
  - analyst_samples_file: Written to squads/hunter-squad/output/analyst-samples.json
---

# Update raw_payload with AI Fields

Merges extracted `ai_*` fields into each record's `raw_payload` column using a PostgreSQL JSONB merge operation. The original `raw_payload` data is preserved — only the `ai_*` fields are added/updated.

## Process

1. Initialize Supabase client with `ClientOptions(postgrest_client_timeout=30)`
2. For each `job_id` in `extraction_results`:
   a. Build `ai_fields` dict from the extracted data
   b. Execute JSONB merge update:
      ```sql
      UPDATE apify_jobs
      SET raw_payload = raw_payload || ai_fields::jsonb
      WHERE id = '{job_id}'
      ```
      Via Python SDK: `supabase.table("apify_jobs").update({"raw_payload": supabase.rpc("jsonb_merge", ...)}).eq("id", job_id).execute()`
      Or simpler: fetch current raw_payload, merge dicts in Python, then update
   c. Track success/failure per record
   d. On failure: log `{job_id, error_type, message}` — do NOT abort batch
3. After all updates: fetch 3 random successfully-updated records as sample
4. Build `update_stats` with totals
5. Write sample to `squads/hunter-squad/output/analyst-samples.json`

## Output Format

```yaml
update_stats:
  total_updates: int
  success: int
  failed: int
  skipped: int  # records where extraction_results had no data

sample_enriched_jobs:
  - id: "uuid"
    source: "remoteok"
    title: "Senior Data Engineer"
    company: "Stripe"
    ai_key_skills: ["Python", "Spark", "Kafka", "AWS", "Airflow"]
    ai_experience_level: "senior"
    ai_core_responsibilities: "Design and maintain..."
    ai_requirements_summary: "5+ years experience..."
    ai_salary_minvalue: 180000
    ai_salary_unittext: "YEAR"
    remote_derived: true
    domain_derived: "stripe.com"
    locations_derived: ["United States"]
    countries_derived: ["United States"]
    extraction_confidence: "high"
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
  "failed_records": [
    {"job_id": "550e8400-e29b-41d4-a716-446655440001", "error_type": "ConnectionTimeout", "message": "Read timeout after 30s"},
    {"job_id": "550e8400-e29b-41d4-a716-446655440002", "error_type": "InvalidUUID", "message": "Invalid UUID format"}
  ],
  "sample_enriched_jobs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "source": "remoteok",
      "title": "Senior Data Engineer",
      "company": "Stripe",
      "ai_key_skills": ["Python", "Spark", "Kafka", "dbt", "Airflow", "AWS", "Redshift"],
      "ai_keywords": ["data pipeline", "real-time processing", "distributed systems"],
      "ai_experience_level": "senior",
      "ai_core_responsibilities": "Design and maintain data pipelines processing billions of events daily. Lead technical roadmap for data infrastructure.",
      "ai_requirements_summary": "5+ years data engineering. Proficiency in Python and Spark. Experience with Kafka. AWS infrastructure.",
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
      "ai_core_responsibilities": "Research and develop ML systems for AI safety. Build training infrastructure for large language models.",
      "ai_requirements_summary": "PhD or equivalent experience in ML. Strong Python and PyTorch. Experience training large models.",
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
      "company": "Acme Corp",
      "ai_key_skills": ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker"],
      "ai_keywords": ["REST API", "microservices", "scalability"],
      "ai_experience_level": "mid",
      "ai_core_responsibilities": "Build and maintain backend services for B2B SaaS platform.",
      "ai_requirements_summary": "3+ years backend experience. Strong TypeScript/Node.js. Familiarity with cloud infrastructure.",
      "ai_salary_minvalue": null,
      "ai_salary_unittext": null,
      "remote_derived": true,
      "domain_derived": "acmecorp.com",
      "locations_derived": ["United States"],
      "cities_derived": [],
      "regions_derived": [],
      "countries_derived": ["United States"],
      "extraction_confidence": "medium"
    }
  ]
}
```

## Quality Criteria

- [ ] JSONB merge preserves all existing `raw_payload` fields (no original data lost)
- [ ] `update_stats.success + failed + skipped == total_updates`
- [ ] `sample_enriched_jobs` has exactly 3 records (or all available if < 3)
- [ ] `analyst-samples.json` written successfully to output directory
- [ ] All failed records logged with `job_id`, `error_type`, and `message`

## Veto Conditions

Reject and redo if ANY are true:
1. `success == 0` AND `total_updates > 0` — all updates failed, likely Supabase connection error; abort with error
2. `analyst-samples.json` write fails AND `success > 0` — re-attempt file write; if still fails, log warning and continue (data already in DB)
