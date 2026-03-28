---
type: agent
agent: marco
execution: subagent
model_tier: powerful
---

# Pesquisa Web — Flavor: {flavor}

O Marco Pesquisa vai varrer a web em busca de conteúdo recente e relevante sobre o tema **"{flavor}"** para informar o post de LinkedIn do colaborador **{perfil}** em **{idioma}**.

**Input:** flavor = `{flavor}`, perfil = `{perfil}`, idioma = `{idioma}`
**Output:** `squads/ghostwriter-linkedin/output/research-brief.md`

## Fontes prioritárias de pesquisa

Varrer PRIMEIRO as fontes do arquivo **`pipeline/data/sources.json`** antes de buscas genéricas.

1. Ler `squads/ghostwriter-linkedin/pipeline/data/sources.json`
2. Selecionar a lista de sites correspondente ao `{idioma}`:
   - Se `{idioma}` = PT-BR → usar `sources.pt-br.sites`
   - Se `{idioma}` = EN → usar `sources.en.sites`
3. Sempre incluir também `sources.communities.sites` (aplicável a ambos os idiomas)
4. Para cada site da lista, buscar `"{flavor}" site:{site}`

## Sequência de tarefas

**research-flavor.md:**

1. Ler `squads/ghostwriter-linkedin/pipeline/data/sources.json` e varrer as fontes do idioma `{idioma}` + communities
2. Complementar com buscas genéricas:
   - `"{flavor}" latest 2025 2026 enterprise`
   - `"{flavor}" statistics data research report`
   - `"{flavor}" case study real example`
   - Se EN: `"{flavor}" US market fintech tech`
   - Se PT-BR: `"{flavor}" mercado brasileiro fintech tecnologia`
3. Coletar 5+ fontes verificadas com dados concretos
4. Identificar 3+ ângulos editoriais (contrarian, data-driven, personal story, list, etc.)
5. Salvar `squads/ghostwriter-linkedin/output/research-brief.md` no formato:

```
# Research Brief — {flavor}

**Idioma:** {idioma}
**Data:** {YYYY-MM-DD}

## Key Findings

1. [finding com dado concreto]
   - Confidence: HIGH/MEDIUM/LOW
   - Source: [nome] — [URL original]

2. [...]

## Trending Angles

- [ângulo 1] — tipo: contrarian/data-driven/story/list
- [ângulo 2]
- [ângulo 3]

## Sources

| # | Fonte | URL | Data | Relevância |
|---|-------|-----|------|-----------|
| 1 | ... | ... | ... | 8/10 |

## Gaps

[o que não foi encontrado]
```

**Regra:** Cada fonte citada no research-brief DEVE ter o link original completo.
