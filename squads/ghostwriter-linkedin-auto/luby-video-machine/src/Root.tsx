/**
 * Root.tsx
 *
 * Registers compositions for Remotion Studio. Defines four pre-configured
 * variants of the demo so you can preview each from the Studio sidebar:
 *   - DemoVideo                 (default props: pt + corporate)
 *   - DemoVideo-PT              (explicit pt + corporate)
 *   - DemoVideo-EN              (en + corporate)
 *   - DemoVideo-PT-Personal     (pt + personal, with sample speaker)
 *
 * Also installs the @font-face declarations for Aspekta. Drop your
 * Aspekta font files into /public/fonts/ (see /public/fonts/README.md).
 */

import React from 'react';
import { Composition, staticFile } from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

import { DemoVideo } from './compositions/DemoVideo';
import { HookMinimalPreview } from './compositions/HookMinimalPreview';
import { ArchetypesSmokeTest } from './compositions/ArchetypesSmokeTest';
import { SoftwareQuePareceProntoPt } from './compositions/SoftwareQuePareceProntoPt';
import { SoftwareQuePareceProntoEn } from './compositions/SoftwareQuePareceProntoEn';
import { SoftwareQuePareceProntoPersonal } from './compositions/SoftwareQuePareceProntoPersonal';
import { KarimeKumagaiRevopsEn } from './compositions/KarimeKumagaiRevopsEn';
import { RodrigoGardinSubstrateEn } from './compositions/RodrigoGardinSubstrateEn';
import {
  VisualCatalogPremiumDark,
  VisualCatalogMinimalDark,
  VisualCatalogPremiumLight,
} from './compositions/VisualCatalog';
import { VISUAL_CATALOG_TOTAL_FRAMES } from './schema/examples/visual-catalog';
import { VIDEO } from './design/tokens';

// Load Inter as a guaranteed-available fallback.
loadInter();

// Inject @font-face for Aspekta. The Aspekta family ships in fine-grained
// numeric weights (50 → 1000, in 50-unit steps) — there are 19 .otf files
// in /public/fonts/. We don't load all 19; we map the five CSS weights
// the design tokens actually use to the closest available Aspekta weight,
// nudging up where exact matches don't exist (Aspekta has no 700 — we use
// 750 as bold, which is visually equivalent and slightly punchier).
//
// If the .otf files are missing, the browser silently falls back to Inter
// (loaded above), so previews always render.
const ASPEKTA_WEIGHTS: Array<{ cssWeight: number; file: string }> = [
  { cssWeight: 400, file: 'Aspekta-400.otf' },  // regular
  { cssWeight: 500, file: 'Aspekta-500.otf' },  // medium
  { cssWeight: 600, file: 'Aspekta-600.otf' },  // semibold
  { cssWeight: 700, file: 'Aspekta-750.otf' },  // bold (no 700 in family — 750 is the closest punchy match)
  { cssWeight: 900, file: 'Aspekta-900.otf' },  // black — used in display headlines
];

const fontFaceCSS = ASPEKTA_WEIGHTS
  .map(
    ({ cssWeight, file }) => `
  @font-face {
    font-family: 'Aspekta';
    src: url('${staticFile(`fonts/${file}`)}') format('opentype');
    font-weight: ${cssWeight};
    font-style: normal;
    font-display: swap;
  }`,
  )
  .join('\n');

if (typeof document !== 'undefined') {
  const styleId = 'luby-aspekta-fontface';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = fontFaceCSS;
    document.head.appendChild(style);
  }
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={VIDEO.durationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'pt' as const,
          mode: 'corporate' as const,
        }}
      />

      <Composition
        id="DemoVideo-PT"
        component={DemoVideo}
        durationInFrames={VIDEO.durationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'pt' as const,
          mode: 'corporate' as const,
        }}
      />

      <Composition
        id="DemoVideo-EN"
        component={DemoVideo}
        durationInFrames={VIDEO.durationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'en' as const,
          mode: 'corporate' as const,
        }}
      />

      <Composition
        id="DemoVideo-PT-Personal"
        component={DemoVideo}
        durationInFrames={VIDEO.durationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'pt' as const,
          mode: 'personal' as const,
          speaker: {
            name: 'Maria Silva',
            role: 'Senior Software Engineer @ Luby',
          },
        }}
      />

      <Composition
        id="DemoVideo-EN-Personal"
        component={DemoVideo}
        durationInFrames={VIDEO.durationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'en' as const,
          mode: 'personal' as const,
          speaker: {
            name: 'John Doe',
            role: 'Senior Software Engineer @ Luby',
          },
        }}
      />

      {/* ── Isolated visual test for the luby-minimal Hook scene.
          Not a production video — exists to validate the SyncWord +
          SentenceWithSyncsBlock + MinimalOverlay stack before the full
          DemoVideo is refactored to use them. Safe to leave registered
          long-term as a regression fixture. */}
      <Composition
        id="HookMinimalPreview"
        component={HookMinimalPreview}
        durationInFrames={150}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/* ── Smoke-test técnico: validação da Wave 3 (archetype library).
          Não é vídeo de marketing — exercita os 4 arquétipos novos
          em 4 cenas distintas para validar render. Mantido registrado
          como fixture de regressão.
          Run: agents/runs/2026-05-13-archetypes-smoke-test/. */}
      <Composition
        id="archetypes-smoke-test-pt"
        component={ArchetypesSmokeTest}
        durationInFrames={VIDEO.durationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'pt' as const,
          mode: 'corporate' as const,
        }}
      />

      {/* ── Production video: "Software que parece pronto mas não está".
          First video produced under the 3-variants rule (PT/EN/Personal).
          Run: agents/runs/2026-05-12-software-que-parece-pronto/. */}
      <Composition
        id="software-que-parece-pronto-pt"
        component={SoftwareQuePareceProntoPt}
        durationInFrames={VIDEO.durationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'pt' as const,
          mode: 'corporate' as const,
        }}
      />
      <Composition
        id="software-que-parece-pronto-en"
        component={SoftwareQuePareceProntoEn}
        durationInFrames={VIDEO.durationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'en' as const,
          mode: 'corporate' as const,
        }}
      />
      <Composition
        id="software-que-parece-pronto-personal"
        component={SoftwareQuePareceProntoPersonal}
        durationInFrames={VIDEO.durationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'pt' as const,
          mode: 'personal' as const,
        }}
      />

      {/* ── Production video: Karime Kumagai — RevOps & Data Architecture (EN-Personal).
          Generated by squad ghostwriter-linkedin-auto v1.6.0 (Cleidim, step-05d).
          Run: agents/runs/2026-05-13-karime-kumagai-en-us/. */}
      <Composition
        id="karime-kumagai-revops-en"
        component={KarimeKumagaiRevopsEn}
        durationInFrames={VIDEO.durationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'en' as const,
          mode: 'personal' as const,
          speaker: {
            name: 'Karime Kumagai',
            role: 'RevOps & Growth Strategist @ Luby',
          },
        }}
      />

      {/* ── Production video: Rodrigo Gardin — Agent architecture / substrate (EN-Personal).
          Generated by squad ghostwriter-linkedin-auto v1.6.0 (Cleidim, step-05d).
          Run: agents/runs/2026-05-13-rodrigo-gardin-en-us/. */}
      <Composition
        id="rodrigo-gardin-substrate-en"
        component={RodrigoGardinSubstrateEn}
        durationInFrames={VIDEO.durationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'en' as const,
          mode: 'personal' as const,
          speaker: {
            name: 'Rodrigo Gardin',
            role: 'Técnico / CTO @ Luby',
          },
        }}
      />

      {/* ── Visual catalog (internal, not marketing).
          Three variants showcasing every archetype/block the machine
          can render today. Each scene numbered 01..21 via eyebrow at
          top for precise feedback ("ajustar o 14").
          Run: agents/runs/2026-05-12-visual-catalog/. */}
      <Composition
        id="visual-catalog-premium-dark"
        component={VisualCatalogPremiumDark}
        durationInFrames={VISUAL_CATALOG_TOTAL_FRAMES}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'pt' as const,
          mode: 'corporate' as const,
        }}
      />
      <Composition
        id="visual-catalog-minimal-dark"
        component={VisualCatalogMinimalDark}
        durationInFrames={VISUAL_CATALOG_TOTAL_FRAMES}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'pt' as const,
          mode: 'corporate' as const,
        }}
      />
      <Composition
        id="visual-catalog-premium-light"
        component={VisualCatalogPremiumLight}
        durationInFrames={VISUAL_CATALOG_TOTAL_FRAMES}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          lang: 'pt' as const,
          mode: 'corporate' as const,
        }}
      />
    </>
  );
};
