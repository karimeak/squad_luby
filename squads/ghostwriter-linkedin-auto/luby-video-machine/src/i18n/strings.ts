/**
 * i18n strings for the demo video.
 *
 * To add a new video: add a new key here (e.g. `caseStudy`) and a new
 * composition that consumes it. The pattern keeps copy decoupled from layout.
 */

import type { Lang } from '../compositions/types';

export interface BulletsStage {
  /** Short uppercase label shown under the gate (e.g. "Code Review"). */
  title: string;
  /** Full sentence shown as caption beneath the title. */
  caption: string;
}

export interface DemoStrings {
  // Intro
  introTagline: string;
  introMeta: string; // small uppercase eyebrow

  // Hook
  hookEyebrow: string;
  hook: string;
  hookConceptA: string;        // left card title — the "speed" pole
  hookConceptACaption: string; // left card caption
  hookConceptB: string;        // right card title — the "trust" pole
  hookConceptBCaption: string; // right card caption
  hookCenterSymbol: string;    // central tension symbol (typically "vs")

  // Bullets — now rendered as a horizontal pipeline diagram
  bulletsEyebrow: string;
  bulletsTitle: string;
  bulletsStartLabel: string; // pipeline start (e.g. "PR")
  bulletsEndLabel: string;   // pipeline end (e.g. "Deploy")
  bulletsStages: [BulletsStage, BulletsStage, BulletsStage];

  // Stat
  statValue: string;
  statCaption: string;
  statSource: string;

  // CTA — logo + headline only (no URL or button)
  ctaHeadline: string;

  // Frame
  langBadge: string;
}

const pt: DemoStrings = {
  introTagline: 'Desenvolvimento com IA, com segurança',
  introMeta: 'AI-AUGMENTED ENGINEERING',

  hookEyebrow: 'O DILEMA',
  hook: 'Como acelerar com IA sem abrir mão da segurança?',
  hookConceptA: 'Velocidade',
  hookConceptACaption: 'IA acelera o ciclo de entrega',
  hookConceptB: 'Confiança',
  hookConceptBCaption: 'Segurança não é opcional',
  hookCenterSymbol: 'vs',

  bulletsEyebrow: 'TRÊS PILARES',
  bulletsTitle: 'O modo Luby',
  bulletsStartLabel: 'PR',
  bulletsEndLabel: 'Deploy',
  bulletsStages: [
    { title: 'Code Review',  caption: 'Automático em todo PR' },
    { title: 'Vuln Scan',    caption: 'Validação antes do deploy' },
    { title: 'Audit Trail',  caption: 'Compliance desde o dia um' },
  ],

  statValue: '60%',
  statCaption: 'menos vulnerabilidades em produção',
  statSource: 'Média entre clientes Luby — 2025',

  ctaHeadline: 'Construa com IA. Construa com segurança.',

  langBadge: 'PT-BR',
};

const en: DemoStrings = {
  introTagline: 'AI development, secured',
  introMeta: 'AI-AUGMENTED ENGINEERING',

  hookEyebrow: 'THE DILEMMA',
  hook: 'How do you ship AI-fast without compromising security?',
  hookConceptA: 'Speed',
  hookConceptACaption: 'AI compresses delivery cycles',
  hookConceptB: 'Trust',
  hookConceptBCaption: 'Security is non-negotiable',
  hookCenterSymbol: 'vs',

  bulletsEyebrow: 'THREE PILLARS',
  bulletsTitle: 'The Luby way',
  bulletsStartLabel: 'PR',
  bulletsEndLabel: 'Deploy',
  bulletsStages: [
    { title: 'Code Review',  caption: 'Automated on every PR' },
    { title: 'Vuln Scan',    caption: 'Gate before deploy' },
    { title: 'Audit Trail',  caption: 'Compliance from day one' },
  ],

  statValue: '60%',
  statCaption: 'fewer vulnerabilities in production',
  statSource: 'Average across Luby clients — 2025',

  ctaHeadline: 'Build with AI. Build secure.',

  langBadge: 'EN-US',
};

export const strings: Record<Lang, DemoStrings> = { pt, en };
