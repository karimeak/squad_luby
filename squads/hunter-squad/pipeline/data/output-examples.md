# Output Examples — Hunter Squad
# Complete, realistic examples of data at each pipeline stage

---

## Example 1: sites-config.json (Marcos Maestro → Scout)

```json
{
  "run_at": "2026-04-28T09:00:00Z",
  "total_sites": 45,
  "active_sites": 43,
  "auth_skip_sites": 1,
  "estimated_minutes": 45,
  "cutoff_date": "2026-04-21T00:00:00Z",
  "job_titles": ["Data Engineer", "Senior Data Engineer", "ML Engineer"],
  "tiers": {
    "tier_1": [
      {"name": "remoteok", "url": "https://remoteok.com/remote-dev-jobs", "scraper_type": "generic_listing", "priority": 100, "max_pages": 10, "throttle_ms": 500},
      {"name": "weworkremotely", "url": "https://weworkremotely.com/categories/remote-programming-jobs", "scraper_type": "generic_listing", "priority": 98, "max_pages": 10, "throttle_ms": 500}
    ],
    "tier_2": [
      {"name": "remotive", "url": "https://remotive.com/remote-jobs/software-dev", "scraper_type": "generic_listing", "priority": 90, "max_pages": 10, "throttle_ms": 1000}
    ]
  },
  "skipped": [
    {"name": "linkedin", "reason": "requires_auth", "priority": 86}
  ]
}
```

---

## Example 2: scraped-jobs.json (Sandro Scout output)

```json
{
  "metadata": {
    "collected_at": "2026-04-28T09:38:22Z",
    "total_raw": 5847,
    "after_date_filter": 4203,
    "after_title_filter": 1892,
    "sites_succeeded": 41,
    "sites_failed": 2,
    "sites_skipped_auth": 1
  },
  "per_site_stats": [
    {"site": "remoteok", "found": 312, "after_filter": 187, "errors": null, "duration_ms": 8400},
    {"site": "weworkremotely", "found": 204, "after_filter": 143, "errors": null, "duration_ms": 6200},
    {"site": "glassdoor", "found": 0, "after_filter": 0, "errors": "timeout after 30s", "duration_ms": 30000},
    {"site": "linkedin", "found": 0, "after_filter": 0, "errors": "skipped: requires_auth", "duration_ms": 0}
  ],
  "jobs": [
    {
      "title": "Senior Data Engineer",
      "company": "Stripe",
      "url": "https://remoteok.com/remote-jobs/data-engineer-stripe-123456",
      "description": "We are looking for a Senior Data Engineer to join our data infrastructure team...",
      "location": "Remote, United States",
      "posted_at": "2026-04-25T14:30:00Z",
      "source": "remoteok",
      "_source_site": "remoteok"
    },
    {
      "title": "ML Engineer",
      "company": "Anthropic",
      "url": "https://wellfound.com/jobs/anthropic-ml-engineer-789012",
      "description": "Anthropic is looking for a Machine Learning Engineer to work on safety research...",
      "location": "Remote",
      "posted_at": "2026-04-24T11:00:00Z",
      "source": "wellfound",
      "_source_site": "wellfound"
    }
  ]
}
```

---

## Example 3: normalized-batch.json (Natália Norm output)

```json
{
  "metadata": {
    "normalized_at": "2026-04-28T09:42:10Z",
    "total_input": 1892,
    "after_intra_batch_dedup": 1847,
    "duplicate_count": 45,
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
        "source": "remoteok"
      },
      "fetched_at": "2026-04-28T09:38:22Z",
      "scrapy_query_id": null
    }
  ]
}
```

---

## Example 4: apify_jobs record after Ana Analyst enrichment

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "source": "remoteok",
  "source_job_id": "123456",
  "url": "https://remoteok.com/remote-jobs/data-engineer-stripe-123456",
  "url_sha256": "a3f5c8d2e1b94067f8a29e3d5c1b7f0e4a2d6c8b9f1e3a5d7c9b0e2f4a6d8c0",
  "fetched_at": "2026-04-28T09:38:22Z",
  "scrapy_query_id": null,
  "raw_payload": {
    "title": "Senior Data Engineer",
    "company": "Stripe",
    "url": "https://remoteok.com/remote-jobs/data-engineer-stripe-123456",
    "description": "We are looking for a Senior Data Engineer to join our data infrastructure...",
    "location": "Remote, United States",
    "posted_at": "2026-04-25T14:30:00Z",
    "source": "remoteok",
    "ai_key_skills": ["Python", "Spark", "Kafka", "dbt", "Airflow", "AWS", "Redshift", "Kubernetes"],
    "ai_keywords": ["data pipeline", "real-time processing", "streaming", "distributed systems"],
    "ai_experience_level": "senior",
    "ai_core_responsibilities": "Design and maintain data pipelines processing billions of events daily. Lead technical roadmap for data infrastructure. Collaborate with ML teams on feature engineering.",
    "ai_requirements_summary": "5+ years data engineering experience. Proficiency in Python and Spark. Experience with streaming systems (Kafka). AWS cloud infrastructure. Strong SQL skills.",
    "ai_salary_minvalue": 180000,
    "ai_salary_unittext": "YEAR",
    "remote_derived": true,
    "domain_derived": "stripe.com",
    "locations_derived": ["United States"],
    "cities_derived": [],
    "regions_derived": [],
    "countries_derived": ["United States"],
    "extraction_confidence": "high"
  }
}
```

---

## Example 5: Final Report (Checkpoint 4)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 Hunter Squad — Relatório de Execução
  2026-04-28 | Duração total: 2h 14min
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCRAPING
  Sites tentados:    45
  Sites com sucesso: 41 (91%)
  Sites pulados:      1 (LinkedIn — requires_auth)
  Sites com erro:     2 (glassdoor: timeout, hiretechladies: 403)

  Vagas brutas coletadas:  5.847
  Após filtro de data:     4.203
  Após filtro de título:   1.892
  Após dedup intra-batch:  1.847

BANCO DE DADOS
  RPC 1 — ingest_apify_jobs_bronze:
    Inseridos:   1.423
    Já existiam:   424
  
  Analyst — Enriquecimento LLM:
    Registros enriquecidos: 1.423
    Falhas de extração:        12
    Confiança alta:           87%
  
  RPC 2 — promote_apify_jobs_to_jobs_analyzed:
    Promovidos para silver: 1.389
    Rejeitados (missing fields): 34
  
  RPC 3 — upsert_targets_from_jobs_analyzed:
    Empresas novas:     47
    Empresas atualizadas: 123
  
  RPC 4 — refresh_target_jobs_all:
    Pivot atualizado: 8.203 registros
    Duração: 94 segundos

ERROS REGISTRADOS
  - glassdoor: Timeout após 30s (3 tentativas)
  - hiretechladies: HTTP 403 Forbidden (1 tentativa)

last_run_at atualizado para 41 sites ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
