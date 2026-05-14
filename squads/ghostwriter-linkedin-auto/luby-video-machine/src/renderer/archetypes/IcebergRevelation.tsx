/**
 * IcebergRevelation — archetype "iceberg-revelation".
 *
 *                    /\
 *               [Visible 1]
 *              / [Visible 2] \
 *   ═════════/════════════════\═══════════  ← water line
 *           /                  \
 *          /   [Depth 1]        \
 *         /                      \
 *        /     [Depth 2]          \
 *       /                          \
 *      /        [Depth 3]           \
 *     /                              \
 *    /          [Depth 4]             \
 *   /__________________________________\
 *
 * REDESIGN 2026-05: previous version was a horizontal water-line with
 * items in two flat zones — read like a divider, not an iceberg. New
 * version draws a REAL iceberg silhouette (SVG path), with the
 * surface tip above water and the much larger submerged mass below.
 * Items are placed at depth ranges INSIDE the iceberg shape. The
 * water line is rendered as a subtle horizontal gradient where the
 * iceberg meets the surface.
 *
 * The proportion of the iceberg shape (small triangle up, large
 * pentagon down) IS the argument: what you see is the tiny part.
 *
 * Mode-aware via ModeContext; theme-aware via ThemeContext.
 *
 * CHOREOGRAPHY:
 *   t=0    heading mask-reveals
 *   t=10   iceberg silhouette draws (SVG stroke-dashoffset)
 *   t=22   surface items pop in (above the water line)
 *   t=32+  depth items stagger top→bottom (closer to surface first,
 *          deepest last)
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Icon } from '../../components/Icon';
import { MaskReveal } from '../../components/MaskReveal';
import { resolveIcon } from '../../schema/iconMap';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion } from '../../design/motion';
import { useCurrentMode } from '../ModeContext';
import { useThemeTokens } from '../ThemeContext';
import type { IcebergRevelationBlock } from '../../schema/types';

interface Props {
  block: IcebergRevelationBlock;
  startFrame: number;
  exitFrame?: number;
}

// Canvas-local geometry — the iceberg shape is drawn in this coordinate
// system. The container itself is fixed at this size and centred by the
// surrounding scene flex.
const W = 1400;
const H = 880;
const WATER_Y = H * 0.28;  // water line at 28% from top (small visible)
const PEAK_Y = H * 0.04;   // peak of the iceberg
const BOTTOM_Y = H * 0.96; // bottom of the iceberg

const T_HEADING       = 0;
const T_BERG_DRAW     = 10;
const T_SURFACE_ITEM  = 22;
const T_DEPTH_FIRST   = 32;
const DEPTH_STAGGER   = 6;

export const IcebergRevelation: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const mode = useCurrentMode();
  const theme = useThemeTokens();
  const isPremium = mode === 'luby-premium';
  const isLightTheme = theme.name === 'light';

  const surfaceItems = block.surface.items;
  const depthItems = block.depth.items;

  // Iceberg silhouette path. Two regions stitched at the water line:
  //   - SURFACE: narrow triangle peak from (W/2, PEAK) splaying out to
  //     two points on the water line.
  //   - DEPTH: wide irregular shape much larger than the tip.
  //
  // Coordinates designed to read as "iceberg" — small spike on top,
  // wide rounded-bottom body submerged. The shape is asymmetric on
  // purpose (real icebergs aren't symmetric).
  const cx = W / 2;
  const surfaceLeftX = cx - 90;
  const surfaceRightX = cx + 110;
  const depthLeftEdge = cx - 350;
  const depthRightEdge = cx + 380;
  const depthBottomLeftX = cx - 290;
  const depthBottomRightX = cx + 320;

  const icebergPath = [
    `M ${cx} ${PEAK_Y}`,
    `L ${surfaceRightX} ${WATER_Y - 6}`,
    // Surface tip widens into depth body — outline above water connects
    // to a wider shape below.
    `L ${depthRightEdge} ${WATER_Y + 40}`,
    `C ${depthRightEdge + 30} ${WATER_Y + 220}, ${depthRightEdge + 10} ${BOTTOM_Y - 60}, ${depthBottomRightX} ${BOTTOM_Y}`,
    `L ${depthBottomLeftX} ${BOTTOM_Y}`,
    `C ${depthLeftEdge - 20} ${BOTTOM_Y - 80}, ${depthLeftEdge - 30} ${WATER_Y + 240}, ${depthLeftEdge} ${WATER_Y + 30}`,
    `L ${surfaceLeftX} ${WATER_Y - 6}`,
    `Z`,
  ].join(' ');

  // Surface tip subset (above water) — for the lit fill above the line
  const surfaceTipPath = [
    `M ${cx} ${PEAK_Y}`,
    `L ${surfaceRightX} ${WATER_Y - 6}`,
    `L ${surfaceLeftX} ${WATER_Y - 6}`,
    `Z`,
  ].join(' ');

  // Depth body subset (below water) — for the submerged darker fill
  const depthBodyPath = [
    `M ${depthLeftEdge} ${WATER_Y + 30}`,
    `L ${depthRightEdge} ${WATER_Y + 40}`,
    `C ${depthRightEdge + 30} ${WATER_Y + 220}, ${depthRightEdge + 10} ${BOTTOM_Y - 60}, ${depthBottomRightX} ${BOTTOM_Y}`,
    `L ${depthBottomLeftX} ${BOTTOM_Y}`,
    `C ${depthLeftEdge - 20} ${BOTTOM_Y - 80}, ${depthLeftEdge - 30} ${WATER_Y + 240}, ${depthLeftEdge} ${WATER_Y + 30}`,
    `Z`,
  ].join(' ');

  // Colors adapt to theme. Light theme uses navy fills (the iceberg
  // sits as a "shape" on the off-white surface); dark uses blue tones
  // (the iceberg glows against navy background).
  const surfaceFill = isLightTheme
    ? `rgba(65, 160, 220, 0.28)`
    : `rgba(127, 196, 240, 0.32)`;
  const depthFill = isLightTheme
    ? `rgba(15, 35, 65, 0.18)`
    : `rgba(45, 122, 171, 0.18)`;
  const strokeColor = isLightTheme ? colors.blueDeep : colors.blueBright;
  const waterLineColor = isLightTheme ? colors.blueDeep : colors.blueBright;

  // Surface items sit OUTSIDE the iceberg silhouette — to the right of
  // the peak, aligned vertically near the peak. Previously they were
  // placed inside the tip, which overlapped the silhouette drawing.
  // Now they read as labels POINTING AT the visible tip.
  const surfaceLabelX = surfaceRightX + 180;
  const surfaceSlotY = PEAK_Y + 80; // a bit below the peak, beside the tip

  // Depth items distribute through the submerged body
  const depthSlotYs = depthItems.map((_, i) => {
    const top = WATER_Y + 90;
    const bottom = BOTTOM_Y - 110;
    return top + (bottom - top) * (depthItems.length === 1 ? 0.5 : i / (depthItems.length - 1));
  });

  return (
    <div style={{ position: 'relative', width: W, height: H }}>
      {/* Heading */}
      {block.heading && (
        <div
          style={{
            position: 'absolute',
            top: -16,
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 5,
          }}
        >
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
                fontSize: 44,
                color: theme.fg,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                textShadow: isLightTheme ? 'none' : `0 0 40px ${colors.glow30}`,
              }}
            >
              {block.heading}
            </div>
          </MaskReveal>
        </div>
      )}

      {/* Iceberg silhouette (SVG behind items) */}
      <Iceberg
        surfaceTipPath={surfaceTipPath}
        depthBodyPath={depthBodyPath}
        outlinePath={icebergPath}
        surfaceFill={surfaceFill}
        depthFill={depthFill}
        strokeColor={strokeColor}
        startFrame={startFrame + T_BERG_DRAW}
        exitFrame={exitFrame}
        isPremium={isPremium}
      />

      {/* Water line — horizontal stroke across the canvas at WATER_Y */}
      <WaterLine
        y={WATER_Y}
        startFrame={startFrame + T_BERG_DRAW + 4}
        exitFrame={exitFrame}
        color={waterLineColor}
        isPremium={isPremium && !isLightTheme}
      />

      {/* Surface item(s) — sit BESIDE the iceberg tip (right side),
          labeling the visible part without obscuring the drawing.
          If multiple surface items, stack them vertically beside the tip. */}
      {surfaceItems.map((item, i) => {
        const y = surfaceSlotY + i * 70;
        return (
          <IcebergItem
            key={`surface-${i}`}
            iconKey={item.icon}
            label={item.label}
            caption={item.caption}
            x={surfaceLabelX}
            y={y}
            anchor="left"
            startFrame={startFrame + T_SURFACE_ITEM + i * 6}
            exitFrame={exitFrame}
            zone="surface"
            theme={theme}
          />
        );
      })}

      {/* Depth items — stacked vertically inside the submerged body */}
      {depthItems.map((item, i) => (
        <IcebergItem
          key={`depth-${i}`}
          iconKey={item.icon}
          label={item.label}
          caption={item.caption}
          x={cx}
          y={depthSlotYs[i]}
          startFrame={startFrame + T_DEPTH_FIRST + i * DEPTH_STAGGER}
          exitFrame={exitFrame}
          zone="depth"
          theme={theme}
        />
      ))}
    </div>
  );
};

// ─── Iceberg SVG silhouette ──────────────────────────────────────────────

const Iceberg: React.FC<{
  surfaceTipPath: string;
  depthBodyPath: string;
  outlinePath: string;
  surfaceFill: string;
  depthFill: string;
  strokeColor: string;
  startFrame: number;
  exitFrame?: number;
  isPremium: boolean;
}> = ({ surfaceTipPath, depthBodyPath, outlinePath, surfaceFill, depthFill, strokeColor, startFrame, exitFrame, isPremium }) => {
  const frame = useCurrentFrame();

  // Drawing progress — outline strokes in left→right, fills fade in.
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

  return (
    <svg
      width={W}
      height={H}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <defs>
        {/* Subtle gradient on surface tip — lighter on top, darker toward water */}
        <linearGradient id="iceberg-tip-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={surfaceFill} stopOpacity="1" />
          <stop offset="100%" stopColor={surfaceFill} stopOpacity="0.6" />
        </linearGradient>
        {/* Gradient on depth body — darker at top (near water), gradually
            fades darker at bottom (depth feeling) */}
        <linearGradient id="iceberg-depth-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={depthFill} stopOpacity="0.7" />
          <stop offset="100%" stopColor={depthFill} stopOpacity="1" />
        </linearGradient>
        {isPremium && (
          <filter id="iceberg-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* Surface tip (above water) — filled */}
      <path
        d={surfaceTipPath}
        fill="url(#iceberg-tip-grad)"
        opacity={opacity}
        filter={isPremium ? 'url(#iceberg-glow)' : undefined}
      />

      {/* Depth body (below water) — filled */}
      <path
        d={depthBodyPath}
        fill="url(#iceberg-depth-grad)"
        opacity={opacity}
      />

      {/* Outline (whole iceberg) — stroke draws in */}
      <path
        d={outlinePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeOpacity={opacity * 0.6}
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ─── Water line — a horizontal stroke at WATER_Y ─────────────────────────

const WaterLine: React.FC<{
  y: number;
  startFrame: number;
  exitFrame?: number;
  color: string;
  isPremium: boolean;
}> = ({ y, startFrame, exitFrame, color, isPremium }) => {
  const frame = useCurrentFrame();

  const drawP = interpolate(
    frame, [startFrame, startFrame + motion.enterSlow], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;
  const opacity = Math.min(drawP, exitP);

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        width: `${drawP * 100}%`,
        height: 1,
        background: color,
        opacity: opacity * 0.5,
        boxShadow: isPremium ? `0 0 8px ${colors.glow40}` : undefined,
      }}
    />
  );
};

// ─── Single iceberg item (icon + label + caption) positioned absolutely ──

const IcebergItem: React.FC<{
  iconKey: import('../../schema/iconMap').IconKey;
  label: string;
  caption?: string;
  x: number;
  y: number;
  /**
   * 'center' (default): x,y are the CENTER of the item.
   * 'left'           : x,y are the LEFT edge / vertical center.
   *                    Used for surface items that label the tip from
   *                    the right side without crossing the silhouette.
   */
  anchor?: 'center' | 'left';
  startFrame: number;
  exitFrame?: number;
  zone: 'surface' | 'depth';
  theme: ReturnType<typeof useThemeTokens>;
}> = ({ iconKey, label, caption, x, y, anchor = 'center', startFrame, exitFrame, zone, theme }) => {
  const frame = useCurrentFrame();
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
  const enterY = (1 - enterP) * (zone === 'surface' ? -8 : 8);

  // Surface items use brand bright (the visible-part is the proud tip).
  // Depth items use a muted accent (they're "submerged").
  const isLight = theme.name === 'light';
  const iconColor = zone === 'surface'
    ? (isLight ? colors.blueDeep : colors.blueBright)
    : (isLight ? colors.blueDeep : colors.blue);
  const labelColor = zone === 'surface' ? theme.fg : theme.fgMuted;
  const captionColor = zone === 'surface' ? theme.fgMuted : theme.fgSubtle;
  const iconSize = zone === 'surface' ? 64 : 48;
  const labelSize = zone === 'surface' ? 28 : 22;

  // Anchor 'center' translates -50%, -50% (default). Anchor 'left'
  // translates 0, -50% (item starts at x, vertically centered at y).
  const transformOrigin = anchor === 'left'
    ? `translate(0, -50%) translateY(${enterY}px)`
    : `translate(-50%, -50%) translateY(${enterY}px)`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: transformOrigin,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: gap.intra,
        opacity,
        // Tight horizontal layout: icon + label + (caption optional)
        whiteSpace: 'nowrap',
      }}
    >
      <Icon
        Component={IconComponent}
        size={iconSize}
        color={iconColor}
        startFrame={startFrame}
        exitFrame={exitFrame}
        preset="pop"
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.semibold,
            fontSize: labelSize,
            color: labelColor,
            letterSpacing: '-0.015em',
            lineHeight: 1.15,
          }}
        >
          {label}
        </div>
        {caption && (
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: weights.regular,
              fontSize: 16,
              color: captionColor,
              letterSpacing: '0.005em',
              lineHeight: 1.3,
              maxWidth: 320,
              whiteSpace: 'normal',
            }}
          >
            {caption}
          </div>
        )}
      </div>
    </div>
  );
};
