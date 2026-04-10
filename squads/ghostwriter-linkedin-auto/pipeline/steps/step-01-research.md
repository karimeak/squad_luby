---
step: step-01-research
name: Pesquisa Web
type: agent
agent: marco
execution: subagent
---

# Step 01 — Pesquisa Web

## Objetivo
Para o collaborator atual no loop, Marco pesquisa o flavor atribuido e produz um research-brief com dados verificados, fontes e angulos editoriais.

## Instrucoes para Marco

### Input
- Ler `collaborator-queue.json` para obter o collaborator atual e seu flavor
- O flavor e o tema sobre o qual pesquisar

### Processo
1. Ler `squads/ghostwriter-linkedin-auto/pipeline/data/sources.json` para fontes prioritarias
2. Pesquisar fontes EN prioritarias primeiro: `"{flavor}" site:{fonte}`
3. Buscas complementares se < 5 resultados solidos
4. Extrair dados concretos: numeros, empresas reais, datas, citacoes
5. Identificar 3+ angulos editoriais (contrarian, data-driven, story, list, pattern interrupt)
6. Documentar gaps

### Output
Salvar `{name}/research-brief.md` no diretorio de output do run seguindo o formato padrao:
- Key Findings (3+ com fonte e confidence level)
- Trending Angles (3+ distintos)
- Sources table (URL, data, relevancia)
- Gaps

## Next
step-02-persona (Sofia carrega a persona do collaborator)
