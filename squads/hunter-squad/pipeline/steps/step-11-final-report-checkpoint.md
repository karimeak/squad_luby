---
type: checkpoint
---

# Step 11: 🛑 Relatório Final

Pipeline concluído! Revise os resultados desta execução.

## Instructions

Read `squads/hunter-squad/output/run-log.json` and display the full execution report:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 Hunter Squad — Relatório de Execução
  {run_at} | Duração: {duration_minutes} min
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCRAPING
  Sites tentados:     {sites_succeeded + sites_failed + sites_skipped_auth}
  Sites com sucesso:  {sites_succeeded} ({pct}%)
  Sites pulados:      {sites_skipped_auth} (requires_auth)
  Sites com erro:     {sites_failed}

  Vagas brutas coletadas:    {raw_collected}
  Após filtro de data:       {after_date_filter}
  Após filtro de título:     {after_title_filter}
  Após deduplicação:         {after_dedup}

BANCO DE DADOS
  Bronze inseridos:          {bronze_inserted}
  Duplicatas ignoradas:      {bronze_skipped_duplicates}
  
  Analyst enriquecidos:      {analyst_enriched}
  Falhas de extração:        {analyst_failed}
  
  Silver promovidos:         {silver_promoted}
  Targets novos:             {targets_new}
  Targets atualizados:       {targets_updated}
  Target jobs refresh:       {target_jobs_refreshed}

ERROS REGISTRADOS
  {for each error: "- {site}: {error_type} — {message}"}

last_run_at atualizado para {len(last_run_at_updated)} sites ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Opções:**
1. ✅ Concluído
2. 💾 Caminho do relatório: squads/hunter-squad/output/run-log.json
3. 🔍 Ver detalhes de erros dos sites com falha

On option 1: pipeline complete
On option 2: display the full path and confirm the file was written
On option 3: display full error details from the errors array in run-log.json
