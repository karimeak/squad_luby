---
type: agent
agent: rodrigo
execution: inline
model_tier: powerful
on_reject: step-06-karime-copy
---

# Revisão de Conversão

O Rodrigo Revisor avalia o copy com scorecard estruturado contra critérios precisos
de conversão. O veredicto determina se o copy vai para a Tomiko (SEO) ou volta para reescrita.

**Input:** `squads/landing-page-luby/output/{run_id}/landing-page.md`
**Tasks:** score-conversion.md → generate-feedback.md
**Output:**
- `squads/landing-page-luby/output/{run_id}/review-scorecard.md`
- `squads/landing-page-luby/output/{run_id}/review-feedback.md`

**O que o Rodrigo avalia:**

Hard Triggers (REJECT automático):
- Hero começa com nome da empresa
- CTA genérico
- Sem prova concreta
- Nenhuma objeção endereçada
- Anti-commodity falhou

Scorecard por critério (1-10):
- Hero: headline, subtítulo, CTA, social proof (peso 30%)
- Problem Statement: linguagem espelho, agitação, transição (peso 15%)
- Solução/Mecanismo: especificidade, diferenciação, ausência de jargão (peso 15%)
- Prova Social: especificidade, relevância, diversidade (peso 20%)
- CTA Final: headline fechamento, microcopy, intensidade (peso 20%)

**Regras de veredicto:**
- APPROVE: score ponderado ≥ 7,5 e nenhum critério < 5
- CONDITIONAL APPROVE: score médio ≥ 7,0, critério não-crítico entre 5-6
- REJECT: score médio < 7,0 ou critério crítico < 4 ou hard trigger

**On REJECT:** Retornar ao step-06-karime-copy com scorecard + feedback como contexto.
Máximo 3 ciclos de revisão antes de escalação para o usuário.

**On APPROVE / CONDITIONAL APPROVE:** Prosseguir para Tomiko SEO.
