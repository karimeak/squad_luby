---
step: step-06-image-suggestion
name: Geração de Imagem para o Post (Gemini via Playwright)
type: agent
agent: diana
execution: inline
model_tier: powerful
skills:
  - playwright
---

# Step 06 — Geração de Imagem para o Post (Diana + Gemini) — language-aware

## Objetivo

Diana gera **1 Image Prompt Guide por lingua-alvo** do collaborator (campo `languages` em `collaborator-queue.json`), abre o Google Gemini via Playwright para gerar cada imagem, e faz upload das imagens para o Supabase Storage — sem aprovação humana (pipeline autônomo).

> **Language-aware:** O numero de imagens por collaborator e igual ao tamanho do array `languages`:
> - `languages = ["pt-br"]` → 1 imagem (texto/refs em PT-BR se aparecerem na arte)
> - `languages = ["en-us"]` → 1 imagem (texto/refs em EN-US)
> - `languages = ["pt-br","en-us"]` → 2 imagens (1 por lingua)
>
> Cada imagem usa o `humanized-post-{lang}.md` correspondente como source do prompt visual. Path no bucket inclui o sufixo `-{lang}` para diferenciar.

> **Pollinations.ai está PROIBIDO** (decisão definitiva 2026-05-11). Não construir URL, não fazer fallback, não citar. Toda imagem é gerada exclusivamente via Gemini. Se memórias ou exemplos antigos mencionarem Pollinations, ignorar.
>
> **Playwright MCP está sempre disponível**, inclusive em runs agendados/automatizados (schedulers, /loop, /schedule). O perfil persistente fica em `_opensquad/_browser_profile/` e é compartilhado entre runs interativos e automáticos — nunca assumir que "browser não está disponível" para pular para outra ferramenta. Se Playwright realmente falhar (servidor MCP offline, perfil corrompido), abortar o step com erro claro em vez de cair em alternativa.
>
> **Cadência obrigatória para batches:** 60s entre requests; pausa de 2min a cada 10 imagens em batches > 10; backoff exponencial (60→120→240s, máx 3 tentativas) em caso de erro/recusa do Gemini. Após 3 falhas, registrar `linkedin-image-failed.txt` na pasta do collaborator, deixar `Image URL: null` no `image-suggestion-{lang}.md` e seguir (não bloquear o pipeline, mas NÃO usar Pollinations nem qualquer outro fallback).

Saídas:
1. **Arquivo local** (`linkedin-image.jpg`) — screenshot do Gemini em alta resolução
2. **URL pública** (`image_url`) — mesma imagem no Supabase Storage, usada no email do step-09 e salva no banco no step-08

> A imagem do email é a MESMA que o colaborador deve postar no LinkedIn. Não há mais imagem decorativa separada.

## Inputs

- `collaborator-queue.json` — `languages` (array), `flavor`, `id` do collaborator (para path no bucket)
- `{run_output}/{name}/humanized-post-en.md` — **se `"en-us"` em languages** — post final EN pos-Pedro
- `{run_output}/{name}/humanized-post-pt.md` — **se `"pt-br"` em languages** — post final PT-BR pos-Pedro
- `{run_output}/{name}/research-brief.md` — tema, flavor, indústria do collaborator
- `pipeline/data/supabase-config.json` — URL e anon_key para upload no Storage

---

## PARTE 1 — Image Prompt Guide (Diana)

### 1. Limpeza do material

Ler o post revisado e o research brief. Ignorar hashtags, links, emojis, CTAs genéricos e trechos redundantes. Extrair apenas a essência do conteúdo.

### 2. Leitura estratégica

Identificar:
- Tema principal
- Mensagem central
- Objetivo do post
- Tipo de arte adequada (fluxo, síntese conceitual, arte tech, institucional, comparação, etc.)

### 3. Decisão visual + hierarquia

| Conteúdo | Abordagem visual |
|---|---|
| Processo / etapas sequenciais | Arte de fluxo visual |
| Comparação / antes-depois | Oposição visual clara |
| Opinião forte / insight / tendência | Síntese conceitual |
| Tecnologia / IA / dados / código | Sinais visuais do universo tech |
| Posicionamento institucional | Composição moderna, clean, corporativa |

Regra: 1 ideia dominante + no máximo 2 apoios secundários.

### 4. Gerar o Image Prompt Guide

Produzir um prompt fluido em inglês, **em parágrafo único**, cobrindo obrigatoriamente estas 10 seções:

1. Visual concept — ideia central derivada do tema do post
2. Scene or composition — o que aparece, posicionamento dos elementos
3. Main elements — o que deve estar presente
4. Contextual cues — sinais visuais que conectam ao tema (interfaces, dados, código, etc.)
5. Design direction — estilo (editorial, corporativo, minimalista, etc.)
6. Lighting and mood — iluminação, atmosfera, tom emocional
7. Color palette — cores específicas, combinação, contraste
8. Materials or interface feel — texturas, superfícies (se relevante)
9. Composition quality — enquadramento, proporção, profundidade, respiro
10. Constraints and negatives — o que NÃO deve aparecer

**Negatives obrigatórios (sempre ao final):**
> no text-heavy layout, no long paragraphs, no fake readable typography, no watermark, no extra logos, no distorted anatomy, no deformed hands, no visual clutter, no childish style, no cartoon, no illustration look unless intentionally required, no CGI look, no cheap futuristic effects, no random elements unrelated to the topic, no generic AI aesthetics

**Formato do prompt:** apenas texto inglês corrido. Sem análise, sem título, sem aspas, sem markdown, sem listas.

---

## PARTE 2 — Geração via Google Gemini (Playwright)

### 1. Abrir o Gemini

```
mcp__playwright__browser_navigate → https://gemini.google.com/app
```

Aguardar o textbox "Insira um comando para o Gemini" aparecer no snapshot.

### 2. Digitar o prompt

Usar `mcp__playwright__browser_snapshot` para encontrar o ref do textbox.
Digitar com `mcp__playwright__browser_type` (submit: true):
```
Generate an image using Nano Banana Pro: {image_prompt_guide}
```

> A conta logada no profile (`_opensquad/_browser_profile/`) tem acesso Pro/Workspace. Mencionar "Nano Banana Pro" no prompt sinaliza para o Gemini usar o modelo de imagem premium (`gemini-3-pro-image`) em vez do Nano Banana standard. Sem garantia 100% (Gemini decide na hora), mas costuma respeitar o pedido quando a conta tem acesso. Se a qualidade não estiver melhor que antes, evoluir para selecionar o modelo via UI explicitamente.

### 3. Aguardar a geração

Esperar 20–30 segundos (`mcp__playwright__browser_wait_for`, time: 20).
Confirmar com snapshot: quando aparecerem botões "Boa resposta" / "Compartilhar imagem", a geração está completa.

### 4. Extrair a URL da imagem gerada

```js
// mcp__playwright__browser_evaluate
() => {
  const imgs = document.querySelectorAll('img');
  const results = [];
  imgs.forEach(img => {
    if (img.src && img.src.length > 100 && img.naturalWidth > 100) {
      results.push({ src: img.src, width: img.naturalWidth, height: img.naturalHeight });
    }
  });
  return results;
}
```

Selecionar a primeira imagem com `naturalWidth > 100` (as avatars têm 64px). Modificar o size param da URL: substituir `w200-h200` por `w1200-h1200`.

### 5. Navegar para a URL da imagem e salvar

**IMPORTANTE:** Não usar `fetch()` — causa erro de CORS. Usar navegação direta.

```
mcp__playwright__browser_navigate → {url_com_w1200-h1200}
```

O browser autenticado segue o redirect para a URL final em alta resolução.

```
mcp__playwright__browser_resize → width: 1200, height: 1200
mcp__playwright__browser_take_screenshot → type: jpeg, filename: {run_output}/{name}/linkedin-image.jpg
```

### 6. Verificar

O screenshot retorna a imagem visualmente. Checar:
- [ ] Imagem coerente com o tema do post
- [ ] Qualidade visual aceitável (sem artefatos graves)
- [ ] Tamanho do arquivo > 50KB

Se Gemini recusar o prompt: simplificar e tentar uma vez.

### 7. Fechar o browser

```
mcp__playwright__browser_close
```

---

## PARTE 3 — Upload da imagem para o Supabase Storage

Subir o arquivo `linkedin-image.jpg` para o bucket público `linkedin-ghostwriter-images` e capturar a URL pública. Essa URL é a única referência usada nos próximos steps (banco e email).

### 1. Construir o path do arquivo

Padrão (deterministico, zero risco de colisao de nomes homonimos), **com sufixo de lingua**:
```
{collaborator_uuid}/{YYYY-MM-DD}-{flavor-slug}-{language}.jpg
```

Onde `{language}` e `pt-br` ou `en-us` (igual ao path do video).

- `collaborator_uuid`: campo `id` do colaborador no `collaborator-queue.json` (vem direto da tabela `collaborators`, ja e UUID — sem slug, sem normalizacao)
- `YYYY-MM-DD`: data do run (ex: `2026-05-07`)
- `flavor-slug`: flavor normalizado via comando determinista (ver abaixo)

**Slugify do flavor (uma linha node, NAO LLM):**

```bash
FLAVOR_SLUG=$(node -e "console.log(process.argv[1].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''))" "<flavor>")
```

Exemplos do output (sempre o mesmo dado o mesmo input):
- `"AI Credit"` → `ai-credit`
- `"Modernização de Sistemas"` → `modernizacao-de-sistemas`
- `"DevOps & Cloud"` → `devops-cloud`

> **Por que nao usar nome do colaborador?** UUID elimina ambiguidade entre homonimos e nao depende de regras de slug. O path nunca e lido por humano (so vai em `<img src=>`), entao legibilidade nao importa.

### 2. Upload via curl

Ler `supabase_url` e `supabase_anon_key` do `pipeline/data/supabase-config.json`.

```bash
SUPABASE_URL="<supabase_url>"
ANON_KEY="<supabase_anon_key>"
BUCKET="linkedin-ghostwriter-images"
COLLAB_UUID="<collaborator.id do queue>"
RUN_DATE="<YYYY-MM-DD>"
FLAVOR_SLUG=$(node -e "console.log(process.argv[1].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''))" "<flavor>")
LANG_CODE="<pt-br|en-us>"
PATH_IN_BUCKET="${COLLAB_UUID}/${RUN_DATE}-${FLAVOR_SLUG}-${LANG_CODE}.jpg"
LOCAL_FILE="<run_output>/<name>/linkedin-image-${LANG_CODE}.jpg"

curl -X POST \
  "${SUPABASE_URL}/storage/v1/object/${BUCKET}/${PATH_IN_BUCKET}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: image/jpeg" \
  -H "x-upsert: true" \
  --data-binary "@${LOCAL_FILE}"
```

`x-upsert: true` permite re-runs sobrescreverem a mesma chave. O bucket está restrito a `image/jpeg|png|webp` e 10MB máximo.

### 3. Construir a URL pública

```
{supabase_url}/storage/v1/object/public/linkedin-ghostwriter-images/{collaborator_uuid}/{YYYY-MM-DD}-{flavor-slug}-{language}.jpg
```

Exemplo:
```
https://pbvjsixlqnuzcnqahbxu.supabase.co/storage/v1/object/public/linkedin-ghostwriter-images/8f3a2b1c-4d5e-6f7g-8h9i-0j1k2l3m4n5o/2026-05-07-ai-credit-pt-br.jpg
```

### 4. Verificar acessibilidade

Fazer um `curl -I -o /dev/null -w "%{http_code}\n" {public_url}`. Esperado: `200`.

Se o upload falhar (4xx/5xx), tentar 1x novamente. Se falhar de novo, registrar `image_upload_failed` e seguir o pipeline com `image_url: null` — step-08 e step-09 lidam com o caso null.

---

## Output

**Arquivos gerados (1 por lingua-alvo):**

| Arquivo | Uso |
|---|---|
| `{run_output}/{name}/linkedin-image-{lang}.jpg` | Imagem em alta-res salva localmente (ref de auditoria), 1 por lingua-alvo |
| `linkedin-ghostwriter-images/{collaborator_uuid}/{YYYY-MM-DD}-{flavor-slug}-{lang}.jpg` no Supabase Storage | Imagem pública por lingua, para o email e para publicar no LinkedIn |

**Resumo `{run_output}/{name}/image-suggestion-{lang}.md` (1 arquivo por lingua-alvo):**

```markdown
# Image Suggestion — {name} ({lang})

**Language:** {pt-br|en-us}
**Post flavor:** {flavor}
**Visual approach:** {abordagem escolhida}
**Image file:** output/{run_id}/{name}/linkedin-image-{lang}.jpg
**Image URL:** {URL pública do Supabase Storage}
**Storage path:** linkedin-ghostwriter-images/{collaborator_uuid}/{YYYY-MM-DD}-{flavor-slug}-{lang}.jpg

---

## Image Prompt Guide

{prompt completo enviado ao Gemini}

---

## Visual Rationale

{justificativa concisa das escolhas visuais — tema → decisão → resultado}
```

> O campo `**Image URL:**` em cada `image-suggestion-{lang}.md` é a fonte única — lido pelo step-08 (salva em `bloggers.image_url` da row dessa lingua) e pelo step-09 (incorpora no email).
> Se o upload falhou para uma lingua, deixar `**Image URL:** null` nesse arquivo e step-08/09 lidam com o caso.
>
> **Cadência reset por imagem (nao por collaborator):** se um collaborator bilingue gera 2 imagens, ambas contam para o ritmo de 60s entre requests + pausa de 2min a cada 10.

## Next

step-07-linkedin-optimizer (Lucas analisa o perfil LinkedIn do collaborator)
