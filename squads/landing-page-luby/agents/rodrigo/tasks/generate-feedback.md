# Task: Geração de Feedback

## Descrição
Com base no scorecard, definir o veredicto final e gerar feedback acionável
com instrução de reescrita exata para cada ponto de melhoria.

## Input
Scorecard gerado em score-conversion.md (na mesma execução)

## Processo

1. **Definir veredicto** baseado no scorecard:
   - **APPROVE**: Score médio ponderado ≥ 7,5 E nenhum critério individual < 5 E sem hard trigger
   - **CONDITIONAL APPROVE**: Score médio ≥ 7,0 E critério não-crítico entre 5-6 E sem hard trigger
   - **REJECT**: Score médio < 7,0 OU qualquer critério crítico < 4 OU hard trigger ativado

   Critérios críticos (REJECT se < 4): Headline, CTA Above Fold, Especificidade do mecanismo,
   Especificidade da prova social, Intensidade do CTA

2. **Estruturar feedback**:

   **Pontos Fortes** (mínimo 2, específicos):
   - Referência ao elemento específico e por que funciona
   - Não: "boa estrutura de prova" → Sim: "Depoimento da [empresa] com resultado mensurável
     (X% de redução) é exatamente o nível de especificidade que converte decisores B2B"

   **Melhorias Necessárias** (para todo critério com score < 7):
   - Por critério com score abaixo de 7
   - Formato: [Critério] → [Instrução de reescrita exata]
   - Instrução deve ser específica o suficiente para a Carla implementar sem perguntas adicionais

   **Path to Approval** (se REJECT ou CONDITIONAL APPROVE):
   - Lista priorizada: o que tem maior impacto no score se corrigido
   - Prioridade 1: hard triggers ou critérios críticos < 4
   - Prioridade 2: critérios com peso alto (Hero, Prova Social, CTA) com score < 6
   - Prioridade 3: melhorias de refinamento (critérios com score 6)

3. **On REJECT**: Estruturar handoff para Carla:
   - Passar score completo + feedback estruturado
   - Indicar quais seções devem ser reescritas do zero (score < 4)
   - Indicar quais seções precisam de ajuste pontual (score 5-6)
   - Preservar seções com score ≥ 7 (não reescrever o que funciona)

## Output Format

```markdown
# Feedback de Revisão — [Nome da LP]
**Data:** [data]
**Veredicto:** APPROVE / CONDITIONAL APPROVE / REJECT

---

## Pontos Fortes

1. **[Elemento específico]:** [Por que funciona — referência ao critério e ao copy]
2. **[Elemento específico]:** [Por que funciona]
[3+ se aplicável]

---

## Melhorias Necessárias

### [Critério] — Score atual: X/10 → Alvo: 8/10

**Problema:** [O que está errado, com citação do copy atual]
**Instrução de reescrita:** [Instrução específica, com exemplo ou formato esperado]

[repetir por critério com score < 7]

---

## Path to Approval

**Prioridade 1 — Obrigatório para sair do REJECT:**
1. [Item mais crítico]
2. [Segundo item]

**Prioridade 2 — Para alcançar APPROVE:**
3. [Item de impacto médio]

**Prioridade 3 — Refinamento (não bloqueia aprovação):**
4. [Item de refinamento]

---

## Veredicto Final: [APPROVE / CONDITIONAL APPROVE / REJECT]

[1-2 linhas explicando o veredicto — o que foi determinante]

[Se APPROVE:] Pronto para aprovação final do usuário.
[Se CONDITIONAL APPROVE:] Ajustes menores listados acima antes da aprovação final.
[Se REJECT:] Reencaminhar para Carla com este feedback. Máximo 3 ciclos de revisão.
```

## Critérios de Qualidade

- [ ] Veredicto segue as regras: APPROVE ≥ 7,5 / CONDITIONAL ≥ 7,0 / REJECT < 7,0
- [ ] Mínimo 2 pontos fortes com especificidade (referência ao copy)
- [ ] Cada critério com score < 7 tem instrução de reescrita exata
- [ ] Path to Approval priorizado (não é lista plana)
- [ ] Veredicto com explicação de 1-2 linhas
- [ ] Feedback salvo em squads/landing-page-luby/output/{run_id}/review-feedback.md

## Condições de Veto

- Veredicto não segue as regras numéricas definidas
- Ponto de melhoria sem instrução de reescrita específica
- REJECT sem Path to Approval
- Pontos fortes são genéricos ("bom copy", "boa estrutura")
