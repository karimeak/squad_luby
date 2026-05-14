---
step: step-09-send-email
name: Envio de Email para o Collaborator (language-aware + video link)
type: agent
agent: lucas
execution: inline
model_tier: powerful
---

# Step 09 — Envio de Email para o Collaborator

## Objetivo
Lucas envia um email diretamente para o collaborator com o(s) post(s) LinkedIn gerado(s) **apenas nas linguas-alvo** (campo `languages` em `collaborator-queue.json`), a(s) imagem(ens) real(is) que ele postara no LinkedIn (URLs publicas do Supabase Storage, 1 por lingua), o link do video MP4 (apenas se collaborator foi selecionado pelo step-05c E video status=uploaded), e o overview de melhoria do perfil. O envio e exclusivo para o collaborator. A entrega e feita via Supabase Edge Function.

> A imagem do email e a MESMA que sera publicada no LinkedIn. O colaborador decide se aprova/posta com base no que ve no email.
>
> O video, quando incluido, vira um link clicavel (LinkedIn nao permite embed de video em email — o colaborador clica, abre/baixa o MP4, e posta no LinkedIn manualmente).

## Instruções para Lucas

### Input
- `pipeline/data/smtp-config.json` — credenciais Zoho e URL da edge function
- `pipeline/data/supabase-config.json` — URL e anon key do Supabase
- `collaborator-queue.json` — `email`, `name`, `flavor`, `languages` por collaborator
- Para cada collaborator:
  - `{name}/humanized-post-en.md` — **se `"en-us"` em languages**
  - `{name}/humanized-post-pt.md` — **se `"pt-br"` em languages**
  - `{name}/image-suggestion-en-us.md` — **se `"en-us"` em languages** (campo `**Image URL:**`)
  - `{name}/image-suggestion-pt-br.md` — **se `"pt-br"` em languages** (campo `**Image URL:**`)
  - `{name}/video-confirmation.md` — **apenas se collaborator foi selecionado pelo step-05c**
  - `{name}/linkedin-overview.md` — overview de melhoria do perfil
  - `{name}/save-confirmation.md` — IDs Supabase

### Processo

Para cada collaborator processado:

#### 1. Ler todos os arquivos de input

Carregar smtp-config.json e supabase-config.json. Extrair `edge_function_url`, `zoho_user`, `zoho_pass`, `from_name`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

Ler `languages` do collaborator (array).

#### 2. Extrair URLs por lingua

Para cada `LANG` em `languages`:

a) **post_{lang}**: ler `humanized-post-{lang_short}.md` (pt-br→pt, en-us→en)

b) **image_url_{lang}**: parsear `image-suggestion-{LANG}.md`, extrair linha `**Image URL:**`. Se ausente/null, usar `""` (string vazia — edge function omite a tag `<img>`).

#### 3. Extrair video info (se aplicavel)

Se existe `{name}/video-confirmation.md`:
- Parsear `Language` → `VIDEO_LANG`
- Parsear `Status` → `VIDEO_STATUS`
- Parsear `Public URL` → `VIDEO_URL`

Se `VIDEO_STATUS != "uploaded"` ou `Public URL` contem "n/a": tratar como sem video (`video_url = ""`, `video_language = ""`).

Caso contrario: video sera incluido no email. A edge function deve renderizar o link do video apos o post da `VIDEO_LANG` correspondente.

Se nao existe `video-confirmation.md` na pasta do collaborator: collaborator nao foi selecionado, `video_url = ""`.

#### 4. Preparar payload do email

```json
{
  "mode": "linkedin-post",
  "zoho_user": "{smtp-config.zoho_user}",
  "zoho_pass": "{smtp-config.zoho_pass}",
  "from_name": "{smtp-config.from_name}",
  "collaborator_email": "{collaborator.email}",
  "collaborator_name": "{collaborator.name}",
  "flavor": "{collaborator.flavor}",
  "languages": ["pt-br","en-us"],

  "post_en": "{humanized-post-en.md escapado, ou string vazia}",
  "post_pt": "{humanized-post-pt.md escapado, ou string vazia}",

  "image_url_en": "{URL imagem EN ou string vazia}",
  "image_url_pt": "{URL imagem PT ou string vazia}",

  "video_url": "{URL do MP4 ou string vazia}",
  "video_language": "{pt-br|en-us|string vazia}",

  "linkedin_overview": "{linkedin-overview.md escapado}",

  "blogger_id_en": "{id EN do save-confirmation.md ou string vazia}",
  "blogger_id_pt": "{id PT do save-confirmation.md ou string vazia}",
  "run_date": "{YYYY-MM-DD}"
}
```

> A edge function decide quais blocos renderizar com base nos campos vazios:
> - `post_en` vazio → omitir bloco EN inteiro (post + imagem + link video se VIDEO_LANG=en-us)
> - `post_pt` vazio → omitir bloco PT inteiro
> - `image_url_*` vazio → omitir tag `<img>` mas manter o post
> - `video_url` vazio → omitir secao de video
> - `video_language` informa em qual bloco (PT ou EN) renderizar o link de video

#### 5. Chamar a Edge Function

```bash
curl -s -X POST "${edge_function_url}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -d '{payload JSON acima}'
```

Verificar resposta:
- **200/201** → Email enviado com sucesso
- **4xx/5xx** → Logar erro, tentar 1x novamente. Se falhar de novo, registrar `email_failed` e continuar (nao bloquear o pipeline)

#### 6. Atualizar submitted_content no Supabase

Apos envio bem-sucedido, atualizar **todas as rows de bloggers do collaborator nesta run**:

```bash
# Para cada blogger_id (en e/ou pt) presente no save-confirmation.md
curl -s -X PATCH "${SUPABASE_URL}/rest/v1/bloggers?id=eq.${blogger_id}" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"submitted_content": true}'
```

#### 7. Produzir confirmação

```markdown
# Email Delivery — {name}

- Collaborator: {email} — {✓ enviado | ✗ falhou}
- Linguas no email: {languages array}
- Imagem(s):
  - en-us: {URL ou ✗ omitida}
  - pt-br: {URL ou ✗ omitida}
- Video: {URL + lingua | ✗ sem video}
- submitted_content EN: {true ✓ | n/a}
- submitted_content PT: {true ✓ | n/a}
- Timestamp: {ISO datetime}
```

Salvar em `{name}/email-confirmation.md`.

### Regras
- Nunca bloquear o pipeline por falha de email — registrar e continuar
- Nunca enviar para outros destinatarios alem do collaborator.email
- O campo `submitted_content` so deve ser `true` apos confirmacao de envio
- Bloco de uma lingua so renderiza se a lingua esta em `languages` do collaborator
- Link do video so renderiza se `video_url != ""` (collaborator selecionado E upload OK)
- O link do video aparece **apos** o bloco do post da `video_language` correspondente

### Output
- `{name}/email-confirmation.md`

## Next
step-10-delivery (Bruno consolida o resumo final, incluindo metricas de video da run)
