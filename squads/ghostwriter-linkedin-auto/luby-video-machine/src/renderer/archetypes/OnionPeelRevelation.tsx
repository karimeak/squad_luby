/**
 * OnionPeelRevelation — archetype "camadas-de-cebola".
 *
 *   ┌──────────────────────────────────┐
 *   │   heading                        │
 *   │                                  │
 *   │      [icon] VISIBLE              │  ← single visible item, top
 *   │      ─────────────               │  ← divider
 *   │      [icon] Layer 1              │
 *   │      ─────────────               │
 *   │      [icon] Layer 2              │
 *   │      ─────────────               │  ← layers reveal sequentially,
 *   │      [icon] Layer 3              │     each in slightly darker tone
 *   │      ─────────────               │     suggesting "deeper"
 *   │      ...                         │
 *   └──────────────────────────────────┘
 *
 * Wave 5 (2026-05). Materializes the catalog metaphor `camadas-de-cebola`:
 * one visible thing on top, and a stack of layers BELOW that the viewer
 * normally doesn't see. Layers reveal one at a time with mask-up, each
 * with a thin divider above. Background tint on each layer gets
 * progressively deeper to suggest descent.
 *
 * Distinct from iceberg: iceberg argues PROPORTION (small visible /
 * large submerged). Onion-peel argues COUNT (you saw 1, there are N).
 *
 * Mode/theme-aware throughout.
 *
 * CHOREOGRAPHY:
 *   t=0    heading mask-reveals
 *   t=10   visible item pops in
 *   t=20+  layers stagger top→bottom (each reveals via mask + tiny scale)
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Icon } from '../../components/Icon';
import { MaskReveal } from '../../components/MaskReveal';
import { resolveIcon } from '../../schema/iconMap';
import { colors, fonts, weights, gap, radius } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion } from '../../design/motion';
import { useThemeTokens } from '../ThemeContext';
import type { OnionPeelRevelationBlock } from '../../schema/types';

interface Props {
  block: OnionPeelRevelationBlock;
  startFrame: number;
  exitFrame?: number;
}

const T_HEADING       = 0;
const T_VISIBLE       = 10;
const T_FIRST_LAYER   = 20;
const LAYER_STAGGER   = 6;

const ROW_WIDTH       = 880;
const VISIBLE_HEIGHT  = 80;
const LAYER_HEIGHT    = 64;
const LAYER_GAP       = 8;
const VISIBLE_BELOW_GAP = 24; // larger gap between visible and first layer

export const OnionPeelRevelation: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const theme = useThemeTokens();
  const layers = block.layers.slice(0, 7); // cap at 7 for layout sanity

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
        <MaskReveal
          enterAt={startFrame + T_HEADING}
          exitAt={exitFrame}
          direction="up"
          translate={16}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: weights.semibold,
              fontSize: 48,
              color: theme.fg,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              textAlign: 'center',
              textShadow: theme.name === 'light' ? 'none' : `0 0 40px ${colors.glow30}`,
            }}
          >
            {block.heading}
          </div>
        </MaskReveal>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: ROW_WIDTH,
        }}
      >
        {/* Visible item — proud at top, larger */}
        <VisibleRow
          iconKey={block.visible.icon}
          label={block.visible.label}
          startFrame={startFrame + T_VISIBLE}
          exitFrame={exitFrame}
          theme={theme}
        />

        {/* Spacer between visible and layers */}
        <div style={{ height: VISIBLE_BELOW_GAP }} />

        {/* Layers — each progressively deeper */}
        {layers.map((layer, i) => (
          <LayerRow
            key={i}
            iconKey={layer.icon}
            label={layer.label}
            depthIndex={i}
            totalDepth={layers.length}
            startFrame={startFrame + T_FIRST_LAYER + i * LAYER_STAGGER}
            exitFrame={exitFrame}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Visible row (the proud surface item) ──────────────────────────────

const VisibleRow: React.FC<{
  iconKey: import('../../schema/iconMap').IconKey;
  label: string;
  startFrame: number;
  exitFrame?: number;
  theme: ReturnType<typeof useThemeTokens>;
}> = ({ iconKey, label, startFrame, exitFrame, theme }) => {
  const frame = useCurrentFrame();
  const isLight = theme.name === 'light';
  const IconComponent = resolveIcon(iconKey);
  if (!IconComponent) return null;

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
  const enterY = (1 - enterP) * 12;
  const enterScale = interpolate(enterP, [0, 1], [0.96, 1]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: gap.elements,
        width: ROW_WIDTH,
        height: VISIBLE_HEIGHT,
        padding: '0 28px',
        borderRadius: radius.md,
        // Visible item gets the brighter accent fill — it's the part the
        // client sees, presented brightly.
        background: isLight
          ? `linear-gradient(135deg, rgba(65, 160, 220, 0.18), rgba(65, 160, 220, 0.10))`
          : `linear-gradient(135deg, rgba(95, 182, 232, 0.20), rgba(65, 160, 220, 0.12))`,
        border: `1px solid ${isLight ? 'rgba(65, 160, 220, 0.40)' : 'rgba(95, 182, 232, 0.40)'}`,
        boxShadow: isLight
          ? `0 8px 24px rgba(15, 35, 65, 0.06)`
          : `0 12px 32px ${colors.blackA40}, 0 0 32px ${colors.glow30}`,
        opacity,
        transform: `translateY(${enterY}px) scale(${enterScale})`,
      }}
    >
      <Icon
        Component={IconComponent}
        size={48}
        color={isLight ? colors.blueDeep : colors.blueBright}
        startFrame={startFrame}
        exitFrame={exitFrame}
        preset="pop"
      />
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.semibold,
          fontSize: 28,
          color: theme.fg,
          letterSpacing: '-0.015em',
          lineHeight: 1.15,
          flex: 1,
        }}
      >
        {label}
      </div>
      {/* Tag indicating "this is the visible part" */}
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 12,
          fontWeight: weights.bold,
          letterSpacing: '0.18em',
          color: isLight ? colors.blueDeep : colors.blueBright,
          textTransform: 'uppercase',
          opacity: 0.8,
        }}
      >
        Visível
      </div>
    </div>
  );
};

// ─── Layer row (one of N hidden layers) ────────────────────────────────

const LayerRow: React.FC<{
  iconKey: import('../../schema/iconMap').IconKey;
  label: string;
  depthIndex: number;
  totalDepth: number;
  startFrame: number;
  exitFrame?: number;
  theme: ReturnType<typeof useThemeTokens>;
}> = ({ iconKey, label, depthIndex, totalDepth, startFrame, exitFrame, theme }) => {
  const frame = useCurrentFrame();
  const isLight = theme.name === 'light';
  const IconComponent = resolveIcon(iconKey);
  if (!IconComponent) return null;

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
  const enterY = (1 - enterP) * 8;

  // Mask reveal from left → right (peeling motion)
  const inset = (1 - enterP) * 100;

  // Each layer gets progressively more muted/deeper background, simulating
  // descent. Depth index 0 (closest to surface) is lightest, depth (N-1)
  // is darkest.
  const depthRatio = depthIndex / Math.max(1, totalDepth - 1); // 0..1
  const bgAlpha = isLight
    ? 0.04 + depthRatio * 0.06
    : 0.04 + depthRatio * 0.08;
  const background = isLight
    ? `rgba(15, 35, 65, ${bgAlpha})`
    : `rgba(255, 255, 255, ${bgAlpha})`;
  const labelColor = isLight
    ? `rgba(15, 35, 65, ${0.85 - depthRatio * 0.20})`
    : `rgba(255, 255, 255, ${0.85 - depthRatio * 0.20})`;
  const iconColor = isLight ? colors.blueDeep : colors.blue;

  return (
    <div
      style={{
        marginTop: depthIndex === 0 ? 0 : LAYER_GAP,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: gap.elements,
        width: ROW_WIDTH,
        height: LAYER_HEIGHT,
        padding: '0 28px',
        background,
        borderRadius: radius.sm,
        opacity,
        transform: `translateY(${enterY}px)`,
        clipPath: `inset(0 ${inset}% 0 0)`,
        WebkitClipPath: `inset(0 ${inset}% 0 0)`,
      }}
    >
      <Icon
        Component={IconComponent}
        size={32}
        color={iconColor}
        startFrame={startFrame}
        exitFrame={exitFrame}
        preset="pop"
      />
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.medium,
          fontSize: 22,
          color: labelColor,
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          flex: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
};
