/**
 * MinimalOverlay
 *
 * Persistent overlay that paints surface0 + subtle craft texture during
 * frames where active visual mode is luby-minimal. Sits ABOVE the
 * BackgroundAtmosphere (always mounted) and BELOW scene content.
 *
 * v2 (2026-05): "minimal" is no longer flat-flat. Cleidson rejected
 * the first version as "sem carinho". The new minimal has:
 *   - solid surface0 base (the "minimal" part — no atmospheric glows)
 *   - very subtle radial vignette (depth without distraction)
 *   - whisper-tone dot grid (micro-texture, ~5% intensity vs premium 45%)
 *
 * The principle: minimal = restrained craft, not absence of craft.
 * Premium has ambient orbs, mesh gradients, breath. Minimal has the
 * BARE MINIMUM elements that still feel designed — texture you don't
 * notice unless you look, but registers subliminally as "deliberate".
 *
 * Cross-fade: MODE_FADE_FRAMES (6f) on each boundary — same window the
 * mode-tween hook uses.
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { colors } from '../design/tokens';
import { useMinimalness } from '../renderer/ModeContext';

export const MinimalOverlay: React.FC = () => {
  const opacity = useMinimalness();
  const frame = useCurrentFrame();

  // Skip render entirely when fully invisible — saves a paint per frame
  // across the long premium stretches of the video.
  if (opacity <= 0) return null;

  // Slow drift on the dot texture for "alive" feel (matches the v3
  // premium dot grid drift cadence, just much subtler tone).
  const driftX = interpolate(frame, [0, 900], [0, 16]);
  const driftY = interpolate(frame, [0, 900], [0, -10]);

  return (
    <AbsoluteFill aria-hidden style={{ opacity, pointerEvents: 'none' }}>
      {/* Layer 1: solid surface0 base */}
      <AbsoluteFill style={{ background: colors.surface0 }} />

      {/* Layer 2: subtle radial vignette — focuses center without drawing
          attention. Edge fades to slightly DEEPER (almost-black) navy. */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      {/* Layer 3: whisper-tone dot grid — barely visible. The "craft"
          element. ~5% opacity vs premium's 45% — registers subliminally
          as "designed surface" without distracting. */}
      <AbsoluteFill
        style={{
          opacity: 0.18,
          backgroundImage: `radial-gradient(circle, rgba(65, 160, 220, 0.35) 1px, transparent 1.2px)`,
          backgroundSize: '72px 72px',
          backgroundPosition: `${driftX}px ${driftY}px`,
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
