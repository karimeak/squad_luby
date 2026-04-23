---
step: step-03-write
name: Escrita do Post EN
type: agent
agent: bruno
execution: inline
---

# Step 03 — Escrita do Post EN

## Objetivo
Bruno escreve 1 post LinkedIn Text Medium (700-1500 chars) em ingles para o collaborator atual, usando o research-brief e persona-brief como base.

## Instrucoes para Bruno

### Input
- Ler `.agents/skills/linkedin-content/SKILL.md` — Hook Formulas, Formatting Rules
- Ler `{name}/research-brief.md` — dados disponiveis e verificados
- Ler `{name}/persona-brief.md` — angulo, voice markers, dados filtrados
- Ler `squads/ghostwriter-linkedin-auto/pipeline/data/tone-of-voice.md` — regras universais

### Processo
1. **Hook** (~210 chars): Aplicar tipo recomendado pelo persona-brief. Scroll-stop test.
2. **Corpo** (2-3 paragrafos): Primeira pessoa. 1-2 frases por paragrafo. Linha em branco entre blocos. 1+ dado do research com fonte entre parenteses. 1-2 voice markers EN.
3. **Insights** (3-5 pontos): Numerados. 1 ideia acionavel por ponto.
4. **Takeaway + CTA**: 1-2 frases de conclusao + pergunta genuina e especifica.
5. **Hashtags**: 3-5 na ultima linha. Mix broad + niche.

### Regras
- Formato: Text Post Medium (700-1500 chars)
- Idioma: EN-US (American English — referências US/global)
- 1 variante apenas (sem A/B)
- Cada dado/statistic deve ter fonte entre parenteses: "(McKinsey, 2025)"
- Sem links no corpo, sem hashtags no meio, sem jargao corporativo
- Sem emojis no inicio do post

### Verificacao
- [ ] Hook <= ~210 chars
- [ ] Todos os dados estao no research-brief
- [ ] Fonte entre parenteses em cada dado
- [ ] Nenhum link no corpo
- [ ] 1-2 frases por paragrafo
- [ ] Total 700-1500 chars
- [ ] Soa como o collaborator, nao como IA

### Output
Salvar `{name}/post-en.md` no diretorio de output do run.

## Next
step-04-translate (Bruno traduz para PT-BR)
