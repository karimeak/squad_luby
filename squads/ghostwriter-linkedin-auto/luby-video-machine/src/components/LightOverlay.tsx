/**
 * LightOverlay
 *
 * Persistent overlay that crossfades the video into the light theme during
 * scheduled windows. The schedule can come from two places:
 *
 *   1. Per-video `schedule` prop (recommended) — driven by the loaded
 *      VideoSpec's `themeSchedule` field. This is what VideoRenderer
 *      passes through.
 *
 *   2. Falling back to the legacy `THEME_SCHEDULE` constant in
 *      `design/timeline.ts` — kept for backwards compat with components
 *      that still render LightOverlay without props (e.g. the old
 *      DemoVideo composition pre-schema migration).
 *
 * Sits ABOVE the dark BackgroundAtmosphere and BELOW the scene content. So
 * any scene that runs during a "light window" automatically renders against
 * a soft off-white surface, and goes back to dark on either side.
 *
 * The light surface itself is layered just like the dark atmosphere:
 *   - Base off-white surface
 *   - Soft cool gradient bias
 *   - Subtle dot grid (very low contrast on light)
 *   - Edge vignette inverted (light fades to slightly cooler at edges)
 *
 * That way the "light scene" still has texture and depth, not a flat
 * PowerPoint slide.
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { themes } from '../design/tokens';
import { lightOverlayOpacity } from '../design/theme';
import { THEME_FADE_FRAMES, type ThemeWindow } from '../design/timeline';

interface Props {
  /**
   * Per-video theme schedule. Each entry marks a frame window during
   * which the light overlay is active. If omitted, falls back to the
   * legacy project-wide THEME_SCHEDULE.
   */
  schedule?: ThemeWindow[];
}

/**
 * Pure variant of lightOverlayOpacity that accepts a schedule explicitly
 * (instead of reading the module-level THEME_SCHEDULE constant). Used
 * when a per-video schedule is in play.
 */
const opacityFromSchedule = (frame: number, schedule: ThemeWindow[]): number => {
  for (const win of schedule) {
    if (win.theme !== 'light') continue;
    const fadeInStart = win.from - THEME_FADE_FRAMES;
    const fadeOutEnd = win.to + THEME_FADE_FRAMES;
    if (frame < fadeInStart || frame >= fadeOutEnd) continue;
    if (frame < win.from) return (frame - fadeInStart) / THEME_FADE_FRAMES;
    if (frame < win.to) return 1;
    return 1 - (frame - win.to) / THEME_FADE_FRAMES;
  }
  return 0;
};

export const LightOverlay: React.FC<Props> = ({ schedule }) => {
  const frame = useCurrentFrame();
  const opacity = schedule
    ? opacityFromSchedule(frame, schedule)
    : lightOverlayOpacity(frame);

  // Skip render entirely when the overlay is fully transparent.
  // (Saves a few GPU cycles across the dark majority of the video.)
  if (opacity <= 0) return null;

  const t = themes.light;

  // Slight drift on the cool gradient, same vocabulary as BackgroundAtmosphere
  const driftX = interpolate(frame, [0, 900], [0, 18]);

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none' }}>
      {/* Layer 1 — base off-white */}
      <AbsoluteFill style={{ background: t.bg }} />

      {/* Layer 2 — soft cool radial bias (gives the surface depth) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 90% at 50% 45%, rgba(65, 160, 220, 0.06) 0%, transparent 65%)`,
        }}
      />

      {/* Layer 3 — extremely subtle dot grid (whisper of texture) */}
      <AbsoluteFill
        style={{
          opacity: 0.35,
          backgroundImage: `radial-gradient(circle, rgba(15, 35, 65, 0.08) 1px, transparent 1.2px)`,
          backgroundSize: '64px 64px',
          backgroundPosition: `${driftX}px 0px`,
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)',
        }}
      />

      {/* Layer 4 — edge vignette (subtle cooler edges) */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(15, 35, 65, 0.08) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
