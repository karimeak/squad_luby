---
type: agent
agent: cleo
execution: subagent
model_tier: powerful
inputFile: squads/linkedin-luby/output/research-focus.md
---

# Pesquisa de Tendências

Executar a Cleo Curadoria como subagente para varrer as fontes tech e gerar o relatório
com as top 5 histórias ranqueadas.

**Input:** `squads/linkedin-luby/output/research-focus.md` (foco e período definidos no step anterior)
**Tasks:** find-news.md → rank-stories.md
**Output:** `squads/linkedin-luby/output/news-report.md`

A Cleo irá:
1. Varrer todas as fontes Tier 1 (TechCrunch, VentureBeat, HN, ProductHunt)
2. Complementar com Tier 2 se necessário
3. Filtrar por relevância B2B enterprise
4. Ranquear top 5 com score e análise completa

Aguardar conclusão antes de prosseguir para seleção de notícia.
