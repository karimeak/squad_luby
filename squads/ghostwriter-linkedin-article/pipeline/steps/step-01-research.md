---
execution: subagent
agent: marco
inputFile: squads/ghostwriter-linkedin-article/output/collaborator-queue.json
outputFile: squads/ghostwriter-linkedin-article/output/{name}/research-brief.md
model_tier: powerful
---

# Step 01 — Pesquisa Web Profunda

## Context Loading

- `squads/ghostwriter-linkedin-article/output/collaborator-queue.json` — dados do collaborator e flavor
- `squads/ghostwriter-linkedin-article/pipeline/data/sources.json` — fontes prioritárias (EN, PT-BR, research)
- `squads/ghostwriter-linkedin-article/agents/marco/tasks/research-flavor.md` — instruções detalhadas

## Instructions

### Process

1. Para o collaborator atual, extrair o `flavor` do collaborator-queue.json
2. Executar a task `research-flavor.md` do Marco: varrer fontes prioritárias → buscas complementares → extrair findings, frameworks, case studies, angles
3. Para artigos, priorizar fontes de research (HBR, McKinsey, Gartner, Forrester, OWASP, etc.)
4. Produzir research-brief.md com mínimo 5 findings, 1 framework, 1 case study, 3 angles, material por seção
5. Salvar em `{name}/research-brief.md`

## Output Format

```markdown
# Research Brief — {flavor}
**Collaborator:** {name}
**Idioma:** EN
**Data:** {YYYY-MM-DD}

## Key Findings
(mínimo 5, com fonte e confidence)

## Frameworks & Methodologies

## Case Studies

## Trending Angles

## Material por Seção (sugestões)

## Sources

## Gaps
```

## Output Example

```markdown
# Research Brief — Multi-Agent Orchestration for Business Automation
**Collaborator:** Karime
**Idioma:** EN
**Data:** 2026-04-29

## Key Findings

1. Gartner (2025): 40% of enterprise IT processes will be automated by AI agents by 2027
   - Confidence: HIGH
   - Source: Gartner Newsroom — https://gartner.com/en/newsroom/press-releases/2025-agent-automation
   - Data: 2025-01-20

2. McKinsey: Companies with multi-agent AI workflows report 3x faster process completion
   - Confidence: MEDIUM
   - Source: McKinsey Digital — https://mckinsey.com/digital/2025-agent-report
   - Data: 2025-03-10

## Frameworks & Methodologies

- **"Orchestrator-Worker" pattern**: Central agent coordinates specialized sub-agents — Source: martinfowler.com

## Trending Angles

- **Autoritativo**: "Most companies think they need one powerful AI. They need a dozen specialized ones."
- **Educacional**: "How to build your first multi-agent pipeline without breaking your existing stack"
```

## Veto Conditions

Reject and redo if ANY are true:
1. Menos de 3 findings com fontes verificadas
2. Nenhum framework ou case study encontrado

## Quality Criteria

- [ ] Mínimo 5 findings com fonte e confidence
- [ ] Pelo menos 1 framework identificado
- [ ] Pelo menos 1 case study real
- [ ] Mínimo 3 ângulos distintos com material para artigo
- [ ] Sugestões de material por seção
