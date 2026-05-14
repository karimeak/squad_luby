/**
 * TransitionFlash
 *
 * A brief, dramatic white flash that fires AT a specific frame. Used as
 * the "punctuation" between visual mode changes (premium ↔ minimal). The
 * flash is short enough not to fatigue (~0.13s at 30fps) but punchy
 * enough that the eye registers a "scene cut" rather than a fade.
 *
 * Timing curve (default 4-frame duration):
 *
 *   frame: atFrame   atFrame+1   atFrame+2   atFrame+3
 *   alpha:   0.0       1.0         0.6         0.0
 *
 * That's: snap up to full in 1f, hold high through f+1, fall fast.
 * The asymmetry (slow tail) is intentional — a perfectly symmetric
 * spike reads as a glitch; a sharp attack + softer release reads as
 * cinematic.
 *
 * The flash is a single absolutely-positioned div on top of all scene
 * content (z-stacked above mode overlays). It does NOT modify scene
 * timing — both the outgoing and incoming scenes continue their own
 * exit/enter underneath it. The flash just hides 2-3 frames of the
 * transition, which is enough to make the eye accept the mode swap.
 *
 * USAGE
 *
 *   <TransitionFlash atFrame={252} />              // default white 4f
 *   <TransitionFlash atFrame={252} durationFrames={6} />  // longer flash
 *   <TransitionFlash atFrame={252} color="black" />       // unusual: black flash
 *
 * Outside its 4-frame window, the component renders nothing.
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

interface Props {
  /** Frame on which the flash peaks (atFrame is fully white). */
  atFrame: number;
  /** Total duration of the flash window. Default 4. */
  durationFrames?: number;
  /** Flash colour. Default 'white'. */
  color?: 'white' | 'black';
}

export const TransitionFlash: React.FC<Props> = ({
  atFrame,
  durationFrames = 4,
  color = 'white',
}) => {
  const frame = useCurrentFrame();

  // Outside the flash window — render nothing
  const relative = frame - atFrame;
  if (relative < 0 || relative >= durationFrames) return null;

  // Custom envelope, hand-tuned to feel like a film cut:
  //   t=0  → 1.0  (full snap-on)
  //   t=1  → 1.0  (hold)
  //   t=2  → 0.6  (sharp fall)
  //   t=3+ → 0.0  (gone)
  // For durations other than 4, scale the curve proportionally.
  const envelope = [1.0, 1.0, 0.6, 0.0];
  const segment = relative / (durationFrames - 1); // 0..1 across the window
  // Map the segment into the 4-point envelope. Linear interpolation between
  // adjacent envelope points so longer durations still get the right shape.
  const idx = segment * (envelope.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, envelope.length - 1);
  const t = idx - lo;
  const alpha = envelope[lo] * (1 - t) + envelope[hi] * t;

  return (
    <AbsoluteFill
      aria-hidden
      style={{
        background: color === 'white' ? '#FFFFFF' : '#000000',
        opacity: alpha,
        pointerEvents: 'none',
        // Render the flash ABOVE everything else by default. The renderer
        // mounts <TransitionFlash> after scenes/overlays so DOM order
        // already handles z-stacking; this is belt + suspenders.
        zIndex: 999,
      }}
    />
  );
};
