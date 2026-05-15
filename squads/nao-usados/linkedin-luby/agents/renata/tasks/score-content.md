---
task: score-content
order: 1
agent: renata
input: squads/linkedin-luby/output/{run_id}/linkedin-post.md + carousel.md + article.md
output: Tabelas de scoring completas para os 3 formatos
---

## Process

1. Ler `pipeline/data/quality-criteria.md` completamente antes de qualquer avaliação
2. Ler os 3 arquivos de conteúdo (post, carrossel, artigo) do diretório `{run_id}/` do run atual
3. **Verificar hard rejection triggers PRIMEIRO** (qualquer um = REJECT imediato, sem calcular médias):
   - Links no corpo do post LinkedIn?
   - Jargão corporativo pesado: "synergy", "leverage", "paradigm shift", "at the end of the day"?
   - Artigo com < 1.200 palavras?
   - Hook com score claramente < 4/10 (não para o scroll, não cria curiosidade)?
   - Carrossel com < 8 slides?
4. Se hard trigger disparou → registrar o trigger e emitir REJECT imediato
5. Se sem hard trigger → pontuar cada critério de 1-10 com justificativa de ao menos 1 frase
6. Calcular média por formato e média geral
7. Aplicar regra de veredicto:
   - APPROVE: média ≥ 7,0 E nenhum critério < 4
   - CONDITIONAL APPROVE: média ≥ 7,0 mas critério não-crítico entre 4-6
   - REJECT: média < 7,0 OU qualquer critério < 4

## Output Format

```markdown
# Scoring — {título baseado no ângulo}

**Run:** {run_id}
**Revisão:** {N} de 3

---

## Verificação de Hard Triggers

- [ ] Links no corpo do post: {Nenhum detectado / DETECTADO — linha X}
- [ ] Jargão corporativo: {Nenhum detectado / DETECTADO — "palavra"}
- [ ] Artigo < 1.200 palavras: {N palavras — OK / REJEITADO — N palavras}
- [ ] Carrossel < 8 slides: {N slides — OK / REJEITADO — N slides}
- [ ] Hook score < 4: {Avaliado abaixo — OK / HARD REJECT}

**Resultado de Hard Triggers:** {NENHUM — prosseguir para scoring / DETECTADO — REJECT imediato}

---

## Scoring — LinkedIn Post

| Critério | Score | Justificativa |
|---|---|---|
| Hook (scroll-stop) | X/10 | {justificativa} |
| Voz pessoal | X/10 | {justificativa} |
| Estrutura | X/10 | {justificativa} |
| Especificidade | X/10 | {justificativa} |
| CTA genuíno | X/10 | {justificativa} |
| Relevância Luby | X/10 | {justificativa} |
| Anti-corporativo | X/10 | {justificativa} |
**Média post: X,X/10**

## Scoring — Carrossel

[mesmo formato]

## Scoring — Artigo

[mesmo formato]

---

## Veredicto Preliminar

**Média Geral: X,X/10**
**Critério mais baixo: {critério} — X/10**
**Veredicto: {APPROVE / CONDITIONAL APPROVE / REJECT}**
**Motivo: {justificativa do veredicto}**
```

## Quality Criteria

- [ ] Hard triggers verificados antes de qualquer scoring
- [ ] Todos os critérios de quality-criteria.md avaliados (sem pular)
- [ ] Cada score tem justificativa de ao menos 1 frase
- [ ] Médias calculadas corretamente
- [ ] Veredicto preliminar baseado nas regras definidas

## Veto Conditions

- Scoring incompleto (critério sem justificativa) → completar antes de passar para generate-feedback
- Veredicto inconsistente com os scores (ex: APPROVE com critério < 4) → corrigir
