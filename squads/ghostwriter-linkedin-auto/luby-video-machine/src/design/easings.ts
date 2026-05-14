/**
 * Easings — the heart of the motion system.
 *
 * Named by INTENT, not by math. Pick the curve that matches what
 * the element is supposed to feel like, not what shape the curve has.
 *
 * Inspired by curves used by Stripe, Linear, Apple, Vercel — and
 * augmented with custom curves tuned for this brand.
 *
 * USAGE
 *   import { Easing } from 'remotion';
 *   import { easings } from '../design/easings';
 *
 *   interpolate(frame, [0, 30], [0, 1], { easing: easings.enter })
 */

import { Easing } from 'remotion';

/**
 * Cubic-bezier shortcuts. Each tuple matches CSS cubic-bezier(a,b,c,d).
 *
 * Reference vocabulary:
 *   - "ease-out-*" curves: fast start, slow end → great for ENTRANCES
 *     (the element decelerates into its resting place — feels intentional)
 *   - "ease-in-*"  curves: slow start, fast end → great for EXITS
 *     (the element accelerates away — feels purposeful)
 *   - "ease-in-out-*" curves: symmetric → great for STATE CHANGES
 *     (something morphing/transforming continuously)
 *   - "back" curves: overshoot then settle → great for EMPHASIS
 *     (a moment of "punch")
 */
export const bezier = {
  // Entrances — fast in, slow settle (the Stripe staple)
  enterExpo:    [0.16, 1.00, 0.30, 1.00] as const, // dramatic deceleration
  enterQuart:   [0.25, 1.00, 0.50, 1.00] as const, // softer deceleration
  enterCirc:    [0.00, 0.55, 0.45, 1.00] as const, // mechanical, precise

  // Exits — slow start, accelerate away
  exitExpo:     [0.70, 0.00, 0.84, 0.00] as const,
  exitQuart:    [0.50, 0.00, 0.75, 0.00] as const,

  // Continuous / morphs — symmetric
  smooth:       [0.45, 0.05, 0.55, 0.95] as const, // gentle in/out
  swift:        [0.65, 0.00, 0.35, 1.00] as const, // crisp in/out

  // Emphasis — overshoot then settle (used SPARINGLY — for brand moments)
  backSubtle:   [0.34, 1.20, 0.64, 1.00] as const,
  backStrong:   [0.34, 1.56, 0.64, 1.00] as const,

  // Anticipation (rare) — pull back before going forward
  anticipate:   [0.68, -0.55, 0.27, 1.55] as const,
} as const;

/**
 * Pre-built Easing functions, ready to drop into interpolate().
 * This is what scenes/components consume 95% of the time.
 */
export const easings = {
  // Default vocabulary
  enter:      Easing.bezier(...bezier.enterExpo),
  enterSoft:  Easing.bezier(...bezier.enterQuart),
  enterCrisp: Easing.bezier(...bezier.enterCirc),

  exit:       Easing.bezier(...bezier.exitExpo),
  exitSoft:   Easing.bezier(...bezier.exitQuart),

  smooth:     Easing.bezier(...bezier.smooth),
  swift:      Easing.bezier(...bezier.swift),

  emphasis:   Easing.bezier(...bezier.backSubtle),
  punch:      Easing.bezier(...bezier.backStrong),

  anticipate: Easing.bezier(...bezier.anticipate),

  // Microbreathing — used for sin-based oscillations
  breathe:    Easing.inOut(Easing.sin),
} as const;
