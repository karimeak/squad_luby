---
execution: inline
agent: helena
inputFile: squads/ghostwriter-linkedin-article/output/{name}/article-en.md
outputFile: squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-en.md
model_tier: powerful
---

# Step 05 — Revisão Combinada (Tech + Estrutura)

## Context Loading

- `squads/ghostwriter-linkedin-article/output/{name}/article-en.md` — artigo EN do Bruno
- `squads/ghostwriter-linkedin-article/output/{name}/article-pt.md` — artigo PT-BR do Bruno
- `squads/ghostwriter-linkedin-article/output/{name}/research-brief.md` — fonte de verdade para fact-checking
- `squads/ghostwriter-linkedin-article/output/{name}/persona-brief.md` — voice markers esperados
- `squads/ghostwriter-linkedin-article/pipeline/data/quality-criteria.md` — critérios de aprovação
- `squads/ghostwriter-linkedin-article/agents/helena/tasks/combined-review.md` — instruções detalhadas

## Instructions

### Process

1. Executar a task `combined-review.md` da Helena para o artigo EN: tech review + structure review
2. Executar a mesma revisão para o artigo PT-BR
3. Aplicar auto-fix para cada issue identificado (até 2 tentativas)
4. Salvar artigos revisados como reviewed-article-en.md e reviewed-article-pt.md
5. Produzir review-report.md com scoring e lista de fixes aplicados

## Output Format

```
# Review Report — {name}

## EN-US
TECH REVIEW: (tabela de claims verificados)
STRUCTURE REVIEW: (scoring por dimensão)
Word count: {N} — OK/ABAIXO
Auto-fixes: {lista}
VEREDICTO EN: APPROVE / WARNING

## PT-BR
(mesma estrutura)

VEREDICTO FINAL: APPROVE / CONDITIONAL
```

## Veto Conditions

Reject and redo if ANY are true:
1. Artigo com dado fabricado foi aprovado sem auto-fix
2. Word count abaixo de 1.400 sem auto-fix aplicado

## Quality Criteria

- [ ] Todos os claims verificados
- [ ] Scoring table por dimensão (EN e PT-BR)
- [ ] Word count verificado em ambos idiomas
- [ ] reviewed-article-en.md e reviewed-article-pt.md salvos
- [ ] review-report.md gerado
