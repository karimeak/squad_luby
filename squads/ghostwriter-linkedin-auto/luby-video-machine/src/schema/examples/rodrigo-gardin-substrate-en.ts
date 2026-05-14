/**
 * rodrigo-gardin-substrate-en.ts — "The bottleneck isn't the model."
 *
 * Run: agents/runs/2026-05-13-rodrigo-gardin-en-us/
 *
 * Single message (Strategist):
 *   "The bottleneck of AI agents isn't the model. It's the deterministic
 *    substrate underneath."
 *
 * Narrative structure (Director, premium uniform dark — no theme schedule):
 *
 *   Intro    [premium, dark]  logo-with-bloom: tagline contrarian
 *                              (logo auto-suppressed in personal)
 *   Hook     [premium, dark]  giant-statement: "19% slower."
 *   Bullets  [premium, dark]  multiplication-equation: 1.6% × 98.4% = ✓ Working agent (HERO)
 *   Stat     [premium, dark]  big-stat comparison-bars: +242.7% incidents (weak vs strong teams)
 *   CTA      [premium, dark]  closing-card: technical question (logo auto-suppressed)
 *
 * Audio: silent (BGM/narration off — same as karime-kumagai-revops-en).
 *
 * Source for stats:
 *   - 19% slower: METR randomized study, 2025
 *   - 1.6% / 98.4%: Vrungta substack reverse-engineering, 2026
 *   - +242.7% incidents: DORA 2025 Report (Google Cloud)
 *
 * Single export: en spec only. Rodrigo is bilingual (language=['en-us','pt-br'])
 * but video rotation defaults to first element (en-us) since he never
 * received a video before. Squad ghostwriter-linkedin-auto v1.6.0 generates
 * 1 video per selected collaborator in the rotation language.
 */

import type { VideoSpec } from '../types';

export const rodrigoGardinSubstrateEnSpec: VideoSpec = {
  id: 'rodrigo-gardin-substrate-en',
  title: "The bottleneck isn't the model — Agent architecture deep-dive",

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
      name: 'Rodrigo Gardin',
      role: 'Técnico / CTO @ Luby',
    },
  },

  audio: {
    // BGM on (audio assets versioned in the repo as of d8e01d5). Track
    // 'minimal' fits Rodrigo's restrained, deep-technical tone.
    // Narration stays OFF: the roteiro is text-on-screen by design and
    // the versioned narration clips are luby-demo scene content, not
    // Rodrigo's custom copy.
    bgmId:           'corporate-tech-minimal-1',
    bgmVolume:       0.12,
    bgmVolumeDucked: 0.05,
    narrationEnabled: false,
    narrationVolume:  0.95,
  },

  themeSchedule: [], // dark uniforme

  scenes: [
    // ───────────────────────────────────────────────────────────────────
    // INTRO — declarative contrarian signature (logo auto-suppressed)
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
        { kind: 'eyebrow', style: 'mono', text: 'AGENT ARCHITECTURE', startOffset: 14 },
        { kind: 'tagline', text: "The bottleneck isn't the model.", size: 48, align: 'center', startOffset: 18 },
        { kind: 'accent-line', width: 120, thickness: 2, glow: true, startOffset: 26 },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // HOOK — giant-statement: "19% slower." (paradox shock)
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
          kind: 'giant-statement',
          text: '19% slower.',
          size: 220,
          weight: 'bold',
          reveal: 'mask-up',
          accent: 'white',
        },
        {
          kind: 'tagline',
          text: 'Experienced devs with AI in their own codebase. They felt 20% faster. (METR randomized study, 2025)',
          size: 22,
          align: 'center',
          startOffset: 24,
        },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // BULLETS — multiplication-equation: 1.6% × 98.4% = ✓ Working agent (HERO)
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
          kind: 'multiplication-equation',
          eyebrow: 'CLAUDE CODE: REVERSE-ENGINEERED',
          left:   { kind: 'number', numberLabel: '1.6%',  subLabel: 'AI decision logic' },
          right:  { kind: 'number', numberLabel: '98.4%', subLabel: 'Deterministic infrastructure' },
          result: { kind: 'icon-label', icon: 'check', label: 'Working agent', subLabel: 'Vrungta, 2026', accent: true },
          op1: '×',
          op2: '=',
        },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // STAT — big-stat comparison-bars: +242.7% incidents (DORA 2025)
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
          style: 'comparison-bars',
          value: '+242.7%',
          caption: 'incidents per PR for weak teams. AI is an amplifier, not a force multiplier.',
          source: '— DORA 2025 Report (Google Cloud, n≈39k devs)',
          comparisonBars: {
            baseline: { label: 'Strong teams', ratio: 1 },
            target:   { label: 'Weak teams',   ratio: 3.43 },
          },
        },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // CTA — closing-card: technical question (logo auto-suppressed in personal)
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
          eyebrow: 'PLATFORM > MODEL',
          headline: 'What does your platform layer actually do for the agent?',
          logoHeight: 140,
          urlText: '',
        },
      ],
    },
  ],

  transitions: [], // premium uniforme; dark do começo ao fim
};
