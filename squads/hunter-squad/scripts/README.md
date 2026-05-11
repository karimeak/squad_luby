# Hunter Squad — Scripts e Workflow Adaptativo

Esta pasta contém os scripts canônicos do Hunter Squad. Cada run do pipeline
copia esses arquivos para `output/{run_id}/v1/` e patcha `BASE_DIR` antes de executar.

## Scripts canônicos

| Arquivo | Propósito |
|---|---|
| `scraper.py` | Sandro Scout — Playwright stealth + per-site extractors + generic fallback chain |
| `normalize.py` | Natália Norm — URL canonicalization + SHA-256 dedup + Path 1/Path 2 routing |
| `ingest_bronze.py` | Inês Insert — RPC `ingest_apify_jobs_bronze` com telemetria pre/post snapshot |
| `wellfound-login.py` | Renovação manual da sessão persistente do wellfound (a cada ~30 dias) |
| `inspect_site.py` | **DOM inspector**: dumpa candidate selectors de qualquer site (Fase 5.1) |
| `smoke_test_site.py` | **Smoke test**: roda scraper só em 1 site, valida selectors antes de full run |

---

## Sistema adaptativo de selectors (Fase 5.1, 2026-05-11)

### Como funciona

Quando um site quebra (DOM mudou, selector parou de funcionar), você NÃO precisa
editar `scraper.py`. Em vez disso, atualize `hunter_sites.config.selectors` no
Supabase. O scraper lê esse campo em runtime via `resolve_site_spec()`.

**Ordem de precedência** (por-key, mais alta vence):

1. `hunter_sites.config.selectors` (DB JSONB — sem deploy)
2. `SITE_SPECIFIC_SELECTORS[site_name]` (hardcoded em `scraper.py`)
3. Generic best-effort (parade de seletores comuns + `extract_generic_best_effort`)

Merge é por-chave: se o DB define só `title_regex`, o resto vem do hardcoded.

### Schema de `config.selectors`

```json
{
  "card":            "[role='article']",                  // CSS — container do job
  "title":           "h4",                                // CSS — relativo ao card
  "title_regex":     "Apply Now\\s+(\\S[^\\n]+)",         // alternativa: regex em inner_text
  "url":             "a[href*='/job/']",                  // CSS, ou "self" se card é o link
  "url_origin":      "https://example.com",               // base para hrefs relativos
  "company":         "a[data-cy='company']",              // CSS
  "company_fallback":"Site Name",                         // string usada se selector retorna ""
  "company_from_link_slug": false,                        // bool — extrai company da URL /company/{slug}
  "location":        "[class*='location']",
  "posted_at":       "time[datetime]",
  "no_extractable_url": false,                            // bool — sintetiza URL fake p/ sites Angular
  "requires_us_geolocation": false,                       // bool — força geo US (getgreatcareers)
  "recommend_disable": false,                             // bool — short-circuit sem network
  "investigation_failed": "razão"                         // texto explicando "site morto"
}
```

**Prioridade de extração de title** (em ordem):
1. `title_regex` aplicado a `card.inner_text()` (capture group 1)
2. `title` selector via `safe_text` (truncado a 200 chars)
3. Fallback: primeira linha de `card.inner_text()`

---

## Workflow: fixar um site quebrado

### 1. Diagnóstico — rodar inspector

```bash
python squads/hunter-squad/scripts/inspect_site.py <site_name>
# ou pra todos os 7 sites quebrados conhecidos:
python squads/hunter-squad/scripts/inspect_site.py all
```

O inspector:
- Carrega a URL com Playwright stealth
- Testa ~30 seletores candidatos (a[href*='/job/'], [data-testid*='card'], etc.)
- Retorna count + sample text + sample hrefs pra cada um
- Identifica title candidates dentro do top card
- Output: `squads/hunter-squad/_investigations/inspect-<site>-<ts>.json`

### 2. Análise — escolher card+title selector

Da saída do inspector, escolha um candidato com:
- count ≥ 5 (várias cards na página)
- sample_text não vazio
- sample_href contendo path consistente (`/job/`, `/jobs/`, `/posting/`, etc.)

Se o texto vier concatenado (e.g. `"Company\nApply Now\nTitle\nLocation"`), use
`title_regex` em vez de `title` selector — capture group 1 = título.

### 3. Aplicar config no DB

```sql
UPDATE hunter_sites SET config = jsonb_set(config, '{selectors}', '{
  "card":  "...",
  "title": "...",
  "url":   "self",
  "url_origin": "https://..."
}'::jsonb)
WHERE name = '<site_name>';
```

Ou para alterar uma chave específica:
```sql
UPDATE hunter_sites SET config = jsonb_set(config, '{selectors,title_regex}',
  to_jsonb('Apply Now\s+(\S[^\n]+)'::text))
WHERE name = '<site_name>';
```

### 4. Validar — smoke test

```bash
python squads/hunter-squad/scripts/smoke_test_site.py <site_name>
```

O smoke test:
- Lê o `hunter_sites` row direto do Supabase (config atualizada)
- Roda `scrape_single_site` isoladamente (sem o resto do pipeline)
- Imprime: jobs_extracted, sample title/company/url
- NÃO escreve em bronze — totalmente seguro

Critério de aceitação: `jobs_extracted > 0` E títulos parecem limpos.

### 5. Próximo run pipeline

Próxima execução do `/opensquad run hunter-squad` automaticamente pega a config
nova (sem reload de código).

---

## Detecção de anti-bot (Fase 5.1)

A detecção antiga (`"captcha" in page_sample`) era muito agressiva e gerava
falsos positivos em sites que apenas mencionam a palavra "captcha" em scripts CDN
ou class names. A nova detecção (2026-05-11) requer marcadores explícitos:

**Cloudflare challenge** (qualquer match dispara):
- `"just a moment..."`
- `"checking your browser before"`
- `"<title>just a moment"`
- `"cf-mitigated"`, `"cf_chl_opt"`
- `"ray id:"`
- `"please complete the security check"`

**CAPTCHA widget** (precisa estar no DOM, não só keyword):
- `div.g-recaptcha` ou `iframe[src*='recaptcha/api2']`
- `div.h-captcha` ou `iframe[src*='hcaptcha.com']`
- `"press and hold to confirm"` no texto

Se nenhum disparar, o scraper procede para extração mesmo que keywords genéricas
apareçam (e.g. workingnomads que tinha "captcha" em algum lugar do bundle mas
servia conteúdo normal).

---

## Sites com config DB ativa (2026-05-11)

| Site | card | title strategy | jobs extraídos em smoke test |
|---|---|---|---|
| dice | `[role="article"]` | `title_regex: Apply Now[\s\|]+(\S[^\n\|]*[A-Za-z])` | 11/23 (48%) |
| workingnomads | `a[href*="/jobs/"]` | `title: h4` | 13/50 (26%) |

## Sites ainda quebrados (precisam investigação manual)

| Site | Problema | Próximo passo |
|---|---|---|
| getgreatcareers | Angular `<gc-jobs-tile>` não renderizou no inspector | Aumentar wait + reinspect com geo US |
| theladders | Página default é landing, não listing | URL precisa params + SPA wait |
| hiretechladies | 34 hrefs encontrados mas inner_text vazio | SPA precisa probe mais fundo |
| myvisajobs | Login wall (`requires_auth`) | Implementar login persistente |
| h1bdata | Não é job board (database de salários) | Disabled permanentemente |

## Sites desabilitados em 2026-05-11

datayoshi, h1bgrader, upwork, fiverr_pro (anti-bot 403); jobspresso, powertofly
(CAPTCHA); womenwhocode (503); hackajob (404); triplebyte (CERT); flexjobs
(HTTP2). Total ativo: 28 (de 45 originais).
