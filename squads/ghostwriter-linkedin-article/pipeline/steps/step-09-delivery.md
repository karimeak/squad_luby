---
execution: inline
agent: bruno
outputFile: squads/ghostwriter-linkedin-article/output/delivery-log.md
model_tier: powerful
---

# Step 09 — Entrega Final

## Context Loading

- `squads/ghostwriter-linkedin-article/output/collaborator-queue.json` — lista de collaborators processados
- Para cada collaborator: `{name}/reviewed-article-en.md`, `{name}/reviewed-article-pt.md`, `{name}/review-report.md`, `{name}/email-confirmation.md`
- `squads/ghostwriter-linkedin-article/agents/bruno/tasks/deliver-all.md` — instruções detalhadas

## Instructions

### Process

1. Para cada collaborator processado:
   - Copiar reviewed-article-en.md para output/ com nome: `{name}-{flavor-slug}-article-EN-{YYYY-MM-DD}.md`
   - Copiar reviewed-article-pt.md para output/ com nome: `{name}-{flavor-slug}-article-PT-BR-{YYYY-MM-DD}.md`
2. Produzir delivery-log.md com tabela consolidada: collaborator, flavor, word count, score Helena, status email
3. Reportar resumo final no chat

## Output Format

```markdown
# Delivery Log — Ghostwriter LinkedIn Article
**Run Date:** {YYYY-MM-DD}
**Collaborators processed:** {N}

| Collaborator | Flavor | Words EN | Words PT | Score | Email | Status |
|---|---|---|---|---|---|---|
| {name} | {flavor} | {N} | {N} | {X}/10 | ✓/✗ | ✓ delivered |

## Files Generated
- `{name}-{slug}-article-EN-{date}.md`
- `{name}-{slug}-article-PT-BR-{date}.md`
```

## Veto Conditions

Reject and redo if ANY are true:
1. Algum arquivo de artigo final está faltando
2. delivery-log.md não foi gerado

## Quality Criteria

- [ ] 2 arquivos finais por collaborator em output/
- [ ] Nomes padronizados
- [ ] delivery-log.md completo
