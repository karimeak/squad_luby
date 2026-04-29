---
task: "Write LinkedIn Article EN-US"
order: 1
input: |
  - research_brief: {name}/research-brief.md
  - persona_brief: {name}/persona-brief.md
  - tone_of_voice: squads/ghostwriter-linkedin-article/pipeline/data/tone-of-voice.md
  - quality_criteria: squads/ghostwriter-linkedin-article/pipeline/data/quality-criteria.md
output: |
  - article_en: {name}/article-en.md
---

# Write LinkedIn Article EN-US

Escreve o artigo LinkedIn completo em EN-US (1.500-2.000 words) na voz do collaborator, usando a estrutura sugerida por Sofia e os dados verificados do research de Marco.

## Process

1. **Ler todos os inputs** antes de escrever qualquer linha:
   - research-brief.md: Key Findings, Frameworks, Case Studies, Angles
   - persona-brief.md: ângulo recomendado, dados filtrados, voice markers, estrutura sugerida
   - tone-of-voice.md: tom recomendado para este collaborator
   - quality-criteria.md: critérios de aprovação

2. **Escrever o headline** (antes do corpo):
   - SEO-friendly: keyword ou tópico principal nos primeiros 60 chars
   - Curiosidade ou benefício claro — o leitor sabe por que clicar
   - Máximo 100 characters. Testar: "Se eu visse isso no feed, clicaria?"
   - Se o headline não passa no teste, reescrever antes de avançar

3. **Escrever a introdução** (150-250 words):
   - Frase 1-2: hook que cria urgência, curiosidade ou contradiz expectativa
   - Parágrafo 2: estabelece o problema que o artigo vai endereçar
   - Parágrafo 3: preview do que o leitor vai aprender (sem spoilar a conclusão)
   - Verificar: os primeiros 2-3 parágrafos aparecem como preview no feed — precisam convencer o clique

4. **Escrever cada seção** (250-400 words cada):
   - Subheading H2 informativo: o leitor entende o argumento só pelo subheading
   - Abrir a seção com a ideia central, não com contexto
   - Usar pelo menos 1 dado concreto com fonte entre parênteses
   - Parágrafos de máximo 3-4 frases com linha em branco entre eles
   - Terminar a seção com takeaway explícito: "The practical implication: ..."

5. **Escrever a conclusão** (100-200 words):
   - NÃO resumir o que foi dito — sintetizar UM insight que ficará na cabeça do leitor
   - O leitor deve sair com uma frase que vai repetir para um colega

6. **Escrever o CTA**:
   - UMA pergunta genuína e específica para o público do collaborator
   - Ruim: "What do you think?"
   - Bom: "What's the biggest bottleneck you hit when trying to introduce AI agents to a team that's never used them?"

7. **Verificação final** antes de salvar:
   - [ ] Word count: 1.500-2.000 words?
   - [ ] Headline: 60-100 chars com keyword?
   - [ ] Todos os dados estão no research-brief?
   - [ ] Cada dado tem fonte entre parênteses?
   - [ ] Voice markers do persona-brief distribuídos ao longo do artigo (min 4)?
   - [ ] Cada seção tem takeaway?
   - [ ] Parágrafos máximo 3-4 frases?
   - [ ] CTA é 1 pergunta específica?

## Output Format

```markdown
# {Headline — 60-100 chars}

{Introdução — 150-250 words}
{Hook nas primeiras 2-3 frases}
{Problema}
{Preview do artigo}

---

## {Subheading Seção 1 — informativo}

{Corpo da seção — 250-400 words}
{Parágrafos curtos, dados com fonte}

**Takeaway:** {1-2 frases com o que o leitor leva desta seção}

---

## {Subheading Seção 2}

{Corpo — 250-400 words}

**Takeaway:** {1-2 frases}

---

## {Subheading Seção 3}

{Corpo — 250-400 words}

**Takeaway:** {1-2 frases}

---

## {Subheading Seção 4, se houver material}

{Corpo — 250-400 words}

**Takeaway:** {1-2 frases}

---

## {Conclusão / Final Thoughts}

{100-200 words — 1 insight memorável, não resumo}

---

**{CTA — 1 pergunta específica para a audiência}**

---
*Word count: {N} words | Language: EN-US*
```

## Output Example

```markdown
# AI Agents Won't Replace Your Engineers — But They'll Expose the Weak Ones

I've spent the last 18 months helping engineering teams integrate AI coding agents. The pitch is always the same: "GitHub Copilot increases productivity by 55%." (GitHub Research, 2022)

That number is real. But it's measuring the wrong thing.

Here's what I've seen happen when companies adopt AI agents without a framework: the fast engineers get faster. The shallow ones get a very expensive crutch. And the gap between your best and worst performers doesn't close — it widens.

In this article, I'll share the framework we use at Luby to introduce AI agents in a way that actually improves team quality, not just velocity.

---

## What the Productivity Data Actually Says (and What It Hides)

The 55% figure comes from GitHub's research on well-defined, repetitive coding tasks — things like writing boilerplate, completing function signatures, and generating test stubs.

What it doesn't measure: architecture decisions. Code review quality. Debugging novel problems. System design under ambiguous requirements.

McKinsey's 2024 analysis estimates that 30-45% of software engineering tasks could be automated by AI by 2030. The remaining 55-70%? That's exactly where the best engineers live.

The practical implication: if your team is spending most of its time on the 30-45% that AI automates well, you have a different problem than AI can solve.

**Takeaway:** Adopt AI tools to free up time for harder work — not to avoid it.

---

## The 3 Failure Modes Nobody Talks About

OWASP's AI Security Report (2025) analyzed 200+ enterprise AI agent deployments. The three most common failure modes:

1. **Context hallucination (67%)** — The agent generates code that looks correct but doesn't understand the full system context. Engineers who don't review carefully ship bugs.
2. **Over-reliance without review (51%)** — Teams trust AI output without verification, creating a false sense of velocity.
3. **Security policy gaps (43%)** — AI agents trained on public code suggest patterns that violate internal security policies.

The real question is: do your engineers have the judgment to catch these failures? That's not a question about AI — it's a question about your team.

**Takeaway:** AI agents amplify existing engineering judgment. If the judgment isn't there, the agent makes it worse.

---

## A Framework That Actually Works: Human-in-the-Loop

After testing multiple approaches, here's the framework that consistently works in practice at enterprise scale.

The Human-in-the-Loop model (popularized by Martin Fowler's team at ThoughtWorks) divides the work clearly:

- **AI handles**: boilerplate generation, test stubs, documentation drafts, pattern completion
- **Humans own**: architecture decisions, code review, security validation, system design

Shopify's engineering team reported a 30% reduction in time-to-PR using this model — but more importantly, they reported no increase in production incidents. That second number matters more.

**Takeaway:** The best AI integration isn't "AI does more." It's "humans do what only humans should do."

---

## Conclusion

AI agents don't replace engineers. What they do — if you implement them with intention — is create clarity about what engineering actually is.

The engineers who thrive in an AI-augmented environment aren't the fastest coders. They're the ones who understand systems deeply enough to know when the AI is wrong.

That's the real productivity gain worth measuring.

---

**What's the first thing you changed in your team's workflow when you adopted AI tools — and what surprised you most about the result?**

---
*Word count: 1.847 words | Language: EN-US*
```

## Quality Criteria

- [ ] Word count 1.500-2.000 words
- [ ] Headline 60-100 chars com keyword
- [ ] Introdução 150-250 words com hook + problema + preview
- [ ] 3-5 seções com subheadings informativos
- [ ] Cada seção 250-400 words com pelo menos 1 dado com fonte
- [ ] Takeaway explícito em cada seção
- [ ] Conclusão sintetiza 1 insight (não resume)
- [ ] 1 CTA específico no final
- [ ] Voice markers distribuídos ao longo do artigo

## Veto Conditions

Reject and redo if ANY are true:
1. Word count abaixo de 1.400 words — artigo insuficiente para o formato
2. Qualquer dado apresentado como fato não está no research-brief — alucinação crítica
