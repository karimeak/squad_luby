/**
 * karime-kumagai-revops-en.ts — "AI is not the bottleneck."
 *
 * Run: agents/runs/2026-05-13-karime-kumagai-en-us/
 *
 * Single message (Strategist):
 *   "Most companies are buying more AI agents when the bottleneck is
 *    the data architecture supporting the ones they already deployed."
 *
 * Narrative structure (Director, premium uniform dark — no theme schedule):
 *
 *   Intro    [premium, dark]  logo-with-bloom: tagline contrarian
 *                              (logo auto-suppressed in personal mode)
 *   Hook     [premium, dark]  split-screen full-bleed: 96% vs 42%
 *   Bullets  [premium, dark]  vertical-stack: 5 spend allocation items
 *                              (biggest spend ↔ biggest ROI inversion)
 *   Stat     [premium, dark]  big-stat typographic: 37%
 *   CTA      [premium, dark]  closing-card: 2-line negation+affirmation
 *                              (no URL, logo auto-suppressed in personal)
 *
 * Audio: silent (BGM/narration assets not generated locally — ghostwriter-
 * linkedin-auto squad runs without local audio gen pipeline).
 *
 * Source for stats:
 *   - 96% / 42%: Gong/Forrester State of Revenue AI 2025
 *   - 50% misallocation: MIT 2025 GenAI Report
 *   - 37% revenue loss: Datagroomr State of CRM Data Quality 2025
 *
 * Single export: en spec only. Karime is monolingual EN-US (collaborator
 * language=['en-us']). The squad ghostwriter-linkedin-auto v1.6.0 generates
 * 1 video per selected collaborator in their language and personal mode.
 */

import type { VideoSpec } from '../types';

export const karimeKumagaiRevopsEnSpec: VideoSpec = {
  id: 'karime-kumagai-revops-en',
  title: 'AI is not the bottleneck — RevOps & Data Architecture',

  output: {
    width:          1920,
    height:         1080,
    fps:            30,
    durationFrames: 900,
  },

  context: {
    lang: 'en',
    mode: 'personal',
    speaker: {
      name: 'Karime Kumagai',
      role: 'RevOps & Growth Strategist @ Luby',
    },
  },

  audio: {
    // BGM on (audio assets versioned in the repo as of d8e01d5). Track
    // 'confident' fits Karime's consultative, authoritative tone.
    // Narration stays OFF: the roteiro is text-on-screen by design and
    // the versioned narration clips are luby-demo scene content, not
    // Karime's custom copy.
    bgmId:           'corporate-tech-confident-1',
    bgmVolume:       0.12,
    bgmVolumeDucked: 0.05,
    narrationEnabled: false,
    narrationVolume:  0.95,
  },

  themeSchedule: [], // dark uniforme — sem theme transitions

  scenes: [
    // ───────────────────────────────────────────────────────────────────
    // INTRO — declarative contrarian signature (logo auto-suppressed in personal)
    // ───────────────────────────────────────────────────────────────────
    {
      id: 'intro',
      mode: 'luby-premium',
      enter: { at: 0,  duration: 30 },
      exit:  { at: 60, duration: 12 },
      pivot: 40,
      applyBreath: false,
      blocks: [
        { kind: 'logo-mark', height: 240, animated: true, idleBreathe: true, startOffset: 0 },
        { kind: 'eyebrow', style: 'mono', text: 'REVOPS 2026', startOffset: 14 },
        { kind: 'tagline', text: 'AI is not the bottleneck.', size: 48, align: 'center', startOffset: 18 },
        { kind: 'accent-line', width: 120, thickness: 2, glow: true, startOffset: 26 },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // HOOK — split-screen full-bleed: 96% expectation vs 42% reality
    // ───────────────────────────────────────────────────────────────────
    {
      id: 'hook',
      mode: 'luby-premium',
      enter: { at: 90,  duration: 24 },
      exit:  { at: 250, duration: 12 },
      pivot: 165,
      applyBreath: true,
      blocks: [
        {
          kind: 'split-screen-comparison',
          heading: 'Revenue leaders in 2026:',
          left:  { icon: 'trending-up',  title: '96%', caption: 'expect AI by 2026',          accent: 'deep'   },
          right: { icon: 'shield-alert', title: '42%', caption: "hit ROI in 2025's deployments", accent: 'bright' },
          centerSymbol: 'vs',
          highlightSide: 'right',
        },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // BULLETS — vertical-stack: GenAI spend distribution (HERO)
    //   Inversion: top item = biggest spend, bottom item = biggest ROI
    // ───────────────────────────────────────────────────────────────────
    {
      id: 'bullets',
      mode: 'luby-premium',
      enter: { at: 250, duration: 24 },
      exit:  { at: 610, duration: 12 },
      pivot: 480,
      applyBreath: true,
      blocks: [
        {
          kind: 'vertical-stack',
          heading: 'GenAI spend distribution in 2025:',
          align: 'left',
          items: [
            { icon: 'eye',        title: 'Sales demos & innovation showcases', caption: 'biggest spend (~50%)' },
            { icon: 'gauge',      title: 'Forecasting accuracy',                caption: 'underfunded' },
            { icon: 'line-chart', title: 'CRM hygiene',                          caption: 'underfunded' },
            { icon: 'file-check', title: 'Quote-to-cash automation',             caption: 'underfunded' },
            { icon: 'workflow',   title: 'Deal desk workflows',                  caption: 'biggest ROI' },
          ],
        },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // STAT — big-stat typographic: 37% revenue loss (dark uniforme)
    // ───────────────────────────────────────────────────────────────────
    {
      id: 'stat',
      mode: 'luby-premium',
      enter: { at: 610, duration: 24 },
      exit:  { at: 775, duration: 12 },
      pivot: 700,
      applyBreath: true,
      blocks: [
        {
          kind: 'big-stat',
          style: 'typographic',
          value: '37%',
          caption: 'of teams already report revenue loss from poor data quality.',
          source: '— Datagroomr, State of CRM Data Quality 2025',
        },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // CTA — closing card: 2-line negation+affirmation (no URL, logo auto-suppressed in personal)
    // ───────────────────────────────────────────────────────────────────
    {
      id: 'cta',
      mode: 'luby-premium',
      enter: { at: 775, duration: 30 },
      pivot: 840,
      applyBreath: true,
      blocks: [
        {
          kind: 'closing-card',
          eyebrow: 'DATA FOUNDATION FIRST',
          headline: 'The 2026 winners built the data foundation first — not the largest AI stack.',
          logoHeight: 140,
          urlText: '',
        },
      ],
    },
  ],

  transitions: [], // premium uniforme; dark do começo ao fim
};
