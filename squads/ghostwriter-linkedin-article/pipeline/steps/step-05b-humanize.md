---
step: step-05b-humanize
name: Humanização (Pedro — remoção de tells de IA em artigos longos)
type: agent
agent: pedro
execution: inline
model_tier: powerful
max_retries: 2
skills:
  - humanizer
inputFile: squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-en.md
outputFile: squads/ghostwriter-linkedin-article/output/{name}/humanized-article-en.md
---

# Step 05b — Humanização (Pedro)

## Objetivo

Pedro recebe os artigos longos EN e PT-BR já revisados pela Helena (tech + estrutura) e remove tells de escrita IA, aplicando a skill `humanizer`. Em modo automático, Pedro auto-corrige trechos problemáticos em vez de rejeitar (até 2 tentativas).

> **Helena já cuidou de fact-checking, word count e estrutura.** Pedro NÃO refaz isso. Foco único: humanização preservando voz do colaborator.

## Context Loading

- `.claude/skills/humanizer/SKILL.md` — checklist completa de 24 categorias (carregar antes da análise)
- `squads/ghostwriter-linkedin-article/output/{name}/persona-brief.md` — voice markers a preservar
- `squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-en.md` — versão pós-Helena (tech + estrutura clean)
- `squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-pt.md` — versão pós-Helena (tech + estrutura clean)
- `squads/ghostwriter-linkedin-article/output/{name}/review-report.md` — histórico de fixes da Helena (não desfazer)
- `squads/ghostwriter-linkedin-article/agents/pedro/tasks/humanize.md` — instruções detalhadas

## Instructions

### Process (para CADA idioma — EN e PT-BR)

1. Carregar a skill `humanizer` e a checklist de 24 categorias
2. Varrer o artigo por seção (intro, corpo, conclusão) e contar categorias humanizer distintas com 1+ ocorrência
3. Pontuar 1–10 conforme matriz de penalidade
4. Decidir: APPROVED (≥ 7.0), AUTO-FIX (< 7.0, até 2 retries) ou WARNING (após 2 retries)
5. Aplicar reescritas respeitando regras:
   - Headline, CTA, hashtags, dados, citações, links: intocáveis (salvo categoria humanizer flagrante)
   - Hook da intro preservado
   - Subheadings preservados (com conversão title case → sentence case se aplicável)
   - Voice markers do collaborator preservados
   - Sem introduzir em-dash novo (—)
   - Word count em range: EN 1.500–2.000 / PT-BR 1.400–1.900
6. Salvar `humanized-article-en.md` e `humanized-article-pt.md`
7. Appendar seção "Humanization Pass — Pedro" ao `review-report.md` com scoring, categorias detectadas e top 8 reescritas (com seção + categoria por reescrita)

## Output Format

### Arquivos novos

- `{name}/humanized-article-en.md` — versão final EN pós-humanização
- `{name}/humanized-article-pt.md` — versão final PT-BR pós-humanização

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

## Veto Conditions

Pedro NÃO veta o pipeline. Mesmo em score < 5.0 após 2 retries, accept com WARNING e seguir para step-06.

## Quality Criteria

- [ ] Score humanização ≥ 7.0/10 em EN e PT-BR (ou WARNING após 2 retries)
- [ ] Voice markers do collaborator preservados
- [ ] Word count EN 1.500–2.000 / PT-BR 1.400–1.900
- [ ] Sem em-dash novo introduzido (—)
- [ ] Headline, dados, links, citações, CTA, hashtags intactos
- [ ] `humanized-article-en.md` e `humanized-article-pt.md` salvos
- [ ] Apêndice em `review-report.md` com seção + categoria por reescrita

## Next

step-06-image-prompt (Diana lê `humanized-article-en.md` como fonte do conceito visual em vez de `reviewed-article-en.md`)
