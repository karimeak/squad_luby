---
type: agent
agent: mateus
execution: subagent
model_tier: powerful
---

# Pesquisa Web — {title}

O Mateus Pesquisa vai vasculhar as fontes tech curadas e a web aberta para reunir dados, tendências e ângulos editoriais sobre o tema **"{title}"**, para o post do publisher **{publisher.name}** no canal **{publisher.channel}** em **{publisher.language}**.

**Input:** `squads/blog-luby/output/article-brief.md`
**Output:** `squads/blog-luby/output/research-brief.md`

## Instruções para o Mateus

1. Ler `squads/blog-luby/output/article-brief.md` para obter: título, idioma, publisher
2. Ler `squads/blog-luby/pipeline/data/sources.json` para a lista de sites curados por idioma
3. Executar a pesquisa conforme o Operational Framework do agente
4. Salvar o research-brief em `squads/blog-luby/output/research-brief.md`

## Fontes Prioritárias

Varrer PRIMEIRO os sites de `sources.json` correspondentes ao idioma do publisher:
- Se PT-BR → `sources.tech.pt-br`
- Se EN → `sources.tech.en`
- Incluir ambas as listas se o tema tiver cobertura multilíngue relevante

## Buscas Obrigatórias

Para cada site da lista curada:
```
"{title}" site:{site}
```

Complementar com buscas abertas:
- `"{title}" 2025 2026`
- `"{title}" research statistics data`
- `"{title}" case study example`
- Se PT-BR: `"{title}" Brasil mercado tendência`
- Se EN: `"{title}" enterprise industry report`

## Critérios de Qualidade

- Mínimo 5 fontes verificadas
- Cada fonte com URL original completa e acessível
- Pelo menos 3 ângulos editoriais distintos identificados
- Recência: preferir conteúdo dos últimos 6 meses

## Veto Conditions

- Menos de 3 fontes verificadas → refazer pesquisa com queries alternativas
- Nenhuma fonte da lista curada encontrada → reportar gap e usar fontes abertas
