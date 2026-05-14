/**
 * Quadrante2x2 — archetype "quadrante-2x2".
 *
 *                      Y high
 *                        ▲
 *          ┌─────────────┼─────────────┐
 *          │             │             │
 *          │   TL CELL   │   TR CELL   │
 *          │             │             │
 *   X low ◄┼─────────────┼─────────────┼► X high
 *          │             │             │
 *          │   BL CELL   │   BR CELL   │
 *          │             │             │
 *          └─────────────┼─────────────┘
 *                        ▼
 *                      Y low
 *
 * REDESIGN 2026-05: previous version was 4 small ConceptCards in a
 * loose grid with thin axis lines that barely read. New version is
 * a real DATAVIZ MATRIX:
 *
 *   - Each quadrant is a full pane (not a card) with its own subtle
 *     tinted background — adjacent quadrants share an edge with no
 *     gap, so the matrix reads as ONE composition.
 *   - Axes are drawn as bold arrows (with arrowheads) running through
 *     the center, with HIGH/LOW labels at the extremes.
 *   - The center of the matrix has a circular ORIGIN badge where the
 *     two axes cross.
 *   - Highlight quadrant: brand-blue background tint + glow + protagonist
 *     accent on its title.
 *
 * Mode/theme-aware.
 *
 * CHOREOGRAPHY:
 *   t=0   heading
 *   t=8   axes draw (X and Y lines + arrowheads + labels at extremes)
 *   t=18  4 quadrants pop in left→right, top→bottom
 *   t=42  highlight quadrant glow ramps up
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
import type { Quadrante2x2Block, QuadrantCell } from '../../schema/types';

interface Props {
  block: Quadrante2x2Block;
  startFrame: number;
  exitFrame?: number;
}

const T_HEADING        = 0;
const T_AXES           = 8;
const T_QUADRANTS      = 18;
const QUAD_STAGGER     = 6;

const MATRIX_W = 1100;
const MATRIX_H = 720;
const HALF_W = MATRIX_W / 2;
const HALF_H = MATRIX_H / 2;
const AXIS_OVERSHOOT = 60;
const ORIGIN_RADIUS = 24;

export const Quadrante2x2: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const theme = useThemeTokens();
  const isLight = theme.name === 'light';

  const Q = block.quadrants;
  const order: Array<{ key: keyof typeof Q; cell: QuadrantCell; col: 0 | 1; row: 0 | 1 }> = [
    { key: 'topLeft',     cell: Q.topLeft,     col: 0, row: 0 },
    { key: 'topRight',    cell: Q.topRight,    col: 1, row: 0 },
    { key: 'bottomLeft',  cell: Q.bottomLeft,  col: 0, row: 1 },
    { key: 'bottomRight', cell: Q.bottomRight, col: 1, row: 1 },
  ];

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
              fontSize: 52,
              color: theme.fg,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              textAlign: 'center',
              textShadow: isLight ? 'none' : `0 0 40px ${colors.glow30}`,
            }}
          >
            {block.heading}
          </div>
        </MaskReveal>
      )}

      <div
        style={{
          position: 'relative',
          width: MATRIX_W + AXIS_OVERSHOOT * 2,
          height: MATRIX_H + AXIS_OVERSHOOT * 2,
        }}
      >
        {/* Quadrant background tiles (4 panes filling the matrix) */}
        {order.map((o) => (
          <QuadrantPane
            key={`pane-${o.key}`}
            cell={o.cell}
            col={o.col}
            row={o.row}
            startFrame={startFrame + T_QUADRANTS + (o.row * 2 + o.col) * QUAD_STAGGER}
            exitFrame={exitFrame}
            isLight={isLight}
          />
        ))}

        {/* Quadrant content (icon + title + caption) */}
        {order.map((o) => (
          <QuadrantContent
            key={`content-${o.key}`}
            cell={o.cell}
            col={o.col}
            row={o.row}
            startFrame={startFrame + T_QUADRANTS + (o.row * 2 + o.col) * QUAD_STAGGER + 4}
            exitFrame={exitFrame}
            theme={theme}
          />
        ))}

        {/* Axes — X and Y arrows running through the center */}
        <Axes
          startFrame={startFrame + T_AXES}
          exitFrame={exitFrame}
          axisX={block.axisX}
          axisY={block.axisY}
          theme={theme}
        />

        {/* Origin badge — small circle at center where axes cross */}
        <Origin
          startFrame={startFrame + T_AXES + 12}
          exitFrame={exitFrame}
          isLight={isLight}
        />
      </div>
    </div>
  );
};

// ─── Quadrant pane (background tile) ─────────────────────────────────────

const QuadrantPane: React.FC<{
  cell: QuadrantCell;
  col: 0 | 1;
  row: 0 | 1;
  startFrame: number;
  exitFrame?: number;
  isLight: boolean;
}> = ({ cell, col, row, startFrame, exitFrame, isLight }) => {
  const frame = useCurrentFrame();
  const isHighlight = Boolean(cell.highlight);

  const enterP = interpolate(
    frame, [startFrame, startFrame + motion.enterSlow], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;
  const opacity = Math.min(enterP, exitP);

  // Each non-highlight quadrant gets a SUBTLE tint based on its position
  // — distinguishes the four panes without competing with the highlight.
  // Highlight: brand-blue fill with glow.
  let background: string;
  if (isHighlight) {
    background = isLight
      ? `linear-gradient(135deg, rgba(65, 160, 220, 0.20), rgba(65, 160, 220, 0.30))`
      : `linear-gradient(135deg, rgba(95, 182, 232, 0.22), rgba(65, 160, 220, 0.32))`;
  } else {
    // Map each quadrant to a slightly different alpha so they read as
    // four distinct panes, not as one flat color.
    const alpha = isLight
      ? 0.04 + (col + row) * 0.02
      : 0.04 + (col + row) * 0.02;
    background = isLight
      ? `rgba(15, 35, 65, ${alpha})`
      : `rgba(127, 196, 240, ${alpha})`;
  }

  const x = AXIS_OVERSHOOT + col * HALF_W;
  const y = AXIS_OVERSHOOT + row * HALF_H;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: HALF_W,
        height: HALF_H,
        background,
        opacity,
        // Borders only on the OUTER edges of the matrix, not at the axes
        // (the axes are the internal dividers).
        borderTop: row === 0 ? `1px solid ${isLight ? 'rgba(15, 35, 65, 0.20)' : colors.whiteA20}` : undefined,
        borderBottom: row === 1 ? `1px solid ${isLight ? 'rgba(15, 35, 65, 0.20)' : colors.whiteA20}` : undefined,
        borderLeft: col === 0 ? `1px solid ${isLight ? 'rgba(15, 35, 65, 0.20)' : colors.whiteA20}` : undefined,
        borderRight: col === 1 ? `1px solid ${isLight ? 'rgba(15, 35, 65, 0.20)' : colors.whiteA20}` : undefined,
        boxShadow: isHighlight
          ? (isLight
              ? `inset 0 0 60px rgba(65, 160, 220, 0.15)`
              : `inset 0 0 60px ${colors.glow40}, 0 0 40px ${colors.glow30}`)
          : undefined,
      }}
    />
  );
};

// ─── Quadrant content (icon + title + caption inside a pane) ─────────────

const QuadrantContent: React.FC<{
  cell: QuadrantCell;
  col: 0 | 1;
  row: 0 | 1;
  startFrame: number;
  exitFrame?: number;
  theme: ReturnType<typeof useThemeTokens>;
}> = ({ cell, col, row, startFrame, exitFrame, theme }) => {
  const frame = useCurrentFrame();
  const isLight = theme.name === 'light';
  const isHighlight = Boolean(cell.highlight);
  const IconComponent = resolveIcon(cell.icon);
  if (!IconComponent) return null;

  const enterP = interpolate(
    frame, [startFrame, startFrame + motion.enterSlow], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;
  const opacity = Math.min(enterP, exitP);
  const enterY = (1 - enterP) * 8;

  const x = AXIS_OVERSHOOT + col * HALF_W;
  const y = AXIS_OVERSHOOT + row * HALF_H;

  const iconColor = isHighlight
    ? (isLight ? colors.blueDeep : colors.blueBright)
    : (isLight ? colors.blueDeep : colors.blue);
  const titleColor = isHighlight
    ? (isLight ? colors.blueDeep : colors.blueBright)
    : theme.fg;
  const captionColor = theme.fgMuted;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: HALF_W,
        height: HALF_H,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: gap.intra,
        padding: '0 40px',
        opacity,
        transform: `translateY(${enterY}px)`,
      }}
    >
      <Icon
        Component={IconComponent}
        size={isHighlight ? 64 : 52}
        color={iconColor}
        strokeWidth={2.2}
        startFrame={startFrame}
        exitFrame={exitFrame}
        preset="pop"
      />
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.semibold,
          fontSize: isHighlight ? 32 : 26,
          color: titleColor,
          letterSpacing: '-0.015em',
          lineHeight: 1.15,
          textAlign: 'center',
          textShadow: isHighlight && !isLight ? `0 0 24px ${colors.glow40}` : undefined,
        }}
      >
        {cell.title}
      </div>
      {cell.caption && (
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.regular,
            fontSize: 16,
            color: captionColor,
            letterSpacing: '0.005em',
            lineHeight: 1.3,
            textAlign: 'center',
            maxWidth: 360,
          }}
        >
          {cell.caption}
        </div>
      )}
    </div>
  );
};

// ─── Axes (X and Y arrows running through center) ────────────────────────

const Axes: React.FC<{
  startFrame: number;
  exitFrame?: number;
  axisX: { lowLabel: string; highLabel: string };
  axisY: { lowLabel: string; highLabel: string };
  theme: ReturnType<typeof useThemeTokens>;
}> = ({ startFrame, exitFrame, axisX, axisY, theme }) => {
  const frame = useCurrentFrame();
  const isLight = theme.name === 'light';

  const drawP = interpolate(
    frame, [startFrame, startFrame + motion.enterDramatic], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;
  const opacity = Math.min(drawP, exitP);

  // Axis stroke is darker/bolder than the original — these are the
  // semantic spine of the chart, not background dividers.
  const axisColor = isLight ? colors.navyDeep : colors.white;
  const axisStroke = 2;

  // Total canvas span including overshoot on each side
  const totalW = MATRIX_W + AXIS_OVERSHOOT * 2;
  const totalH = MATRIX_H + AXIS_OVERSHOOT * 2;
  const cx = totalW / 2;
  const cy = totalH / 2;

  return (
    <>
      <svg
        width={totalW}
        height={totalH}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {/* X axis (horizontal, growing left→right) */}
        <line
          x1={totalW * (1 - drawP)} y1={cy}
          x2={totalW * drawP}        y2={cy}
          stroke={axisColor}
          strokeWidth={axisStroke}
          strokeOpacity={opacity * 0.85}
        />
        {/* X axis arrowhead (right side) */}
        {drawP > 0.7 && (
          <polygon
            points={`${totalW - 4},${cy - 8} ${totalW - 4},${cy + 8} ${totalW + 12},${cy}`}
            fill={axisColor}
            opacity={opacity * (drawP - 0.7) / 0.3}
          />
        )}

        {/* Y axis (vertical, growing bottom→top) */}
        <line
          x1={cx} y1={totalH * drawP}
          x2={cx} y2={totalH * (1 - drawP)}
          stroke={axisColor}
          strokeWidth={axisStroke}
          strokeOpacity={opacity * 0.85}
        />
        {/* Y axis arrowhead (top) */}
        {drawP > 0.7 && (
          <polygon
            points={`${cx - 8},4 ${cx + 8},4 ${cx},-12`}
            fill={axisColor}
            opacity={opacity * (drawP - 0.7) / 0.3}
          />
        )}
      </svg>

      {/* Axis labels at extremes */}
      {/* Axis labels removed 2026-05 — feedback: too much visual noise.
          The axes themselves (arrows + arrowheads) carry the dimensionality;
          named extremes are optional and obscure the quadrant content.
          The schema still accepts axisX/axisY labels for backward compat
          but the renderer no longer draws them. */}
    </>
  );
};

// ─── Axis label (small bold mono text) ────────────────────────────────

const AxisLabel: React.FC<{
  text: string;
  position: React.CSSProperties;
  startFrame: number;
  exitFrame?: number;
  theme: ReturnType<typeof useThemeTokens>;
}> = ({ text, position, startFrame, exitFrame, theme }) => {
  const frame = useCurrentFrame();
  const enterP = interpolate(
    frame, [startFrame, startFrame + motion.enter], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;
  const opacity = Math.min(enterP, exitP);

  return (
    <div
      style={{
        position: 'absolute',
        opacity,
        fontFamily: fonts.mono,
        fontSize: 16,
        fontWeight: weights.bold,
        letterSpacing: '0.16em',
        color: theme.fg,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...position,
      }}
    >
      {text}
    </div>
  );
};

// ─── Origin badge (where axes cross) ──────────────────────────────────

const Origin: React.FC<{
  startFrame: number;
  exitFrame?: number;
  isLight: boolean;
}> = ({ startFrame, exitFrame, isLight }) => {
  const frame = useCurrentFrame();
  const enterP = interpolate(
    frame, [startFrame, startFrame + motion.enter], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.emphasis },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;
  const opacity = Math.min(enterP, exitP);
  const scale = interpolate(enterP, [0, 1], [0.5, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: ORIGIN_RADIUS * 2,
        height: ORIGIN_RADIUS * 2,
        borderRadius: '50%',
        background: isLight
          ? `radial-gradient(circle, ${colors.blueDeep} 0%, ${colors.blue} 100%)`
          : `radial-gradient(circle, ${colors.blueBright} 0%, ${colors.blueDeep} 100%)`,
        boxShadow: isLight
          ? `0 4px 12px rgba(15, 35, 65, 0.2)`
          : `0 0 24px ${colors.glow60}, 0 0 8px ${colors.glow40}`,
        opacity,
        zIndex: 5,
      }}
    />
  );
};
