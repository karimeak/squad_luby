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
3. Escrever HTML semântico (`<article>`, H1, H2s, parágrafos, fontes linkadas)
4. Respeitar idioma e flavor do publisher
5. Salvar em `squads/blog-luby-auto/output/post-draft.md`

## Veto Conditions
- H1 ausente → reescrever
- Idioma errado → reescrever
- Post excede max_words em > 20% → encurtar
- Dados não presentes no research-brief → remover
