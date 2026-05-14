/**
 * BulletList (v2)
 *
 * Vertical stack of bullets revealed with eased stagger.
 * Each bullet has its own dot that pops in with overshoot,
 * then breathes subtly while idle.
 *
 * Improvements:
 *   - Eased stagger (not linear)
 *   - Mask reveal per bullet (text wipes in from left)
 *   - Dot pops in with `emphasis` curve (overshoot)
 *   - Exit: bullets slide right and fade in unison
 *   - Optional active-state highlighting
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { colors, fonts, weights, space } from '../design/tokens';
import { easings } from '../design/easings';
import { motion, stagger, breathe } from '../design/motion';

interface Props {
  items: string[];
  startFrame: number;
  exitFrame?: number;
  itemGap?: number;
  fontSize?: number;
}

export const BulletList: React.FC<Props> = ({
  items,
  startFrame,
  exitFrame,
  itemGap = 16,
  fontSize = 44,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
      {items.map((item, i) => {
        const itemStart = stagger({
          index: i,
          base: startFrame,
          gap: itemGap,
          total: items.length,
          easingFn: easings.enterSoft,
        });

        // Text mask reveal
        const textP = interpolate(
          frame,
          [itemStart, itemStart + motion.enterSlow],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter }
        );

        // Dot pops in slightly before the text, with overshoot
        const dotP = interpolate(
          frame,
          [itemStart - 4, itemStart + motion.enter],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.emphasis }
        );

        // Exit
        const exitP = exitFrame
          ? interpolate(
              frame,
              [exitFrame + i * 2, exitFrame + i * 2 + motion.exit],
              [1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit }
            )
          : 1;

        const visible = Math.min(textP, exitP);
        const x = (1 - textP) * -24 + (1 - exitP) * 32;

        // Idle breathing on the dot (very subtle)
        const dotBreath = breathe({
          frame,
          fps,
          speed: 0.4,
          min: 0.85,
          max: 1.0,
          phase: i * 0.7,
        });

        // Text mask wipe from left
        const inset = (1 - textP) * 100;
        const clipPath = `inset(0 ${inset}% 0 0)`;

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: space.md,
              opacity: exitP,
              transform: `translateX(${x}px)`,
            }}
          >
            <div
              style={{
                marginTop: fontSize * 0.42,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: colors.blue,
                transform: `scale(${dotP * dotBreath})`,
                boxShadow: `
                  0 0 24px ${colors.glow80},
                  0 0 48px ${colors.glow30}
                `,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: fonts.display,
                fontWeight: weights.medium,
                fontSize,
                lineHeight: 1.25,
                letterSpacing: '-0.015em',
                color: colors.white,
                opacity: visible,
                clipPath,
                WebkitClipPath: clipPath,
              }}
            >
              {item}
            </span>
          </div>
        );
      })}
    </div>
  );
};
