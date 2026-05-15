---
type: agent
agent: renata
execution: inline
model_tier: powerful
on_reject: step-06-lucio-create
---

# Revisão de Qualidade

A Renata Revisão avalia os 3 formatos com scoring estruturado contra quality-criteria.md.

**Input:** `squads/linkedin-luby/output/{run_id}/` (post + carrossel + artigo)
**Tasks:** score-content.md → generate-feedback.md
**Output:** Review estruturado com veredicto APPROVE / CONDITIONAL APPROVE / REJECT

**O que a Renata avalia:**
- Hard rejection triggers (links no corpo, jargão, artigo < 1.200 palavras)
- Scoring 1-10 por critério com justificativa em cada formato
- Strengths identificados (mínimo 1 por formato)
- Required changes com instrução de reescrita exata
- Path to Approval em caso de REJECT

**Regras de veredicto:**
- APPROVE: média ≥ 7,0 e nenhum critério < 4
- CONDITIONAL APPROVE: média ≥ 7,0, critério não-crítico entre 4-6
- REJECT: média < 7,0 ou qualquer critério < 4

**On REJECT:** Retornar ao step-06-lucio-create com feedback da Renata como contexto.
Contador de revisões: máximo 3 ciclos antes de escalação para o usuário.
