/**
 * archetypes-smoke-test.ts — vídeo de validação técnica da Wave 3.
 *
 * Run: agents/runs/2026-05-13-archetypes-smoke-test/
 *
 * Objetivo: renderizar 4 arquétipos novos (giant-statement,
 * split-screen-comparison, central-spotlight-with-satellites,
 * quadrante-2x2) em 4 cenas distintas, com Intro + CTA premium
 * existentes nas pontas.
 *
 * Conteúdo é PLACEHOLDER deliberado — esta spec NÃO é vídeo de
 * marketing. Foco: validar que cada arquétipo renderiza sem
 * sobreposições / proporções erradas / explosões de TS.
 */

import type { VideoSpec } from '../types';

export const archetypesSmokeTestSpec: VideoSpec = {
  id: 'archetypes-smoke-test',
  title: 'Smoke-test — biblioteca de arquétipos (Wave 3)',

  output: {
    width:           1920,
    height:          1080,
    fps:             30,
    durationFrames:  900,
  },

  context: {
    lang: 'pt',
    mode: 'corporate',
  },

  audio: {
    bgmId:           'corporate-tech-confident-1',
    bgmVolume:       0.12,
    bgmVolumeDucked: 0.05,
    narrationEnabled: false,
    narrationVolume:  0.95,
  },

  themeSchedule: undefined,

  scenes: [
    // ═════════════════════════════════════════════════════════════════════
    // INTRO — premium logo-with-bloom
    // ═════════════════════════════════════════════════════════════════════
    {
      id: 'intro',
      mode: 'luby-premium',
      enter: { at: 0,  duration: 30 },
      exit:  { at: 60, duration: 12 },
      pivot: 40,
      applyBreath: false,
      blocks: [
        { kind: 'logo-mark', height: 240, animated: true, idleBreathe: true, startOffset: 0 },
        { kind: 'eyebrow', style: 'mono', text: 'TESTE TÉCNICO', startOffset: 14 },
        { kind: 'tagline', text: 'Wave 3 — biblioteca de arquétipos', size: 48, align: 'center', startOffset: 18 },
        { kind: 'accent-line', width: 120, thickness: 2, glow: true, startOffset: 26 },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════
    // HOOK — giant-statement (NOVO archetype)
    // ═════════════════════════════════════════════════════════════════════
    {
      id: 'hook',
      mode: 'luby-premium',
      enter: { at: 90,  duration: 24 },
      exit:  { at: 240, duration: 12 },
      pivot: 165,
      applyBreath: true,
      blocks: [
        {
          kind: 'giant-statement',
          text: 'Variação.',
          size: 240,
          weight: 'semibold',
          reveal: 'mask-up',
          accent: 'white',
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════
    // BULLETS-1 — split-screen-comparison (NOVO archetype)
    // ═════════════════════════════════════════════════════════════════════
    {
      id: 'bullets-1',
      mode: 'luby-premium',
      enter: { at: 240, duration: 18 },
      exit:  { at: 390, duration: 12 },
      pivot: 320,
      applyBreath: true,
      blocks: [
        {
          kind: 'split-screen-comparison',
          heading: 'Antes da Wave 3 vs agora',
          left: {
            icon: 'circle-dashed',
            title: 'Cena igual',
            caption: 'sempre 3 cards',
            accent: 'deep',
          },
          right: {
            icon: 'sparkles',
            title: 'Cena diferente',
            caption: '11 arquétipos no catálogo',
            accent: 'bright',
          },
          centerSymbol: 'vs',
          highlightSide: 'right',
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════
    // BULLETS-2 — central-spotlight-with-satellites (NOVO archetype)
    // ═════════════════════════════════════════════════════════════════════
    {
      id: 'bullets-2',
      mode: 'luby-premium',
      enter: { at: 390, duration: 18 },
      exit:  { at: 600, duration: 12 },
      pivot: 500,
      applyBreath: true,
      blocks: [
        {
          kind: 'central-spotlight-with-satellites',
          heading: 'Modelo operacional',
          center: {
            icon: 'brain',
            title: 'AI-augmented engineering',
            caption: 'núcleo do modelo',
          },
          satellites: [
            { icon: 'shield', label: 'Governança' },
            { icon: 'file-check', label: 'Compliance' },
            { icon: 'zap', label: 'Velocidade' },
            { icon: 'users', label: 'Contexto' },
          ],
          showConnectors: true,
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════
    // STAT — quadrante-2x2 (NOVO archetype)
    // ═════════════════════════════════════════════════════════════════════
    {
      id: 'stat',
      mode: 'luby-premium',
      enter: { at: 600, duration: 24 },
      exit:  { at: 810, duration: 12 },
      pivot: 720,
      applyBreath: true,
      blocks: [
        {
          kind: 'quadrante-2x2',
          heading: 'Onde estamos no mercado',
          axisX: { lowLabel: 'Lento', highLabel: 'Rápido' },
          axisY: { lowLabel: 'Baixa especialização', highLabel: 'Alta especialização' },
          quadrants: {
            topLeft: {
              icon: 'briefcase',
              title: 'Boutique tradicional',
              caption: 'specialista mas lenta',
            },
            topRight: {
              icon: 'sparkles',
              title: 'Modelo Luby',
              caption: 'especialista + AI-augmented',
              highlight: true,
            },
            bottomLeft: {
              icon: 'circle-dashed',
              title: 'Genéricos',
              caption: 'sem ângulo claro',
            },
            bottomRight: {
              icon: 'bot',
              title: 'AI-only',
              caption: 'rápido, sem contexto',
            },
          },
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════
    // CTA — logo-with-bloom (closing-card variant)
    // ═════════════════════════════════════════════════════════════════════
    {
      id: 'cta',
      mode: 'luby-premium',
      enter: { at: 810, duration: 30 },
      pivot: 855,
      applyBreath: true,
      blocks: [
        {
          kind: 'closing-card',
          eyebrow: 'WAVE 3',
          headline: 'Cinco arquétipos novos.',
          logoHeight: 140,
          urlText: 'luby.co/archetypes',
        },
      ],
    },
  ],

  transitions: [], // premium uniforme, sem flash interno
};
