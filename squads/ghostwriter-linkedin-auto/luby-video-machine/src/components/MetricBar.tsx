/**
 * MetricBar
 *
 * Horizontal bar chart row that animates to its target value with a
 * synchronized number readout. Designed for moments where a stat needs
 * to feel measured and credible (a number alone reads as a flex; the
 * bar growing alongside it reads as data).
 *
 *   Label                                 Value
 *   ━━━━━━━━━━━━━━━━━━━━━●─────────────  (glow head at the playhead)
 *
 * Animations:
 *   - Track fades in over the first frames (bar at width 0)
 *   - Bar grows 0 → value/max with easings.enter (real ease-out settle)
 *   - Number counts up in sync (same easing → number and bar feel locked)
 *   - Glow head at the bar tip pulses while the bar is stationary
 *   - Exit: track + bar fade together
 *
 * The component renders as a block — wrap in a flex column to stack rows.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { colors, fonts, weights, gradients } from '../design/tokens';
import { easings } from '../design/easings';
import { motion, breathe } from '../design/motion';

interface Props {
  label: string;
  /** Target numeric value the bar fills to. */
  value: number;
  /** Scale max — bar fills to value/max. */
  max: number;
  /** Optional unit suffix appended to the readout (e.g. "%", " ms"). */
  unit?: string;
  color?: string;
  startFrame: number;
  exitFrame?: number;
  /** Render the bar wider/thinner. Default 8px. */
  thickness?: number;
  /** Width override; otherwise stretches to container. */
  width?: number | string;
  /** Decimal places for the readout (defaults: integer if value is integer). */
  decimals?: number;
}

export const MetricBar: React.FC<Props> = ({
  label,
  value,
  max,
  unit = '',
  color = colors.blue,
  startFrame,
  exitFrame,
  thickness = 8,
  width = '100%',
  decimals,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Track + bar enter together; the bar just fills inside the track.
  // Container scope = readout + label opacity.
  const containerP = interpolate(
    frame,
    [startFrame, startFrame + motion.enter],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );

  // Bar fill happens slightly later, with a longer ease-out — that's the
  // "settling into the data" feel.
  const fillStart = startFrame + 6;
  const fillP = interpolate(
    frame,
    [fillStart, fillStart + motion.enterDramatic],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );

  const exitP = exitFrame !== undefined
    ? interpolate(
        frame,
        [exitFrame, exitFrame + motion.exit],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit },
      )
    : 1;

  const opacity = Math.min(containerP, exitP);

  const ratio = Math.max(0, Math.min(1, value / Math.max(0.0001, max)));
  const fillRatio = ratio * fillP; // 0 → ratio, eased
  const displayedValue = value * fillP;

  const glowBreath = breathe({ frame, fps, speed: 0.45, min: 0.6, max: 1.0 });

  // Number formatting
  const isIntegerValue = decimals === undefined ? Number.isInteger(value) : decimals === 0;
  const formatted = isIntegerValue
    ? Math.round(displayedValue).toString()
    : displayedValue.toFixed(decimals ?? 1);

  return (
    <div style={{ width, opacity, fontFamily: fonts.display }}>
      {/* Top row: label + readout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontWeight: weights.regular,
            fontSize: 18,
            letterSpacing: '0.02em',
            color: colors.gray100,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontWeight: weights.semibold,
            fontSize: 28,
            letterSpacing: '-0.01em',
            color: colors.white,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatted}
          {unit}
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: thickness,
          background: colors.whiteA10,
          borderRadius: thickness,
          overflow: 'visible',
        }}
      >
        {/* Filled portion */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${fillRatio * 100}%`,
            background: color === colors.blue ? gradients.progressBar : color,
            borderRadius: thickness,
            boxShadow: `0 0 ${thickness * 2}px ${colors.glow60}`,
          }}
        >
          {/* Glow head at the tip — only visible once the bar has any width */}
          {fillRatio > 0.01 && (
            <div
              style={{
                position: 'absolute',
                right: -thickness * 0.6,
                top: '50%',
                transform: 'translateY(-50%)',
                width: thickness * 1.6,
                height: thickness * 1.6,
                borderRadius: '50%',
                background: colors.blueBright,
                opacity: glowBreath,
                boxShadow: `
                  0 0 ${thickness}px ${colors.blueBright},
                  0 0 ${thickness * 3}px ${colors.glow80},
                  0 0 ${thickness * 6}px ${colors.glow30}
                `,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
