---
execution: inline
agent: bruno
inputFile: squads/ghostwriter-linkedin-article/output/{name}/article-en.md
outputFile: squads/ghostwriter-linkedin-article/output/{name}/article-pt.md
model_tier: powerful
---

# Step 04 — Tradução EN > PT-BR

## Context Loading

- `squads/ghostwriter-linkedin-article/output/{name}/article-en.md` — artigo EN aprovado pelo Bruno
- `squads/ghostwriter-linkedin-article/output/collaborator-queue.json` — voice_markers_pt, tone_pt, audience_pt do collaborator
- `squads/ghostwriter-linkedin-article/agents/bruno/tasks/translate-article.md` — instruções detalhadas

## Instructions

### Process

1. Ler artigo EN e o perfil PT-BR do collaborator
2. Traduzir com adaptação cultural completa — não traduzir, reescrever em PT-BR
3. Trocar voice markers EN pelos equivalentes PT do perfil
4. Adaptar referências culturais (SEC→CVM, USD→BRL, NYSE→B3, etc.)
5. Adaptar CTA para o contexto e audiência brasileira
6. Verificar: word count PT-BR 1.400-1.900 words, tom natural
7. Salvar como `{name}/article-pt.md`

## Output Format

Mesmo formato do artigo EN mas em PT-BR:

```markdown
# {Headline PT-BR}

{Introdução PT-BR}

---

## {Subheading PT-BR}

{Corpo PT-BR}

**Takeaway:** {PT-BR}

...

---

**{CTA adaptada para audiência brasileira}**

---
*Contagem de palavras: {N} | Idioma: PT-BR*
```

## Veto Conditions

Reject and redo if ANY are true:
1. Artigo PT-BR é tradução literal — soa artificial
2. Referências puramente americanas onde equivalente brasileiro existe

## Quality Criteria

- [ ] Word count 1.400-1.900 words
- [ ] Voice markers PT distribuídos
- [ ] Referências culturais BR aplicadas
- [ ] CTA adaptada (não traduzida)
- [ ] Tom natural em PT-BR
