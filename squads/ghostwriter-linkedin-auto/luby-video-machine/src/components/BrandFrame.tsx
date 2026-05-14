/**
 * BrandFrame (v4 — theme + mode aware)
 *
 * Persistent overlay across the entire video:
 *   - Top-left:    Luby logo (corporate) or speaker block (personal)
 *   - Top-right:   Language badge (PT-BR / EN-US)
 *   - Bottom-strip: Polished gradient progress bar with glow head
 *   - Bottom-right (personal only): Subtle "made @ Luby" signature
 *
 * v3 added theme-awareness (light/dark cross-fade).
 * v4 adds mode-awareness (premium/minimal cross-fade):
 *   - In minimal mode the progress bar's glow head is suppressed
 *   - The lang badge loses backdrop-blur (becomes a flat outlined badge)
 *   - The logo top-left stops idle-breathing
 *   All three changes tween via useMinimalness() so the transition is
 *   continuous, never a hard cut.
 *
 * The two cross-fades (theme + mode) are independent. A scene can be
 * minimal-dark, minimal-light, premium-dark, or premium-light; the
 * BrandFrame chrome adapts to BOTH axes simultaneously.
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { colors, fonts, weights, space, gradients, themes } from '../design/tokens';
import { easings } from '../design/easings';
import { breathe } from '../design/motion';
import { lightOverlayOpacity } from '../design/theme';
import { useMinimalness } from '../renderer/ModeContext';
import { Logo } from './Logo';
import type { CommonProps } from '../compositions/types';

interface Props extends CommonProps {
  langBadge: string;
  children: React.ReactNode;
}

export const BrandFrame: React.FC<Props> = ({
  mode,
  langBadge,
  speaker,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Frame elements fade in over the first ~1s, after the intro logo lands
  const frameOpacity = interpolate(
    frame,
    [12, 36],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter }
  );

  // Progress bar
  const progress = frame / durationInFrames;
  const progressBreath = breathe({ frame, fps, speed: 0.5, min: 0.7, max: 1 });

  // Theme blend factor: 0 = full dark, 1 = full light. Used to crossfade the
  // logo variant and tween the badge palette. The schedule lives in
  // design/timeline.ts; this component just consumes the resolved factor.
  const lightT = lightOverlayOpacity(frame);
  const darkBadge = themes.dark;
  const lightBadge = themes.light;

  // Mode blend factor: 0 = full premium, 1 = full minimal. Used to suppress
  // chrome decorations during minimal windows. Cross-faded across
  // MODE_FADE_FRAMES (6) on each boundary so chrome changes are seamless.
  const minimalT = useMinimalness();
  // Inverted helper — most chrome decorations only render in PREMIUM, so
  // we multiply opacity / size by `premiumT` to fade them out as we enter
  // minimal. (Keeps the mounting structure constant across the whole video,
  // which is what Remotion likes.)
  const premiumT = 1 - minimalT;

  return (
    <AbsoluteFill>
      {children}

      <AbsoluteFill style={{ opacity: frameOpacity, pointerEvents: 'none' }}>
        {/* ── Top-left brand block ─────────────────────────────────────────
            Logo crossfade: both variants are mounted on top of each other,
            opacity controlled by the theme blend factor. Avoids the PNG/SVG
            swap flicker that a conditional render would cause. */}
        <div
          style={{
            position: 'absolute',
            top: space.lg,
            left: space.lg,
            display: 'flex',
            alignItems: 'center',
            gap: space.sm,
          }}
        >
          {mode === 'corporate' ? (
            <div style={{ position: 'relative' }}>
              {/* idleBreathe is suppressed in minimal — chrome stays static.
                  We toggle on premiumT crossing 0.5 because Logo's breathe
                  is internal sin-wave; ramping its amplitude per-frame
                  would require Logo's API to take a `breatheIntensity`
                  prop. Hard-toggle is hidden by the TransitionFlash. */}
              <div style={{ opacity: 1 - lightT }}>
                <Logo variant="white" height={42} idleBreathe={premiumT > 0.5} />
              </div>
              {lightT > 0 && (
                <div style={{ position: 'absolute', inset: 0, opacity: lightT }}>
                  <Logo variant="navy" height={42} idleBreathe={premiumT > 0.5} />
                </div>
              )}
            </div>
          ) : (
            <SpeakerBadge speaker={speaker} />
          )}
        </div>

        {/* ── Top-right language badge ─────────────────────────────────────
            Personal mode: suppressed entirely (per directive 2026-05).
            Personal videos carry NO Luby chrome at all — including the
            lang badge — so the colaborador's repost looks native to
            their own profile.

            Corporate mode: two axes of cross-fade
              - theme (lightT)   → text/border/background palette
              - mode  (minimalT) → backdrop-blur amount + boxShadow halo
            Minimal vocabulary wants a flat outlined chip, no glassy blur. */}
        {mode === 'corporate' && (
          <div
            style={{
              position: 'absolute',
              top: space.lg,
              right: space.lg,
              fontFamily: fonts.mono,
              fontSize: 14,
              fontWeight: weights.regular,
              letterSpacing: '0.2em',
              color: lightT > 0.5 ? lightBadge.badgeText : darkBadge.badgeText,
              padding: '8px 14px',
              border: `1px solid ${lightT > 0.5 ? lightBadge.badgeBorder : darkBadge.badgeBorder}`,
              borderRadius: 4,
              background: lightT > 0.5 ? lightBadge.badgeBg : darkBadge.badgeBg,
              backdropFilter: `blur(${8 * premiumT}px)`,
              boxShadow: premiumT > 0.01
                ? (lightT > 0.5
                    ? `0 0 ${20 * premiumT}px rgba(15, 35, 65, ${0.06 * premiumT})`
                    : `0 0 ${20 * premiumT}px ${colors.glow10}`)
                : 'none',
              transition: 'none',
            }}
          >
            {langBadge}
          </div>
        )}

        {/* Progress bar removed as project default (2026-05): 30s LinkedIn
            videos don't need a progress indicator. Was visually noisy and
            took bottom-strip real estate that scenes can now use. The
            `progress` and `progressBreath` variables above are kept (cheap)
            in case someone wants to reintroduce a discrete progress
            indicator inside a scene's content. */}

        {/* Personal mode bottom-right "made @ Luby" signature removed
            2026-05: directive that personal videos must carry NO Luby
            branding (only the speaker identity matters). The speaker
            badge top-left stays — that's the colaborador's voice, not
            Luby chrome. */}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SpeakerBadge: React.FC<{ speaker?: { name: string; role: string; avatarUrl?: string } }> = ({
  speaker,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ringBreath = breathe({ frame, fps, speed: 0.4, min: 0.5, max: 1 });

  if (!speaker) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative' }}>
        {/* Outer glow ring */}
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.glow40} 0%, transparent 70%)`,
            opacity: ringBreath,
            filter: 'blur(6px)',
          }}
        />
        <div
          style={{
            position: 'relative',
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.blue}, ${colors.navy})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fonts.display,
            fontWeight: weights.semibold,
            fontSize: 20,
            color: colors.white,
            border: `2px solid ${colors.whiteA20}`,
          }}
        >
          {speaker.name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.semibold,
            fontSize: 18,
            color: colors.white,
            letterSpacing: '-0.01em',
          }}
        >
          {speaker.name}
        </span>
        <span
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.regular,
            fontSize: 14,
            color: colors.gray400,
          }}
        >
          {speaker.role}
        </span>
      </div>
    </div>
  );
};
