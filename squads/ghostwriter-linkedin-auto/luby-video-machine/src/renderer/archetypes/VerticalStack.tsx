/**
 * VerticalStack — archetype "vertical-stack".
 *
 *   ┌──────────────────────────────┐
 *   │  [icon]  Item 1  caption     │
 *   └──────────────────────────────┘
 *                ↓
 *   ┌──────────────────────────────┐
 *   │  [icon]  Item 2  caption     │
 *   └──────────────────────────────┘
 *                ↓
 *   ┌──────────────────────────────┐
 *   │  [icon]  Item 3  caption     │
 *   └──────────────────────────────┘
 *
 * REDESIGN 2026-05: previous version was tipograficamente densa mas
 * visualmente fraca — só ícone + texto empilhados, parecia slide PowerPoint.
 * New version reads as VERTICAL FLOWCHART: each item sits inside a
 * compact "node" card, with connector arrows DRAWN between nodes
 * (SVG strokes) signaling sequence/flow. Stagger top→bottom.
 *
 * The result: same 3-6 items, but the visual is now a vertical
 * diagram of nodes, not a list. Reads as "process / flow / sequence"
 * even when the items are conceptually parallel — which suits more
 * narrative use-cases than the previous typography-only stack.
 *
 * Mode/theme-aware throughout.
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
import type { VerticalStackBlock } from '../../schema/types';

interface Props {
  block: VerticalStackBlock;
  startFrame: number;
  exitFrame?: number;
}

const T_HEADING       = 0;
const T_FIRST_NODE    = 12;
const NODE_STAGGER    = 8;

const NODE_WIDTH      = 720;
const NODE_HEIGHT     = 88;
// Tightened 2026-05: nodes stack closer (was 28+28+28 = ~84px between
// node bodies via connector). Now 12px gap, no connector — reads as
// a compact stack of items instead of a sparse flowchart.
const NODE_GAP        = 12;

export const VerticalStack: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const theme = useThemeTokens();
  const items = block.items.slice(0, 6);
  if (items.length === 0) return null;

  const align = block.align ?? 'center';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        gap: gap.group,
        maxWidth: 1200,
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
              fontSize: 52,
              color: theme.fg,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              textAlign: align,
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
          width: NODE_WIDTH,
          gap: NODE_GAP,
        }}
      >
        {items.map((item, i) => {
          const IconComponent = resolveIcon(item.icon);
          if (!IconComponent) return null;

          const nodeStart = startFrame + T_FIRST_NODE + i * NODE_STAGGER;

          return (
            <FlowNode
              key={i}
              IconComponent={IconComponent}
              title={item.title}
              caption={item.caption}
              index={i + 1}
              total={items.length}
              startFrame={nodeStart}
              exitFrame={exitFrame}
              theme={theme}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─── Single flow node (card with index + icon + title + caption) ─────────

const FlowNode: React.FC<{
  IconComponent: React.ComponentType<{ size?: number }>;
  title: string;
  caption?: string;
  index: number;
  total: number;
  startFrame: number;
  exitFrame?: number;
  theme: ReturnType<typeof useThemeTokens>;
}> = ({ IconComponent, title, caption, index, startFrame, exitFrame, theme }) => {
  const frame = useCurrentFrame();
  const isLight = theme.name === 'light';

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
        width: NODE_WIDTH,
        minHeight: NODE_HEIGHT,
        padding: '14px 24px',
        borderRadius: radius.md,
        background: isLight
          ? `linear-gradient(160deg, ${theme.surfaceStrong}, ${theme.surface})`
          : `linear-gradient(160deg, ${colors.whiteA10}, ${colors.whiteA05})`,
        border: `1px solid ${theme.border}`,
        boxShadow: isLight
          ? `0 8px 24px rgba(15, 35, 65, 0.06)`
          : `0 12px 32px ${colors.blackA40}, 0 0 24px ${colors.glow10}`,
        opacity,
        transform: `translateY(${enterY}px) scale(${enterScale})`,
      }}
    >
      {/* Index badge */}
      <div
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: isLight ? colors.blueDeep : colors.blue,
          color: colors.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fonts.mono,
          fontSize: 16,
          fontWeight: weights.bold,
          letterSpacing: '0.02em',
        }}
      >
        {index}
      </div>

      {/* Icon */}
      <div style={{ flexShrink: 0 }}>
        <Icon
          // Cast: Icon component expects LucideIcon; the resolved icons all are.
          Component={IconComponent as any}
          size={44}
          color={isLight ? colors.blueDeep : colors.blueBright}
          startFrame={startFrame}
          exitFrame={exitFrame}
          preset="pop"
        />
      </div>

      {/* Title + caption */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.semibold,
            fontSize: 28,
            color: theme.fg,
            letterSpacing: '-0.015em',
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        {caption && (
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: weights.regular,
              fontSize: 16,
              color: theme.fgMuted,
              letterSpacing: '0.005em',
              lineHeight: 1.3,
            }}
          >
            {caption}
          </div>
        )}
      </div>
    </div>
  );
};

// Connector arrows removed 2026-05 — feedback was the arrows made the
// layout feel like a sparse flowchart. Without them the items read as
// a compact vertical list, which is what the archetype name says.
