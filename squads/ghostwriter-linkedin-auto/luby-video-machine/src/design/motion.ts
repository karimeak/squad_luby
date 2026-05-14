/**
 * Motion system — beats, choreography, stagger.
 *
 * Replaces the v1 spring-only approach with a richer vocabulary:
 *
 *   1. BEATS — discrete units of time. The whole project speaks
 *      in beats so timing across scenes feels musical, not arbitrary.
 *
 *   2. STAGGER — coordinated multi-element entrances/exits with
 *      easing curves applied to the stagger ITSELF (not just to
 *      each element). This produces the "wave" feel premium motion has.
 *
 *   3. CHOREOGRAPHY — helper functions to express enter/idle/exit
 *      lifecycles in one shot.
 */

import { interpolate } from 'remotion';
import { easings } from './easings';

/**
 * BEATS at 30fps.
 *   1 beat = 12 frames = 0.4s
 *   2 beats = 24f = 0.8s
 *   ...
 *
 * Why 0.4s? It's the sweet spot between "snappy" (perceived as instant)
 * and "deliberate" (perceived as designed). Stripe and Linear hover
 * around this duration for most micro-animations.
 */
export const BEAT = 12;

export const beats = (n: number) => Math.round(n * BEAT);

/**
 * Standard durations expressed in beats.
 * Enter/exit are intentionally asymmetric — exits are faster, which
 * feels more "decisive" and avoids dead time between scenes.
 */
export const motion = {
  enterFast:    beats(0.5),  // 6f  — micro-interactions
  enter:        beats(1.5),  // 18f — most entrances
  enterSlow:    beats(2.0),  // 24f — emphasized entrances (titles)
  enterDramatic:beats(2.5),  // 30f — hero moments

  exitFast:     beats(0.4),  // ~5f
  exit:         beats(1.0),  // 12f
  exitSlow:     beats(1.5),  // 18f

  pause:        beats(1.0),  // breathing room between events
  hold:         beats(2.0),  // significant pause for absorption
} as const;

/**
 * Stagger helper.
 * Returns the START FRAME for the i-th element in a stagger sequence.
 *
 *   const start = stagger({ index: i, base: 30, gap: 6, easing: easings.enter })
 *
 * Why apply easing to the stagger itself?
 * Default linear stagger feels mechanical: t=0, t=6, t=12, t=18...
 * With easing, items group toward the start or end, which the eye reads
 * as "intentional choreography" instead of a metronome.
 */
export const stagger = ({
  index,
  base,
  gap,
  total,
  easingFn = easings.enter,
}: {
  index: number;
  base: number;
  gap: number;
  total?: number;
  easingFn?: (t: number) => number;
}): number => {
  if (!total || total <= 1) return base + index * gap;

  // Map the stagger position through the easing curve
  const linearT = index / (total - 1);
  const easedT = easingFn(linearT);
  const totalSpread = (total - 1) * gap;
  return base + easedT * totalSpread;
};

/**
 * Lifecycle progress.
 * Returns a 0..1 value that ramps in (0→1), holds (=1), then ramps out (1→0).
 *
 *   const p = lifecycle({
 *     frame, enter: { at: 0,  duration: 18 },
 *     exit:  { at: 100, duration: 12 },
 *   })
 *
 * Use this when the same prop (opacity, scale, etc) needs to enter,
 * persist, and exit on its own schedule.
 */
export const lifecycle = ({
  frame,
  enter,
  exit,
  enterEasing = easings.enter,
  exitEasing = easings.exit,
}: {
  frame: number;
  enter: { at: number; duration: number };
  exit?: { at: number; duration: number };
  enterEasing?: (t: number) => number;
  exitEasing?: (t: number) => number;
}): number => {
  // Enter phase
  const enterProgress = interpolate(
    frame,
    [enter.at, enter.at + enter.duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: enterEasing }
  );

  if (!exit) return enterProgress;

  // Exit phase
  const exitProgress = interpolate(
    frame,
    [exit.at, exit.at + exit.duration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: exitEasing }
  );

  // The visible value is the MIN of both — the element is only fully
  // present when it has finished entering AND hasn't started exiting.
  return Math.min(enterProgress, exitProgress);
};

/**
 * Microbreathing — a constant, very subtle oscillation.
 * Returns a value in [min, max] following a sine wave.
 *
 * Use for: glow opacity, subtle scale, drifting backgrounds.
 * Speed: cycles per second (0.3 = slow breath, 1 = quick pulse).
 */
export const breathe = ({
  frame,
  fps = 30,
  speed = 0.3,
  min = 0.85,
  max = 1.0,
  phase = 0,
}: {
  frame: number;
  fps?: number;
  speed?: number;
  min?: number;
  max?: number;
  phase?: number;
}): number => {
  const t = (frame / fps) * speed * Math.PI * 2 + phase;
  const sine = Math.sin(t);
  return interpolate(sine, [-1, 1], [min, max]);
};

/**
 * Reveal helper — single-prop reveal with a nice default.
 * Sugar around interpolate() for the common case of "fade in over X frames".
 */
export const reveal = (
  frame: number,
  startFrame: number,
  duration: number = motion.enter,
  easing = easings.enter,
): number => {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
};
