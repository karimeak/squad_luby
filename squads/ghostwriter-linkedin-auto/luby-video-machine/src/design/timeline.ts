/**
 * TIMELINE — the master schedule.
 *
 * Defines WHEN each scene enters, holds, and exits.
 * Scenes overlap intentionally: as one is exiting, the next is already
 * entering, with shared elements morphing between them. This is what
 * gives the "continuous flow" feel instead of slide-deck transitions.
 *
 * Total: 900 frames @ 30fps = 30.0 seconds.
 *
 * To add a new scene: define a SceneSpec, add it to SCENES, and the
 * total duration check below will warn if you're over budget.
 */

import { motion, beats } from './motion';

/**
 * SCENE_BREATH — frames of "tomada de fôlego" added between the moment a
 * scene's window opens and the moment its content actually starts entering.
 *
 * The TIMELINE windows still overlap (so the master schedule reads as a
 * continuous flow), but inside each scene the elements wait SCENE_BREATH
 * frames before animating in. This gives the previous scene's exit time
 * to fully resolve before new content lands on top — visually, you don't
 * see scene A's "vs" symbol still fading while scene B's title is already
 * mask-revealing.
 *
 * Math: with motion.exit = 12f, a 12-frame breath means the previous
 * scene is fully out (opacity 0) at the same moment the next one starts
 * entering. That's the cleanest hand-off without adding dead-air frames.
 *
 * Usage in a scene:
 *
 *   const enterAt = TIMELINE.bullets.enter.at + SCENE_BREATH;
 *   // ... drive all child entrances from enterAt instead of bullets.enter.at
 *
 * The IntroScene is the exception (no scene before it, so no breath).
 */
export const SCENE_BREATH = 12;

export interface SceneSpec {
  name: string;
  enter: { at: number; duration: number };
  exit?: { at: number; duration: number };
  /** Frame at which this scene "owns" the screen — useful for nested timing. */
  pivot: number;
}

/**
 * The choreography:
 *
 *   IntroScene    [0 ────── 80]
 *   HookScene          [60 ──────────── 220]
 *   BulletsScene             [200 ──────────────────── 600]
 *   StatScene                                  [580 ──────── 760]
 *   CTAScene                                          [740 ────── 900]
 *
 * Overlap windows (~20f each) are where morphing transitions happen.
 */
export const TIMELINE = {
  intro: {
    name: 'intro',
    enter:  { at: 0,   duration: motion.enterDramatic }, // 30f
    exit:   { at: 60,  duration: motion.exit },          // 12f → fully out at 72
    pivot:  40,
  } satisfies SceneSpec,

  hook: {
    name: 'hook',
    enter:  { at: 60,  duration: motion.enterSlow },     // overlaps intro exit
    exit:   { at: 200, duration: motion.exit },
    pivot:  130,
  } satisfies SceneSpec,

  bullets: {
    name: 'bullets',
    enter:  { at: 200, duration: motion.enter },
    exit:   { at: 580, duration: motion.exit },
    pivot:  400,
  } satisfies SceneSpec,

  stat: {
    name: 'stat',
    enter:  { at: 580, duration: motion.enterSlow },
    exit:   { at: 740, duration: motion.exit },
    pivot:  670,
  } satisfies SceneSpec,

  cta: {
    name: 'cta',
    enter:  { at: 740, duration: motion.enterDramatic },
    pivot:  830,
    // No exit — the CTA holds until the end of the video
  } satisfies SceneSpec,
} as const;

export const TOTAL_FRAMES = 900;

/**
 * Theme schedule.
 *
 * Marks the frame windows during which the video flips to the light
 * theme. Outside these windows, the dark theme is the default.
 *
 * The transition between themes is automatically cross-faded over a
 * short window (`THEME_FADE_FRAMES`) at each boundary, so the change
 * never feels like a hard cut. We use the StatScene as the breath:
 * tension (Hook, dark) → process (Bullets, dark) → result (Stat, LIGHT)
 * → close (CTA, dark) reads as a structured arc.
 *
 * Why a *schedule* and not a per-scene flag? Theme is a property of the
 * video at frame T, not of any one scene. Cross-fading requires both
 * "before" and "after" themes to coexist briefly at the boundary, and a
 * single source of truth keeps that math in one place.
 */
export const THEME_FADE_FRAMES = 18;

export interface ThemeWindow {
  theme: 'light' | 'dark';
  /** Inclusive start frame of this window (after fade-in). */
  from: number;
  /** Exclusive end frame (fade-out begins THEME_FADE_FRAMES before this). */
  to: number;
}

export const THEME_SCHEDULE: ThemeWindow[] = [
  // Stat scene window — slightly wider than the scene itself so the fade
  // happens *during* the scene boundary, not in the middle of held content.
  { theme: 'light', from: TIMELINE.stat.enter.at, to: TIMELINE.stat.exit?.at ?? TIMELINE.cta.enter.at },
];
