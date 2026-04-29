---
execution: inline
agent: diana
inputFile: squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-en.md
outputFile: squads/ghostwriter-linkedin-article/output/{name}/image-prompt.md
model_tier: powerful
---

# Step 06 — Image Prompt Guide para Capa

## Context Loading

- `squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-en.md` — artigo revisado (fonte para o conceito visual)
- `squads/ghostwriter-linkedin-article/agents/diana/tasks/image-prompt.md` — instruções detalhadas

## Instructions

### Process

1. Ler o artigo revisado EN na íntegra — headline, seções, tom geral
2. Identificar o conceito visual central do TEMA (não apenas do título)
3. Decidir a abordagem visual adequada para o tema e tom do collaborator
4. Compor o Image Prompt Guide: um parágrafo fluido em inglês cobrindo as 10 dimensões
5. Incluir negatives padrão no final
6. Salvar em `{name}/image-prompt.md`

**Importante:** Diana NÃO gera imagem — apenas produz o prompt em texto para uso manual pelo collaborator.

## Output Format

```markdown
# Image Prompt Guide — {name} / {flavor}
**Artigo:** {headline}
**Proporção:** 1200×627 (16:9 — LinkedIn Article Cover)

---

## Prompt (copie e cole no seu gerador de imagem preferido)

{Parágrafo fluido em inglês cobrindo as 10 dimensões + negatives}

---

## Notas de uso

- Cole o prompt completo como está
- Se o gerador pedir aspect ratio: use 16:9 ou 1200×627
- LinkedIn recomenda imagens de pelo menos 1200×627px para capas
```

## Veto Conditions

Reject and redo if ANY are true:
1. Prompt tem menos de 100 words
2. Prompt menciona texto legível que precisaria aparecer na imagem

## Quality Criteria

- [ ] Prompt cobre 10 dimensões visuais
- [ ] Prompt em inglês corrido, sem markdown
- [ ] Negatives padrão incluídos
- [ ] Proporção 1200×627 especificada
