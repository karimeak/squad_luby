---
execution: inline
agent: bruno
format: linkedin-article
inputFile: squads/ghostwriter-linkedin-article/output/{name}/persona-brief.md
outputFile: squads/ghostwriter-linkedin-article/output/{name}/article-en.md
model_tier: powerful
---

# Step 03 — Escrita do Artigo EN-US

## Context Loading

- `squads/ghostwriter-linkedin-article/output/{name}/research-brief.md` — dados verificados do Marco
- `squads/ghostwriter-linkedin-article/output/{name}/persona-brief.md` — ângulo, dados filtrados, voice markers, estrutura
- `squads/ghostwriter-linkedin-article/pipeline/data/tone-of-voice.md` — 6 tons disponíveis para artigos
- `squads/ghostwriter-linkedin-article/pipeline/data/quality-criteria.md` — critérios de aprovação
- `_opensquad/core/best-practices/linkedin-article.md` — injetado automaticamente pelo runner

## Instructions

### Process

1. Ler todos os inputs antes de escrever qualquer linha
2. Seguir a task `write-article.md` do Bruno: headline → intro → seções → conclusão → CTA
3. Usar a estrutura sugerida por Sofia como mapa — pode ajustar se o texto fluir melhor
4. Só usar dados do research-brief com fonte entre parênteses
5. Distribuir voice markers ao longo do artigo (mínimo 4 ocorrências)
6. Verificar o checklist final antes de salvar
7. Salvar como `{name}/article-en.md`

## Output Format

```markdown
# {Headline — 60-100 chars}

{Introdução — 150-250 words}

---

## {Subheading Seção 1}

{250-400 words com dado + fonte}

**Takeaway:** {1-2 frases}

---

## {Subheading Seção 2}

...

---

## {Conclusão}

{100-200 words — insight síntese}

---

**{CTA — 1 pergunta específica}**

---
*Word count: {N} words | Language: EN-US*
```

## Veto Conditions

Reject and redo if ANY are true:
1. Word count abaixo de 1.400 words
2. Qualquer dado como fato não está no research-brief

## Quality Criteria

- [ ] Headline 60-100 chars com keyword
- [ ] Word count 1.500-2.000 words
- [ ] 3-5 seções com subheadings e takeaways
- [ ] Todos os dados com fonte entre parênteses
- [ ] Voice markers distribuídos (mínimo 4)
- [ ] 1 CTA específico no final
