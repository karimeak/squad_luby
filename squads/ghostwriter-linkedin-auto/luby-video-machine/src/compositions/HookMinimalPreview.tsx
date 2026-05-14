/**
 * HookMinimalPreview — isolated visual test for the luby-minimal Hook.
 *
 * This composition is NOT a production video. It exists ONLY to validate
 * the SyncWord + SentenceWithSyncsBlock + MinimalOverlay + MinimalScene
 * stack visually, in isolation, before the full DemoVideo is refactored
 * to use them.
 *
 * What's mounted:
 *   - <BackgroundAtmosphere> base (so any minimal-overlay opacity issue
 *     is visible against the rich premium background, not a void)
 *   - <ModeProvider> with a schedule that says "luby-minimal for the
 *     whole composition" so all primitives auto-detect minimal
 *   - <MinimalOverlay> which paints surface0 over the atmosphere
 *   - <MinimalScene> renderer with the Hook scene from luby-demo.ts —
 *     so the test pulls from the same schema entry the real video will
 *
 * Duration is short (~150 frames / 5s) — enough to see the sentence
 * assemble word by word and rest.
 *
 * Once approved, this composition can stay around as a regression test
 * fixture (any future change to SyncWord etc. is easy to eyeball here).
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BackgroundAtmosphere } from '../components/BackgroundAtmosphere';
import { MinimalOverlay } from '../components/MinimalOverlay';
import { MinimalScene } from '../renderer/MinimalScene';
import { ModeProvider } from '../renderer/ModeContext';
import { lubyDemoSpec } from '../schema/examples/luby-demo';
import type { SceneSpec } from '../schema/types';

// The whole preview lives in luby-minimal mode. Hardcoded schedule —
// VideoRenderer (Etapa 5) is who derives this from the full video spec.
const PREVIEW_SCHEDULE = [
  { mode: 'luby-minimal' as const, from: 0, to: 9999 },
];

export const HookMinimalPreview: React.FC = () => {
  // Pull the Hook scene from the canonical demo schema. If the schema
  // changes, the preview adapts automatically.
  const hookScene = lubyDemoSpec.scenes.find((s) => s.id === 'hook');

  if (!hookScene) {
    return <ErrorCard message="Hook scene not found in lubyDemoSpec" />;
  }

  // We're previewing in isolation, so the scene's `enter.at` (=60) and
  // applyBreath (=true) would push the content 72 frames into the
  // composition. For preview, shift the scene to start at frame 0 and
  // disable breath so the action begins immediately.
  const previewScene: SceneSpec = {
    ...hookScene,
    enter: { at: 0, duration: hookScene.enter.duration },
    exit: undefined, // hold to the end of the preview window
    applyBreath: false,
  };

  return (
    <ModeProvider schedule={PREVIEW_SCHEDULE}>
      <AbsoluteFill>
        {/* Atmosphere stays mounted so we can see what gets covered.
            In production, the same composition layers exist; here it's
            purely diagnostic — the MinimalOverlay should cover it 100%. */}
        <BackgroundAtmosphere intensity={1} hero />

        {/* The minimal overlay paints surface0 over the atmosphere.
            In a real video it fades in/out at boundaries; here it's
            fully opaque the whole time. */}
        <MinimalOverlay />

        {/* The scene under test */}
        <MinimalScene scene={previewScene} />
      </AbsoluteFill>
    </ModeProvider>
  );
};

const ErrorCard: React.FC<{ message: string }> = ({ message }) => (
  <AbsoluteFill
    style={{
      background: '#020610',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      fontSize: 24,
    }}
  >
    PREVIEW ERROR: {message}
  </AbsoluteFill>
);
