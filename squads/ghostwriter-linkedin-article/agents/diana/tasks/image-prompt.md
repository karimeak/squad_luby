---
task: "Generate Article Cover Image (Gemini + Supabase Upload)"
order: 1
input: |
  - humanized_article_en: {name}/humanized-article-en.md
  - research_brief: {name}/research-brief.md
  - collaborator: {id, name, flavor} de collaborator-queue.json
  - supabase_config: squads/ghostwriter-linkedin-article/pipeline/data/supabase-config.json
output: |
  - cover_image: {name}/linkedin-article-cover.jpg
  - image_metadata: {name}/image-prompt.md
  - uploaded: linkedin-ghostwriter-article-images/{collaborator_uuid}/{YYYY-MM-DD}-{flavor-slug}.jpg
tools:
  - playwright
---

# Generate Article Cover Image (Gemini + Supabase Upload)

Diana produz o Image Prompt Guide, abre o Google Gemini via Playwright para gerar a capa do artigo (1200×627), e faz upload da imagem para o Supabase Storage. O collaborator recebe a capa real no email — sem aprovação humana (pipeline autônomo).

> **Pollinations.ai PROIBIDO** (decisão Karime 2026-05-11). Não construir URL, não fazer fallback, não citar. Toda imagem é Gemini.
>
> **Cadência obrigatória:** 60s entre requests; pausa de 2min a cada 10 imagens em batches > 10; backoff exp (60→120→240s, máx 3) em erro/recusa. Após 3 falhas, registrar `linkedin-article-image-failed.txt` e seguir com `image_url: null` (não bloquear).

---

## PARTE 1 — Image Prompt Guide (Diana)

### 1. Limpeza do material

Ler `humanized-article-en.md` e `research-brief.md`. Ignorar hashtags, links, emojis, CTAs genéricos. Extrair a essência: tema principal, mensagem central, tom geral.

### 2. Leitura estratégica

Identificar:
- Tema principal (não o título)
- Mensagem central
- Objetivo do artigo
- Tipo de arte adequada (fluxo, síntese conceitual, arte tech, institucional, comparação, etc.)

### 3. Decisão visual + hierarquia

| Conteúdo | Abordagem visual |
|---|---|
| Processo / etapas sequenciais | Arte de fluxo visual |
| Comparação / antes-depois | Oposição visual clara |
| Opinião forte / insight / tendência | Síntese conceitual |
| Tecnologia / IA / dados / código | Sinais visuais do universo tech |
| Posicionamento institucional | Composição moderna, clean, corporativa |
| Erros / lições | Tensão visual controlada, não dramática |

Regra: 1 ideia dominante + máx 2 apoios secundários. Composição 16:9 com respiro horizontal à direita (o LinkedIn sobrepõe o título do artigo).

### 4. Compor o Image Prompt Guide

Parágrafo único em inglês corrido, cobrindo obrigatoriamente estas 10 seções em sequência:

1. **Visual concept** — ideia central derivada do TEMA do artigo
2. **Scene or composition** — o que aparece, posicionamento, respiro à direita
3. **Main elements** — elementos principais
4. **Contextual cues** — sinais visuais conectando ao universo do tema
5. **Design direction** — estilo (editorial, corporativo, minimalista)
6. **Lighting and mood** — iluminação, atmosfera, tom emocional
7. **Color palette** — cores específicas
8. **Materials or interface feel** — texturas, superfícies
9. **Composition quality** — enquadramento 16:9, profundidade, respiro
10. **Constraints and negatives** — negatives padrão obrigatórios

**Negatives obrigatórios (sempre ao final):**
> no text-heavy layout, no readable typography, no fake readable interfaces, no watermark, no extra logos, no distorted anatomy, no deformed hands, no visual clutter, no childish style, no cartoon, no cheap CGI, no cheap futuristic effects, no generic AI aesthetics, no random elements unrelated to the topic, no square crop, no portrait orientation

**Formato:** texto inglês corrido, parágrafo único, sem markdown, sem listas, sem aspas, sem comentários.

---

## PARTE 2 — Geração via Google Gemini (Playwright)

### 1. Abrir o Gemini
```
mcp__playwright__browser_navigate → https://gemini.google.com/app
```
Aguardar o textbox "Insira um comando para o Gemini" aparecer no snapshot.

### 2. Digitar o prompt
```
mcp__playwright__browser_snapshot   # localizar ref do textbox
mcp__playwright__browser_type (submit: true) → "Generate an image using Nano Banana Pro: {image_prompt_guide}"
```

> "Nano Banana Pro" sinaliza para o Gemini usar `gemini-3-pro-image`. Sem garantia 100%, mas costuma respeitar quando a conta tem acesso Pro/Workspace.

### 3. Aguardar a geração
```
mcp__playwright__browser_wait_for (time: 20)
```
Confirmar com snapshot: botões "Boa resposta" / "Compartilhar imagem" presentes → geração completa.

### 4. Extrair URL da imagem
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
Selecionar a primeira com `naturalWidth > 100` (avatars têm 64px). Modificar size param: substituir `w200-h200` por **`w1200-h627`** (16:9 — DIFERENTE do squad de posts que usa `w1200-h1200`).

### 5. Navegar para URL e screenshot em 16:9

**IMPORTANTE:** Não usar `fetch()` — causa erro de CORS. Usar navegação direta.

```
mcp__playwright__browser_navigate → {url_com_w1200-h627}
mcp__playwright__browser_resize → width: 1200, height: 627
mcp__playwright__browser_take_screenshot → type: jpeg, filename: {output}/{name}/linkedin-article-cover.jpg
```

### 6. Verificar
- [ ] Imagem coerente com o tema do artigo
- [ ] Qualidade visual aceitável (sem artefatos graves, sem mãos deformadas, sem texto fake)
- [ ] Tamanho do arquivo > 50KB
- [ ] Proporção visualmente 16:9 (se Gemini retornou quadrada, aceitar — LinkedIn faz crop)

Se Gemini recusar o prompt: simplificar e tentar uma vez.

### 7. Fechar o browser
```
mcp__playwright__browser_close
```

---

## PARTE 3 — Upload para Supabase Storage

Subir o arquivo `linkedin-article-cover.jpg` para o bucket público `linkedin-ghostwriter-article-images` e capturar a URL pública.

### 1. Construir o path determinístico

Padrão:
```
{collaborator_uuid}/{YYYY-MM-DD}-{flavor-slug}.jpg
```

- `collaborator_uuid`: campo `id` do `collaborator-queue.json` (UUID direto da tabela `collaborators`)
- `YYYY-MM-DD`: data do run
- `flavor-slug`: slugificado via node deterministico (NÃO LLM):

```bash
FLAVOR_SLUG=$(node -e "console.log(process.argv[1].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''))" "<flavor>")
```

Exemplos:
- `"AI Credit"` → `ai-credit`
- `"Modernização de Sistemas"` → `modernizacao-de-sistemas`
- `"DevOps & Cloud"` → `devops-cloud`

### 2. Upload via curl

Ler `supabase_url` e `supabase_anon_key` de `pipeline/data/supabase-config.json`.

```bash
SUPABASE_URL="<supabase_url>"
ANON_KEY="<supabase_anon_key>"
BUCKET="linkedin-ghostwriter-article-images"
COLLAB_UUID="<collaborator.id do queue>"
RUN_DATE="<YYYY-MM-DD>"
FLAVOR_SLUG=$(node -e "console.log(process.argv[1].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''))" "<flavor>")
PATH_IN_BUCKET="${COLLAB_UUID}/${RUN_DATE}-${FLAVOR_SLUG}.jpg"
LOCAL_FILE="<output>/<name>/linkedin-article-cover.jpg"

curl -X POST \
  "${SUPABASE_URL}/storage/v1/object/${BUCKET}/${PATH_IN_BUCKET}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: image/jpeg" \
  -H "x-upsert: true" \
  --data-binary "@${LOCAL_FILE}"
```

`x-upsert: true` permite re-runs sobrescreverem a mesma chave. Bucket restrito a `image/jpeg|png|webp` e 10MB.

### 3. URL pública

```
{supabase_url}/storage/v1/object/public/linkedin-ghostwriter-article-images/{collaborator_uuid}/{YYYY-MM-DD}-{flavor-slug}.jpg
```

### 4. Verificar acessibilidade

```bash
curl -I -o /dev/null -w "%{http_code}\n" {public_url}
```
Esperado: `200`.

Se upload falhar (4xx/5xx), tentar 1x. Se falhar de novo, registrar `image_upload_failed: true` em `image-prompt.md` e definir `image_url: null`.

---

## Output Format

**Arquivos gerados:**

| Arquivo | Uso |
|---|---|
| `{output}/{name}/linkedin-article-cover.jpg` | Imagem em alta-res salva localmente (auditoria) |
| `linkedin-ghostwriter-article-images/{collaborator_uuid}/{YYYY-MM-DD}-{flavor-slug}.jpg` no Storage | Capa pública para email + LinkedIn |

**Arquivo de metadados `{output}/{name}/image-prompt.md`:**

```markdown
# Image Cover — {name} / {flavor}
**Artigo:** {headline do artigo}
**Proporção:** 1200×627 (16:9 — LinkedIn Article Cover)

**Image file:** output/{name}/linkedin-article-cover.jpg
**Image URL:** {URL pública do Supabase Storage}
**Storage path:** linkedin-ghostwriter-article-images/{collaborator_uuid}/{YYYY-MM-DD}-{flavor-slug}.jpg

---

## Image Prompt Guide

{prompt completo enviado ao Gemini — parágrafo único em inglês corrido}

---

## Visual Rationale

{justificativa concisa: tema → abordagem visual escolhida → decisões de paleta/luz/composição}
```

> O campo `**Image URL:**` é a fonte única — lido pelo step-07 (salva em `bloggers.image_url`) e pelo step-08 (incorpora no email).
> Se o upload falhou, deixar `**Image URL:** null` e os steps seguintes lidam com o caso.

---

## Quality Criteria

- [ ] Prompt cobre as 10 dimensões em ordem
- [ ] Prompt em inglês corrido, sem markdown ou listas
- [ ] Negatives padrão incluídos
- [ ] Imagem gerada via Gemini (Nano Banana Pro) — NÃO Pollinations
- [ ] Arquivo local > 50KB
- [ ] Upload bem-sucedido no bucket `linkedin-ghostwriter-article-images`
- [ ] URL pública retorna `200`
- [ ] Campo `**Image URL:**` registrado em `image-prompt.md`
- [ ] Cadência respeitada (60s entre requests, pausa 2min/10)

## Veto Conditions

Reject and redo if ANY are true:
1. Prompt tem menos de 100 words — insuficiente para guiar o Gemini
2. Prompt menciona texto legível que precisaria aparecer na imagem

**Não veta o pipeline em falha de geração/upload** — após 3 retries, accept null e seguir.
