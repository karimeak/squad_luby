# Luby Video Machine — v2

Production-grade video pipeline for the Luby LinkedIn presence
(corporate + collaborator personal accounts), built on **Remotion**.
Generates 30-second, 1920×1080, 30 fps horizontal videos that are
fully parameterized by:

- **Language** — `pt` or `en`
- **Mode** — `corporate` (Luby account) or `personal` (collaborator account)
- **Speaker** — for personal mode, a name + role (and optional avatar)

## What's new in v2

This version is a ground-up rebuild of the motion system, designed
around a **Stripe-like motion vocabulary**: rich easings, beat-based
timing, eased stagger, microbreathing, and overlapping scenes for
continuous flow instead of slide transitions.

Key changes:

- **Motion system** (`src/design/motion.ts`, `src/design/easings.ts`,
  `src/design/timeline.ts`) replaces the v1 spring-only approach with
  named cubic-bezier curves, beat units, and a master timeline.
- **No more `<TransitionSeries>`**: scenes now overlap via the master
  timeline and morph through shared persistent layers (background,
  brand frame).
- **All components evolved**: mask reveals replace fades; eased stagger
  replaces linear stagger; explicit enter/idle/exit lifecycles.
- **New components**: `BackgroundAtmosphere` (4-layer background),
  `GlowOrb` (reusable atmospheric light), `MaskReveal` (clip-path
  reveal primitive), `LineDraw` (animated SVG strokes).

### v3 — visual density layer

v2 fixed motion. v3 fixes the *what's-on-screen* problem: a typographic
deck, no matter how well animated, still reads as a deck. v3 adds a
visual vocabulary so scenes can hold ideas as **diagrams**, not just words.

- **Icon system** — wraps `lucide-react` with motion presets (`draw`,
  `pop`, `bloom`, `slide`, `fade`) so any icon plugs into the project's
  easing + lifecycle vocabulary. The `draw` preset uses
  `pathLength="1"` + `stroke-dashoffset` so each icon literally draws
  itself in.
- **Connector** — animated SVG path between two canvas points, with
  optional curve (quadratic Bezier), dashed stroke, end/start arrowhead,
  Gaussian glow, and a `flow` mode that travels brand-coloured dots
  along the path while it's held on screen.
- **ConceptCard** — glass-morphism panel that holds an icon + title +
  caption. Coordinated entrance: card clip-reveals, icon blooms, title
  mask-reveals, caption mask-reveals — all chained off a single
  `startFrame`. Supports absolute canvas positioning so it lines up
  with `Connector`.
- **MetricBar** — labelled horizontal bar with a synchronized
  count-up readout. Bar grows with `easings.enter`, glow head pulses,
  fades cleanly on exit.
- **HookScene** — first scene rebuilt as a "tension diagram" instead
  of a centred title. Two `ConceptCard`s ("speed" vs. "trust") flank a
  central pivot symbol; two `Connector`s with `flow` carry the eye
  between them; the question reads below as the *resolution* of the
  visual tension.

---

## Quick start

Requirements: **Node.js 18+** (20+ recommended).

```bash
npm install
npm start
```

Remotion Studio opens at <http://localhost:3000>. You'll see four
pre-configured compositions in the sidebar:

- `DemoVideo` — default (PT-BR, corporate)
- `DemoVideo-PT` — explicit PT-BR, corporate
- `DemoVideo-EN` — EN-US, corporate
- `DemoVideo-PT-Personal` — PT-BR, personal collaborator account

Click any composition to preview it in the studio.

### Render to MP4

```bash
npm run render            # default (PT-BR corporate)  → out/demo.mp4
npm run render:pt         # PT-BR corporate            → out/demo-pt.mp4
npm run render:en         # EN-US corporate            → out/demo-en.mp4
npm run render:personal-pt # PT-BR personal mode       → out/demo-personal-pt.mp4
```

### Custom render

```bash
npx remotion render DemoVideo out/custom.mp4 \
  --props='{"lang":"en","mode":"personal","speaker":{"name":"João Souza","role":"Tech Lead @ Luby"}}'
```

---

## Brand setup

### 1. Aspekta font (recommended)

Drop the Aspekta font files into `public/fonts/`:

```
public/fonts/Aspekta-400.woff2
public/fonts/Aspekta-500.woff2
public/fonts/Aspekta-600.woff2
public/fonts/Aspekta-700.woff2
public/fonts/Aspekta-900.woff2
```

If files are missing, the project automatically falls back to **Inter**.

### 2. Logos (already in place)

`public/logos/luby-white.png` and `public/logos/luby-navy.png` are ready.
Replace these files to swap to higher-resolution versions.

### 3. Color tokens

All brand colors live in `src/design/tokens.ts`. Update there if the brand
palette changes — every scene picks up the new values automatically.

---

## Architecture (v2)

```
src/
├── index.ts                       # registerRoot
├── Root.tsx                       # Compositions + @font-face for Aspekta
├── design/
│   ├── tokens.ts                  # Colors (extended), fonts, gradients, video spec
│   ├── easings.ts                 # 12 named cubic-bezier easings (NEW)
│   ├── motion.ts                  # Beats, stagger, lifecycle, breathe (REWRITTEN)
│   └── timeline.ts                # Master timeline of scene windows (NEW)
├── components/
│   ├── BackgroundAtmosphere.tsx   # 4-layer ambient background
│   ├── GlowOrb.tsx                # Reusable atmospheric light
│   ├── MaskReveal.tsx             # Clip-path reveal primitive
│   ├── LineDraw.tsx               # Animated SVG line (decorative)
│   ├── Logo.tsx                   # Luby logo with halo bloom
│   ├── AnimatedTitle.tsx          # Word-by-word with mask reveals
│   ├── Pill.tsx                   # Eyebrow with breathing dot
│   ├── BulletList.tsx             # Eased stagger + dot pop
│   ├── BigStat.tsx                # Number with glow halo
│   ├── BrandFrame.tsx             # Persistent overlay with progress bar
│   ├── Icon.tsx                   # Lucide wrapper + motion presets (v3)
│   ├── Connector.tsx              # Animated path between two points (v3)
│   ├── ConceptCard.tsx            # Glass-morphism concept panel (v3)
│   └── MetricBar.tsx              # Animated bar chart row (v3)
├── scenes/                        # Each scene reads its window from TIMELINE
│   ├── IntroScene.tsx
│   ├── HookScene.tsx
│   ├── BulletsScene.tsx
│   ├── StatScene.tsx
│   └── CTAScene.tsx
├── compositions/
│   ├── types.ts                   # Lang, Mode, SpeakerInfo, CommonProps
│   └── DemoVideo.tsx              # All scenes mounted in parallel
└── i18n/
    └── strings.ts                 # PT-BR + EN-US copy
```

### How the motion system works

Every animation in the project follows this pattern:

1. **Read your enter/exit times** from `TIMELINE` (in `src/design/timeline.ts`).
2. **Pick an easing** from `easings` (in `src/design/easings.ts`) — `enter`, `exit`,
   `emphasis`, `swift`, etc. — based on the *intent* of the motion.
3. **Use a duration constant** from `motion` (in `src/design/motion.ts`) —
   `enterFast`, `enter`, `enterSlow`, `enterDramatic`, etc.
4. **Compose with helpers**: `stagger()` for multi-element reveals,
   `breathe()` for idle oscillations, `lifecycle()` for enter+exit in one shot.

This means: change one easing or one duration and it propagates consistently
across the whole video.

### How the visual-density system works (v3)

When a scene needs more than typography (a process, a comparison, a flow,
a metric), reach for the v3 components instead of inventing one-off SVG.

**`Icon`** — every diagram element starts here. Lucide ships ~1500 icons,
all stroke-based, all 24×24 normalized — so they scale and animate
predictably. Pick the icon component, pick a preset, pass `startFrame`:

```tsx
import { Zap, ShieldCheck, GitBranch } from 'lucide-react';
import { Icon } from '../components/Icon';

<Icon Component={Zap} size={120} preset="bloom" startFrame={frame} exitFrame={out} />
<Icon Component={GitBranch} size={48} preset="draw" startFrame={frame} />
```

Presets at a glance:
- `draw` — strokes draw in (use for hero moments where the eye should follow the line)
- `pop` — overshoot scale (punchy default for dense rows)
- `bloom` — pop + radial halo (used inside `ConceptCard`)
- `slide` — translates from a direction (good with `slideFrom`)
- `fade` — neutral default when the parent already handles motion

**`ConceptCard`** — the workhorse for "this is the concept" beats.
Combines an icon, a title, and an optional caption with a coordinated
internal sequence (card → icon → title → caption). Position it inline
or in absolute canvas coords:

```tsx
<ConceptCard
  IconComponent={ShieldCheck}
  title="Trust"
  caption="Security is non-negotiable"
  startFrame={tCard}
  exitFrame={tExit}
  size="standard"           // 'compact' | 'standard' | 'feature'
  absolute={{ x: 1450, y: 540, centered: true }}  // matches Connector coords
/>
```

**`Connector`** — connects two cards (or any two canvas points). Coords
are in 1920×1080 pixels, NOT SVG viewBox units, so the same numbers you
use to position a card place the line endpoints. Use `curve` to bow the
path, `flow` to make it carry travelling dots, `arrow` for direction:

```tsx
<Connector
  from={{ x: 670, y: 540 }}
  to={  { x: 870, y: 540 }}
  curve={-18}
  startFrame={tConnector}
  exitFrame={tExit}
  flow                       // animated dots travel along the path
  arrow="end"
/>
```

**`MetricBar`** — animated horizontal bar with a synced count-up. Stack
multiple in a flex column for a "scoreboard" beat:

```tsx
<MetricBar
  label="Lead time"
  value={42} max={100} unit=" min"
  startFrame={t} exitFrame={tExit}
/>
```

**Patterns that work well**
- Pair `ConceptCard` with `Connector` for "X relates to Y" beats. Use
  matching x-coords on the cards' centers and place the connector
  endpoints `±cardEdgeOffset` from those centers.
- Use `preset='draw'` icons sparingly — one per scene at most. They're
  attention-grabbing by design.
- Treat absolute coordinates as a layout grid: pick a centerline (e.g.
  `y=540`), then place cards/symbols/connectors relative to it. See
  `HookScene.tsx` for a worked example.

### Adding a new scene to the demo

1. Add a new key to `TIMELINE` in `src/design/timeline.ts` with `enter`/`exit`
   windows that fit the 900-frame budget.
2. Build the scene component in `src/scenes/`, reading from `TIMELINE` and
   using the motion vocabulary.
3. Add a `<AbsoluteFill>` wrapping your scene in `src/compositions/DemoVideo.tsx`.

### Adding a new video format (different composition)

1. Add new strings to `src/i18n/strings.ts` (a new key like `caseStudy`).
2. (Optional) Build any new scene components.
3. Create `src/compositions/CaseStudyVideo.tsx`.
4. Register it in `src/Root.tsx` with a new `<Composition>`.

---

## What's intentionally not yet wired up

### 1. Voiceover (ElevenLabs)

Add a `narrationUrl` prop to compositions, then use Remotion's `<Audio>`
component. A separate script (e.g., `scripts/generate-narration.ts`)
calls the ElevenLabs API with each video's script.

### 2. Background music

Same pattern — `<Audio src={...} volume={0.15} />`.

### 3. Auto-orchestration

A future iteration can wrap the pipeline in n8n / Archon to take a
brief or URL as input and emit an MP4 automatically.

---

## Working with Claude Code on this project

When you ask Claude Code to add a new composition, ask it to:

1. Read `src/design/tokens.ts`, `src/design/easings.ts`, `src/design/motion.ts`,
   and `src/design/timeline.ts` first.
2. Reuse existing components from `src/components/` before creating new ones.
3. Follow the scene pattern in `src/scenes/` (reading from TIMELINE,
   using motion vocabulary).
4. Add strings under a new key in `src/i18n/strings.ts`.
5. Register the new composition in `src/Root.tsx`.

For best results, also install the official Remotion skills:

```bash
npx -y skills@latest add remotion-dev/skills -g -y
```

---

## Equipe de agentes (produção de vídeos)

Para criar vídeos novos a partir de um briefing, este projeto define uma
**equipe de 5 agentes especializados** (Estrategista → Roteirista → Diretor
Criativo → Motion Designer → Revisor) que transformam ideia bruta em MP4
revisado.

Cada agente tem persona, contrato de I/O e templates de exemplo
versionados em [`agents/`](agents/README.md). Cada vídeo gerado vive em
`agents/runs/YYYY-MM-DD-slug/` com o histórico completo de decisões.

Comece por [`agents/README.md`](agents/README.md) para entender o fluxo.

---

## License & credits

- Project code: internal / Luby
- Logos: Luby
- Fonts: Aspekta (FormatType Foundry); Inter (Rasmus Andersson, OFL)
- Framework: [Remotion](https://www.remotion.dev) — special license for
  companies with 4+ employees ([details](https://www.remotion.dev/license))
