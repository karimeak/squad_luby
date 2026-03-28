---
type: agent
agent: bruno
execution: inline
model_tier: powerful
---

# Escrita de Variantes A/B — Post LinkedIn

O Bruno Ghostwriter vai escrever 2 variantes A/B do post de LinkedIn em **{idioma}** no tom do colaborador **{perfil}**, no tamanho **{tamanho}**, usando os dados do research e o persona-brief.

**Input:** research-brief.md + persona-brief.md + tone-of-voice.md + linkedin-content skill + selected-flavor.md (para {tamanho})
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

**Estrutura por tamanho (ler `selected-flavor.md` para verificar {tamanho}):**

| Tamanho | Chars | Estrutura |
|---------|-------|-----------|
| **Low** | ≤ 700 | Hook + corpo breve (1-2 parágrafos) + CTA + hashtags. **SEM insights numerados.** |
| **Medium** | 700–1500 | Hook + corpo (2-3 parágrafos) + insights (3-5 pontos) + takeaway + CTA + hashtags. |
| **Large** | 1500–3000 | Hook + corpo (3-4 parágrafos) + insights (5-7 pontos) + takeaway + CTA + hashtags. |

Para cada variante:
1. Hook: primeiros ~210 caracteres (antes do "see more"), obrigatoriamente em primeira pessoa
2. Corpo: parágrafos curtos (1-2 frases cada, linha em branco entre eles) — quantidade conforme tamanho
3. Insights: pontos numerados ou bullets (apenas Medium e Large; Low pula esta seção)
4. Takeaway: 1-2 frases de conclusão (Low: pode combinar com CTA)
5. CTA: pergunta genuína e específica para o público deste colaborador
6. Hashtags: 3-5 hashtags relevantes, última linha

**Restrições:**
- PROIBIDO links no corpo do post
- PROIBIDO hashtags no meio do texto
- PROIBIDO jargão corporativo (alavancar, sinergia, ecossistema, paradigma)
- PROIBIDO stats sem base no research-brief
- Respeitar limite de caracteres do tamanho: Low ≤ 700, Medium ≤ 1500, Large ≤ 3000
- Idioma: {idioma} (adaptar referências ao mercado correspondente)

Salvar ambas as variantes em `squads/ghostwriter-linkedin/output/post-variants.md` com o formato:

```
# Variantes do Post — {perfil} / {flavor} / {idioma} / {tamanho}

---

## Variante A — [tipo de hook]

[post completo]

---

## Variante B — [tipo de hook]

[post completo]
```
