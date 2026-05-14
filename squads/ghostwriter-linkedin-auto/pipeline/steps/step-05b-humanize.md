---
step: step-05b-humanize
name: Humanizacao (Pedro — remocao de tells de IA)
type: agent
agent: pedro
execution: inline
model_tier: powerful
max_retries: 2
skills:
  - humanizer
---

# Step 05b — Humanizacao (Pedro)

## Objetivo

Pedro recebe os posts ja revisados pela Helena **apenas nas linguas-alvo** do collaborator (campo `languages` em `collaborator-queue.json`) e remove tells de escrita IA, aplicando a skill `humanizer`. Em modo automatico, Pedro auto-corrige trechos problematicos em vez de rejeitar (ate 2 tentativas).

> **Helena ja cuidou de fact-checking e engagement.** Pedro NAO refaz isso. Foco unico: humanizacao.
>
> **Language-aware:** Se `"en-us"` em languages → processa `reviewed-post-en.md` e gera `humanized-post-en.md`. Se `"pt-br"` em languages → processa `reviewed-post-pt.md` e gera `humanized-post-pt.md`. Se so 1 lingua, so essa.

## Inputs

- `.claude/skills/humanizer/SKILL.md` — checklist completa (carregar antes da analise)
- `{run_output}/{name}/_collab.json` — voice_markers para preservar
- `collaborator-queue.json` — para extrair `languages`
- `{run_output}/{name}/reviewed-post-en.md` — **se `"en-us"` em languages**
- `{run_output}/{name}/reviewed-post-pt.md` — **se `"pt-br"` em languages**
- `{run_output}/{name}/review.md` — historico de fixes da Helena (nao desfazer)

## Processo (para CADA idioma-alvo do collaborator)

### 1. Deteccao por categoria

Aplicar a checklist humanizer e contar **categorias distintas** com 1+ ocorrencia:

1. Em-dash em excesso (mais de 2 no post)
2. Rule of three (series de exatamente 3 itens repetitivas)
3. Vocabulario inflado:
   - **EN:** delve, leverage, robust, seamless, foster, navigate, unleash, tapestry, vibrant, intricate, multifaceted
   - **PT-BR:** alavancar, mergulhar profundamente, robusto, fluido, fomentar, navegar, desbravar, vibrante, intrincado, multifacetado
4. Atribuicoes vagas: "studies show", "experts believe", "many argue", "muitos especialistas dizem", "estudos mostram"
5. Paralelismos negativos: "not just X, it's Y", "more than just", "nao apenas X, mas Y", "mais do que X, e Y"
6. Conjuncoes formais: Moreover, Furthermore, Additionally, In conclusion, Alem disso, Adicionalmente, Em conclusao
7. Analise -ing superficial: "highlighting the importance of", "showcasing how", "demonstrando como", "destacando a importancia de"
8. Promocional vazio: groundbreaking, revolutionary, game-changing, transformador, revolucionario
9. Inflated symbolism: "stands as a testament", "marks a pivotal moment", "serve como um lembrete", "marca um momento decisivo"
10. Frases-resumo redundantes no fim de paragrafo
11. "It's worth noting that…" / "Vale ressaltar que…"
12. Voz passiva sem motivo (use ativa quando o sujeito e claro)

### 2. Pontuacao (1–10 por idioma)

```
Score = 10 - penalidade
Penalidade por categoria detectada:
  1 categoria  → -1
  2 categorias → -2
  3 categorias → -3
  4-5 categorias → -5
  6+ categorias → -7
Concentracao (3+ ocorrencias da MESMA categoria) → -2 extra
```

Threshold de aprovacao: **7.0/10**.

### 3. Auto-Fix Decision

- Score >= 7.0 → APPROVED, sem mexer
- Score 5.0-6.9 → AUTO-FIX (1a tentativa): reescrever apenas as passagens flagged
- Score < 5.0 → AUTO-FIX (1a tentativa): reescrever passagens criticas
- Apos 1 retry, se ainda < 7.0 → AUTO-FIX (2a e ultima tentativa)
- Apos 2 retries, se ainda < 7.0 → ACCEPT WITH WARNING (registrar `humanization_warning: true` no review)

### 4. Reescrita (regras)

- Preservar hook (primeira linha) sempre que possivel
- Preservar hashtags, paragrafos, dados, citacoes, CTAs
- Preservar voice_markers do collaborator
- NUNCA introduzir em-dash novo (—)
- Substituir vocabulario inflado por equivalente cotidiano (ex: leverage → use; alavancar → usar)
- Manter char count em 700–1.500

## Output

### Arquivos novos (apenas para linguas-alvo)

- `{run_output}/{name}/humanized-post-en.md` — **se `"en-us"` em languages** — versao final EN pos-humanizacao
- `{run_output}/{name}/humanized-post-pt.md` — **se `"pt-br"` em languages** — versao final PT-BR pos-humanizacao

### Apendice em `review.md`

Appendar:

```markdown
## Humanization Pass — Pedro

### EN
- Score inicial: X.X/10
- Categorias detectadas: [lista]
- Auto-fix: 0 / 1 / 2 retries
- Score final: X.X/10
- Verdict: APPROVED / FIXED / WARNING

### PT-BR
- Score inicial: X.X/10
- Categorias detectadas: [lista]
- Auto-fix: 0 / 1 / 2 retries
- Score final: X.X/10
- Verdict: APPROVED / FIXED / WARNING

### Reescritas aplicadas (top 5)
1. EN: "{trecho original}" → "{reescrita}" (categoria: vocabulario inflado)
2. PT: "{trecho original}" → "{reescrita}" (categoria: paralelismo negativo)
3. ...
```

## Veto Conditions

Pedro NAO veta o pipeline. Mesmo em score < 5.0 apos 2 retries, accept com WARNING e seguir.

## Next

step-05c-video-selection (Lucas seleciona 2 collaborators para receber video — roda 1x por run apos humanizacao terminar para todos os collaborators)
