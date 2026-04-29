---
execution: subagent
agent: natalia-norm
model_tier: fast
inputFile: squads/hunter-squad/output/scraped-jobs.json
outputFile: squads/hunter-squad/output/normalized-batch.json
---

# Step 04: Natália Norm — Normalize & Deduplicate

## Context Loading

- `squads/hunter-squad/output/scraped-jobs.json` — raw jobs array from Scout (1,500–8,000 jobs expected)
- `squads/hunter-squad/pipeline/data/domain-framework.md` — bronze schema definition: source, source_job_id, url, url_sha256, raw_payload, fetched_at, scrapy_query_id
- `squads/hunter-squad/pipeline/data/anti-patterns.md` — normalization anti-patterns: never dedup raw URLs, never discard records missing source_job_id

## Instructions

### Process

1. Execute task `normalize-schema.md`: map each raw job to bronze schema. Normalize URL (lowercase + strip trailing slash + remove utm_* params). Compute `url_sha256 = SHA256(normalized_url)`. Set `scrapy_query_id = null` for all records.
2. Execute task `deduplicate.md`: compute dedup key per record. Primary key: `f"{source}::{source_job_id}"` if source_job_id available. Fallback: `f"{source}::{url_sha256}"`. Keep first occurrence per key. Report dedup stats.
3. Execute task `build-batch.md`: validate required fields (source, url, url_sha256, raw_payload). Ensure JSON serializability (convert datetime → ISO string, no Python sets). Split into chunks of 500. Write `normalized-batch.json`.

## Output Format

```json
{
  "metadata": {
    "normalized_at": "ISO-8601 timestamp",
    "total_input": 1892,
    "after_dedup": 1847,
    "duplicate_count": 45,
    "dedup_rate": "2.4%",
    "final_batch_size": 1847,
    "chunks": 4
  },
  "records": [
    {
      "source": "string",
      "source_job_id": "string or null",
      "url": "string (normalized)",
      "url_sha256": "64-char hex string",
      "raw_payload": {"full original job object"},
      "fetched_at": "ISO-8601 UTC",
      "scrapy_query_id": null
    }
  ]
}
```

## Output Example

```json
{
  "metadata": {
    "normalized_at": "2026-04-28T09:45:10Z",
    "total_input": 1892,
    "after_dedup": 1847,
    "duplicate_count": 45,
    "dedup_rate": "2.4%",
    "final_batch_size": 1847,
    "chunks": 4
  },
  "records": [
    {
      "source": "remoteok",
      "source_job_id": "123456",
      "url": "https://remoteok.com/remote-jobs/data-engineer-stripe-123456",
      "url_sha256": "a3f5c8d2e1b94067f8a29e3d5c1b7f0e4a2d6c8b9f1e3a5d7c9b0e2f4a6d8c0",
      "raw_payload": {
        "title": "Senior Data Engineer",
        "company": "Stripe",
        "url": "https://remoteok.com/remote-jobs/data-engineer-stripe-123456",
        "description": "We are looking for a Senior Data Engineer...",
        "location": "Remote, United States",
        "posted_at": "2026-04-25T14:30:00Z",
        "source": "remoteok",
        "_source_site": "remoteok"
      },
      "fetched_at": "2026-04-28T09:38:22Z",
      "scrapy_query_id": null
    },
    {
      "source": "wellfound",
      "source_job_id": null,
      "url": "https://wellfound.com/jobs/anthropic-ml-engineer-789012",
      "url_sha256": "b7e2f4a6d8c0e1b3a5d7c9b0f2e4a6d8c0e1b3a5d7c9b0f2e4a6d8c0e1b3a5",
      "raw_payload": {
        "title": "ML Engineer",
        "company": "Anthropic",
        "url": "https://wellfound.com/jobs/anthropic-ml-engineer-789012",
        "description": "Anthropic is hiring a Machine Learning Engineer...",
        "location": "Remote",
        "posted_at": "2026-04-24T11:00:00Z",
        "source": "wellfound",
        "_source_site": "wellfound"
      },
      "fetched_at": "2026-04-28T09:38:22Z",
      "scrapy_query_id": null
    }
  ]
}
```

## Veto Conditions

Reject and redo if ANY are true:
1. `normalized-batch.json` records array is empty — abort: "Normalization produced zero records. Check scraped-jobs.json integrity."
2. Any record has `url_sha256` length ≠ 64 characters — recompute all hashes before writing

## Quality Criteria

- [ ] All records have `url_sha256` (64-char SHA-256 hex string)
- [ ] `scrapy_query_id = null` for 100% of records
- [ ] No chunks exceed 500 records
- [ ] `metadata.dedup_rate` reported as percentage string
- [ ] `raw_payload` contains full original job object (no fields stripped)
