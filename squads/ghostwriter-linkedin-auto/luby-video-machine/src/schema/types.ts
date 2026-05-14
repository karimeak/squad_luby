/**
 * VideoSpec — the schema that describes a video as DATA.
 *
 * Philosophy
 * ──────────
 * The Luby Video Machine separates two layers:
 *
 *   1. The BRAND      (paleta, easings, motion vocabulary, modos visuais)
 *      → lives as code in src/design/* and src/components/*
 *
 *   2. A VIDEO        (which scenes, in what order, with what content)
 *      → lives as DATA conforming to the types in this file
 *
 * To create a new video:
 *   1. Copy src/schema/examples/luby-demo.ts to a new file
 *   2. Edit the data — text, scenes, icons, modes, narration
 *   3. Register in src/Root.tsx as a new <Composition>
 *   4. Preview in Remotion Studio
 *
 * No React, no design tokens, no motion code is touched per video. The
 * schema covers all variability; the renderers handle all presentation.
 *
 * SERIALIZABILITY
 * ───────────────
 * Although the file extension is `.ts` (we use TypeScript for autocomplete
 * and exhaustiveness checking), every VideoSpec MUST be serializable to
 * JSON. That means: no functions, no class instances, no React component
 * imports inside the schema. Icons are referenced by string KEY (see
 * src/schema/iconMap.ts) so the schema can in the future come from an
 * LLM, a database, or a web form without the renderer having to evaluate
 * arbitrary code.
 *
 * GROWTH POLICY
 * ─────────────
 * The Block union starts small — only the kinds the current Luby demo
 * needs. Each new kind is justified by an actual video that needs it,
 * never speculatively. Bias toward composing existing blocks before
 * adding a new one.
 */

import type { IconKey } from './iconMap';

// ─── Top-level: a video ─────────────────────────────────────────────────────

export type Lang = 'pt' | 'en';
export type Mode = 'corporate' | 'personal';

export interface SpeakerInfo {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface VideoSpec {
  /** Stable identifier — used as the Remotion composition id and asset folder name. */
  id: string;

  /** Human-readable title for the Studio sidebar / dashboards. */
  title: string;

  /** Output spec — currently locked to 1920x1080 @ 30fps but kept here for future flexibility. */
  output: {
    width: number;
    height: number;
    fps: number;
    durationFrames: number;
  };

  /** Brand context — language and account mode. */
  context: {
    lang: Lang;
    mode: Mode;
    speaker?: SpeakerInfo;
  };

  /** Audio configuration — which BGM, whether narration is on, etc. */
  audio: AudioSpec;

  /** Theme schedule (light/dark windows). Optional — defaults to all dark. */
  themeSchedule?: ThemeWindowSpec[];

  /** Ordered list of scenes that make up the video. */
  scenes: SceneSpec[];

  /**
   * Optional explicit transition flashes between scenes. If omitted, the
   * renderer auto-emits a flash at every premium↔minimal mode change.
   * Pass an empty array to disable transitions.
   */
  transitions?: TransitionFlashSpec[];
}

// ─── Audio ─────────────────────────────────────────────────────────────────

export interface AudioSpec {
  /** BGM track id from the audio manifest. */
  bgmId?: string;
  /** Master BGM volume when no narration is active. */
  bgmVolume?: number;
  /** BGM volume during narration windows (auto-ducking target). */
  bgmVolumeDucked?: number;
  /** Whether per-scene narration plays. */
  narrationEnabled?: boolean;
  /** Master narration volume. */
  narrationVolume?: number;
}

// ─── Theme schedule (light/dark) ───────────────────────────────────────────

export interface ThemeWindowSpec {
  theme: 'dark' | 'light';
  /** Start frame of the window (inclusive). */
  from: number;
  /** End frame of the window (exclusive). */
  to: number;
}

// ─── Mode (visual vocabulary) ──────────────────────────────────────────────

/**
 * The visual vocabulary a scene speaks in.
 *
 *   'luby-premium' — atmospheric, glows, ambient orbs, mask reveals,
 *                    breathing elements. Used at brand moments (intro,
 *                    closing) and dense diagrams.
 *
 *   'luby-minimal' — flat surface0 background, no glows, no breathing,
 *                    text+icon synced word by word. Used in the body
 *                    where retention matters more than atmosphere.
 *
 * Modes are an ORTHOGONAL axis to themes (light/dark). A future
 * 'luby-minimal' light variant is conceivable; not built yet.
 */
export type VisualMode = 'luby-premium' | 'luby-minimal';

// ─── Scene ─────────────────────────────────────────────────────────────────

export interface SceneSpec {
  /** Scene id. Used for narration lookup, debug, telemetry. */
  id: string;

  /** Visual vocabulary for this scene. */
  mode: VisualMode;

  /** When the scene's window opens / closes on the master timeline. */
  enter: { at: number; duration: number };
  exit?: { at: number; duration: number };

  /** Anchor frame for nested timing inside the scene (defaults to mid-window). */
  pivot?: number;

  /**
   * Whether to apply SCENE_BREATH (12f offset) before child blocks start
   * entering. Default true except for the first scene of the video.
   */
  applyBreath?: boolean;

  /** Ordered blocks that compose the scene. */
  blocks: Block[];
}

// ─── Transition flash ──────────────────────────────────────────────────────

export interface TransitionFlashSpec {
  atFrame: number;
  durationFrames?: number; // default 4
  color?: 'white' | 'black'; // default 'white'
}

// ─── Blocks (the building units inside a scene) ────────────────────────────

/**
 * A Block is a self-contained, addressable visual unit inside a scene.
 * The renderer dispatches to a specific component per `kind`.
 *
 * Coordinate system: every block can pin itself with `position` (absolute
 * canvas coords in 1920x1080) or fall back to the scene's auto-layout
 * (centred flex column).
 */
export type Block =
  | LogoMarkBlock
  | EyebrowBlock
  | TaglineBlock
  | AccentLineBlock
  | SentenceWithSyncsBlock
  | ConceptPairBlock
  | ConceptRowBlock
  | PipelineBlock
  | BigStatBlock
  | ClosingCardBlock
  | MultiplicationEquationBlock
  | MetricGridBlock
  | FeatureGridBlock
  | QuoteBlock
  | LogoRowBlock
  | TimelineBlock
  // ─── Archetype Library (Wave 3 — 2026-05) ────────────────────────────
  // Each entry below corresponds to an archetype documented in
  // agents/archetypes.md. Implementations live in src/renderer/archetypes/
  // and are dispatched by PremiumScene/MinimalScene alongside regular blocks.
  | SplitScreenComparisonBlock
  | VerticalStackBlock
  | CentralSpotlightBlock
  | GiantStatementBlock
  | Quadrante2x2Block
  // ─── Archetype Library (Wave 4 — 2026-05-12) ─────────────────────────
  | IcebergRevelationBlock
  // ─── Archetype Library (Wave 5 — 2026-05-12) ─────────────────────────
  | OnionPeelRevelationBlock;

interface BlockBase {
  /** Optional id for debug/telemetry. */
  id?: string;
  /**
   * When this block starts entering, RELATIVE to scene.enter.at (after
   * SCENE_BREATH if applicable). If omitted, the renderer assigns a
   * sequential default based on block position in the scene.
   */
  startOffset?: number;
  /**
   * Optional absolute canvas position. If omitted, the block flows in
   * the scene's auto-layout (centred column).
   */
  position?: { x: number; y: number; centered?: boolean };
}

// Block kinds ---------------------------------------------------------------

export interface LogoMarkBlock extends BlockBase {
  kind: 'logo-mark';
  /** Pixel height of the wordmark. */
  height: number;
  /** Whether to play the bloom-and-reveal entrance. */
  animated?: boolean;
  /** Subtle idle breathing of the dot halo. */
  idleBreathe?: boolean;
}

export interface EyebrowBlock extends BlockBase {
  kind: 'eyebrow';
  text: string;
  /** Visual treatment. 'mono' = code-style tracked uppercase. 'pill' = bordered pill with dot. */
  style?: 'mono' | 'pill';
}

export interface TaglineBlock extends BlockBase {
  kind: 'tagline';
  text: string;
  /** Pixel size. Default scales by mode (premium 52, minimal 64). */
  size?: number;
  align?: 'left' | 'center';
}

export interface AccentLineBlock extends BlockBase {
  kind: 'accent-line';
  width?: number;
  thickness?: number;
  glow?: boolean;
}

/**
 * The headline block for luby-minimal mode. Renders a sentence word by
 * word, where designated words come with a synchronized icon that pops
 * in/out together with the word.
 */
export interface SentenceWithSyncsBlock extends BlockBase {
  kind: 'sentence-with-syncs';
  /**
   * Full sentence as a single string. The renderer tokenizes by spaces.
   * Punctuation stays attached to its word.
   */
  text: string;
  /**
   * Per-word icon overrides. Each entry matches a word in `text`. Words
   * not listed here render as plain text by default.
   *
   * To opt INTO the global keyword auto-resolver (suggestIconForWord),
   * set `autoResolveIcons: true` — useful for first-draft / preview where
   * the author wants the iconMap dictionary to fill in suggestions. In
   * production runs, keep it OFF and declare every sync explicitly.
   * Default: false (explicit wins over magic).
   */
  syncs?: SyncWordSpec[];
  /**
   * If true, words not listed in `syncs` are still checked against the
   * global keyword→icon dictionary (iconMap.suggestIconForWord). Useful
   * for prototyping but DANGEROUS in production — common words like
   * 'time', 'ai', 'code' get icons you didn't ask for.
   * Default: false.
   */
  autoResolveIcons?: boolean;
  /**
   * Pixel size for non-keyword words. Keyword words (with icons) may
   * render slightly larger automatically.
   */
  size?: number;
  /** Centered or left-aligned reading flow. Default 'center'. */
  align?: 'center' | 'left';
  /**
   * Frames between consecutive word entrances. Lower = faster reading.
   * Default 6 in minimal mode, 8 in premium.
   */
  wordStaggerFrames?: number;
}

export interface SyncWordSpec {
  /** The exact word from the sentence (case-insensitive match, punctuation ignored). */
  word: string;
  /** Icon key from iconMap. Use 'none' to explicitly suppress auto-resolved icon. */
  icon: IconKey | 'none';
  /** Whether to color the word in brand blue. Default true if icon present. */
  highlight?: boolean;
  /** Icon size in px. Default scales by mode (~80 minimal, ~64 premium). */
  iconSize?: number;
  /** Where the icon sits relative to the word. */
  placement?: 'above' | 'below' | 'inline-right';
}

export interface ConceptPairBlock extends BlockBase {
  kind: 'concept-pair';
  left: ConceptSpec;
  right: ConceptSpec;
  centerSymbol?: string; // e.g. "vs", "×", "→"
}

export interface ConceptSpec {
  icon: IconKey;
  title: string;
  caption?: string;
  accent?: 'primary' | 'bright' | 'deep'; // maps to brand blue tones
}

/**
 * ConceptRowBlock — N concepts arranged horizontally as a row of cards.
 *
 * Designed for "comparison/sequence/contrast" beats where the message
 * is "A, B, ..., and finally C". Supports 2–5 concepts. One concept
 * can be marked as `highlight: true` — that one renders larger and in
 * brand accent, signalling the protagonist (e.g. the "third way" in a
 * "false dichotomy → solution" framing).
 *
 * Optional connectors between cards (arrows, dots) can be added later;
 * v1 of the block keeps the row clean with just cards and breathing
 * room between them.
 *
 * REPERTORIO
 *   This block is the canonical "row of N concepts" composition. Use
 *   for: hot-take with 3-act framing, before/after/now, options A/B/C,
 *   timeline of phases, etc.
 */
export interface ConceptRowBlock extends BlockBase {
  kind: 'concept-row';
  /** 2 to 5 concepts. */
  concepts: Array<ConceptSpec & {
    /**
     * When true, this concept is the protagonist — larger card, brand
     * accent, slight delayed entrance to land last visually.
     */
    highlight?: boolean;
  }>;
  /**
   * Optional heading above the row (e.g. the hot-take's resolution
   * statement). Renders as display-tier centred text.
   */
  heading?: string;
  /**
   * Card size for non-highlighted concepts. Highlight uses one size up.
   * Default 'compact'.
   */
  size?: 'compact' | 'standard';
}

export interface PipelineBlock extends BlockBase {
  kind: 'pipeline';
  startLabel: string;
  endLabel: string;
  stages: PipelineStageSpec[];
}

export interface PipelineStageSpec {
  icon: IconKey;
  title: string;
  caption?: string;
}

export interface BigStatBlock extends BlockBase {
  kind: 'big-stat';
  /** Display string with embedded number, e.g. "60%", "3x", "1.2k". */
  value: string;
  caption: string;
  source?: string;
  /**
   * Visual presentation:
   *   'typographic'      — number + caption + source, no decoration
   *   'donut'            — radial track ring + filled arc (count-up)
   *   'comparison-bars'  — number on the left + two stacked bars on the
   *                        right (baseline 1× + target N×) for material
   *                        before/after contrast. Requires `comparisonBars`.
   * Default: 'typographic'.
   */
  style?: 'donut' | 'typographic' | 'comparison-bars';
  /** Required when style === 'comparison-bars'. Ignored otherwise. */
  comparisonBars?: ComparisonBarsConfig;
}

export interface ComparisonBarsConfig {
  /** The reference bar (smaller). Always renders pre-filled. */
  baseline: { label: string; ratio: number };
  /** The target bar (larger). Animates from 0 to its `ratio` width. */
  target: { label: string; ratio: number };
}

/**
 * MultiplicationEquationBlock — a visual equation with two operands and a
 * result, separated by `op1` and `op2` symbols.
 *
 *   [left] op1 [right] op2 [result]
 *
 * Designed for "scale composition" beats where the message is "A × B = C"
 * (e.g. "humans × AI = multiplication of output"). Each slot can be:
 *   - 'icon-label' — icon above a label, optional sublabel below
 *   - 'number'     — large number string in brand accent color
 *
 * Default operators are × and =. Symbols are rendered as oversized
 * typography (~180-200px) in white between the slots, acting as visual
 * heroes alongside the slot content.
 */
export interface MultiplicationEquationBlock extends BlockBase {
  kind: 'multiplication-equation';
  left: EquationSlot;
  right: EquationSlot;
  result: EquationSlot;
  /** Symbol between left and right. Default '×'. */
  op1?: string;
  /** Symbol between right and result. Default '='. */
  op2?: string;
  /** Optional eyebrow rendered above the equation. */
  eyebrow?: string;
}

export type EquationSlot =
  | {
      kind: 'icon-label';
      icon: IconKey;
      label: string;
      subLabel?: string;
      /** If true, the label/icon are tinted in brand blue. */
      accent?: boolean;
    }
  | {
      kind: 'number';
      /** Number text, e.g. "3-5×", "100x", "60%". */
      numberLabel: string;
      subLabel?: string;
      accent?: boolean;
    };

export interface ClosingCardBlock extends BlockBase {
  kind: 'closing-card';
  eyebrow?: string;
  headline: string;
  /** Logo height in px. Default 140. */
  logoHeight?: number;
  /**
   * Optional URL/CTA text rendered BELOW the logo, in mono font, smaller
   * than the headline. Use for videos where a specific landing URL must
   * be visible (vs the logo alone implying the brand homepage).
   */
  urlText?: string;
}

// ─── ONDA 2 blocks (B2B essential repertoire) ─────────────────────────────

/**
 * MetricGridBlock — a grid of 3-6 KPI cards.
 *
 *   ┌─────────┐ ┌─────────┐ ┌─────────┐
 *   │  60%    │ │  3-5×   │ │  220+   │
 *   │ less    │ │ faster  │ │ engineers│
 *   │ vulns   │ │ delivery│ │  (...)  │
 *   └─────────┘ └─────────┘ └─────────┘
 *
 * For: results dashboards, capability metrics, "the numbers" beat.
 * Each metric is a glass card with big number + label + optional sublabel.
 *
 * Layout: auto-grid (2 cols if N=2/4, 3 cols if N=3/6, 5 cols if N=5).
 * Heading optional above the grid.
 */
export interface MetricGridBlock extends BlockBase {
  kind: 'metric-grid';
  metrics: Array<{
    /** Display string with embedded number, e.g. "60%", "3-5×". */
    value: string;
    label: string;
    sublabel?: string;
    /** Optional Lucide icon shown small above the number. */
    icon?: IconKey;
    /** Tint accent color: brand blue variants. Default 'primary'. */
    accent?: 'primary' | 'bright' | 'deep';
  }>;
  /** Heading above the grid. */
  heading?: string;
}

/**
 * FeatureGridBlock — 3-4 features arranged horizontally with icon + title + description.
 *
 *   ┌────────┐  ┌────────┐  ┌────────┐
 *   │  [🛡]  │  │  [⚡]  │  │  [📊]  │
 *   │ Title  │  │ Title  │  │ Title  │
 *   │ Short  │  │ Short  │  │ Short  │
 *   │ desc   │  │ desc   │  │ desc   │
 *   └────────┘  └────────┘  └────────┘
 *
 * For: capability-spotlight format. Reuses ConceptCard internally but
 * with a column layout that fits 3-4 features comfortably.
 *
 * Differs from concept-row: feature-grid is for "list of equal-weight
 * capabilities" (no protagonist), concept-row is for "comparison/sequence
 * with optional highlight" (has rhetorical weight).
 */
export interface FeatureGridBlock extends BlockBase {
  kind: 'feature-grid';
  features: Array<{
    icon: IconKey;
    title: string;
    description: string;
  }>;
  heading?: string;
}

/**
 * QuoteBlock — a quoted testimonial with attribution.
 *
 *   "                                            "
 *      Lorem ipsum dolor sit amet, consectetur
 *      adipiscing elit, sed do eiusmod tempor.
 *   "                                            "
 *
 *                                  — Name, Role
 *                                    Company logo
 *
 * For: case study testimonials, board endorsements, positioning pulls.
 */
export interface QuoteBlock extends BlockBase {
  kind: 'quote';
  /** The quoted text (no need to wrap in quotes — renderer adds them). */
  quote: string;
  /** Person's name (e.g. "John Smith"). */
  attribution: string;
  /** Their role/title (e.g. "CTO @ ACME"). */
  role?: string;
  /** URL of avatar image (optional, square crop recommended). */
  avatarUrl?: string;
}

/**
 * LogoRowBlock — horizontal row of client/partner logos.
 *
 *   [LexisNexis]   [Bridgestone]   [Siemens]   [Sunwest]
 *
 * For: social proof, "trusted by" beats, partnership announcements.
 *
 * Logos are passed as image URLs (typically PNG/SVG in /public/logos/).
 * Renderer crossfades them in with eased stagger and holds at uniform
 * desaturated tone (so individual brands don't fight each other).
 */
export interface LogoRowBlock extends BlockBase {
  kind: 'logo-row';
  logos: Array<{
    /** Display name (for accessibility / debug). */
    name: string;
    /** Image URL — typically `staticFile('logos/clients/X.png')` already resolved at schema build time. */
    src: string;
    /** Optional tint behavior. 'mono' = desaturate to white-ish; 'preserve' = keep original colors. Default 'mono'. */
    tint?: 'mono' | 'preserve';
  }>;
  heading?: string;
}

/**
 * TimelineBlock — events on a horizontal timeline.
 *
 *   2019 ──● 2020 ──● 2022 ──● 2024 ──● 2026
 *          │         │         │         │
 *        First    Series A   1k proj   AI agents
 *
 * For: milestones, history beats, evolution narratives.
 */
export interface TimelineBlock extends BlockBase {
  kind: 'timeline';
  events: Array<{
    /** Year/period label on the axis (e.g. "2019", "Q1 2024"). */
    when: string;
    /** Short event description (1-3 words ideal). */
    what: string;
    /** Optional Lucide icon shown above the event marker. */
    icon?: IconKey;
    /** Optional highlight marker (the "this is the climax" event). */
    highlight?: boolean;
  }>;
  heading?: string;
}

// ─── Archetype Library blocks (Wave 3 — 2026-05) ─────────────────────────
//
// These five blocks correspond 1:1 to archetypes catalogued in
// agents/archetypes.md. They live in src/renderer/archetypes/ instead of
// src/renderer/blocks/ to make the "this is a top-level scene
// composition, not a peca atomica" distinction visible in the file tree.
// At dispatch time they're treated identically to regular blocks.

/**
 * SplitScreenComparisonBlock — quadro dividido em duas metades.
 *
 *   ┌──────────────┬──────────────┐
 *   │   [icon]     │   [icon]     │
 *   │   title      │   title      │
 *   │   caption    │   caption    │
 *   └──────┬───────┴───────┬──────┘
 *          │      vs       │
 *          └───────────────┘
 *
 * Centro tem um symbol tipográfico (vs/×/→/≠) que faz ponte. Lados
 * podem ter accents diferentes para sinalizar protagonista
 * (highlightSide). Mode-aware: premium tem glow no símbolo central,
 * minimal não.
 */
export interface SplitScreenComparisonBlock extends BlockBase {
  kind: 'split-screen-comparison';
  left:  ComparisonSide;
  right: ComparisonSide;
  /** Symbol no centro entre os dois lados. Default 'vs'. */
  centerSymbol?: string;
  /** Heading opcional acima da composição. */
  heading?: string;
  /** Lado em destaque (accent bright + escala maior). Default 'none'. */
  highlightSide?: 'left' | 'right' | 'none';
}

export interface ComparisonSide {
  icon: IconKey;
  title: string;
  caption?: string;
  /** Brand-blue accent tier. Default 'primary'. */
  accent?: 'primary' | 'bright' | 'deep';
}

/**
 * VerticalStackBlock — lista vertical tipograficamente densa.
 *
 *   [icon] Title 1 ─────────────
 *           caption opcional
 *   [icon] Title 2 ─────────────
 *           caption opcional
 *   [icon] Title 3 ─────────────
 *
 * Densidade tipográfica, não cards. Ícones inline-left, alinhamento
 * default 'left'. Stagger top→bottom. 3-6 itens.
 */
export interface VerticalStackBlock extends BlockBase {
  kind: 'vertical-stack';
  items: Array<{
    icon: IconKey;
    title: string;
    caption?: string;
  }>;
  heading?: string;
  /** Alinhamento horizontal do stack. Default 'left'. */
  align?: 'left' | 'center';
}

/**
 * CentralSpotlightBlock — núcleo central + satélites em volta.
 *
 *           ┌─[satellite]─┐
 *           │             │
 *   [satellite]─[CENTER]─[satellite]
 *           │             │
 *           └─[satellite]─┘
 *
 * Centro é o protagonista (icon + title grande). Satélites entram com
 * stagger radial (não linear). Conectores opcionais ligando centro a
 * cada satélite.
 */
export interface CentralSpotlightBlock extends BlockBase {
  kind: 'central-spotlight-with-satellites';
  center: { icon: IconKey; title: string; caption?: string };
  satellites: Array<{ icon: IconKey; label: string }>; // 3-5
  heading?: string;
  /** Mostrar linhas finas centro→satélite. Default true. */
  showConnectors?: boolean;
}

/**
 * GiantStatementBlock — uma palavra/frase ocupando a tela inteira.
 *
 *
 *
 *           OBSOLETO.
 *
 *
 *
 * Tipografia hero (≥160px). Motion mínimo: word-by-word, mask-up, ou
 * letterspacing-settle. Sem ícone, sem card.
 */
export interface GiantStatementBlock extends BlockBase {
  kind: 'giant-statement';
  /** Texto. 1-6 palavras tipicamente; máx 12. */
  text: string;
  /** Tamanho em px. Default 200. */
  size?: number;
  /** Peso da fonte. Default 'semibold'. */
  weight?: 'semibold' | 'bold' | 'black';
  /** Forma de revelação. Default 'mask-up'. */
  reveal?: 'word-by-word' | 'mask-up' | 'letterspacing-settle';
  /** Cor do texto. Default 'white'. */
  accent?: 'white' | 'bright' | 'deep';
}

/**
 * Quadrante2x2Block — matriz 2×2 com eixos NOMEADOS.
 *
 *   axisY.high  ┌──────────┬──────────┐
 *               │ topLeft  │ topRight │
 *               ├──────────┼──────────┤
 *               │ btmLeft  │ btmRight │
 *   axisY.low   └──────────┴──────────┘
 *               axisX.low   axisX.high
 *
 * Diferente de feature-grid 2×2: aqui os eixos têm SEMÂNTICA. Um
 * quadrante pode ser highlight (o "ideal").
 */
export interface Quadrante2x2Block extends BlockBase {
  kind: 'quadrante-2x2';
  axisX: { lowLabel: string; highLabel: string };
  axisY: { lowLabel: string; highLabel: string };
  quadrants: {
    topLeft:     QuadrantCell;
    topRight:    QuadrantCell;
    bottomLeft:  QuadrantCell;
    bottomRight: QuadrantCell;
  };
  heading?: string;
}

export interface QuadrantCell {
  icon: IconKey;
  title: string;
  caption?: string;
  highlight?: boolean;
}

/**
 * IcebergRevelationBlock — surface vs depth as visual argument.
 *
 *   ┌──────────────────────────────────┐
 *   │  heading                         │
 *   │  [item] [item]                   │  ← surface (visible work)
 *   │ ──────────── water line ─────── │
 *   │                                  │
 *   │  [item] [item] [item] [item]     │  ← depth (invisible work, muted)
 *   └──────────────────────────────────┘
 *
 * For positioning videos that argue "the work that matters isn't
 * visible." Surface items render in normal palette; depth items
 * render in muted tone. The PROPORTION of canvas devoted to each
 * zone IS the argument: typically 30% surface / 70% depth.
 *
 * REPERTORIO
 *   Use for: depth-positioning videos (invisible work, technical
 *   depth, "what sustains software"). Pair with metaphor 'iceberg'
 *   in agents/metaforas.md Section F.
 */
export interface IcebergRevelationBlock extends BlockBase {
  kind: 'iceberg-revelation';
  heading?: string;
  surface: {
    items: Array<{
      icon: IconKey;
      label: string;
      caption?: string;
    }>;
  };
  depth: {
    items: Array<{
      icon: IconKey;
      label: string;
      caption?: string;
    }>;
  };
  /**
   * Vertical position of water line as percentage of canvas height
   * from the top. Default 30 (surface = top 30%, depth = bottom 70%).
   */
  waterLinePercent?: number;
}

/**
 * OnionPeelRevelationBlock — surface vs N hidden layers (Wave 5).
 *
 *   ┌────────────────────────┐
 *   │  visible item (proud)  │   ← what client sees
 *   │  ───────────────       │
 *   │  layer 1               │
 *   │  layer 2               │   ← what sustains it (revealed
 *   │  layer 3               │     progressively, deeper tone)
 *   │  ...                   │
 *   └────────────────────────┘
 *
 * For positioning videos that argue "you saw 1, there are N more".
 * Distinct from IcebergRevelationBlock (proportion argument):
 * onion-peel argues COUNT, not proportion.
 */
export interface OnionPeelRevelationBlock extends BlockBase {
  kind: 'onion-peel-revelation';
  heading?: string;
  visible: { icon: IconKey; label: string };
  layers: Array<{ icon: IconKey; label: string }>; // 3-7 typical
}

// ─── Validation helper types ──────────────────────────────────────────────

/**
 * Discriminated union helper — TypeScript narrows Block by `kind`, which
 * gives renderers exhaustive matching for free. If you add a new block
 * kind here without updating the renderer's switch, TS will complain at
 * compile time. That's the safety net.
 */
export type BlockKind = Block['kind'];
