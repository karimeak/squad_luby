/**
 * GlowOrb
 *
 * A soft radial light orb. Used heavily for atmosphere and
 * to anchor visual focus. Supports independent breathing,
 * positioning, and intensity.
 *
 * Multiple GlowOrbs can be layered to create complex lighting.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../design/tokens';
import { breathe } from '../design/motion';

interface Props {
  x: number | string;
  y: number | string;
  size: number;
  color?: string;
  intensity?: number;        // 0..1
  blur?: number;
  breatheSpeed?: number;     // cycles per second (default 0.25)
  breatheRange?: [number, number]; // min/max multiplier on intensity
  phase?: number;            // phase offset for stacking multiple orbs
}

export const GlowOrb: React.FC<Props> = ({
  x,
  y,
  size,
  color = colors.glow40,
  intensity = 1,
  blur = 0,
  breatheSpeed = 0.25,
  breatheRange = [0.7, 1.0],
  phase = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const breath = breathe({
    frame,
    fps,
    speed: breatheSpeed,
    min: breatheRange[0],
    max: breatheRange[1],
    phase,
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        opacity: intensity * breath,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
    />
  );
};
