/**
 * luby-demo.ts — the canonical Luby demo video, expressed as a VideoSpec.
 *
 * This is the reference example for the squad. To create a new video,
 * COPY this file and edit. Each scene below is annotated with what it
 * does and why the choices were made.
 *
 * The data here is the SOURCE OF TRUTH for the demo. The renderers
 * (PremiumScene, MinimalScene) consume this — they don't hardcode
 * anything specific to "Luby" or "this demo".
 *
 * STRUCTURE OF THIS DEMO
 * ──────────────────────
 *   IntroScene    [0    →  72]   premium  — brand mark + tagline
 *   HookScene     [60   → 200]   minimal  — sync'd words form the question
 *   BulletsScene  [200  → 580]   minimal  — three pillars as syncs (or pipeline diagram)
 *   StatScene     [580  → 740]   minimal  — 60% as a synced statement
 *   CTAScene      [740  → 900]   premium  — closing brand statement
 *
 * The premium↔minimal transitions auto-emit a TransitionFlash (see the
 * `transitions` field at the bottom — left to default, the renderer
 * detects mode changes and inserts a 4f white flash on each boundary).
 */

import type { VideoSpec } from '../types';

export const lubyDemoSpec: VideoSpec = {
  id: 'luby-demo',
  title: 'Luby Demo — AI development, secured (v4)',

  output: {
    width:           1920,
    height:          1080,
    fps:             30,
    durationFrames:  900, // 30 seconds
  },

  context: {
    lang: 'pt',
    mode: 'corporate',
  },

  audio: {
    bgmId:           'corporate-tech-uplifting-1',
    bgmVolume:       0.12,
    bgmVolumeDucked: 0.05,
    narrationEnabled: true,
    narrationVolume:  0.95,
  },

  // The "result" stat scene flips to a soft off-white surface so the
  // structural arc reads tension → process → RESULT (light) → close.
  // (Same windows the project has used since v3.)
  themeSchedule: [
    { theme: 'light', from: 580, to: 740 },
  ],

  scenes: [
    // ═════════════════════════════════════════════════════════════════════
    // INTRO — premium brand opener
    // ═════════════════════════════════════════════════════════════════════
    {
      id: 'intro',
      mode: 'luby-premium',
      enter: { at: 0,  duration: 30 }, // motion.enterDramatic
      exit:  { at: 60, duration: 12 },
      pivot: 40,
      // First scene — no breath needed (nothing exits before it)
      applyBreath: false,
      blocks: [
        {
          kind: 'logo-mark',
          height: 280,
          animated: true,
          idleBreathe: true,
          startOffset: 0,
        },
        {
          kind: 'eyebrow',
          style: 'mono',
          text: 'AI-AUGMENTED ENGINEERING',
          startOffset: 14,
        },
        {
          kind: 'tagline',
          text: 'Desenvolvimento com IA, com segurança',
          size: 52,
          align: 'center',
          startOffset: 18,
        },
        {
          kind: 'accent-line',
          width: 120,
          thickness: 2,
          glow: true,
          startOffset: 26,
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════
    // HOOK — minimal mode, the scroll-stopper question
    // ═════════════════════════════════════════════════════════════════════
    // The full question is rendered word by word. Three words trigger
    // synchronized icons: "acelerar" → Zap, "IA" → Sparkles,
    // "segurança" → ShieldCheck (the climax — biggest icon).
    //
    // Words NOT listed in `syncs` render as plain white text. Words
    // listed without an explicit icon get auto-resolved by the keyword
    // map (see iconMap.suggestIconForWord).
    {
      id: 'hook',
      mode: 'luby-minimal',
      enter: { at: 60,  duration: 24 }, // motion.enterSlow
      exit:  { at: 200, duration: 12 },
      pivot: 130,
      applyBreath: true,
      blocks: [
        {
          kind: 'sentence-with-syncs',
          text: 'Como acelerar com IA sem abrir mão da segurança?',
          align: 'center',
          // 56px lets the full 9-word sentence fit on one horizontal
          // line at 1700px max-width. Icons auto-scale to ~85% of font
          // size, so they pair visually instead of dominating.
          size: 56,
          wordStaggerFrames: 6,
          syncs: [
            { word: 'acelerar',  icon: 'zap',          highlight: true, placement: 'above' },
            { word: 'IA',        icon: 'sparkles',     highlight: true, placement: 'above' },
            // segurança is the climax — slightly larger icon than the
            // auto-proportional default, but not the previous 96px that
            // dwarfed the word.
            { word: 'segurança', icon: 'shield-check', highlight: true, iconSize: 64, placement: 'above' },
          ],
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════
    // BULLETS — minimal mode, three pillars as syncs
    // ═════════════════════════════════════════════════════════════════════
    // First iteration: same sentence-with-syncs primitive used as a
    // single statement. If we want the assembled-pipeline diagram back
    // for this scene, swap the block kind to 'pipeline' and the
    // renderer picks the diagram component instead. The schema can
    // express both — the choice is content-author's, not renderer's.
    {
      id: 'bullets',
      mode: 'luby-minimal',
      enter: { at: 200, duration: 18 }, // motion.enter
      exit:  { at: 580, duration: 12 },
      pivot: 400,
      applyBreath: true,
      blocks: [
        {
          kind: 'sentence-with-syncs',
          text: 'Code review automático. Validação de vulnerabilidades. Compliance desde o dia um.',
          align: 'center',
          size: 56,
          wordStaggerFrames: 6,
          syncs: [
            { word: 'review',         icon: 'eye',          highlight: true,  iconSize: 64, placement: 'above' },
            { word: 'vulnerabilidades', icon: 'shield-alert', highlight: true,  iconSize: 64, placement: 'above' },
            { word: 'compliance',     icon: 'file-check',   highlight: true,  iconSize: 64, placement: 'above' },
          ],
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════
    // STAT — minimal mode + light theme window
    // ═════════════════════════════════════════════════════════════════════
    // The themeSchedule above flips this window to off-white. The
    // renderer reads the active theme and the donut/typography flip
    // their palettes accordingly. The MINIMAL mode still applies — no
    // glows, no orbs, just a bold number on a clean surface.
    {
      id: 'stat',
      mode: 'luby-minimal',
      enter: { at: 580, duration: 24 }, // motion.enterSlow
      exit:  { at: 740, duration: 12 },
      pivot: 670,
      applyBreath: true,
      blocks: [
        {
          kind: 'big-stat',
          value:  '60%',
          caption: 'menos vulnerabilidades em produção',
          source: 'Média entre clientes Luby — 2025',
          style: 'donut',
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════
    // CTA — premium mode, closing brand statement
    // ═════════════════════════════════════════════════════════════════════
    {
      id: 'cta',
      mode: 'luby-premium',
      enter: { at: 740, duration: 30 }, // motion.enterDramatic
      // No exit — holds until end of video
      pivot: 830,
      applyBreath: true,
      blocks: [
        {
          kind: 'closing-card',
          eyebrow: 'POWERED BY AI',
          headline: 'Construa com IA. Construa com segurança.',
          logoHeight: 140,
        },
      ],
    },
  ],

  // Leave `transitions` undefined → renderer auto-emits a 4f white flash
  // on every premium↔minimal boundary detected from `scenes[].mode`.
};
