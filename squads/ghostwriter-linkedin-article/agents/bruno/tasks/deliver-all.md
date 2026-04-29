---
task: "Deliver All Articles"
order: 3
input: |
  - reviewed_articles: arquivos reviewed-article-en.md e reviewed-article-pt.md de cada collaborator
  - collaborator_queue: collaborator-queue.json
output: |
  - final_files: artigos finais em output/ com nomes padronizados
  - delivery_log: delivery-log.md com resumo do run
---

# Deliver All Articles

Consolida todos os artigos processados, salva com nomes padronizados e produz o log final do run.

## Process

1. **Para cada collaborator processado**:
   - Localizar `{name}/reviewed-article-en.md` e `{name}/reviewed-article-pt.md`
   - Copiar conteúdo para output/ com nome padronizado:
     - `{name}-{flavor-slug}-article-EN-{YYYY-MM-DD}.md`
     - `{name}-{flavor-slug}-article-PT-BR-{YYYY-MM-DD}.md`

2. **Produzir delivery-log.md**:
   - Quantos collaborators processados
   - Para cada collaborator: nome, flavor, word count EN e PT-BR, score da Helena
   - Status geral do run

3. **Salvar delivery-log.md** em output/.

## Output Format

```markdown
# Delivery Log — Ghostwriter LinkedIn Article
**Run Date:** {YYYY-MM-DD}
**Collaborators processed:** {N}

---

| Collaborator | Flavor | Word Count EN | Word Count PT | Helena Score | Status |
|---|---|---|---|---|---|
| {name} | {flavor} | {N} | {N} | {score} | ✓ delivered |

---

## Files Generated

- `{name}-{slug}-article-EN-{date}.md`
- `{name}-{slug}-article-PT-BR-{date}.md`
```

## Quality Criteria

- [ ] 2 arquivos por collaborator (EN + PT-BR) salvos em output/
- [ ] Nomes de arquivo padronizados
- [ ] delivery-log.md com resumo completo

## Veto Conditions

Reject and redo if ANY are true:
1. Algum arquivo de artigo está faltando
2. Nomes de arquivo não seguem o padrão
