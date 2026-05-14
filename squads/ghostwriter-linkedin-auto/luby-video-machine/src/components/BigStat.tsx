/**
 * BigStat (v2)
 *
 * Hero number with count-up. Substantial improvements:
 *   - Count-up uses easings.enter (real ease-out, not linear)
 *   - Number gets a glow halo that intensifies during count
 *   - Caption reveals via mask, not fade
 *   - Source line slides in from below
 *   - Exit: number scales down + fades (gives sense of "transformation")
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { colors, fonts, weights, gradients } from '../design/tokens';
import { easings } from '../design/easings';
import { motion, breathe } from '../design/motion';

interface Props {
  value: string;
  caption: string;
  source?: string;
  startFrame: number;
  exitFrame?: number;
}

const splitValue = (raw: string): { num: number; suffix: string; prefix: string } => {
  const match = raw.match(/^([^\d.,-]*)([\d.,-]+)(.*)$/);
  if (!match) return { num: 0, suffix: raw, prefix: '' };
  const [, prefix, numStr, suffix] = match;
  const num = parseFloat(numStr.replace(/,/g, ''));
  return { num: isNaN(num) ? 0 : num, suffix, prefix };
};

export const BigStat: React.FC<Props> = ({
  value,
  caption,
  source,
  startFrame,
  exitFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { num, suffix, prefix } = splitValue(value);

  // Count-up — uses real ease-out for the right "settling" feel
  const countP = interpolate(
    frame,
    [startFrame, startFrame + motion.enterDramatic + 12],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easings.enter,
    }
  );
  const displayedNum = num * countP;

  // Container scale-in (very subtle — number is already counting which feels active)
  const containerP = interpolate(
    frame,
    [startFrame, startFrame + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter }
  );
  const enterScale = interpolate(containerP, [0, 1], [0.94, 1]);

  // Exit: number scales down + fades (suggests it "becomes" something else)
  const exitP = exitFrame
    ? interpolate(
        frame,
        [exitFrame, exitFrame + motion.exit],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit }
      )
    : 1;
  const exitScale = interpolate(exitP, [0, 1], [0.85, 1]);
  const opacity = Math.min(containerP, exitP);

  // Glow halo intensifies as number counts up
  const glowIntensity = interpolate(countP, [0, 1], [0, 1]);
  const glowBreath = breathe({ frame, fps, speed: 0.5, min: 0.7, max: 1 });

  // Caption mask reveal (lands after number settles)
  const captionStart = startFrame + 24;
  const captionP = interpolate(
    frame,
    [captionStart, captionStart + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter }
  );
  const captionInset = (1 - captionP) * 100;
  const captionY = (1 - captionP) * 12;

  // Source slides up from below
  const sourceStart = startFrame + 40;
  const sourceP = interpolate(
    frame,
    [sourceStart, sourceStart + motion.enter],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enterSoft }
  );
  const sourceY = (1 - sourceP) * 14;

  const formatNumber = (n: number): string => {
    if (Number.isInteger(num)) return Math.round(n).toString();
    return n.toFixed(1);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        opacity,
        transform: `scale(${enterScale * exitScale})`,
        transformOrigin: 'left center',
      }}
    >
      {/* Glow behind the number */}
      <div
        style={{
          position: 'absolute',
          left: -100,
          top: -100,
          width: 700,
          height: 500,
          background: `radial-gradient(ellipse, ${colors.glow40} 0%, transparent 60%)`,
          opacity: glowIntensity * glowBreath * 0.8,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.bold,
          fontSize: 340,
          lineHeight: 0.92,
          letterSpacing: '-0.05em',
          background: gradients.numberShine,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          position: 'relative',
        }}
      >
        {prefix}
        {formatNumber(displayedNum)}
        {suffix}
      </div>

      <div
        style={{
          marginTop: 28,
          fontFamily: fonts.display,
          fontWeight: weights.regular,
          fontSize: 38,
          lineHeight: 1.3,
          color: colors.gray100,
          opacity: captionP,
          clipPath: `inset(${captionInset}% 0 0 0)`,
          WebkitClipPath: `inset(${captionInset}% 0 0 0)`,
          transform: `translateY(${captionY}px)`,
          maxWidth: 1000,
          letterSpacing: '-0.01em',
        }}
      >
        {caption}
      </div>

      {source && (
        <div
          style={{
            marginTop: 20,
            fontFamily: fonts.mono,
            fontSize: 16,
            letterSpacing: '0.08em',
            color: colors.gray400,
            opacity: sourceP * 0.9,
            transform: `translateY(${sourceY}px)`,
            textTransform: 'uppercase',
          }}
        >
          {source}
        </div>
      )}
    </div>
  );
};
