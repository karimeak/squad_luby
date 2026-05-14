/**
 * AnimatedTitle (v2)
 *
 * Word-by-word kinetic reveal using mask wipes (NOT fades).
 * Each word reveals from below with a clip-path mask.
 *
 * Improvements over v1:
 *   - Mask reveal instead of fade → premium feel (Stripe/Linear style)
 *   - Eased stagger (words group then settle, not metronome)
 *   - Independent exit choreography (words slide up + fade in unison)
 *   - Optional micro-letterspacing animation on settle
 *   - Per-word highlight (in brand blue)
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { colors, fonts, weights } from '../design/tokens';
import { easings } from '../design/easings';
import { motion, stagger } from '../design/motion';

interface Props {
  text: string;
  highlightWords?: string[];
  fontSize?: number;
  startFrame: number;
  exitFrame?: number;
  align?: 'left' | 'center';
  maxWidth?: number;
  lineHeight?: number;
}

export const AnimatedTitle: React.FC<Props> = ({
  text,
  highlightWords = [],
  fontSize = 92,
  startFrame,
  exitFrame,
  align = 'left',
  maxWidth,
  lineHeight = 1.06,
}) => {
  const frame = useCurrentFrame();

  const words = text.split(' ');
  const total = words.length;

  const stripPunct = (s: string) => s.replace(/[.,?!:;]/g, '');
  const highlightSet = new Set(highlightWords.map(stripPunct));

  // Stagger gap — slightly negative-eased so first words come quick,
  // last ones settle gently into place
  const STAGGER_GAP = 4;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.28em',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        maxWidth,
        fontFamily: fonts.display,
        fontWeight: weights.bold,
        fontSize,
        lineHeight,
        letterSpacing: '-0.025em',
        color: colors.white,
      }}
    >
      {words.map((word, i) => {
        const wordStart = stagger({
          index: i,
          base: startFrame,
          gap: STAGGER_GAP,
          total,
          easingFn: easings.enterSoft,
        });

        // Enter: mask wipe up + translate
        const enterP = interpolate(
          frame,
          [wordStart, wordStart + motion.enterSlow],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter }
        );

        // Exit: all words slide up + fade together (no stagger on exit — feels decisive)
        const exitP = exitFrame
          ? interpolate(
              frame,
              [exitFrame, exitFrame + motion.exit],
              [1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit }
            )
          : 1;

        const enterY = (1 - enterP) * 32;
        const exitY  = (1 - exitP) * -24;
        const opacity = Math.min(enterP, exitP);

        // Mask wipe progress
        const inset = (1 - enterP) * 100;
        const clipPath = `inset(${inset}% 0 0 0)`;

        const isHighlight = highlightSet.has(stripPunct(word));

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${enterY + exitY}px)`,
              opacity,
              clipPath,
              WebkitClipPath: clipPath,
              color: isHighlight ? colors.blue : colors.white,
              willChange: 'transform, opacity, clip-path',
              textShadow: isHighlight
                ? `0 0 40px ${colors.glow40}`
                : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
