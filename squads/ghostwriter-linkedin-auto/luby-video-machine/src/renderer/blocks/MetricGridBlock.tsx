/**
 * MetricGridBlock — renders a `kind: 'metric-grid'` block.
 *
 * 3-6 KPI cards arranged in a grid:
 *
 *   ┌─────────┐ ┌─────────┐ ┌─────────┐
 *   │  60%    │ │  3-5×   │ │  220+   │
 *   │ less    │ │ faster  │ │ engineers│
 *   │ vulns   │ │ delivery│ │  (team) │
 *   └─────────┘ └─────────┘ └─────────┘
 *
 * For: results dashboards, capability metrics, "the numbers" beat.
 *
 * Layout: auto-grid based on count
 *   2 → 2 cols × 1 row
 *   3 → 3 cols × 1 row
 *   4 → 2 cols × 2 rows
 *   5-6 → 3 cols × 2 rows
 *
 * Cards stagger in left-to-right, top-to-bottom (reading order).
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion, stagger } from '../../design/motion';
import { resolveIcon } from '../../schema/iconMap';
import { Icon } from '../../components/Icon';
import { MaskReveal } from '../../components/MaskReveal';
import { useThemeTokens } from '../ThemeContext';
import type { MetricGridBlock as MetricGridBlockSpec } from '../../schema/types';

interface Props {
  block: MetricGridBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

const HEADING_OFFSET = 0;
const FIRST_CARD_OFFSET = 12;
const STAGGER_GAP = 6;

export const MetricGridBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const metrics = block.metrics.slice(0, 6); // cap at 6
  if (metrics.length === 0) return null;

  // Layout decision based on count
  const cols = metrics.length === 2 ? 2
             : metrics.length === 3 ? 3
             : metrics.length === 4 ? 2
             : 3;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: gap.group,
      }}
    >
      {block.heading && (
        <Heading text={block.heading} startFrame={startFrame + HEADING_OFFSET} exitFrame={exitFrame} />
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(280px, 320px))`,
          gap: gap.elements,
          justifyContent: 'center',
        }}
      >
        {metrics.map((metric, i) => {
          const cardStart = stagger({
            index: i,
            base: startFrame + FIRST_CARD_OFFSET,
            gap: STAGGER_GAP,
            total: metrics.length,
            easingFn: easings.enter,
          });
          return (
            <MetricCard
              key={i}
              value={metric.value}
              label={metric.label}
              sublabel={metric.sublabel}
              iconKey={metric.icon}
              accent={metric.accent ?? 'primary'}
              startFrame={cardStart}
              exitFrame={exitFrame}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─── Single metric card ───────────────────────────────────────────────────

interface MetricCardProps {
  value: string;
  label: string;
  sublabel?: string;
  iconKey?: import('../../schema/iconMap').IconKey;
  accent: 'primary' | 'bright' | 'deep';
  startFrame: number;
  exitFrame?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  value, label, sublabel, iconKey, accent, startFrame, exitFrame,
}) => {
  const frame = useCurrentFrame();
  const theme = useThemeTokens();

  const enterP = interpolate(
    frame,
    [startFrame, startFrame + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;

  const opacity = Math.min(enterP, exitP);
  const enterY = (1 - enterP) * 16;
  const enterScale = interpolate(enterP, [0, 1], [0.92, 1]);
  const exitScale = interpolate(exitP, [0, 1], [0.95, 1]);
  const inset = (1 - enterP) * 100;

  // Number reveals after the card lands
  const numberStart = startFrame + 4;
  const numberP = interpolate(
    frame,
    [numberStart, numberStart + motion.enter],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.emphasis },
  );

  const labelStart = startFrame + 12;
  const labelP = interpolate(
    frame,
    [labelStart, labelStart + motion.enter],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );

  // Light theme uses deeper blue tones for legibility on off-white.
  // 'bright' maps to brand `blue` instead of `blueBright` (which is
  // too pale to read on light). 'primary' maps to `blueDeep`.
  const accentColor = theme.name === 'light'
    ? (accent === 'bright' ? colors.blue
        : accent === 'deep' ? colors.navyDeep
        : colors.blueDeep)
    : (accent === 'bright' ? colors.blueBright
        : accent === 'deep' ? colors.blueDeep
        : colors.blue);

  const IconComponent = iconKey ? resolveIcon(iconKey) : undefined;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '32px 28px',
        borderRadius: 22,
        background: theme.name === 'light'
          ? `linear-gradient(160deg, ${theme.surface}, ${theme.surfaceStrong})`
          : `linear-gradient(160deg, ${colors.whiteA10}, ${colors.whiteA05})`,
        border: `1px solid ${theme.border}`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: theme.name === 'light'
          ? `0 24px 40px rgba(15, 35, 65, 0.08), 0 0 24px ${colors.glow10}`
          : `
              0 0 0 1px ${colors.whiteA10} inset,
              0 24px 60px ${colors.blackA40},
              0 0 60px ${colors.glow20}
            `,
        opacity,
        transform: `translateY(${enterY}px) scale(${enterScale * exitScale})`,
        transformOrigin: 'center',
        clipPath: `inset(${inset}% 0 0 0)`,
        WebkitClipPath: `inset(${inset}% 0 0 0)`,
        position: 'relative',
        minHeight: 220,
        justifyContent: 'center',
      }}
    >
      {IconComponent && (
        <Icon
          Component={IconComponent}
          size={36}
          color={accentColor}
          startFrame={startFrame + 2}
          exitFrame={exitFrame}
          preset="pop"
          idleBreathe={false}
        />
      )}

      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.bold,
          fontSize: 88,
          color: accentColor,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          textAlign: 'center',
          opacity: numberP,
          textShadow: `0 0 32px ${colors.glow40}`,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>

      {/* Simplified hierarchy 2026-05: only 2 type tiers, not 3.
          Value (huge bold accent) + a single supporting text tier
          combining label and sublabel. Avoids the visually fragmented
          "big number + medium label + tiny sublabel" stack. */}
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.medium,
          fontSize: 22,
          color: theme.fg,
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
          textAlign: 'center',
          opacity: labelP,
          marginTop: 4,
        }}
      >
        {label}
      </div>

      {sublabel && (
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.regular,
            fontSize: 16,
            color: theme.fgMuted,
            letterSpacing: '0.005em',
            lineHeight: 1.3,
            textAlign: 'center',
            opacity: labelP * 0.85,
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};

// ─── Heading above the grid ──────────────────────────────────────────────

const Heading: React.FC<{ text: string; startFrame: number; exitFrame?: number }> = ({
  text, startFrame, exitFrame,
}) => {
  const theme = useThemeTokens();
  return (
    <MaskReveal enterAt={startFrame} exitAt={exitFrame} direction="up" translate={16}>
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.semibold,
          fontSize: 56,
          color: theme.fg,
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
          textAlign: 'center',
          maxWidth: 1500,
          textShadow: theme.name === 'light' ? 'none' : `0 0 40px ${colors.glow30}`,
        }}
      >
        {text}
      </div>
    </MaskReveal>
  );
};
