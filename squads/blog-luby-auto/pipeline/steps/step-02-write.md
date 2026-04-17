---
type: agent
agent: lara
execution: inline
model_tier: powerful
---

# Redação do Blog Post em HTML

A Lara Redatora vai criar o HTML completo do post.

**Input:** `squads/blog-luby-auto/output/article-brief.md` + `squads/blog-luby-auto/output/research-brief.md`
**Output:** `squads/blog-luby-auto/output/post-draft.md`

## Instruções

1. Ler `article-brief.md` — title, instructions, max_words, publisher (channel, name, language, flavor)
2. Ler `research-brief.md` — dados, fontes, ângulos
3. Escrever HTML no **formato Gutenberg** (obrigatório para WordPress):
   - **Título** salvo como `post_title` no output (NÃO vai no HTML — Ada o usa no campo `title` da API WP)
   - Todo `<p>` envolvido em `<!-- wp:paragraph -->` / `<!-- /wp:paragraph -->`
   - Todo `<h2>`/`<h3>` envolvido em `<!-- wp:heading {"level":N} -->` / `<!-- /wp:heading -->`
   - Listas em `<!-- wp:list -->` com `<!-- wp:list-item -->` por item
   - Sem `<h1>`, `<article>`, `<html>`, `<body>`, `<!DOCTYPE>`
   - Sem inline styles
4. Respeitar idioma e flavor do publisher
5. Salvar em `squads/blog-luby-auto/output/post-draft.md` com formato:
   ```
   post_title: {título do post}
   ---
   {HTML do conteúdo começando com <p>}
   ```

## Veto Conditions
- `post_title` ausente no output → reescrever
- `<h1>` presente no HTML → reescrever (criar dois títulos no WP)
- `<article>`, `<html>`, `<body>` no HTML → remover
- Idioma errado → reescrever
- Post excede max_words em > 20% → encurtar
- Dados não presentes no research-brief → remover
