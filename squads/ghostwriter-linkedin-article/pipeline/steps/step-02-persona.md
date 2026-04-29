---
execution: inline
agent: sofia
inputFile: squads/ghostwriter-linkedin-article/output/{name}/research-brief.md
outputFile: squads/ghostwriter-linkedin-article/output/{name}/persona-brief.md
model_tier: powerful
---

# Step 02 — Carga de Persona

## Context Loading

- `squads/ghostwriter-linkedin-article/output/{name}/research-brief.md` — findings, frameworks, angles do Marco
- `squads/ghostwriter-linkedin-article/output/collaborator-queue.json` — perfil completo do collaborator
- `squads/ghostwriter-linkedin-article/agents/sofia/tasks/load-persona.md` — instruções detalhadas

## Instructions

### Process

1. Ler research-brief.md e absorver findings, frameworks, case studies e ângulos disponíveis
2. Carregar perfil do collaborator do collaborator-queue.json
3. Cruzar persona × research: quais ângulos fazem sentido para a voz e expertise desta persona?
4. Filtrar dados mais relevantes para o público específico do collaborator
5. Propor estrutura do artigo: headline tentativo + 3-5 seções com material disponível
6. Produzir persona-brief.md

## Output Format

```markdown
# Persona Brief — {name} / {flavor} / EN Article

## Ângulo Recomendado
## Dados Filtrados do Research
## Voice Markers Ativos (com posicionamento)
## Estrutura Sugerida do Artigo
## Evitar
```

## Output Example

```markdown
# Persona Brief — Karime / Multi-Agent Orchestration / EN Article

**Ângulo Recomendado:** Educacional
**Justificativa:** Karime tem experiência prática construindo squads multi-agente. O público de tech leads e CTOs quer aprender o framework, não teoria. O ângulo educacional com exemplos práticos aproveita o que ela sabe de verdade.

**Estrutura Sugerida:**
- Headline: Multi-Agent AI: The Framework That Finally Made It Work For Us
- Seção 1: Why one big AI model isn't the answer
- Seção 2: The Orchestrator-Worker pattern explained
- Seção 3: 3 mistakes we made and how we fixed them
- Conclusão: What changes when you get the architecture right
- CTA: What's the hardest part of your first multi-agent implementation?
```

## Veto Conditions

Reject and redo if ANY are true:
1. Estrutura sugerida tem menos de 3 seções
2. Ângulo recomendado não tem material no research para sustentar 3+ seções

## Quality Criteria

- [ ] Ângulo com justificativa em termos de persona + audiência
- [ ] 5+ dados filtrados com relevância explicada
- [ ] Voice markers com posicionamento distribuído
- [ ] Estrutura sugerida com headline tentativo e 3-5 seções
