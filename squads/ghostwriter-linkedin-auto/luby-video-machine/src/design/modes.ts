/**
 * modes.ts — visual mode system (luby-premium vs luby-minimal).
 *
 * A "mode" is a VISUAL VOCABULARY — a coordinated set of choices about:
 *   - icon style (stroke width, glow on/off, idle breathing)
 *   - text weight defaults
 *   - motion feel (faster/punchier vs slower/softer)
 *   - decorative layers (orbs, dot grid, vignette)
 *
 * Themes (light/dark) and modes (premium/minimal) are ORTHOGONAL axes:
 *   theme  → palette (which colors)
 *   mode   → vocabulary (how things move and feel)
 *
 * The Luby brand palette stays the same in both modes. What changes is
 * intensity and motion grammar.
 *
 * IMPORTANT (v2 update 2026-05): Minimal mode was REDESIGNED after first
 * usage proved "flat-flat" felt sem craft. New principle: **minimal is
 * restrained craft, not absence of craft**. Icons get soft glow + breath,
 * text uses semibold (not bold), motion uses same 18f enter as premium
 * (not 6f punch). The DIFFERENCE between modes is now:
 *   - premium: ambient orbs, mesh gradients, full element blooms
 *   - minimal: surface0 base, micro-texture, soft halos on hero elements
 * Both have craft. Minimal just has fewer atmospheric layers.
 *
 * MODE SCHEDULE
 * ─────────────
 * The active mode at any given frame is determined by the LOADED VIDEO'S
 * scene list. The renderer derives a flat MODE_SCHEDULE from
 * `videoSpec.scenes[].mode` and stores it in a React context. Components
 * that need to react to the current mode (BrandFrame, MinimalOverlay,
 * Icon) read from that context.
 *
 * If no schedule is provided (e.g. a component renders outside the
 * VideoRenderer for testing), we fall back to 'luby-premium' for the
 * whole timeline — the safest default since premium == the original
 * project look.
 */

import { motion } from './motion';
import { easings } from './easings';
import { weights } from './tokens';

// ─── Mode types ─────────────────────────────────────────────────────────────

export type VisualMode = 'luby-premium' | 'luby-minimal';

/**
 * Per-mode preset. Defaults that components can read instead of
 * hardcoding "in mode X, use stroke 1.75". The values here are the
 * RECOMMENDED defaults — components are still free to override per-call.
 */
export interface ModePreset {
  name: VisualMode;

  // ── Iconography ─────────────────────────────────────────────────────
  icon: {
    /** Lucide stroke width. */
    strokeWidth: number;
    /** Whether icons glow / drop-shadow by default. */
    glow: boolean;
    /** Whether icons subtly pulse while held on screen. */
    idleBreathe: boolean;
    /**
     * Default Icon component preset for this mode.
     * Premium picks up `bloom` (halo + scale); minimal picks `pop`
     * (clean scale, no halo).
     */
    defaultPreset: 'draw' | 'pop' | 'bloom' | 'slide' | 'fade';
  };

  // ── Typography defaults ─────────────────────────────────────────────
  text: {
    /** Default font weight for keyword/headline text. */
    weight: number;
    /**
     * Whether text uses microscopic letter-spacing animation on entry.
     * Premium yes (settles into place), minimal no (snaps in).
     */
    animatedTracking: boolean;
  };

  // ── Motion feel ─────────────────────────────────────────────────────
  motion: {
    /** Default enter duration in frames for this mode's elements. */
    enterDuration: number;
    /** Default easing function name (resolved at use site). */
    enterEasing: typeof easings[keyof typeof easings];
    /** Whether elements idle-animate (breathe / drift) while on screen. */
    idleMotion: boolean;
  };

  // ── Decorations ─────────────────────────────────────────────────────
  decorations: {
    /** Show ambient glow orbs in the background. */
    orbs: boolean;
    /** Show dot grid texture in the background. */
    dotGrid: boolean;
    /** Show edge vignette. */
    vignette: boolean;
    /** Allow blooms/glows around hero elements (logo halo, headline shadow). */
    elementBlooms: boolean;
  };

  // ── Frame chrome behavior ───────────────────────────────────────────
  chrome: {
    /** Whether the BrandFrame's progress bar carries a glow head. */
    progressBarGlow: boolean;
    /** Whether the BrandFrame's lang badge uses backdrop-blur. */
    badgeBackdropBlur: boolean;
    /** Whether the BrandFrame's logo top-left idle-breathes. */
    logoBreathe: boolean;
  };
}

// ─── The actual presets ────────────────────────────────────────────────────

export const modes: Record<VisualMode, ModePreset> = {
  'luby-premium': {
    name: 'luby-premium',
    icon: {
      strokeWidth: 2,
      glow: true,
      idleBreathe: true,
      defaultPreset: 'bloom',
    },
    text: {
      weight: weights.semibold,
      animatedTracking: true,
    },
    motion: {
      enterDuration: motion.enter,    // 18f
      enterEasing: easings.enter,
      idleMotion: true,
    },
    decorations: {
      orbs: true,
      dotGrid: true,
      vignette: true,
      elementBlooms: true,
    },
    chrome: {
      progressBarGlow: true,
      badgeBackdropBlur: true,
      logoBreathe: true,
    },
  },

  'luby-minimal': {
    name: 'luby-minimal',
    icon: {
      strokeWidth: 1.85,                // slightly heavier than v1 — reads better at small sizes
      glow: true,                       // SOFT glow (drop-shadow at 50% premium intensity)
      idleBreathe: true,                // subtle breath restored — minimal ≠ static
      defaultPreset: 'pop',
    },
    text: {
      weight: weights.semibold,         // semibold (600), down from bold (700) — bold was visually heavy
      animatedTracking: false,
    },
    motion: {
      enterDuration: motion.enter,     // 18f — match premium for parity (v1 was 6f, too punchy/raw)
      enterEasing: easings.emphasis,   // keep overshoot for the "snappy" feel
      idleMotion: true,                // breath restored — coherent with premium
    },
    decorations: {
      orbs: false,
      dotGrid: false,
      vignette: false,
      elementBlooms: false,
    },
    chrome: {
      progressBarGlow: false,
      badgeBackdropBlur: false,
      logoBreathe: false,
    },
  },
};

// ─── Schedule (derived from a loaded video's scenes) ──────────────────────

/**
 * A window during which a single mode is active. Multiple windows form
 * the MODE_SCHEDULE for a video. Built by the renderer from the video's
 * scene list.
 */
export interface ModeWindow {
  mode: VisualMode;
  /** Frame the window opens (inclusive). */
  from: number;
  /** Frame the window closes (exclusive). */
  to: number;
}

/**
 * Build a MODE_SCHEDULE from a video's scenes.
 *
 * Each scene contributes a window [scene.enter.at, scene.exit.at]. If
 * consecutive scenes share the same mode, their windows are MERGED so
 * the schedule has the minimum number of entries. That keeps mode
 * transitions cleanly aligned to actual changes, not to scene
 * boundaries (which the renderer also uses for transition flashes).
 *
 * Last scene without an `exit` extends to `totalFrames`.
 */
export const buildModeSchedule = (
  scenes: Array<{ mode: VisualMode; enter: { at: number }; exit?: { at: number } }>,
  totalFrames: number,
): ModeWindow[] => {
  if (scenes.length === 0) return [];

  // Collect raw per-scene windows
  const raw: ModeWindow[] = scenes.map((scene, i) => {
    const next = scenes[i + 1];
    const to = scene.exit?.at ?? next?.enter.at ?? totalFrames;
    return { mode: scene.mode, from: scene.enter.at, to };
  });

  // Merge consecutive same-mode windows
  const merged: ModeWindow[] = [];
  for (const w of raw) {
    const last = merged[merged.length - 1];
    if (last && last.mode === w.mode && last.to >= w.from) {
      last.to = Math.max(last.to, w.to);
    } else {
      merged.push({ ...w });
    }
  }

  return merged;
};

/**
 * Resolve which mode is active at the given frame, given a schedule.
 *
 * Returns 'luby-premium' as a safe default if the frame falls outside
 * any defined window (shouldn't happen with a well-formed video but the
 * fallback keeps things rendering instead of throwing).
 */
export const resolveMode = (frame: number, schedule: ModeWindow[]): VisualMode => {
  for (const w of schedule) {
    if (frame >= w.from && frame < w.to) return w.mode;
  }
  return 'luby-premium';
};

/**
 * Frames around a mode boundary where a TransitionFlash should fire.
 * Returns the centre frame of each premium↔minimal change.
 *
 * Used by the renderer when `videoSpec.transitions` is undefined to
 * auto-insert flashes. Authors who want to suppress transitions can
 * pass `transitions: []` in the schema.
 */
export const findModeBoundaries = (schedule: ModeWindow[]): number[] => {
  const boundaries: number[] = [];
  for (let i = 1; i < schedule.length; i++) {
    if (schedule[i].mode !== schedule[i - 1].mode) {
      boundaries.push(schedule[i].from);
    }
  }
  return boundaries;
};

/**
 * Compute a 0..1 "minimal-ness" factor at the given frame, with a short
 * cross-fade on each boundary. Used by components that want to TWEEN
 * properties between modes (e.g. BrandFrame's progress bar glow).
 *
 * Components that don't need tweening (e.g. SyncWord) can use
 * resolveMode() directly and get a hard preset.
 */
export const MODE_FADE_FRAMES = 6;

export const minimalness = (frame: number, schedule: ModeWindow[]): number => {
  const minimalWindows = schedule.filter((w) => w.mode === 'luby-minimal');
  let max = 0;
  for (const w of minimalWindows) {
    const fadeInStart = w.from - MODE_FADE_FRAMES;
    const fadeOutEnd = w.to + MODE_FADE_FRAMES;
    if (frame < fadeInStart || frame >= fadeOutEnd) continue;
    if (frame < w.from) {
      max = Math.max(max, (frame - fadeInStart) / MODE_FADE_FRAMES);
    } else if (frame < w.to) {
      max = 1;
      break;
    } else {
      max = Math.max(max, 1 - (frame - w.to) / MODE_FADE_FRAMES);
    }
  }
  return max;
};
