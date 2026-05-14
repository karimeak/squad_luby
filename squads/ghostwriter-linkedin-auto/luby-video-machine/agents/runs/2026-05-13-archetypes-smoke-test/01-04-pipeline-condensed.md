# Pipeline condensado — Smoke-test archetype library

> **Nota**: para um smoke-test técnico (não conteúdo real de
> marketing), os agentes 01-04 são condensados aqui em um único
> artefato. Pipeline pleno dos 5 agentes só faz sentido para
> conteúdo real. O Revisor (05-review.md) é executado
> normalmente porque é quem valida render.

## 01 Estratégia (síntese)
Validar arquétipos novos em condições próximas a vídeo real. Cenas
têm conteúdo placeholder com ar declarativo pra exercitar headings,
captions, ícones — não pra comunicar tese.

## 02 Roteiro (síntese)
Sem narração. Texto on-screen funciona standalone.

| Cena | Texto on-screen |
|---|---|
| Intro | Eyebrow "TESTE TÉCNICO" / Tagline "Wave 3 — biblioteca de arquétipos" |
| Hook | Giant statement: "Variação." |
| Bullets-1 | Split-screen: "Cena igual" vs "Cena diferente" |
| Bullets-2 | Central spotlight: centro "AI-augmented engineering" + 4 satélites |
| Stat | Quadrante 2×2: especialização × velocidade, 4 quadrantes |
| CTA | "Cinco arquétipos novos." + URL placeholder |

## 03 Storyboard (síntese, formato condensado)

### Cena 1 — Intro (`logo-with-bloom`)
- Modo premium, frames 0–90.
- Blocks: `logo-mark` (240px), `eyebrow` "TESTE TÉCNICO" mono,
  `tagline` "Wave 3 — biblioteca de arquétipos", `accent-line`.

### Cena 2 — Hook (`giant-statement`) — NOVO arquétipo
- Modo premium, frames 90–240 (5s).
- Block: `giant-statement` { text: "Variação.", size: 240,
  reveal: 'mask-up', accent: 'white' }.
- Highlight frame: ~165 (palavra totalmente revelada).

### Cena 3 — Bullets-1 (`split-screen-comparison`) — NOVO
- Modo premium, frames 240–390 (5s).
- Block: `split-screen-comparison` { heading: "Antes da Wave 3 vs
  agora", left: { icon: 'circle-dashed', title: 'Cena igual',
  caption: 'sempre 3 cards' }, right: { icon: 'sparkles', title:
  'Cena diferente', caption: '11 arquétipos', highlight side
  right }, centerSymbol: 'vs' }.
- Highlight frame: ~330 (lado direito plenamente revelado).

### Cena 4 — Bullets-2 (`central-spotlight-with-satellites`) — NOVO
- Modo premium, frames 390–600 (7s — radial precisa de mais respiro).
- Block: `central-spotlight-with-satellites` {
    center: { icon: 'brain', title: 'AI-augmented engineering' },
    satellites: [ Shield Governança, FileCheck Compliance, Zap
    Velocidade, Users Contexto ],
    showConnectors: true,
  }.
- Highlight frame: ~520.

### Cena 5 — Stat (`quadrante-2x2`) — NOVO
- Modo premium, frames 600–810 (7s).
- Block: `quadrante-2x2` {
    axisX: { lowLabel: 'Lento', highLabel: 'Rápido' },
    axisY: { lowLabel: 'Baixa especialização', highLabel: 'Alta especialização' },
    quadrants: 4 cells, top-right highlight 'Modelo Luby'
  }.
- Highlight frame: ~720.

### Cena 6 — CTA (`logo-with-bloom`)
- Modo premium, frames 810–900.
- Block: `closing-card` { eyebrow: 'WAVE 3', headline: 'Cinco
  arquétipos novos.', urlText: 'luby.co/archetypes' }.

## 04 Implementation notes (síntese)

Spec: `src/schema/examples/archetypes-smoke-test.ts`.
Composition: `src/compositions/ArchetypesSmokeTest.tsx`.
Composition ID registrado em Root: `archetypes-smoke-test-pt`.
Render: `npx remotion render archetypes-smoke-test-pt agents/runs/2026-05-13-archetypes-smoke-test/out/video-pt.mp4`.

Sem alteração em i18n/strings.ts (texto direto no spec) ou
narration.json (narração off).

## Variação visual intencional

- Runs anteriores: `time-220-claude-code` usou multiplication-equation
  + comparison-bars; `pergunta-errada-outsourcing` usou concept-row
  + feature-grid + metric-grid.
- Esta run varia em **arquétipo de Hook** (giant-statement vs
  concept-row anterior), **arquétipo de Bullets** (split-screen +
  central-spotlight em vez de concept-row + feature-grid) e
  **arquétipo de Stat** (quadrante-2x2 em vez de metric-grid /
  comparison-bars). Cobertura: 4 arquétipos novos em 4 cenas distintas.
- Justificativa: smoke-test exige diversidade máxima por cena para
  validar todos os componentes; conteúdo é placeholder.
