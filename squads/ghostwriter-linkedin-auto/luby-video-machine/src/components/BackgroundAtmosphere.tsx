/**
 * BackgroundAtmosphere
 *
 * The foundation layer. Replaces the old single-layer BackgroundDots
 * with FOUR stacked planes that create real depth:
 *
 *   1. Base hero gradient    (deepest navy with radial bias)
 *   2. Ambient glow orbs     (drifting lights, slow breathing)
 *   3. Dot grid              (the texture, slowly drifting)
 *   4. Vignette              (edge darkening — pulls focus center)
 *
 * Optional: a "scene tint" prop lets specific scenes shift the
 * atmosphere subtly (e.g. brighter for hero moments, deeper for hooks).
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { colors } from '../design/tokens';
import { GlowOrb } from './GlowOrb';

interface Props {
  /** 0..1, modulates the brightness of ambient glows */
  intensity?: number;
  /** Hero scenes: bias the gradient center brighter */
  hero?: boolean;
}

export const BackgroundAtmosphere: React.FC<Props> = ({
  intensity = 1,
  hero = false,
}) => {
  const frame = useCurrentFrame();

  // Slow drift on the dot grid — barely perceptible, purely for "alive" feel
  const driftX = interpolate(frame, [0, 900], [0, 22]);
  const driftY = interpolate(frame, [0, 900], [0, -14]);

  // The hero gradient subtly animates its radial center
  const heroX = interpolate(frame, [0, 900], [48, 52]);
  const heroY = interpolate(frame, [0, 900], [50, 48]);

  return (
    <AbsoluteFill>
      {/* Layer 1 — base hero gradient */}
      <AbsoluteFill
        style={{
          background: hero
            ? `radial-gradient(ellipse 70% 90% at ${heroX}% ${heroY}%, ${colors.navy} 0%, ${colors.navyDark} 50%, ${colors.surface0} 100%)`
            : `radial-gradient(ellipse 60% 80% at 50% 50%, ${colors.navyMuted} 0%, ${colors.navyDark} 60%, ${colors.surface0} 100%)`,
        }}
      />

      {/* Layer 2 — ambient glow orbs (multiple, breathing on different phases) */}
      <AbsoluteFill>
        <GlowOrb
          x="20%"
          y="25%"
          size={900}
          color={colors.glow30}
          intensity={intensity}
          breatheSpeed={0.18}
          breatheRange={[0.6, 1]}
          phase={0}
        />
        <GlowOrb
          x="85%"
          y="80%"
          size={1100}
          color={colors.glow20}
          intensity={intensity * 0.8}
          breatheSpeed={0.12}
          breatheRange={[0.7, 1]}
          phase={Math.PI}
        />
        <GlowOrb
          x="60%"
          y="40%"
          size={600}
          color={colors.brightGlow30}
          intensity={intensity * 0.5}
          breatheSpeed={0.22}
          breatheRange={[0.5, 1]}
          phase={Math.PI / 2}
        />
      </AbsoluteFill>

      {/* Layer 3 — dot grid texture */}
      <AbsoluteFill
        style={{
          opacity: 0.45,
          backgroundImage: `radial-gradient(circle, ${colors.whiteA10} 1px, transparent 1.2px)`,
          backgroundSize: `64px 64px`,
          backgroundPosition: `${driftX}px ${driftY}px`,
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        }}
      />

      {/* Layer 4 — edge vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 50%, ${colors.blackA40} 100%)`,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
