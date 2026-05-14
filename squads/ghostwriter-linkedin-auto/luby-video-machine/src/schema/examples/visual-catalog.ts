/**
 * visual-catalog.ts — internal showcase video that exercises every
 * archetype/block the machine can render today.
 *
 * NOT a marketing video. Use case: visual validation of the design
 * system. Each scene is numbered (01, 02, ...) via an eyebrow tag
 * at the top, so feedback can reference scenes precisely ("ajustar o
 * 14") without describing them.
 *
 * Three variants are produced from the same scene data:
 *   - visualCatalogPremiumDark  (mode=premium uniform, theme=dark)
 *   - visualCatalogMinimalDark  (mode=minimal uniform, theme=dark)
 *   - visualCatalogPremiumLight (mode=premium uniform, theme=light)
 *
 * The first two share the dark navy palette but differ in atmospheric
 * density. The third tests how premium components hold up on the
 * off-white light theme (untested territory — light theme has only
 * been used in the legacy luby-demo Stat window).
 *
 * Run folder: agents/runs/2026-05-12-visual-catalog/
 */

import type { VideoSpec, SceneSpec, VisualMode, ThemeWindowSpec } from '../types';

// NOTE: don't import staticFile here — LogoRowBlock calls it
// internally on its `src` prop. Passing a path-only string (no
// staticFile prefix) is the documented contract.

// Each composition gets ~5s on screen. Numbered eyebrow at top.
const SCENE_FRAMES = 150;             // 5s @ 30fps
const SCENE_BREATH_BETWEEN = 0;       // No breath — cuts straight between scenes
const INTRO_FRAMES = 90;              // 3s
const CTA_FRAMES = 90;                // 3s

const SHARED_LOGO = 'logos/luby-white.svg';

/**
 * Build a numbered eyebrow block (e.g. "01 / 23") for catalog
 * navigation. Catalog reviewer says "fix scene 14" and we find it.
 */
const numberedEyebrow = (n: number, total: number, suffix: string) =>
  ({
    kind: 'eyebrow' as const,
    style: 'mono' as const,
    text: `${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}  ·  ${suffix}`,
    startOffset: 0,
    // Position absolutely at top of canvas so it sits ABOVE archetypes
    // that take the full canvas (e.g. split-screen-comparison full-bleed).
    // Without this, the eyebrow gets covered by absolute-positioned
    // archetypes. positionedBlocks render AFTER flowBlocks in PremiumScene,
    // so z-order naturally puts the eyebrow on top.
    position: { x: 960, y: 60, centered: true },
  });

/**
 * Build a single catalog scene. Each scene packs:
 *   - numbered eyebrow at top (identifies the scene for feedback)
 *   - the actual composition block being demonstrated
 *
 * `mode` is the visual mode for the scene. The catalog uses uniform
 * mode per video (no premium↔minimal mixing within one catalog video).
 */
const catalogScene = (params: {
  n: number;
  total: number;
  suffix: string;
  enterAt: number;
  mode: VisualMode;
  blocks: SceneSpec['blocks'];
}): SceneSpec => ({
  id: `scene-${String(params.n).padStart(2, '0')}`,
  mode: params.mode,
  enter: { at: params.enterAt,                duration: 18 },
  exit:  { at: params.enterAt + SCENE_FRAMES, duration: 12 },
  pivot: params.enterAt + Math.floor(SCENE_FRAMES / 2),
  applyBreath: false, // catalog cuts straight — no breath needed
  blocks: [
    numberedEyebrow(params.n, params.total, params.suffix),
    // Subsequent blocks render below the eyebrow via flow layout
    ...params.blocks.map((b) => ({
      ...b,
      // Offset content blocks slightly so the eyebrow lands first
      startOffset:
        ('startOffset' in b && typeof b.startOffset === 'number')
          ? b.startOffset
          : 8,
    })),
  ],
});

// ─── Scene definitions (composition demos in order) ──────────────────────
//
// TOTAL: 23 scenes including intro + CTA. Body = 21 composition demos.

const TOTAL_BODY = 21;

/**
 * Build the array of catalog scenes for a given visual mode.
 * `mode` is uniform across all scenes (catalog doesn't mix modes).
 */
const buildScenes = (mode: VisualMode): SceneSpec[] => {
  const scenes: SceneSpec[] = [];

  // ── Scene: Intro (premium signature, always) ────────────────────────
  scenes.push({
    id: 'intro',
    mode: 'luby-premium',
    enter: { at: 0,            duration: 30 },
    exit:  { at: INTRO_FRAMES, duration: 12 },
    pivot: 45,
    applyBreath: false,
    blocks: [
      { kind: 'logo-mark',  height: 220, animated: true, idleBreathe: true, startOffset: 0 },
      { kind: 'eyebrow',    style: 'mono', text: 'CATÁLOGO VISUAL',         startOffset: 14 },
      { kind: 'tagline',    text: 'Toda composição que renderizamos hoje.', size: 44, align: 'center', startOffset: 18 },
      { kind: 'accent-line',width: 120, thickness: 2, glow: true,           startOffset: 26 },
    ],
  });

  // ── Body scenes — sequential 5s each, numbered 01..21 ──────────────
  let n = 0;
  let cursor = INTRO_FRAMES;
  const addBody = (suffix: string, blocks: SceneSpec['blocks']) => {
    n++;
    scenes.push(catalogScene({ n, total: TOTAL_BODY, suffix, enterAt: cursor, mode, blocks }));
    cursor += SCENE_FRAMES + SCENE_BREATH_BETWEEN;
  };

  // 01 — chrome combo (logo-mark already shown in intro, demo eyebrow + tagline + accent-line)
  addBody('chrome (eyebrow + tagline + accent-line)', [
    { kind: 'eyebrow',     style: 'pill', text: 'EYEBROW PILL', startOffset: 8 },
    { kind: 'tagline',     text: 'Tagline em duas linhas\ncentralizada e respirando.', size: 56, align: 'center', startOffset: 14 },
    { kind: 'accent-line', width: 140, thickness: 2, glow: true, startOffset: 24 },
  ]);

  // 02 — closing-card (without URL — URL is optional and often unnecessary
  // when the headline + logo already do the work; the final CTA scene
  // of a real video may add urlText explicitly)
  addBody('closing-card (sem URL)', [
    { kind: 'closing-card', eyebrow: 'CLOSING CARD', headline: 'Headline declarativa.', logoHeight: 120 },
  ]);

  // 03 — sentence-with-syncs
  // No markdown asterisks in `text` — the SentenceWithSyncsBlock matches
  // `syncs[].word` against tokens split by whitespace. Punctuation is
  // normalized away, but asterisks aren't. Passing the word raw lets
  // the sync map cleanly.
  addBody('sentence-with-syncs', [
    { kind: 'sentence-with-syncs',
      text: 'Frase com palavras-chave sincronizadas a ícones.',
      syncs: [
        { word: 'palavras-chave', icon: 'sparkles', placement: 'above' },
        { word: 'ícones',          icon: 'eye',      placement: 'above' },
      ],
      size: 48, align: 'center',
    },
  ]);

  // 04 — concept-row (sem highlight)
  addBody('concept-row (3 cards)', [
    { kind: 'concept-row',
      heading: 'Três conceitos lado a lado',
      concepts: [
        { icon: 'building', title: 'Conceito A', caption: 'Descrição curta' },
        { icon: 'workflow', title: 'Conceito B', caption: 'Descrição curta' },
        { icon: 'gauge',    title: 'Conceito C', caption: 'Descrição curta' },
      ],
    },
  ]);

  // 05 — concept-row com highlight
  addBody('concept-row (com highlight)', [
    { kind: 'concept-row',
      heading: 'Um conceito carrega o peso',
      concepts: [
        { icon: 'building', title: 'Opção',     caption: 'Comum',           accent: 'deep' },
        { icon: 'workflow', title: 'Opção',     caption: 'Comum',           accent: 'deep' },
        { icon: 'sparkles', title: 'Destaque',  caption: 'O protagonista',  accent: 'bright', highlight: true },
      ],
    },
  ]);

  // 06 — pipeline
  addBody('pipeline (start → 4 stages → end)', [
    { kind: 'pipeline',
      startLabel: 'INÍCIO',
      endLabel:   'FIM',
      stages: [
        { icon: 'search',       title: 'Etapa 1', caption: 'descrição curta' },
        { icon: 'code',         title: 'Etapa 2', caption: 'descrição curta' },
        { icon: 'shield-check', title: 'Etapa 3', caption: 'descrição curta' },
        { icon: 'rocket',       title: 'Etapa 4', caption: 'descrição curta' },
      ],
    },
  ]);

  // 07 — multiplication-equation
  addBody('multiplication-equation (A × B = C)', [
    { kind: 'multiplication-equation',
      eyebrow: 'EQUAÇÃO VISUAL',
      left:   { kind: 'icon-label', icon: 'users', label: 'Time',   subLabel: 'fator A' },
      op1:    '×',
      right:  { kind: 'icon-label', icon: 'bot',   label: 'Agentes', subLabel: 'fator B' },
      op2:    '=',
      result: { kind: 'number', numberLabel: '3-5×', subLabel: 'resultado', accent: true },
    },
  ]);

  // 08 — big-stat typographic
  addBody('big-stat (typographic)', [
    { kind: 'big-stat', style: 'typographic',
      value: '220+', caption: 'engenheiros sêniors', source: 'estilo: typographic',
    },
  ]);

  // 09 — big-stat donut
  addBody('big-stat (donut)', [
    { kind: 'big-stat', style: 'donut',
      value: '70%', caption: 'visualização em arco radial', source: 'estilo: donut',
    },
  ]);

  // 10 — big-stat comparison-bars
  addBody('big-stat (comparison-bars)', [
    { kind: 'big-stat', style: 'comparison-bars',
      value: '3-5×', caption: 'mais rápido', source: 'estilo: comparison-bars',
      comparisonBars: {
        baseline: { label: 'Baseline', ratio: 1 },
        target:   { label: 'Target',   ratio: 4 },
      },
    },
  ]);

  // 11 — metric-grid
  addBody('metric-grid (2 KPIs)', [
    { kind: 'metric-grid',
      heading: 'Métricas em grid',
      metrics: [
        { value: '220+',   label: 'engenheiros',  sublabel: 'sêniors',     icon: 'users', accent: 'bright' },
        { value: '1.350+', label: 'projetos',     sublabel: 'entregues',   icon: 'check', accent: 'bright' },
      ],
    },
  ]);

  // 12 — feature-grid
  addBody('feature-grid (4 features 2×2)', [
    { kind: 'feature-grid',
      heading: 'Quatro features em grade 2×2',
      features: [
        { icon: 'shield',       title: 'Feature A', description: 'Descrição da feature' },
        { icon: 'shield-check', title: 'Feature B', description: 'Descrição da feature' },
        { icon: 'gauge',        title: 'Feature C', description: 'Descrição da feature' },
        { icon: 'brain',        title: 'Feature D', description: 'Descrição da feature' },
      ],
    },
  ]);

  // 13 — quote
  addBody('quote (testimonial)', [
    { kind: 'quote',
      quote: 'Esta é uma citação ilustrativa para demonstrar o block quote em isolamento.',
      attribution: 'Nome do Autor',
      role: 'Cargo, Empresa',
    },
  ]);

  // 14 — logo-row (4 Luby logos como placeholders — single asset disponível)
  addBody('logo-row (4 logos — Luby ×4 como placeholder)', [
    { kind: 'logo-row',
      heading: 'Fileira de logos',
      logos: [
        { name: 'Luby 1', src: SHARED_LOGO, tint: 'mono' },
        { name: 'Luby 2', src: SHARED_LOGO, tint: 'mono' },
        { name: 'Luby 3', src: SHARED_LOGO, tint: 'mono' },
        { name: 'Luby 4', src: SHARED_LOGO, tint: 'mono' },
      ],
    },
  ]);

  // 15 — timeline (horizontal)
  addBody('timeline (5 marcos horizontais)', [
    { kind: 'timeline',
      heading: 'Linha do tempo horizontal',
      events: [
        { when: '2019', what: 'Marco 1', icon: 'circle-dashed' },
        { when: '2021', what: 'Marco 2', icon: 'circle-dashed' },
        { when: '2023', what: 'Marco 3', icon: 'circle-dashed', highlight: true },
        { when: '2024', what: 'Marco 4', icon: 'circle-dashed' },
        { when: '2026', what: 'Hoje',    icon: 'circle-dashed' },
      ],
    },
  ]);

  // 16 — split-screen-comparison
  addBody('split-screen-comparison', [
    { kind: 'split-screen-comparison',
      heading: 'Comparação binária',
      left:  { icon: 'cpu',      title: 'Lado A', caption: 'opção 1', accent: 'deep'   },
      right: { icon: 'workflow', title: 'Lado B', caption: 'opção 2', accent: 'bright' },
      centerSymbol: 'vs',
      highlightSide: 'right',
    },
  ]);

  // 17 — vertical-stack
  addBody('vertical-stack (5 itens)', [
    { kind: 'vertical-stack',
      heading: 'Lista vertical tipográfica',
      items: [
        { icon: 'shield-check', title: 'Item um',    caption: 'descrição curta' },
        { icon: 'eye',          title: 'Item dois',  caption: 'descrição curta' },
        { icon: 'gauge',        title: 'Item três',  caption: 'descrição curta' },
        { icon: 'brain',        title: 'Item quatro',caption: 'descrição curta' },
        { icon: 'rocket',       title: 'Item cinco', caption: 'descrição curta' },
      ],
      align: 'left',
    },
  ]);

  // 18 — central-spotlight-with-satellites
  addBody('central-spotlight (núcleo + 4 satélites)', [
    { kind: 'central-spotlight-with-satellites',
      heading: 'Núcleo e satélites',
      center: { icon: 'brain', title: 'Conceito central', caption: 'o âncora' },
      satellites: [
        { icon: 'shield',       label: 'Satélite N'  },
        { icon: 'file-check',   label: 'Satélite E'  },
        { icon: 'zap',          label: 'Satélite S'  },
        { icon: 'users',        label: 'Satélite O'  },
      ],
      showConnectors: true,
    },
  ]);

  // 19 — giant-statement
  addBody('giant-statement (palavra gigante)', [
    { kind: 'giant-statement',
      text: 'Declaração.',
      size: 240,
      weight: 'semibold',
      reveal: 'mask-up',
      accent: 'white',
    },
  ]);

  // 20 — quadrante-2x2
  addBody('quadrante-2x2 (matriz com eixos)', [
    { kind: 'quadrante-2x2',
      heading: 'Matriz 2×2 com eixos nomeados',
      axisX: { lowLabel: 'Eixo X baixo', highLabel: 'Eixo X alto' },
      axisY: { lowLabel: 'Eixo Y baixo', highLabel: 'Eixo Y alto' },
      quadrants: {
        topLeft:     { icon: 'circle-dashed', title: 'TL', caption: 'top-left'    },
        topRight:    { icon: 'sparkles',      title: 'TR', caption: 'top-right (destaque)', highlight: true },
        bottomLeft:  { icon: 'circle-dashed', title: 'BL', caption: 'bottom-left' },
        bottomRight: { icon: 'circle-dashed', title: 'BR', caption: 'bottom-right' },
      },
    },
  ]);

  // 21 — iceberg-revelation
  addBody('iceberg-revelation (superfície vs profundidade)', [
    { kind: 'iceberg-revelation',
      heading: 'Iceberg: o que aparece vs o que sustenta',
      surface: {
        items: [
          { icon: 'eye', label: 'Visível', caption: 'acima da linha' },
        ],
      },
      depth: {
        items: [
          { icon: 'building',     label: 'Camada 1', caption: 'abaixo da linha' },
          { icon: 'shield-check', label: 'Camada 2', caption: 'abaixo da linha' },
          { icon: 'gauge',        label: 'Camada 3', caption: 'abaixo da linha' },
          { icon: 'code',         label: 'Camada 4', caption: 'abaixo da linha' },
        ],
      },
      waterLinePercent: 30,
    },
  ]);

  // ── CTA (premium signature, always) ────────────────────────────────
  scenes.push({
    id: 'cta',
    mode: 'luby-premium',
    enter: { at: cursor,            duration: 30 },
    pivot: cursor + 45,
    applyBreath: false,
    blocks: [
      { kind: 'closing-card',
        eyebrow:   'FIM DO CATÁLOGO',
        headline:  '21 composições demonstradas.',
        logoHeight: 120,
        urlText:   'luby.co',
      },
    ],
  });

  return scenes;
};

// ─── Total frames calculation ───────────────────────────────────────────
//
// intro 90 + 21 body × 150 + CTA 90 = 90 + 3150 + 90 = 3330 frames
// At 30fps = 111 seconds (~1m51s).

const TOTAL_FRAMES = INTRO_FRAMES + TOTAL_BODY * SCENE_FRAMES + CTA_FRAMES; // 3330

const baseSpec = (id: string, title: string, mode: VisualMode, themeSchedule?: ThemeWindowSpec[]): VideoSpec => ({
  id,
  title,
  output: {
    width:           1920,
    height:          1080,
    fps:             30,
    durationFrames:  TOTAL_FRAMES,
  },
  context: {
    lang: 'pt',
    mode: 'corporate',
  },
  audio: {
    // BGM off — too long for ducking to matter; catalog is silent inspection.
    narrationEnabled: false,
  },
  themeSchedule,
  scenes: buildScenes(mode),
  transitions: [], // No transitions — direct cuts between scenes
});

// ─── Three variants ─────────────────────────────────────────────────────

export const visualCatalogPremiumDarkSpec = baseSpec(
  'visual-catalog-premium-dark',
  'Catálogo Visual — Premium / Dark',
  'luby-premium',
  undefined, // entire video dark
);

export const visualCatalogMinimalDarkSpec = baseSpec(
  'visual-catalog-minimal-dark',
  'Catálogo Visual — Minimal / Dark',
  'luby-minimal',
  undefined,
);

export const visualCatalogPremiumLightSpec = baseSpec(
  'visual-catalog-premium-light',
  'Catálogo Visual — Premium / Light',
  'luby-premium',
  // Whole video on light theme except for the premium intro/CTA which
  // already use logo-mark designed for dark. We DO test light theme
  // on all body scenes (1..21).
  [{ theme: 'light', from: INTRO_FRAMES, to: INTRO_FRAMES + TOTAL_BODY * SCENE_FRAMES }],
);

export const VISUAL_CATALOG_TOTAL_FRAMES = TOTAL_FRAMES;
