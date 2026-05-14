# Storyboard — The Bottleneck Isn't the Model (Rodrigo, EN-Personal)

## Choreography summary
Vídeo em luby-premium uniforme, dark do começo ao fim (sem theme schedule). Personal mode com speaker badge Rodrigo / Técnico / CTO @ Luby mantido top-left via BrandFrame. Logo Luby auto-suppressed em logo-mark + closing-card.

Arco visual: tagline contrarian declarativa (Intro) → giant-statement "19% slower" (Hook) → multiplication-equation 1.6% × 98.4% = working agent (Bullets — HERO técnico) → big-stat comparison-bars +242.7% incidents (Stat) → closing-card pergunta técnica (CTA).

Memória entre runs vs Karime (run anterior): Hook usa giant-statement (Karime usou split-screen). Bullets usa multiplication-equation (Karime usou vertical-stack). Stat usa comparison-bars (Karime usou typographic). Variação em todos os 3 beats principais.

---

## Cena 1 — Intro (0–90, 3s)
- **Modo**: luby-premium
- **Arquétipo**: `logo-with-bloom` (logo auto-suppressed em personal)
- **Blocks**:
  - `logo-mark` { height: 240, animated: true, idleBreathe: true, startOffset: 0 }
  - `eyebrow` { text: 'AGENT ARCHITECTURE', style: 'mono', startOffset: 14 }
  - `tagline` { text: "The bottleneck isn't the model.", size: 48, align: 'center', startOffset: 18 }
  - `accent-line` { width: 120, thickness: 2, glow: true, startOffset: 26 }

### Highlight frame
Frame 40 — eyebrow + tagline lidas + speaker badge presente.

### Intenção narrativa
- **Feeling**: provocação técnica calma; "espera, é isso?"
- **Memory anchor**: a frase "The bottleneck isn't the model"

---

## Cena 2 — Hook (90–250, 5.3s)
- **Modo**: luby-premium
- **Metáfora**:
  - **chosen**: `paradoxo-stat-shock` (giant-statement)
  - **alternatives_considered**: [`split-screen-comparison`, `concept-row`, `multiplication-equation`]
  - **reasoning**: split-screen acabou de ser usado por Karime (run anterior, mesmo dia). concept-row consumido em 3 das 5 runs anteriores. multiplication-equation reservado pro Bullets (encaixe semântico perfeito lá). `giant-statement` puro com "19% slower." é punch máximo: número gritando, paradoxo (felt 20% faster) embaixo em fonte menor, source METR como sub-line. Block existe na Wave 3, nunca usado em vídeo real novo. Variação real.
- **Arquétipo**: `giant-statement`
- **Blocks**:
  - `giant-statement` {
      text: '19% slower.',
      size: 220,
      weight: 'bold',
      reveal: 'mask-up',
      accent: 'white',
    }
  - (Opcional: bloco eyebrow ou tagline auxiliar embaixo. Vou usar 1 tagline pequeno como sub-line.)
  - `tagline` {
      text: 'Experienced devs with AI in their own codebase. They felt 20% faster. (METR randomized study, 2025)',
      size: 22,
      align: 'center',
      startOffset: 24,
    }

### Highlight frame
Frame 165 — "19% slower." preenchendo tela + sub-line lida.

### Intenção narrativa
- **Feeling**: choque cognitivo; "espera, ISSO é o oposto do que eu achava"
- **Memory anchor**: "19% slower"

---

## Cena 3 — Bullets (250–610, 12s) — HERO
- **Modo**: luby-premium
- **Metáfora**:
  - **chosen**: `equacao-multiplicativa` (Seção B Composição)
  - **alternatives_considered**: [`vertical-stack`, `concept-row`, `feature-grid`, `pipeline`]
  - **reasoning**: vertical-stack acabou de ser usado por Karime. concept-row saturado. feature-grid sem peso retórico para essa decomposição. pipeline sugere sequência temporal — não cabe (decomposição estrutural, não temporal). `multiplication-equation` é EXATAMENTE a metáfora: 1.6% × 98.4% = working agent. A multiplicação semântica é o argumento ("zero em qualquer lado = nada"). Equation foi usado em time-220-claude-code mas com conteúdo diferente (eram benefits, não decomposição arquitetural). Aqui semanticamente novo.
- **Arquétipo**: `multiplication-equation`
- **Blocks**:
  - `multiplication-equation` {
      eyebrow: 'CLAUDE CODE: REVERSE-ENGINEERED',
      left: { kind: 'number', numberLabel: '1.6%', subLabel: 'AI decision logic' },
      right: { kind: 'number', numberLabel: '98.4%', subLabel: 'Deterministic infrastructure' },
      result: { kind: 'icon-label', icon: 'check', label: 'Working agent', subLabel: 'Vrungta substack analysis, 2026', accent: true },
      op1: '×',
      op2: '=',
    }

### Highlight frame
Frame 480 — equação completa visível: 1.6% × 98.4% = ✓ Working agent.

### Intenção narrativa
- **Feeling**: revelação técnica; "ah, faz sentido — é por isso que o modelo sozinho não é o agente"
- **Memory anchor**: a equação 1.6% × 98.4%

### Source line (Revisor verifica)
Vrungta substack reverse-engineering — em research-brief.md, URL pública citável.

---

## Cena 4 — Stat (610–775, 5.5s)
- **Modo**: luby-premium
- **Theme**: dark (sem schedule — uniforme)
- **Metáfora**:
  - **chosen**: `count-up-comparison-bars` (variante comparison-bars do big-stat)
  - **alternatives_considered**: [`typographic`, `donut`, `metric-grid`, `giant-statement`]
  - **reasoning**: typographic acabou de ser usado por Karime. donut proibido (cliente-ve já usou). metric-grid proibido (pergunta-errada já usou). giant-statement vai ser usado no Hook desta run — repetir no Stat enfraquece. `comparison-bars` mostra LITERALMENTE o paradoxo do DORA: 1× baseline (strong teams) vs 3.4× target (weak teams). A barra crescendo é o argumento. Bars usado em time-220-claude-code mas com semantic diferente (eram before/after, aqui é strong vs weak teams).
- **Arquétipo**: `stat-with-comparison-bars`
- **Blocks**:
  - `big-stat` {
      style: 'comparison-bars',
      value: '+242.7%',
      caption: 'incidents per PR for weak teams. AI is an amplifier — not a force multiplier.',
      source: '— DORA 2025 Report (Google Cloud, n≈39k devs)',
      comparisonBars: {
        baseline: { label: 'Strong teams', ratio: 1 },
        target:   { label: 'Weak teams',   ratio: 3.43 },
      },
    }

### Highlight frame
Frame 700 — número, caption, source visíveis + barra weak teams animando do 0 para 3.4×.

### Intenção narrativa
- **Feeling**: confirmação contrarian; "AI não nivela, AI separa"
- **Memory anchor**: barra de incidentes 3.4× maior

### Source line (Revisor verifica)
DORA 2025 Report — em research-brief.md, link público citável.

---

## Cena 5 — CTA (775–900, 4.2s)
- **Modo**: luby-premium
- **Theme**: dark
- **Arquétipo**: `logo-with-bloom` (logo auto-suppressed em personal)
- **Blocks**:
  - `closing-card` {
      eyebrow: 'PLATFORM > MODEL',
      headline: 'What does your platform layer actually do for the agent?',
      logoHeight: 140,
      urlText: '',
    }

### Highlight frame
Frame 840 — eyebrow + headline pergunta + speaker badge Rodrigo visível.

---

## Notes para o Motion Designer

1. **NENHUM archetype novo** — todos os blocks usados (logo-mark, eyebrow, tagline, accent-line, giant-statement, multiplication-equation, big-stat com comparison-bars, closing-card) já existem no catálogo Wave 5. **Gate 1: sem disparo.**

2. **Gate 2 (smoke-still PNG)**: auto-aprovado por Cleidim — pular geração de stills, render full direto.

3. **Sem light theme schedule** — `themeSchedule: []` (dark uniforme).

4. **Personal mode com speaker** — `lang: 'en'`, `mode: 'personal'`, `speaker: { name: 'Rodrigo Gardin', role: 'Técnico / CTO @ Luby' }`.

5. **Apenas 1 variante** — apenas `rodrigo-gardin-substrate-en` (EN-Personal). Rodrigo bilíngue mas rotação default = en-us (primeiro elemento da lingua array sem histórico).

6. **Ícones explicitados**:
   - `check` (no result da equação) — ✓ existe em iconMap

7. **Audio off direto no spec**: `bgmId: undefined`, `narrationEnabled: false`, volumes 0.

8. **`transitions: []`** — premium uniforme.

9. **Composition path**:
   - Spec file: `src/schema/examples/rodrigo-gardin-substrate-en.ts` (export `rodrigoGardinSubstrateEnSpec`)
   - Composition file: `src/compositions/RodrigoGardinSubstrateEn.tsx`
   - Registrada em `src/Root.tsx` com id `rodrigo-gardin-substrate-en`
