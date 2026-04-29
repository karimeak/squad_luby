---
type: checkpoint
---

# Step 05: 🛑 Aprovação — Inserir no Banco?

Antes de inserir no Supabase, revise os totais coletados e confirme a ingestão.

## Instructions

Read `squads/hunter-squad/output/normalized-batch.json` and display:

**Resumo da Coleta:**
Show a table with the top 10 sites by job count, sorted descending:

| Site | Vagas coletadas | Após filtro |
|------|----------------|-------------|
| remoteok | 312 | 187 |
| wellfound | 518 | 312 |
| ... | ... | ... |

**Totais do pipeline:**
- Vagas brutas coletadas: {total_raw}
- Após filtro de data (7 dias): {after_date_filter}
- Após filtro de título (90+ cargos): {after_title_filter}
- Após deduplicação intra-batch: {after_dedup} ({dedup_rate} duplicatas)
- Sites com erro: {list of failed sites with error type}

**Destino:** `apify_jobs` no Supabase `pbvjsixlqnuzcnqahbxu`

**Opções:**
Present these options to the user:
1. ✅ Confirmar ingestão no Supabase ({after_dedup} vagas)
2. 🔄 Ver lista completa de vagas por site
3. ❌ Cancelar pipeline

On option 1: proceed to Step 06
On option 2: display full per_site_stats table from scraped-jobs.json, then ask again
On option 3: abort pipeline, inform user no data was written to Supabase
