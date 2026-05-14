/**
 * Theme resolution at a given frame.
 *
 * `currentTheme(frame)` returns:
 *   - `theme` — the dominant theme at this frame ('dark' or 'light')
 *   - `next` — the theme being faded TOWARDS, if mid-transition (else null)
 *   - `t` — 0..1 fade progress (0 = fully on `theme`, 1 = fully on `next`)
 *
 * Components that need to morph between themes should:
 *   1. Read `theme` (the "from" colour)
 *   2. Read `next` (the "to" colour, or fall back to `theme` if null)
 *   3. Interpolate between them using `t`
 *
 * Components that only show during a stable window can ignore `next`/`t`
 * and just consume the resolved `theme`.
 */

import { THEME_SCHEDULE, THEME_FADE_FRAMES, TOTAL_FRAMES } from './timeline';
import type { ThemeName } from './tokens';

export interface ResolvedTheme {
  theme: ThemeName;
  next: ThemeName | null;
  /** 0..1 progress towards `next`. 0 if no transition is active. */
  t: number;
}

/**
 * Resolve which theme is active at the given frame, and the fade progress
 * towards the next theme if we're in a boundary window.
 */
export const currentTheme = (frame: number): ResolvedTheme => {
  // Find the window the frame falls into (or the gap between windows).
  // Default theme is 'dark'.
  let activeTheme: ThemeName = 'dark';
  for (const win of THEME_SCHEDULE) {
    if (frame >= win.from && frame < win.to) {
      activeTheme = win.theme;
      break;
    }
  }

  // Detect proximity to a boundary so we can fade in / fade out.
  // A boundary fade-in: the THEME_FADE_FRAMES BEFORE a window's `from`.
  // A boundary fade-out: the THEME_FADE_FRAMES AFTER a window's `to`.
  // Within the fade band, return both `theme` (current) and `next` (target).
  for (const win of THEME_SCHEDULE) {
    // Fading IN to a light window
    const fadeInStart = win.from - THEME_FADE_FRAMES;
    if (frame >= fadeInStart && frame < win.from) {
      const t = (frame - fadeInStart) / THEME_FADE_FRAMES;
      return { theme: 'dark', next: win.theme, t };
    }
    // Fading OUT of a light window
    const fadeOutEnd = win.to + THEME_FADE_FRAMES;
    if (frame >= win.to && frame < fadeOutEnd) {
      const t = (frame - win.to) / THEME_FADE_FRAMES;
      return { theme: win.theme, next: 'dark', t };
    }
  }

  return { theme: activeTheme, next: null, t: 0 };
};

/**
 * Quick check: is a light overlay currently visible at the given frame?
 * Useful for gating `<LightOverlay>` mounting and BrandFrame inversions.
 */
export const lightOverlayOpacity = (frame: number): number => {
  for (const win of THEME_SCHEDULE) {
    if (win.theme !== 'light') continue;
    const fadeInStart = win.from - THEME_FADE_FRAMES;
    const fadeOutEnd  = win.to + THEME_FADE_FRAMES;
    if (frame < fadeInStart || frame >= fadeOutEnd) continue;

    if (frame < win.from) {
      // Fading in
      return (frame - fadeInStart) / THEME_FADE_FRAMES;
    }
    if (frame < win.to) {
      // Fully visible
      return 1;
    }
    // Fading out
    return 1 - (frame - win.to) / THEME_FADE_FRAMES;
  }
  return 0;
};

// Suppress unused-export warning for TOTAL_FRAMES (re-exported elsewhere)
void TOTAL_FRAMES;
