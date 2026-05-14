---
step: step-08-save-to-supabase
name: Salvar no Supabase (language-aware + video_url)
type: agent
agent: lucas
execution: inline
---

# Step 08 — Salvar no Supabase

## Objetivo
Lucas salva os posts revisados na tabela `bloggers` do Supabase para cada collaborator — **apenas nas linguas-alvo** do collaborator (campo `languages` em `collaborator-queue.json`). Quando o collaborator foi selecionado pela rotacao (step-05c) e o video foi gerado com sucesso (step-05d), tambem popula `video_url` na row correspondente. Os posts ficam com `submitted_content = false` ate o envio via edge function.

## Instrucoes para Lucas

### Input
- `collaborator-queue.json` — `languages`, `id`, `flavor` por collaborator
- `{name}/humanized-post-en.md` — **se `"en-us"` em languages**
- `{name}/humanized-post-pt.md` — **se `"pt-br"` em languages**
- `{name}/image-suggestion-en-us.md` — **se `"en-us"` em languages** (campo `**Image URL:**`)
- `{name}/image-suggestion-pt-br.md` — **se `"pt-br"` em languages` (campo `**Image URL:**`)
- `{name}/video-confirmation.md` — **apenas se collaborator foi selecionado pelo step-05c** (campos `Language`, `Status`, `Public URL`)
- `pipeline/data/supabase-config.json` — URL e anon_key

### Processo

Para cada collaborator processado:

#### 1. Carregar dados base

Ler `collaborator-queue.json` → extrair `id`, `languages`, `flavor`, `name`.

Se existe `video-confirmation.md` na pasta do collaborator, parsear:
- `VIDEO_LANG` = lingua do video gerado (`pt-br` ou `en-us`)
- `VIDEO_STATUS` = `uploaded` ou `failed`
- `VIDEO_URL` = URL publica (so se status=uploaded; senao tratar como null)

Se nao existe `video-confirmation.md`: collaborator nao foi selecionado pra video — `VIDEO_URL = null` para ambas as linguas.

#### 2. Para cada lingua-alvo do collaborator

Loop em `languages` array. Para cada `LANG` (`pt-br` ou `en-us`):

a) **Ler post da lingua**: `humanized-post-{lang_short}.md`
   - `pt-br` → `humanized-post-pt.md`
   - `en-us` → `humanized-post-en.md`

b) **Ler image_url da lingua**: `image-suggestion-{LANG}.md`
   - Localizar linha que comeca com `**Image URL:**`
   - Extrair URL (ou null se ausente/upload falhou)

c) **Decidir video_url para esta row**:
   - Se `LANG == VIDEO_LANG` AND `VIDEO_STATUS == "uploaded"` → `video_url = VIDEO_URL`
   - Caso contrario → `video_url = null`

d) **Inserir row em bloggers**:

```bash
curl -X POST "${SUPABASE_URL}/rest/v1/bloggers" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "collaborator_id": "<uuid>",
    "content": "<post completo - escaped>",
    "image_url": "<url ou null>",
    "video_url": "<url ou null>",
    "submitted_content": false
  }'
```

Capturar `id` da row retornada.

#### 3. Se a row tem video_url, atualizar video_rotation_linkedin com blogger_id

Apos inserir a row em bloggers que recebeu o video_url, fazer PATCH na row pendente:

```bash
# ROW_ID vem do video-confirmation.md (campo "video_rotation_linkedin row_id")
curl -X PATCH \
  "${SUPABASE_URL}/rest/v1/video_rotation_linkedin?id=eq.${ROW_ID}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"blogger_id":"<id da row de bloggers que ficou com o video_url>"}'
```

> Isso fecha o link bidirecional video_rotation_linkedin ↔ bloggers.

#### 4. Verificar insercoes

O retorno de cada POST com `Prefer: return=representation` traz a row criada. Validar que `id` existe.

#### 5. Produzir confirmacao

```markdown
# Save Confirmation — {name}

- Languages-alvo: {languages array}
- Rows inseridas em bloggers:
  - blogger_id (en-us): {id} | chars: {count} | image_url: {OK|null} | video_url: {OK|null}
  - blogger_id (pt-br): {id} | chars: {count} | image_url: {OK|null} | video_url: {OK|null}
- Video selecionado: {sim|nao}
- Video lingua: {pt-br|en-us|n/a}
- Video status: {uploaded|failed|n/a}
- video_rotation_linkedin row_id: {id|n/a}
- video_rotation_linkedin.blogger_id PATCH: {OK|n/a|skipped}
- submitted_content: false (aguardando edge function)
- Timestamp: {ISO datetime}
```

> Se o collaborator e monolingue, so 1 row de blogger e listada. Se bilingue, 2.

### Regras
- NUNCA salvar posts que nao passaram pela review (step-05) e humanizacao (step-05b)
- NUNCA criar row de blogger para lingua que NAO esta em `languages`
- `video_url` so popula em **uma** das rows (a da lingua que casou com VIDEO_LANG)
- A outra row (lingua sem video) fica com `video_url = null`
- Se `image_url` falhou pra uma lingua: salvar mesmo assim com `image_url = null`
- Se a insercao falhar (HTTP != 2xx), tentar novamente 1x. Se falhar de novo, registrar erro e continuar
- Escapar corretamente o conteudo JSON (newlines, aspas)

### Output
- `{name}/save-confirmation.md` no diretorio de output do run
- 1-2 rows novas em `bloggers` por collaborator (1 se monolingue, 2 se bilingue)
- 0-1 rows atualizadas em `video_rotation_linkedin` (com `blogger_id` populado)

## Next
step-09-send-email (Lucas envia email com posts/imagens/video real para cada collaborator, respeitando linguas-alvo)
