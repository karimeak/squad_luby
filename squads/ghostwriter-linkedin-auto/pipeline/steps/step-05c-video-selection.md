---
step: step-05c-video-selection
name: Selecao de Collaborators para Video (Rotacao Random sem Repeticao)
type: agent
agent: lucas
execution: inline
---

# Step 05c — Selecao de Collaborators para Video

## Objetivo
Lucas seleciona **2 collaborators** dessa run para receberem video (alem do post). A selecao usa rotacao random **sem repeticao**: collaborators que nunca receberam video tem prioridade; bilingues recebem alternadamente PT-BR e EN-US conforme historico em `video_rotation_linkedin`. Os outros collaborators continuam recebendo apenas post + imagem (fluxo padrao).

> Este step roda **1x por run** (nao por collaborator). E executado APOS a humanizacao (step-05b) ter terminado para todos os collaborators, e ANTES da geracao de video (step-05d).

## Instrucoes para Lucas

### Input
- `collaborator-queue.json` (output do step-00) — lista completa de collaborators com `id`, `name`, `flavor`, `language` (array)
- `pipeline/data/supabase-config.json` — URL e anon_key
- `pipeline/data/video-config.json` — campo `videos_per_run` (default: 2)

### Processo

#### 1. Ler video-config.json

```bash
VIDEOS_PER_RUN=$(cat pipeline/data/video-config.json | node -e "console.log(JSON.parse(require('fs').readFileSync(0,'utf8')).videos_per_run || 2)")
```

#### 2. Fetch historico da rotacao

```bash
SUPABASE_URL="<supabase_url>"
ANON_KEY="<supabase_anon_key>"

curl -s "${SUPABASE_URL}/rest/v1/video_rotation_linkedin?select=collaborator_id,language,generated_at,status&order=generated_at.desc" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

> Considera-se "ja recebeu video" qualquer row com `status='uploaded'`. Rows com `status='failed'` ou `'pending'` NAO contam (collaborator pode ser re-tentado).

#### 3. Calcular ranking de selecao

Para cada collaborator no `collaborator-queue.json`:

a) **Contar videos uploaded** desse collaborator:
   - `videos_uploaded_count = COUNT(rows WHERE collaborator_id = X AND status = 'uploaded')`

b) **Pegar timestamp do ultimo video uploaded** (NULL se nunca recebeu):
   - `last_uploaded_at = MAX(generated_at WHERE collaborator_id = X AND status = 'uploaded')`

c) **Ordenar collaborators** por:
   1. `videos_uploaded_count ASC` (quem recebeu menos vem primeiro)
   2. `last_uploaded_at NULLS FIRST, ASC` (nunca recebeu > recebeu ha mais tempo)
   3. **Dentro do mesmo bucket**, embaralhar com seed do `RUN_DATE` para variar entre runs

#### 4. Selecionar os top N

Pegar os primeiros `VIDEOS_PER_RUN` (default 2) collaborators do ranking.

#### 5. Decidir lingua para cada selecionado

Para cada collaborator selecionado:

- **Se `language = ['pt-br']`** (monolingue PT) → video em `pt-br`
- **Se `language = ['en-us']`** (monolingue EN) → video em `en-us`
- **Se `language = ['pt-br','en-us']` ou `['en-us','pt-br']`** (bilingue):
  1. Buscar a ultima row em `video_rotation_linkedin` desse collaborator com `status='uploaded'`
  2. Se ultima foi `pt-br` → agora `en-us`
  3. Se ultima foi `en-us` → agora `pt-br`
  4. Se nunca recebeu video → default = primeiro elemento do array `language[0]`

#### 6. Inserir rows pending em video_rotation_linkedin

Para cada selecionado, **insert** uma row com `status='pending'`:

```bash
RUN_ID="<YYYY-MM-DD-HH-MM>"

curl -X POST "${SUPABASE_URL}/rest/v1/video_rotation_linkedin" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "collaborator_id": "<uuid>",
    "language": "<pt-br|en-us>",
    "status": "pending",
    "run_id": "<run_id>"
  }'
```

Capturar o `id` retornado (uuid da nova row) — sera usado pelo step-05d para PATCH posterior.

#### 7. Produzir video-queue.json

Salvar `video-queue.json` no diretorio de output do run:

```json
[
  {
    "collaborator_id": "uuid",
    "name": "Wagner Lopes",
    "role": "...",
    "flavor": "...",
    "language": "pt-br",
    "rotation_row_id": "uuid-da-row-pending",
    "selection_reason": "never_received_video | bilingual_alternating | rotation_oldest"
  },
  {
    ...
  }
]
```

#### 8. Produzir relatorio video-selection-report.md

```markdown
# Video Selection Report — {RUN_DATE}

## Configuracao
- videos_per_run: {N}
- Total collaborators na fila: {total}
- Historico consultado: {total_rows} rows em video_rotation_linkedin

## Ranking (top 5 — primeiros {N} foram selecionados)

| # | Collaborator | uploaded_count | last_uploaded_at | language array | selecionado? | lingua atribuida |
|---|---|---|---|---|---|---|
| 1 | ... | 0 | NULL | ['pt-br'] | ✓ | pt-br |
| 2 | ... | 0 | NULL | ['pt-br','en-us'] | ✓ | en-us (alternando) |
| 3 | ... | 1 | 2026-04-30 | ['en-us'] | - | - |

## Selecionados ({N})
- {name1} ({language1}) — motivo: {reason}
- {name2} ({language2}) — motivo: {reason}

## Rows pending criadas
- {row_id_1} — {collaborator_id_1} — {language1}
- {row_id_2} — {collaborator_id_2} — {language2}
```

### Regras
- NUNCA selecionar collaborators que nao estao no `collaborator-queue.json` desta run
- Se `videos_per_run > total_collaborators` na fila, selecionar todos disponiveis (nao explodir)
- Bilingue conta como **1 slot** (recebe 1 video por run, alternando lingua)
- Se um bilingue nunca recebeu video, default usa `language[0]` (primeiro elemento do array)
- Se a tabela `video_rotation_linkedin` esta vazia, ranking inicial e ordem alfabetica do nome (com seed = RUN_DATE)

### Verificacao
- [ ] `videos_per_run` lido corretamente
- [ ] Historico carregado do Supabase
- [ ] Ranking calculado corretamente (uploaded_count + last_uploaded_at)
- [ ] N selecionados com lingua atribuida
- [ ] N rows inseridas em video_rotation_linkedin com status=pending
- [ ] `video-queue.json` gerado
- [ ] `video-selection-report.md` gerado

### Output
- `video-queue.json` no diretorio de output do run (1 arquivo, nao por collaborator)
- `video-selection-report.md` no mesmo diretorio
- N rows pending na tabela `video_rotation_linkedin`

## Next
step-05d-video-generation (Cleidim aciona luby-video-machine para os N collaborators selecionados)
