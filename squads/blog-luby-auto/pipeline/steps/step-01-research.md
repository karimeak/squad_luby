---
type: agent
agent: mateus
execution: subagent
model_tier: powerful
---

# Pesquisa Web — {title}

O Mateus Pesquisa vai vasculhar as fontes tech curadas para o tema do artigo selecionado.

**Input:** `squads/blog-luby-auto/output/article-brief.md`
**Output:** `squads/blog-luby-auto/output/research-brief.md`

## Instruções

**Execução:** sempre como `subagent` (background) — nunca inline. Isso preserva o contexto principal para os próximos agentes.

1. Ler `squads/blog-luby-auto/output/article-brief.md` — extrair title, idioma, publisher
2. Ler `squads/blog-luby-auto/pipeline/data/sources.json` — fontes curadas por idioma (obrigatório antes de qualquer busca)
3. Varrer fontes curadas + buscas abertas
4. Mínimo 5 fontes verificadas, 3 ângulos editoriais
5. Salvar em `squads/blog-luby-auto/output/research-brief.md`

## Veto Conditions
- Menos de 3 fontes encontradas → refazer com queries alternativas antes de entregar
- `sources.json` não lido antes da pesquisa → ler antes de iniciar qualquer WebSearch
