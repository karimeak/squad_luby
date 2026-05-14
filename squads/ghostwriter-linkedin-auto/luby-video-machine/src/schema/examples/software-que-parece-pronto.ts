/**
 * software-que-parece-pronto.ts — "A definição de pronto mente."
 *
 * Run: agents/runs/2026-05-12-software-que-parece-pronto/
 *
 * Single message (Strategist):
 *   "A definição de 'pronto' muda quando você é responsável pelo que
 *    acontece depois da review."
 *
 * Narrative structure (Director, premium uniform + light Stat):
 *
 *   Intro    [premium, dark]  logo-with-bloom: tagline declarativa
 *   Hook     [premium, dark]  split-screen full-bleed: parece ≠ está
 *   Bullets  [premium, dark]  onion-peel-revelation: 1 visível + 7 camadas (HERO)
 *   Stat     [premium, light] big-stat typographic: 70%
 *   CTA      [premium, dark]  closing-card
 *
 * Wave 5 firsts:
 *   - First real video using onion-peel-revelation archetype
 *   - First real video using `themeSchedule` (light window in Stat)
 *     since the legacy luby-demo
 *   - First video produced under the 3-variants rule (PT/EN/Personal)
 *
 * Two specs exported: ptSpec (PT-BR text) and enSpec (EN-US text).
 * Compositions pick by lang. Personal uses ptSpec (lang=pt, mode=personal).
 */

import type { VideoSpec } from '../types';

type Lang = 'pt' | 'en';

interface Copy {
  introEyebrow: string;
  introTagline: string;
  hookHeading: string;
  hookLeft:  { title: string; caption: string };
  hookRight: { title: string; caption: string };
  bulletsHeading: string;
  bulletsVisible: string;
  bulletsLayers: string[];
  statValue: string;
  statCaption: string;
  statSource: string;
  ctaEyebrow: string;
  ctaHeadline: string;
  ctaUrl: string;
}

const ptCopy: Copy = {
  introEyebrow: 'DEFINITION OF DONE',
  introTagline: 'A definição de "pronto" mente.',
  hookHeading: 'O que parece pronto ≠ o que está pronto.',
  hookLeft:  { title: 'Parece pronto', caption: 'na review' },
  hookRight: { title: 'Está pronto',   caption: 'em produção' },
  // Substituído 2026-05 por feedback "encher linguiça": as 7 layers
  // genéricas (tratamento de erro, performance, segurança...) viraram
  // 5 conceitos de Production Engineering nomeados, vocabulário que
  // CTO sênior reconhece direto (Netflix, Stripe, SRE book).
  bulletsHeading: 'O que sustenta o software em produção:',
  bulletsVisible: 'A feature funciona',
  bulletsLayers: [
    'Idempotência — sobreviver a retry sem corromper estado',
    'Circuit breakers — falha contida não derruba o resto',
    'Observabilidade — logs e traces que tornam o post-mortem possível',
    'Migração reversível — schema change com rollback testado',
    'Rate limiting — contenção de payload abusivo',
  ],
  // Stat trocada por dado público real (CISQ 2022): custo de poor
  // software quality nos EUA. Número grande, fonte citável,
  // diretamente conectado ao tema.
  // Valor formatado como cifra financeira pura. "US$ 2,41 tri" tinha
  // problema de glyph rendering com tabular-nums (cifrão virava "S" e
  // a vírgula sumia). "$2.4T" é a notação financeira universal —
  // funciona tanto em PT-BR quanto EN-US sem ambiguidade. Caption
  // dá contexto ("trilhões anualmente") explicitamente.
  statValue: '$2.4T',
  statCaption: 'trilhões anuais — o custo de tratar "pronto na review" como "pronto em produção" só nos EUA.',
  statSource: '— Consortium for Information & Software Quality (CISQ), Cost of Poor Software Quality 2022',
  ctaEyebrow: 'ENGENHARIA HONESTA',
  ctaHeadline: 'Veja como definimos "pronto".',
  ctaUrl: 'luby.co/definition-of-done',
};

// Translation handled by Motion Designer per Wave 5 rule.
// Decisions documented in 04-implementation-notes.md.
const enCopy: Copy = {
  introEyebrow: 'DEFINITION OF DONE',
  introTagline: 'The definition of "done" lies.',
  hookHeading: 'What looks done ≠ what\'s actually done.',
  hookLeft:  { title: 'Looks done',    caption: 'in review' },
  hookRight: { title: 'Actually done', caption: 'in production' },
  bulletsHeading: 'What sustains software in production:',
  bulletsVisible: 'The feature works',
  bulletsLayers: [
    'Idempotency — survive retries without corrupting state',
    'Circuit breakers — contained failure that doesn\'t cascade',
    'Observability — logs and traces that make post-mortems possible',
    'Reversible migrations — schema changes with tested rollback',
    'Rate limiting — protection against abusive payloads',
  ],
  statValue: '$2.4T',
  statCaption: 'is the annual cost of poor software quality in the US — the price of treating "done in review" as "done in production."',
  statSource: '— Consortium for Information & Software Quality (CISQ), Cost of Poor Software Quality 2022',
  ctaEyebrow: 'HONEST ENGINEERING',
  ctaHeadline: 'See how we define "done."',
  ctaUrl: 'luby.co/definition-of-done',
};

const buildSpec = (lang: Lang, copy: Copy): VideoSpec => ({
  id: `software-que-parece-pronto-${lang}`,
  title: lang === 'pt'
    ? 'Software que parece pronto mas não está'
    : 'Software that looks done but isn\'t',

  output: {
    width:          1920,
    height:         1080,
    fps:            30,
    durationFrames: 900,
  },

  context: {
    lang,
    mode: 'corporate',
  },

  audio: {
    bgmId:           'corporate-tech-confident-1',
    bgmVolume:       0.12,
    bgmVolumeDucked: 0.05,
    narrationEnabled: false,
    narrationVolume:  0.95,
  },

  // Light theme window during the Stat scene. The window starts AFTER
  // the Bullets scene has fully exited (Bullets exits at 610, exit
  // duration 12f → fully gone by 622). LightOverlay fades in starting
  // `from - 6f` so we offset to 628 to keep the fade-in clean of
  // bleed-through. Window ends a hair before CTA enter (775) so the
  // light-to-dark exit completes before CTA chrome starts.
  themeSchedule: [
    { theme: 'light', from: 628, to: 769 },
  ],

  scenes: [
    // ───────────────────────────────────────────────────────────────────
    // INTRO — declarative signature
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
        { kind: 'eyebrow', style: 'mono', text: copy.introEyebrow, startOffset: 14 },
        { kind: 'tagline', text: copy.introTagline, size: 48, align: 'center', startOffset: 18 },
        { kind: 'accent-line', width: 120, thickness: 2, glow: true, startOffset: 26 },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // HOOK — split-screen full-bleed: parece vs está
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
          heading: copy.hookHeading,
          left:  { icon: 'eye',          title: copy.hookLeft.title,  caption: copy.hookLeft.caption,  accent: 'deep' },
          right: { icon: 'shield-check', title: copy.hookRight.title, caption: copy.hookRight.caption, accent: 'bright' },
          centerSymbol: '≠',
          highlightSide: 'right',
        },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // BULLETS — onion-peel revelation: 1 visible + 7 layers (HERO)
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
          kind: 'onion-peel-revelation',
          heading: copy.bulletsHeading,
          visible: { icon: 'eye', label: copy.bulletsVisible },
          // 5 layers (was 7) per content rework 2026-05: each layer
          // names a Production Engineering concept (Idempotency,
          // Circuit Breakers, Observability, Reversible Migrations,
          // Rate Limiting) that a senior CTO recognizes immediately.
          // Icons mapped semantically:
          layers: [
            { icon: 'repeat',       label: copy.bulletsLayers[0] }, // Idempotência
            { icon: 'shield-alert', label: copy.bulletsLayers[1] }, // Circuit breakers
            { icon: 'activity',     label: copy.bulletsLayers[2] }, // Observabilidade
            { icon: 'shield-check', label: copy.bulletsLayers[3] }, // Migração reversível
            { icon: 'gauge',        label: copy.bulletsLayers[4] }, // Rate limiting
          ],
        },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // STAT — big-stat typographic on light theme
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
          value: copy.statValue,
          caption: copy.statCaption,
          source: copy.statSource,
        },
      ],
    },

    // ───────────────────────────────────────────────────────────────────
    // CTA — closing card (logo auto-suppressed in personal mode)
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
          eyebrow: copy.ctaEyebrow,
          headline: copy.ctaHeadline,
          logoHeight: 140,
          urlText: copy.ctaUrl,
        },
      ],
    },
  ],

  transitions: [], // premium uniform; theme cross-fade handled by LightOverlay
});

export const softwareQuePareceProntoPtSpec = buildSpec('pt', ptCopy);
export const softwareQuePareceProntoEnSpec = buildSpec('en', enCopy);
