---
type: checkpoint
---

# Step 02: 🛑 Aprovação — Iniciar Scraping?

## Instructions

Read `squads/hunter-squad/output/sites-config.json` and present a formatted summary to the user before proceeding.

### Summary to Display

**1. Sites por Tier**

Show a Markdown table:

| Tier   | Sites | Max Pages / Site | Throttle Típico |
|--------|-------|-----------------|-----------------|
| tier1  | N     | 10              | ~1.0s           |
| tier2  | N     | 10              | ~1.2s           |
| tier3  | N     | 5               | ~1.0s           |
| tier4  | N     | 5               | ~1.0s           |
| tier5  | N     | 2               | ~1.0s           |
| **Total** | **N** | —            | —               |

Fill counts from `sites-config.json`.

**2. Sites Pulados (requires_auth)**

List each entry in `skipped[]`:
- `{name}` — `{base_url}` — motivo: autenticação necessária

**3. Estimativa**

- Tempo estimado: **{estimated_minutes} minutos**
- Volume esperado (bruto): **3.000–8.000 vagas brutas** antes de filtragem
- Data de corte: `{cutoff_date}`

---

### Opções de Aprovação

Apresente as opções como lista numerada:

```
1. ✅ Iniciar scraping — continuar para o Step 03 (Sandro Scout)
2. 🔍 Ver lista completa de sites — exibir tabela com todos os 43 sites antes de decidir
3. ❌ Cancelar pipeline — abortar execução
```

### Comportamento por Resposta

- **Opção 1 — Aprovação:** Continuar imediatamente para o Step 03.
- **Opção 2 — Ver lista completa:** Exibir uma tabela Markdown com todas as entradas do array `sites[]` (name, base_url, scraper_type, priority, tier, max_pages). Em seguida, reapresentar as 3 opções acima e aguardar nova resposta.
- **Opção 3 — Cancelar:** Abortar o pipeline. Exibir mensagem: `"Pipeline cancelado pelo usuário no Step 02."`
