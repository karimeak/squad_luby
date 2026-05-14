/**
 * Pill (v2)
 *
 * Eyebrow label with the recurring blue-dot motif.
 * Improvements:
 *   - Mask reveal entrance (wipes from left)
 *   - Breathing dot with glow
 *   - Lifecycle support (enter + exit)
 *   - Letter spacing animation on entrance
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { colors, fonts, weights, radius } from '../design/tokens';
import { easings } from '../design/easings';
import { motion, breathe } from '../design/motion';

interface Props {
  text: string;
  startFrame: number;
  exitFrame?: number;
  size?: 'sm' | 'md';
  /**
   * Visual theme. Controls the surface, border and text colour so the pill
   * stays legible on either dark or light backgrounds. Defaults to 'dark'.
   */
  theme?: 'dark' | 'light';
}

export const Pill: React.FC<Props> = ({
  text,
  startFrame,
  exitFrame,
  size = 'md',
  theme = 'dark',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterP = interpolate(
    frame,
    [startFrame, startFrame + motion.enter],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter }
  );

  const exitP = exitFrame
    ? interpolate(
        frame,
        [exitFrame, exitFrame + motion.exitFast],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit }
      )
    : 1;

  const opacity = Math.min(enterP, exitP);
  const x = (1 - enterP) * -16 + (1 - exitP) * -8;

  // Letter spacing relaxes from tight (0.30em) to final (0.18em) on entrance
  const letterSpacing = interpolate(enterP, [0, 1], [0.32, 0.18]);

  // Dot breathing
  const dotBreath = breathe({ frame, fps, speed: 0.8, min: 0.7, max: 1.0 });

  const fontSize = size === 'sm' ? 18 : 22;
  const padY = size === 'sm' ? 6 : 10;
  const padX = size === 'sm' ? 14 : 18;
  const dotSize = size === 'sm' ? 7 : 9;

  // Mask wipe from left
  const inset = (1 - enterP) * 100;
  const clipPath = `inset(0 ${inset}% 0 0)`;

  // Theme-aware surface tokens
  const surfaceBg     = theme === 'light' ? 'rgba(15, 35, 65, 0.06)' : colors.whiteA10;
  const surfaceBorder = theme === 'light' ? 'rgba(15, 35, 65, 0.18)' : colors.whiteA20;
  const textColor     = theme === 'light' ? '#3A4A66' : colors.gray100;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: `${padY}px ${padX}px ${padY}px ${padX - 2}px`,
        borderRadius: radius.pill,
        background: surfaceBg,
        border: `1px solid ${surfaceBorder}`,
        backdropFilter: 'blur(10px)',
        opacity,
        transform: `translateX(${x}px)`,
        clipPath,
        WebkitClipPath: clipPath,
      }}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: colors.blue,
          opacity: dotBreath,
          boxShadow: `
            0 0 ${dotSize * 2}px ${colors.glow80},
            0 0 ${dotSize * 4}px ${colors.glow40}
          `,
        }}
      />
      <span
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.medium,
          fontSize,
          letterSpacing: `${letterSpacing}em`,
          color: textColor,
          textTransform: 'uppercase',
        }}
      >
        {text}
      </span>
    </div>
  );
};
