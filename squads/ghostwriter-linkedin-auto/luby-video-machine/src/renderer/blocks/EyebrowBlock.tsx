/**
 * EyebrowBlock — renders a `kind: 'eyebrow'` block.
 *
 * Two visual styles are supported via the schema:
 *
 *   'mono'  — code-style tracked uppercase. Mono font, brand blue, soft
 *             text-shadow glow. Used in IntroScene and CTAScene as the
 *             pre-headline brand "voice" line (e.g. "AI-AUGMENTED
 *             ENGINEERING", "POWERED BY AI").
 *
 *   'pill'  — bordered pill with breathing blue dot. Defers to the
 *             existing <Pill> primitive. Used inside dense scenes as a
 *             scoped section label (e.g. "THE DILEMMA", "THREE PILLARS").
 *
 * Default style is 'mono' — that's the brand voice eyebrow.
 *
 * Motion: 'mono' uses MaskReveal up from below with a small subtle
 * letter-spacing animation that settles after entrance. 'pill' uses its
 * own entrance choreography (mask wipe from left, dot pop).
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { MaskReveal } from '../../components/MaskReveal';
import { Pill } from '../../components/Pill';
import { colors, fonts, weights } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion } from '../../design/motion';
import { useCurrentMode } from '../ModeContext';
import type { EyebrowBlock as EyebrowBlockSpec } from '../../schema/types';

interface Props {
  block: EyebrowBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

export const EyebrowBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const style = block.style ?? 'mono';

  if (style === 'pill') {
    // The Pill primitive is already mode-aware (theme prop accepts dark/light).
    // We don't need to thread the visual mode (premium/minimal) here because
    // Pill's surface tokens look fine in both — the "minimal-ness" of a Pill
    // is identical to its premium look modulo backdrop-blur, which Pill
    // already toggles internally based on theme.
    return <Pill text={block.text} startFrame={startFrame} exitFrame={exitFrame} />;
  }

  return <MonoEyebrow text={block.text} startFrame={startFrame} exitFrame={exitFrame} />;
};

// ─── 'mono' style implementation ───────────────────────────────────────────

interface MonoProps {
  text: string;
  startFrame: number;
  exitFrame?: number;
}

const MonoEyebrow: React.FC<MonoProps> = ({ text, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const mode = useCurrentMode();

  // Letter-spacing animation: starts loose (0.5em), settles tight (0.34em).
  // Premium only — minimal mode wants snap-in, not settle.
  const settleP = interpolate(
    frame,
    [startFrame, startFrame + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );

  const trackingEm = mode === 'luby-premium'
    ? interpolate(settleP, [0, 1], [0.5, 0.34])
    : 0.34;

  return (
    <MaskReveal enterAt={startFrame} exitAt={exitFrame} direction="up" translate={8}>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 20,
          fontWeight: weights.regular,
          letterSpacing: `${trackingEm}em`,
          color: mode === 'luby-premium' ? colors.blue : colors.blueBright,
          textTransform: 'uppercase',
          // Soft glow in premium — suppressed entirely in minimal so the
          // eyebrow reads as a flat label, consistent with the rest of
          // the minimal vocabulary.
          textShadow: mode === 'luby-premium' ? `0 0 24px ${colors.glow60}` : undefined,
        }}
      >
        {text}
      </div>
    </MaskReveal>
  );
};
