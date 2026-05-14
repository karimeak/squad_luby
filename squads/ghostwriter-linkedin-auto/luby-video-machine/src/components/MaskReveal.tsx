/**
 * MaskReveal
 *
 * Reveals its children with a directional mask wipe. Far more premium-feeling
 * than a fade or a slide because the content stays in its final position
 * the entire time — only the visibility mask moves.
 *
 * Used for: titles, big numbers, CTAs.
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { easings } from '../design/easings';
import { motion } from '../design/motion';

interface Props {
  children: React.ReactNode;
  enterAt: number;
  enterDuration?: number;
  exitAt?: number;
  exitDuration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Optional translation distance in px during the reveal (adds physicality) */
  translate?: number;
}

export const MaskReveal: React.FC<Props> = ({
  children,
  enterAt,
  enterDuration = motion.enterSlow,
  exitAt,
  exitDuration = motion.exit,
  direction = 'up',
  translate = 28,
}) => {
  const frame = useCurrentFrame();

  // Two independent progresses so we can use different easings on enter vs exit
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

  const visible = Math.min(enterP, exitP);

  // Compute clip-path based on direction
  const inset = (1 - enterP) * 100; // 100% → 0% as we enter
  const exitInset = (1 - exitP) * 100; // 0 → 100 as we exit (from opposite side)

  let clipPath: string;
  let exitTransform = '';

  switch (direction) {
    case 'up':
      // Mask wipes up: bottom edge stays, top edge reveals
      clipPath = `inset(${inset}% 0 0 0)`;
      exitTransform = `translateY(${(1 - exitP) * -translate}px)`;
      break;
    case 'down':
      clipPath = `inset(0 0 ${inset}% 0)`;
      exitTransform = `translateY(${(1 - exitP) * translate}px)`;
      break;
    case 'left':
      clipPath = `inset(0 ${inset}% 0 0)`;
      exitTransform = `translateX(${(1 - exitP) * -translate}px)`;
      break;
    case 'right':
      clipPath = `inset(0 0 0 ${inset}%)`;
      exitTransform = `translateX(${(1 - exitP) * translate}px)`;
      break;
  }

  // Subtle entrance translation adds the "physical" feel
  const enterOffset = (1 - enterP) * translate;
  const enterTransform =
    direction === 'up'    ? `translateY(${enterOffset}px)` :
    direction === 'down'  ? `translateY(${-enterOffset}px)` :
    direction === 'left'  ? `translateX(${enterOffset}px)` :
                            `translateX(${-enterOffset}px)`;

  return (
    <div
      style={{
        clipPath,
        WebkitClipPath: clipPath,
        transform: `${enterTransform} ${exitTransform}`,
        opacity: visible,
        willChange: 'clip-path, transform, opacity',
      }}
    >
      {children}
    </div>
  );
};
