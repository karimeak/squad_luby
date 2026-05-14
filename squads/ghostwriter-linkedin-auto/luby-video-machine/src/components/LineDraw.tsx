/**
 * LineDraw
 *
 * Animates an SVG line "drawing itself" using stroke-dashoffset.
 * Decorative — used to underscore titles, frame elements, or
 * connect concepts visually.
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { easings } from '../design/easings';
import { motion } from '../design/motion';
import { colors } from '../design/tokens';

interface Props {
  width: number;
  height?: number;
  thickness?: number;
  color?: string;
  enterAt: number;
  enterDuration?: number;
  exitAt?: number;
  exitDuration?: number;
  direction?: 'horizontal' | 'vertical';
  glow?: boolean;
}

export const LineDraw: React.FC<Props> = ({
  width,
  height = 4,
  thickness = 4,
  color = colors.blue,
  enterAt,
  enterDuration = motion.enterSlow,
  exitAt,
  exitDuration = motion.exit,
  direction = 'horizontal',
  glow = true,
}) => {
  const frame = useCurrentFrame();

  const enterP = interpolate(
    frame,
    [enterAt, enterAt + enterDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter }
  );

  const exitP = exitAt
    ? interpolate(
        frame,
        [exitAt, exitAt + exitDuration],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit }
      )
    : 1;

  // For horizontal: line grows from left to right
  // For vertical:   line grows from top to bottom
  const lineLength = direction === 'horizontal' ? width : height;
  const drawnLength = lineLength * enterP;
  const fadeOut = exitP;

  const svgW = direction === 'horizontal' ? width : thickness;
  const svgH = direction === 'horizontal' ? thickness : height;

  return (
    <svg
      width={svgW}
      height={svgH}
      style={{
        opacity: fadeOut,
        overflow: 'visible',
      }}
    >
      <defs>
        {glow && (
          <filter id={`glow-${enterAt}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      <line
        x1={0}
        y1={direction === 'horizontal' ? thickness / 2 : 0}
        x2={direction === 'horizontal' ? drawnLength : thickness / 2}
        y2={direction === 'horizontal' ? thickness / 2 : drawnLength}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        filter={glow ? `url(#glow-${enterAt})` : undefined}
      />
    </svg>
  );
};
