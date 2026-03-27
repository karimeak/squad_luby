---
type: agent
agent: bruno
execution: inline
model_tier: powerful
---

# Escrita de Variantes A/B — Post LinkedIn

O Bruno Ghostwriter vai escrever 2 variantes A/B do post de LinkedIn em **{idioma}** no tom do colaborador **{perfil}**, usando os dados do research e o persona-brief.

**Input:** research-brief.md + persona-brief.md + tone-of-voice.md + linkedin-content skill
**Output:** `squads/ghostwriter-linkedin/output/post-variants.md`

**Referências obrigatórias antes de escrever:**
- Ler `squads/ghostwriter-linkedin/output/research-brief.md`
- Ler `squads/ghostwriter-linkedin/output/persona-brief.md`
- Ler `squads/ghostwriter-linkedin/pipeline/data/tone-of-voice.md`
- Aplicar regras da skill `linkedin-content` (.agents/skills/linkedin-content/SKILL.md)

**Tarefa write-variants.md:**

Escrever 2 variantes completas usando hooks DIFERENTES:

**Variante A** — Hook baseado em contrarian take ou personal story
**Variante B** — Hook baseado em dado/estatística ou list promise

Para cada variante:
1. Hook: primeiros ~210 caracteres (antes do "see more"), obrigatoriamente em primeira pessoa
2. Corpo: 2-3 parágrafos curtos (1-2 frases cada, linha em branco entre eles)
3. Insights: 3-5 pontos numerados ou bullets com takeaways concretos
4. Takeaway: 1-2 frases de conclusão
5. CTA: pergunta genuína e específica para o público deste colaborador
6. Hashtags: 3-5 hashtags relevantes, última linha

**Restrições:**
- PROIBIDO links no corpo do post
- PROIBIDO hashtags no meio do texto
- PROIBIDO jargão corporativo (alavancar, sinergia, ecossistema, paradigma)
- PROIBIDO stats sem base no research-brief
- Máx 3.000 caracteres por variante
- Idioma: {idioma} (adaptar referências ao mercado correspondente)

Salvar ambas as variantes em `squads/ghostwriter-linkedin/output/post-variants.md` com o formato:

```
# Variantes do Post — {perfil} / {flavor} / {idioma}

---

## Variante A — [tipo de hook]

[post completo]

---

## Variante B — [tipo de hook]

[post completo]
```
