---
type: agent
agent: helena
execution: inline
model_tier: powerful
inputFile: squads/ghostwriter-linkedin/output/selected-variant.md
---

# Revisão Técnica — Helena

A Helena Técnica vai revisar a variante selecionada em busca de erros factuais, claims sem fundamento e inconsistências com a realidade da Luby ou do mercado.

**Input:** `squads/ghostwriter-linkedin/output/selected-variant.md`
**Output:** `squads/ghostwriter-linkedin/output/tech-review.md`

**Tarefa tech-review.md:**

1. Ler `squads/ghostwriter-linkedin/output/selected-variant.md`
2. Ler `squads/ghostwriter-linkedin/output/research-brief.md` (fontes disponíveis)
3. Verificar cada claim significativo:
   - O dado está no research-brief com fonte verificada?
   - Se não estiver, o claim é razoável e pode ser contextualizado como experiência pessoal?
   - Existe risco de dano à reputação da Luby ou do colaborador?
4. Aplicar critérios de `pipeline/data/quality-criteria.md` (seção Revisão Técnica)
5. Produzir tech-review.md com:
   - Veredicto: APPROVE / CONDITIONAL APPROVE / REJECT
   - Tabela de scoring por critério
   - Required changes (se REJECT): exatamente o que mudar e por quê
   - Suggestions (se CONDITIONAL): melhorias não-bloqueadoras
6. Se REJECT, indicar as mudanças mínimas necessárias para o Bruno reescrever o trecho específico
