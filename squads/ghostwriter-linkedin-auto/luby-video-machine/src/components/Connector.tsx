/**
 * Connector
 *
 * An SVG line connecting two points (`from` → `to`) that draws itself in,
 * optionally curves, optionally carries an animated "flow" dot, and exits
 * cleanly. The whole component renders to a single absolutely-positioned
 * SVG that covers the parent — so callers think in canvas coordinates,
 * not in SVG viewBox terms.
 *
 * USAGE
 *   <Connector
 *     from={{ x: 700,  y: 540 }}
 *     to=  {{ x: 1220, y: 540 }}
 *     curve={-40}                  // 0 = straight; +/- bows up or down
 *     thickness={3}
 *     startFrame={hook.enter.at + 24}
 *     drawDuration={motion.enterSlow}
 *     exitFrame={hook.exit.at}
 *     arrow="end"
 *     flow                         // animated dot traveling along the path
 *     glow
 *   />
 *
 * Coordinate system: `from` and `to` are in PARENT-COORDINATE pixels
 * (NOT viewBox units). The component covers the full 1920×1080 frame
 * with a fixed-size SVG so math stays trivial for callers.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { colors } from '../design/tokens';
import { easings } from '../design/easings';
import { motion, breathe } from '../design/motion';
import { VIDEO } from '../design/tokens';

interface Point {
  x: number;
  y: number;
}

interface Props {
  from: Point;
  to: Point;
  /**
   * Curve offset in pixels. 0 = straight line. Positive bows in the +Y
   * direction (downwards on screen). Negative bows up. Visual rule of
   * thumb: 8–15% of the line length looks "designed", more looks loud.
   */
  curve?: number;
  thickness?: number;
  color?: string;
  startFrame: number;
  drawDuration?: number;
  exitFrame?: number;
  exitDuration?: number;
  arrow?: 'none' | 'end' | 'both';
  /** Soft Gaussian glow around the line. */
  glow?: boolean;
  /** Dashed stroke (e.g. for "uncertain" / "in-flight" connections). */
  dashed?: boolean;
  /**
   * Animated dot that travels along the path. If true, uses sensible
   * defaults; if a number is passed, that's the cycle period in seconds.
   */
  flow?: boolean | number;
  /** Colour of the flow dot (defaults to a brighter brand variant). */
  flowColor?: string;
  /** Number of flow dots traveling at once (staggered). */
  flowCount?: number;
}

/** Quadratic Bezier point for parameter t∈[0,1]. */
const bezierPoint = (
  p0: Point,
  c: Point,
  p1: Point,
  t: number,
): Point => {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
    y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
  };
};

/** Linear interpolation between two points. */
const lerpPoint = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

export const Connector: React.FC<Props> = ({
  from,
  to,
  curve = 0,
  thickness = 3,
  color = colors.blue,
  startFrame,
  drawDuration = motion.enterSlow,
  exitFrame,
  exitDuration = motion.exit,
  arrow = 'none',
  glow = true,
  dashed = false,
  flow = false,
  flowColor = colors.blueBright,
  flowCount = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Draw progress (stroke-dashoffset)
  const drawP = interpolate(
    frame,
    [startFrame, startFrame + drawDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );

  // Exit fade — line stays drawn, just dims out
  const exitP = exitFrame !== undefined
    ? interpolate(
        frame,
        [exitFrame, exitFrame + exitDuration],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit },
      )
    : 1;

  const opacity = Math.min(drawP > 0 ? 1 : 0, exitP);

  // Build the path. For curve=0 it's a straight L; otherwise a quadratic
  // Bezier with the control point pushed perpendicular to the AB midpoint.
  let pathD: string;
  let control: Point | null = null;
  if (curve === 0) {
    pathD = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  } else {
    const mid: Point = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
    // Perpendicular unit vector to AB
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const perpX = -dy / len;
    const perpY = dx / len;
    control = { x: mid.x + perpX * curve, y: mid.y + perpY * curve };
    pathD = `M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`;
  }

  // Idle pulse on glow strength so a held connector still feels alive
  const glowBreath = breathe({ frame, fps, speed: 0.4, min: 0.7, max: 1.0 });

  // Unique IDs so multiple Connectors can coexist without filter/marker collisions.
  // Using startFrame+from.x+to.x is good enough for static scene math (deterministic).
  const idSeed = `${startFrame}-${Math.round(from.x)}-${Math.round(to.x)}-${Math.round(from.y)}-${Math.round(to.y)}`;
  const glowId = `cx-glow-${idSeed}`;
  const arrowId = `cx-arrow-${idSeed}`;

  // Flow dot positioning along the path
  const renderFlow = flow !== false && flow !== undefined && drawP >= 1;
  const flowPeriodSec = typeof flow === 'number' ? flow : 1.6;
  const flowT = ((frame / fps) % flowPeriodSec) / flowPeriodSec; // 0..1 looped
  const flowPoints: Array<{ p: Point; alpha: number; size: number }> = [];
  if (renderFlow) {
    for (let i = 0; i < flowCount; i++) {
      // Stagger each dot's phase across the period
      const phase = (i / flowCount);
      const t = (flowT + phase) % 1;
      const point = control ? bezierPoint(from, control, to, t) : lerpPoint(from, to, t);
      // Fade in at start, fade out near end so dots don't pop in/out at the seams
      const alpha = Math.sin(t * Math.PI); // 0 → 1 → 0 across the path
      flowPoints.push({ p: point, alpha, size: thickness * 2.4 });
    }
  }

  return (
    <svg
      width={VIDEO.width}
      height={VIDEO.height}
      viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`}
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <defs>
        {glow && (
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={Math.max(2, thickness * 1.4)} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
        {arrow !== 'none' && (
          <marker
            id={arrowId}
            viewBox="0 0 12 12"
            refX={10}
            refY={6}
            markerWidth={6}
            markerHeight={6}
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path
              d="M 0 0 L 12 6 L 0 12 L 3 6 Z"
              fill={color}
            />
          </marker>
        )}
      </defs>

      {/* Underlay: slightly thicker, very transparent — gives the line presence
          without doubling the visual weight when glow is on */}
      {glow && (
        <path
          d={pathD}
          stroke={color}
          strokeWidth={thickness * 2.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.18 * glowBreath}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - drawP}
        />
      )}

      {/* Main path */}
      <path
        d={pathD}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        // Use pathLength normalization so dashoffset works the same for any curve length
        strokeDasharray={dashed ? `${0.012} ${0.018}` : 1}
        strokeDashoffset={dashed ? 0 : 1 - drawP}
        // Hide the dashed variant during draw-in by using a clipPath-like trick:
        // for the dashed case, we fade in instead of stroke-revealing.
        opacity={dashed ? drawP : 1}
        filter={glow ? `url(#${glowId})` : undefined}
        markerEnd={arrow !== 'none' ? `url(#${arrowId})` : undefined}
        markerStart={arrow === 'both' ? `url(#${arrowId})` : undefined}
      />

      {/* Flow dots — only visible after the line finishes drawing */}
      {flowPoints.map((d, i) => (
        <circle
          key={i}
          cx={d.p.x}
          cy={d.p.y}
          r={d.size}
          fill={flowColor}
          opacity={d.alpha * 0.95}
          style={{
            filter: `drop-shadow(0 0 ${d.size * 2}px ${flowColor})`,
          }}
        />
      ))}
    </svg>
  );
};
