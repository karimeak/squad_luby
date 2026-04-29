---
task: "Load Persona for Article"
order: 1
input: |
  - research_brief: {name}/research-brief.md
  - collaborator: dados do collaborator (collaborator-queue.json)
output: |
  - persona_brief: {name}/persona-brief.md
---

# Load Persona for Article

Cruza o perfil do collaborator com o research-brief e produz um persona-brief orientado para artigo longo: ângulo, dados filtrados, voice markers distribuídos e estrutura sugerida.

## Process

1. **Ler research-brief.md**: Absorver Key Findings, Frameworks, Case Studies, Trending Angles e Material por Seção.

2. **Carregar perfil do collaborator** do collaborator-queue.json: name, role, audience_en, objective_en, topics, tone_en, voice_markers_en, avoid.

3. **Cruzamento persona × research**:
   - Quais Trending Angles fazem sentido para a voz e expertise desta persona?
   - Quais Key Findings são mais relevantes para o público específico do collaborator?
   - Qual framework do research o collaborator pode genuinamente endossar ou adaptar?
   - Quais dados o collaborator usaria em uma conversa real sobre este tema?

4. **Selecionar ângulo recomendado**: 1 ângulo primário com justificativa clara em termos de persona + audiência. Verificar se há material suficiente no research para 3-5 seções.

5. **Filtrar dados para artigo**: Selecionar 5-8 dados/findings mais relevantes para o público do collaborator. Para cada um: por que é relevante para ESTA audiência.

6. **Definir voice markers distribuídos**: Do array voice_markers_en, selecionar 4-5 e definir em qual momento do artigo cada um aparece mais naturalmente (intro, seção 1, seção 3, conclusão, etc.).

7. **Propor estrutura do artigo** (baseada no research disponível):
   - Headline tentativo (SEO-friendly, 60-100 chars)
   - Intro: qual problema abre o artigo?
   - Seção 1: tema + dados disponíveis
   - Seção 2: tema + dados disponíveis
   - Seção 3: tema + dados disponíveis
   - (Seção 4 opcional se houver material)
   - Conclusão: qual insight síntese?
   - CTA: qual pergunta faz sentido para esta audiência?

8. **Produzir persona-brief.md**.

## Output Format

```markdown
# Persona Brief — {name} / {flavor} / EN Article

**Collaborator:** {name}
**Papel:** {role}
**Audiência:** {audience_en}
**Objetivo:** {objective_en}

---

## Ângulo Recomendado

**Tipo:** {tipo: Autoritativo / Educacional / Narrativo / Analítico / Provocativo / Prático}
**Justificativa:** {por que este ângulo para esta persona e audiência}
**Material disponível:** {quais dados/frameworks do research sustentam este ângulo}

---

## Dados Filtrados do Research

1. "{dado}" — {confidence} — {por que é relevante para ESTA audiência}
2. "{dado}" — ...
3. "{dado}" — ...
(mínimo 5 para artigo)

---

## Voice Markers Ativos

1. "{marker}" — usar em: {intro / seção X / conclusão}
2. "{marker}" — usar em: ...
3. "{marker}" — usar em: ...
4. "{marker}" — usar em: ...

---

## Estrutura Sugerida do Artigo

**Headline tentativo:** {60-100 chars, keyword na frente}

**Intro:** {qual problema / hook abre o artigo — 1 parágrafo}

**Seção 1 — {subheading}:** {o que abordar + dados disponíveis}
**Seção 2 — {subheading}:** {o que abordar + dados disponíveis}
**Seção 3 — {subheading}:** {o que abordar + dados disponíveis}
**(Seção 4 — {subheading}, se houver material)**

**Conclusão:** {qual insight síntese — 1 linha}
**CTA:** {qual pergunta para os comentários}

---

## Evitar

- {itens do campo avoid do perfil}
- {anti-patterns temáticos identificados no research}
```

## Output Example

```markdown
# Persona Brief — Rodrigo / AI Agents in Enterprise Dev / EN Article

**Collaborator:** Rodrigo
**Papel:** CTO / Engineering Lead
**Audiência:** Engineering managers, CTOs and senior developers at mid-to-large companies
**Objetivo:** Position Rodrigo as a pragmatic tech leader who cuts through AI hype with evidence

---

## Ângulo Recomendado

**Tipo:** Autoritativo
**Justificativa:** Rodrigo tem histórico de adoção de ferramentas de AI na Luby. O público de CTOs/EMs quer perspectiva de alguém que já passou pelo processo, não teoria. O ângulo autoritativo ("I've seen what actually works") é mais convincente que o analítico (puramente dados) para esta audiência.
**Material disponível:** GitHub 55% data (verificado), OWASP failure modes, Framework Human-in-the-Loop, Shopify case study.

---

## Dados Filtrados do Research

1. "GitHub Copilot users complete tasks 55% faster — but only for well-defined, repetitive coding tasks" — HIGH — Rodrigo's audience needs the nuance, not just the headline
2. "Top 3 AI agent failure modes: context hallucination (67%), over-reliance without review (51%), security gaps (43%)" — HIGH — CTOs need to know the risks, not just the benefits
3. "McKinsey: 30-45% of software tasks automatable by AI by 2030" — MEDIUM — useful for the 'future of the role' angle
4. "Human-in-the-Loop framework: AI handles generation/repetition, humans own architecture and review" — framework — gives Rodrigo a structured recommendation to make
5. "Shopify: 30% reduction in time-to-PR with AI pair programming" — MEDIUM — real enterprise case that CTOs respect

---

## Voice Markers Ativos

1. "In practice" — usar em: Seção 1 e 3 (contraposição entre teoria e realidade)
2. "What I've seen work" — usar em: Intro e Seção 3 (âncora de autoridade)
3. "The real question is" — usar em: Seção 2 (virada argumentativa)
4. "Don't optimize for speed alone" — usar em: Conclusão (síntese de posição)

---

## Estrutura Sugerida do Artigo

**Headline tentativo:** AI Agents Won't Replace Your Engineers — But They'll Expose the Weak Ones

**Intro:** Abrir com a promessa do "55% productivity gain" e imediatamente problematizar: gain in what, exactly? Estabelecer que a maioria das empresas está adotando AI tools sem medir o que importa.

**Seção 1 — What the productivity data actually says (and what it hides):** GitHub data + nuance de quais tarefas. Não é muro de tijolos, é cimento.
**Seção 2 — The 3 failure modes nobody talks about:** OWASP report — context hallucination, over-reliance, security gaps. Prático e acionável.
**Seção 3 — A framework that actually works: Human-in-the-Loop:** martinfowler framework + como Rodrigo implementou na Luby.
**Seção 4 — How to measure what matters:** métricas sugeridas além de "velocidade" — qualidade, revisão, arquitetura.

**Conclusão:** AI agents amplify your best engineers and expose your weakest habits. The technology is the easy part.
**CTA:** "What's the first thing you changed in your team's workflow when you adopted AI tools — and what surprised you most?"

---

## Evitar

- Hype sem substância: "AI is changing everything" sem dados
- Posição extrema anti-AI (persona é pragmático, não cético)
- Números sem fonte no research-brief
- Linguagem corporativa: leverage, synergy, paradigm shift
```

## Quality Criteria

- [ ] Ângulo recomendado com justificativa clara em termos de persona + audiência
- [ ] Mínimo 5 dados filtrados com relevância explicada
- [ ] Voice markers com posicionamento distribuído no artigo
- [ ] Estrutura sugerida com headline tentativo e 3-5 seções
- [ ] CTA adequada à audiência específica
- [ ] Lista de evitações preenchida

## Veto Conditions

Reject and redo if ANY are true:
1. Estrutura sugerida tem menos de 3 seções — insuficiente para artigo de 1.500+ words
2. Ângulo recomendado não tem material suficiente no research para sustentá-lo
