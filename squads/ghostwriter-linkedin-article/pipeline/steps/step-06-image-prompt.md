---
execution: inline
agent: diana
inputFile: squads/ghostwriter-linkedin-article/output/{name}/humanized-article-en.md
outputFile: squads/ghostwriter-linkedin-article/output/{name}/linkedin-article-cover.jpg
model_tier: powerful
skills:
  - playwright
tools:
  - playwright
---

# Step 06 — Geração da Capa do Artigo (Diana + Gemini)

## Objetivo

Diana gera um Image Prompt Guide estruturado a partir do artigo humanizado, abre o Google Gemini via Playwright para gerar a capa (1200×627, 16:9), e faz upload da imagem para o Supabase Storage — sem aprovação humana (pipeline autônomo).

> **Pollinations.ai PROIBIDO** (decisão Karime 2026-05-11). Não construir URL, não fazer fallback, não citar. Toda imagem é Gemini.
>
> **Cadência obrigatória:** 60s entre requests; pausa de 2min a cada 10 imagens em batches > 10; backoff exp (60→120→240s, máx 3 tentativas) em erro/recusa. Após 3 falhas, registrar `linkedin-article-image-failed.txt` na pasta do collaborator e seguir com `image_url: null` (não bloquear).

**Saídas:**
1. **Arquivo local** (`linkedin-article-cover.jpg`) — screenshot do Gemini em 1200×627
2. **URL pública** (`image_url`) — mesma imagem no Supabase Storage, usada no email do step-08 e salva no banco no step-07
3. **Metadados** (`image-prompt.md`) — prompt completo + Image URL + storage path + rationale visual

> A capa do email é a MESMA que o colaborador deve publicar como cover do artigo LinkedIn.

## Context Loading

- `squads/ghostwriter-linkedin-article/output/{name}/humanized-article-en.md` — artigo revisado + humanizado (fonte do conceito visual)
- `squads/ghostwriter-linkedin-article/output/{name}/research-brief.md` — tema, flavor, indústria do collaborator
- `squads/ghostwriter-linkedin-article/pipeline/data/supabase-config.json` — URL, anon key, bucket `linkedin-ghostwriter-article-images`
- `squads/ghostwriter-linkedin-article/output/collaborator-queue.json` — UUID, nome, email, flavor do collaborator
- `squads/ghostwriter-linkedin-article/agents/diana/tasks/image-prompt.md` — instruções detalhadas em 3 partes

## Instructions

### Process

**PARTE 1 — Image Prompt Guide:**
1. Ler `humanized-article-en.md` na íntegra (headline, seções, tom geral)
2. Identificar o conceito visual central do TEMA do artigo (não do título)
3. Decidir a abordagem visual (fluxo, oposição, síntese, institucional, tech, etc.)
4. Compor parágrafo único em inglês cobrindo as 10 dimensões + negatives padrão

**PARTE 2 — Geração via Gemini (Playwright):**
5. `browser_navigate → https://gemini.google.com/app`
6. `browser_type` (submit:true) → `Generate an image using Nano Banana Pro: {prompt}`
7. `browser_wait_for (time:20)` + snapshot para confirmar geração
8. `browser_evaluate` para extrair URL da imagem (filtrar `naturalWidth > 100`)
9. Modificar size param: `w200-h200` → `w1200-h627` (16:9 — diferente do squad de posts)
10. `browser_navigate` para URL em alta-res (NÃO usar fetch — CORS)
11. `browser_resize → 1200×627` + `browser_take_screenshot` JPEG → `{name}/linkedin-article-cover.jpg`
12. `browser_close`

**PARTE 3 — Upload no Supabase Storage:**
13. Slugificar flavor via node deterministico (não LLM):
    ```bash
    FLAVOR_SLUG=$(node -e "console.log(process.argv[1].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''))" "<flavor>")
    ```
14. Path: `{collaborator_uuid}/{YYYY-MM-DD}-{flavor-slug}.jpg`
15. Upload via `curl POST` para `{supabase_url}/storage/v1/object/linkedin-ghostwriter-article-images/{path}` com header `x-upsert: true`
16. URL pública: `{supabase_url}/storage/v1/object/public/linkedin-ghostwriter-article-images/{path}`
17. Verificar com `curl -I` (esperar `200`)

**PARTE 4 — Metadados:**
18. Gerar `image-prompt.md` com headline + Image URL + Storage path + Prompt completo + Visual Rationale
19. Em caso de falha após retries: `Image URL: null` + criar `linkedin-article-image-failed.txt` na pasta do collaborator

## Output Format

```markdown
# Image Cover — {name} / {flavor}
**Artigo:** {headline}
**Proporção:** 1200×627 (16:9 — LinkedIn Article Cover)

**Image file:** output/{name}/linkedin-article-cover.jpg
**Image URL:** {URL pública do Supabase Storage}
**Storage path:** linkedin-ghostwriter-article-images/{collaborator_uuid}/{YYYY-MM-DD}-{flavor-slug}.jpg

---

## Image Prompt Guide

{parágrafo único em inglês corrido cobrindo as 10 dimensões + negatives}

---

## Visual Rationale

{justificativa concisa: tema → abordagem visual escolhida → decisões de paleta/luz/composição}
```

## Veto Conditions

Reject and redo if ANY are true:
1. Prompt tem menos de 100 words
2. Prompt menciona texto legível que precisaria aparecer na imagem

**Não veta o pipeline em falha de geração/upload.** Após 3 retries falhos, registrar `linkedin-article-image-failed.txt` e seguir com `image_url: null` no `image-prompt.md`. Step-07 salva null em `bloggers.image_url`; step-08 omite a tag `<img>` no email.

## Quality Criteria

- [ ] Prompt cobre 10 dimensões visuais
- [ ] Prompt em inglês corrido, sem markdown
- [ ] Negatives padrão incluídos
- [ ] Imagem via Gemini Nano Banana Pro (NÃO Pollinations)
- [ ] Arquivo local `linkedin-article-cover.jpg` > 50KB
- [ ] Upload OK no bucket `linkedin-ghostwriter-article-images`
- [ ] URL pública retorna `200` no `curl -I`
- [ ] `**Image URL:**` registrado em `image-prompt.md`
- [ ] Cadência respeitada (60s entre requests, pausa 2min a cada 10)
