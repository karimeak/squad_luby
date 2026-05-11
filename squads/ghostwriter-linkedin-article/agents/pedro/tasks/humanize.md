---
task: humanize
agent: pedro
execution: inline
skill: humanizer
inputs:
  - .claude/skills/humanizer/SKILL.md
  - squads/ghostwriter-linkedin-article/output/{name}/persona-brief.md
  - squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-en.md
  - squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-pt.md
  - squads/ghostwriter-linkedin-article/output/{name}/review-report.md
outputs:
  - squads/ghostwriter-linkedin-article/output/{name}/humanized-article-en.md
  - squads/ghostwriter-linkedin-article/output/{name}/humanized-article-pt.md
  - squads/ghostwriter-linkedin-article/output/{name}/review-report.md (apêndice)
---

# Task: Humanizar artigo (EN e PT-BR)

Pedro recebe os artigos longos já revisados pela Helena (tech + estrutura) e remove tells de escrita IA, preservando voz do collaborator, dados e estrutura.

## Pré-requisitos

1. Ler `.claude/skills/humanizer/SKILL.md` (checklist completa de 24 categorias)
2. Ler `persona-brief.md` (voice markers a preservar)
3. Ler `reviewed-article-en.md` e `reviewed-article-pt.md`
4. Ler `review-report.md` (Helena já corrigiu; não desfazer)

## Processo (por idioma)

### 1. Detecção (varredura por seção)

Para cada seção do artigo (intro, seções do corpo, conclusão), contar **categorias humanizer distintas** com 1+ ocorrência. Lista completa das 24 categorias no `pedro.agent.md` seção "Detecção".

### 2. Pontuação (1–10)

```
Score = 10 - penalidade
1–2 categorias   → -1
3–4 categorias   → -2
5–6 categorias   → -3
7–9 categorias   → -5
10+ categorias   → -7
Concentração (3+ ocorrências da mesma categoria) → -2 extra por categoria concentrada
```

Threshold de aprovação: **7.0/10**.

### 3. Auto-Fix

- Score ≥ 7.0 → APPROVED
- Score 5.0–6.9 → AUTO-FIX (até 2 retries)
- Score < 5.0 → AUTO-FIX (até 2 retries)
- Após 2 retries: ACCEPT WITH WARNING (`humanization_warning: true`)

### 4. Regras de reescrita

- **Headline:** só toca em caso flagrante (vocabulário inflado, em-dash duplo, inflated symbolism)
- **Intro:** preserva o hook (primeira frase)
- **Seções:** preserva subheadings (converte title case → sentence case se aplicável), preserva takeaway, reescreve corpo
- **Conclusão:** se genérica positiva, reescreve para insight específico
- **CTA:** só toca em caso flagrante
- **Hashtags, dados, citações, números, links:** intocáveis
- **Em-dash:** nunca introduzir (—); usar vírgula, ponto ou dois-pontos
- **Word count:** EN 1.500–2.000 / PT-BR 1.400–1.900 (manter no range)
- **Voice markers:** preservar

## Substituições rápidas

**EN:** leverage→use, delve→look at, robust→solid, seamless→smooth, foster→build, pivotal→important, crucial→essential, showcase→show, highlight→show, underscore→emphasize, testament→proof, additionally/moreover/furthermore→also (ou começar frase nova)

**PT-BR:** alavancar→usar/aproveitar, mergulhar profundamente→analisar/olhar de perto, robusto→sólido/confiável, fluido→suave, fomentar→incentivar/apoiar, pivotal→importante/central, crucial→essencial, destacar→mostrar, sublinhar→enfatizar, testemunho→prova, além disso/adicionalmente→também (ou começar frase nova)

## Output

### Arquivos novos

- `humanized-article-en.md` — versão final EN (1.500–2.000 words)
- `humanized-article-pt.md` — versão final PT-BR (1.400–1.900 words)

### Apêndice em `review-report.md`

```markdown
## Humanization Pass — Pedro

### EN-US
- Score inicial: X.X/10
- Categorias detectadas: [lista]
- Auto-fix: 0 / 1 / 2 retries
- Score final: X.X/10
- Word count final: {N} words
- Verdict: APPROVED / FIXED / WARNING

### PT-BR
- Score inicial: X.X/10
- Categorias detectadas: [lista]
- Auto-fix: 0 / 1 / 2 retries
- Score final: X.X/10
- Word count final: {N} words
- Verdict: APPROVED / FIXED / WARNING

### Reescritas aplicadas (top 8)
1. EN, seção "{titulo}": "{original}" → "{reescrita}" (categoria: {nome})
2. PT, conclusão: "{original}" → "{reescrita}" (categoria: {nome})
3. ...

humanization_warning: false | true
```

## Quality Gates

- [ ] Score ≥ 7.0/10 em EN e PT-BR (ou WARNING após 2 retries)
- [ ] Word count EN 1.500–2.000 / PT-BR 1.400–1.900
- [ ] Sem em-dash novo
- [ ] Headline, dados, links, citações, CTA, hashtags intactos
- [ ] Voice markers preservados
- [ ] Apêndice em review-report.md com seção + categoria por reescrita
