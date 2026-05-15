---
type: agent
agent: bruno
execution: inline
model_tier: powerful
---

# Escrita de Variantes A/B — Conteúdo LinkedIn

O Bruno Ghostwriter vai escrever 2 variantes A/B de conteúdo LinkedIn em **{idioma}** no tom do colaborador **{perfil}**, no formato **{formato}**, usando os dados do research e o persona-brief.

**Input:** research-brief.md + persona-brief.md + tone-of-voice.md + linkedin-content skill + selected-flavor.md (para {formato} e {tamanho})
**Output:** `squads/ghostwriter-linkedin/output/post-variants.md`

**Referências obrigatórias antes de escrever:**
- Ler `squads/ghostwriter-linkedin/output/research-brief.md`
- Ler `squads/ghostwriter-linkedin/output/persona-brief.md`
- Ler `squads/ghostwriter-linkedin/pipeline/data/tone-of-voice.md`
- Aplicar regras da skill `linkedin-content` (.agents/skills/linkedin-content/SKILL.md)
- Ler `selected-flavor.md` para verificar {formato} e {tamanho}

**Tarefa write-variants.md:**

Escrever 2 variantes completas usando abordagens DIFERENTES, adaptadas ao formato selecionado.

---

## Formato: Text Post

**Variante A** — Hook baseado em contrarian take ou personal story
**Variante B** — Hook baseado em dado/estatística ou list promise

**Estrutura por tamanho:**

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

---

## Formato: Carousel (Document Post)

**Variante A** — Abordagem didática/framework (passo-a-passo, lista de dicas, como fazer)
**Variante B** — Abordagem narrativa/contrarian (mito vs realidade, antes vs depois, história com lições)

Para cada variante, gerar roteiro completo de carrossel:

1. **Slide 1 — Hook**: 1 frase provocativa ou dado impactante (máx 20 palavras). Deve parar o scroll.
2. **Slides 2 a N — Conteúdo**: Um conceito por slide, máximo 25 palavras. Progressão lógica.
3. **Slide final — CTA**: Chamada para ação específica (comentar, salvar, seguir).
4. **Total**: 10-15 slides recomendados.
5. **Design por slide**: Descrever layout visual, elemento de destaque, paleta (usar cores da marca do colaborador ou neutras: azul corporativo, branco, cinza escuro).

**Estrutura de output por variante:**
```
## Variante [A/B] — [abordagem]

**Total de slides:** {N}
**Abordagem:** {descrição}

### Slide 1 — Hook
**Texto:** {hook — máx 20 palavras}
**Design:** {layout visual}

### Slide 2 — {subtítulo}
**Texto:** {conteúdo — máx 25 palavras}
**Design:** {elemento visual}

[repetir para todos os slides]

### Slide {N} — CTA
**Texto:** {chamada para ação}
**Design:** {layout final}
```

**Também gerar o caption** (texto que acompanha o carrossel no feed):
- Hook forte (~210 chars antes do "see more")
- 1-2 parágrafos de contexto
- CTA convidando a deslizar
- 3-5 hashtags

---

## Formato: Poll (Enquete)

**Variante A** — Poll de opinião polarizada (pergunta que divide, opções provocativas)
**Variante B** — Poll de diagnóstico/auto-avaliação (pergunta que faz o leitor refletir sobre si)

Para cada variante:

1. **Texto de contexto** (aparece acima da enquete):
   - Hook forte (~210 chars antes do "see more")
   - Contexto: 1-3 parágrafos curtos explicando por que a pergunta importa
   - Estrutura por tamanho (Low/Medium/Large, mesmas regras do Text Post)
   - CTA convidando a votar e comentar o porquê

2. **Pergunta da enquete**: Clara, concisa, sem ambiguidade. Máximo ~140 caracteres.

3. **Opções de resposta**: Exatamente 4 opções.
   - Cada opção: curta (máx 30 caracteres)
   - As opções devem cobrir um espectro real de respostas
   - Evitar opção "Outro" — forçar escolha
   - Uma opção levemente provocativa gera mais comentários

4. **Duração recomendada**: 1 semana (padrão) ou 2 semanas (temas amplos)

5. **Hashtags**: 3-5 na última linha do texto de contexto

**Estrutura de output por variante:**
```
## Variante [A/B] — [abordagem]

### Texto de Contexto
{texto completo com hook + corpo + CTA}

### Enquete
**Pergunta:** {pergunta}
**Opções:**
1. {opção 1}
2. {opção 2}
3. {opção 3}
4. {opção 4}
**Duração:** {1 semana / 2 semanas}

### Hashtags
{hashtags}
```

---

## Formato: Article (Artigo)

**Variante A** — Abordagem analítica (análise de mercado, tendência, dados com interpretação)
**Variante B** — Abordagem experiencial (história pessoal/profissional com framework prático)

Para cada variante:

1. **Headline**: SEO-friendly, específico, gera curiosidade. 60-100 caracteres ideal, máx 220. Keyword principal nos primeiros 70 chars.

2. **Descrição da cover image**: Conceito visual relevante (não stock genérico).

3. **Introdução** (150-250 palavras): Hook nas primeiras 2-3 frases. Problema claro. Preview do que o leitor vai aprender.

4. **Corpo** (3-5 seções, 250-400 palavras cada):
   - Cada seção com H2 subheading informativo
   - Pelo menos 1 dado, case study ou exemplo concreto por seção
   - Takeaway acionável ao final de cada seção
   - Parágrafos de 2-4 frases máximo

5. **Conclusão** (100-200 palavras): Sintetizar em 1 insight memorável.

6. **CTA**: Uma pergunta ou ação clara no final.

7. **Total**: 1.500-2.000 palavras.

**Estrutura de output por variante:**
```
## Variante [A/B] — [abordagem]

### Headline
{headline}

### Cover Image
{descrição do conceito visual}

### Introdução
{texto 150-250 palavras}

### {Subheading Seção 1}
{texto 250-400 palavras}
**Takeaway:** {ação concreta}

### {Subheading Seção 2}
{texto 250-400 palavras}
**Takeaway:** {ação concreta}

[repetir para 3-5 seções]

### Conclusão
{texto 100-200 palavras}

### CTA
{pergunta ou chamada para ação}
```

---

## Restrições Universais (todos os formatos)

- PROIBIDO links no corpo do post/texto
- PROIBIDO hashtags no meio do texto
- PROIBIDO jargão corporativo (alavancar, sinergia, ecossistema, paradigma)
- PROIBIDO stats sem base no research-brief
- Idioma: {idioma} (adaptar referências ao mercado correspondente)
- Tudo em primeira pessoa, na voz do colaborador

Salvar ambas as variantes em `squads/ghostwriter-linkedin/output/post-variants.md` com o formato:

```
# Variantes — {perfil} / {flavor} / {idioma} / {formato} / {tamanho}

---

## Variante A — [abordagem]

[conteúdo completo]

---

## Variante B — [abordagem]

[conteúdo completo]
```
