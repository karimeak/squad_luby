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
3. Navegar no Unsplash via Playwright, fazer screenshot dos resultados
4. Selecionar a melhor foto (sem clichês), acessar página da foto, extrair dados
5. Montar `<figure>` com atribuição obrigatória ao fotógrafo
6. Inserir no HTML após o `<h1>`
7. Salvar `image-selection.md` e `post-with-image.md`

## Fallback automático (sem interação)

Se as 3 queries falharem (sem resultados adequados):
- Usar query genérica de fallback: `technology professional workspace`
- Selecionar a primeira foto decente encontrada
- Marcar no `image-selection.md`: "FALLBACK: imagem genérica usada — queries originais não retornaram resultado"

**Nunca bloquear o pipeline** — sempre encontrar uma imagem, mesmo que seja o fallback.

## Veto Conditions
- URL de imagem não começa com `https://images.unsplash.com/` → buscar novamente
- Fotógrafo não identificado → buscar outra foto (atribuição obrigatória)
