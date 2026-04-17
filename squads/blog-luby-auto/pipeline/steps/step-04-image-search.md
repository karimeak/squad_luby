---
type: agent
agent: iris
execution: inline
model_tier: powerful
---

# Busca de Imagem — Unsplash (automático)

A Iris Imagens vai buscar a imagem ideal no Unsplash e embutir no HTML. Sem interação com o usuário.

**Input:** `squads/blog-luby-auto/output/article-brief.md` + `squads/blog-luby-auto/output/post-draft.md`
**Output:**
- `squads/blog-luby-auto/output/image-selection.md`
- `squads/blog-luby-auto/output/post-with-image.md`

## Instruções

1. Analisar o post — extrair tema central e conceitos visuais
2. Gerar 3 queries (do mais específico ao mais genérico, sempre em inglês)
3. Buscar via Unsplash API (`GET /search/photos?query=...&orientation=landscape`) com header `Authorization: Client-ID F5Y0BxjDgXs_o5pV_91sW6H-8I0AjQpYx0EWpANZqcw`
4. Selecionar a melhor foto (sem clichês) do JSON de resultados
5. Chamar `GET /photos/{id}/download` para registrar uso (obrigatório pela API)
6. Preparar `caption_html` com atribuição Unsplash (links UTM incluídos)
7. Copiar `post-draft.md` para `post-with-image.md` sem alterações no HTML — a imagem vai como `featured_media` via Ada, não no conteúdo
   **Obrigatório para cada artigo processado, mesmo que `post-with-image.md` já exista de um artigo anterior. Ada lê de `post-with-image.md`, não de `post-draft.md`.**
8. Salvar `image-selection.md` e `post-with-image.md`

## Fallback automático (sem interação)

Se as 3 queries falharem (sem resultados adequados):
- Usar query genérica de fallback: `technology professional workspace`
- Selecionar a primeira foto decente encontrada
- Marcar no `image-selection.md`: "FALLBACK: imagem genérica usada — queries originais não retornaram resultado"

**Nunca bloquear o pipeline** — sempre encontrar uma imagem, mesmo que seja o fallback.

## Veto Conditions
- URL de imagem não começa com `https://images.unsplash.com/` → buscar novamente
- Fotógrafo não identificado → buscar outra foto (atribuição obrigatória)
