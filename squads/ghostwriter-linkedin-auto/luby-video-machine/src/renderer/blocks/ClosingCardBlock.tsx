/**
 * ClosingCardBlock — renders a `kind: 'closing-card'` block.
 *
 * The full visual structure of the CTA scene as ONE block:
 *
 *   [ EYEBROW (mono, blue, tracked) ]    ← optional, omits if not provided
 *        ────                              ← short accent line
 *   Headline (display, semibold)           ← the brand message
 *           Luby                           ← logo wordmark with bloom halo
 *   + warm radial bloom in the background
 *
 * Why a macro-block? The CTA pattern recurs across videos (every closing
 * frame is voice → message → mark) and packaging it into one block keeps
 * the schema readable. Authors who want a different closing layout can
 * still compose the underlying primitives manually with eyebrow + accent
 * + tagline + logo-mark blocks.
 *
 * INTERNAL CHOREOGRAPHY (anchored to startFrame):
 *   t=0   background bloom begins growing
 *   t+6   eyebrow mask-reveals
 *   t+12  top accent line draws
 *   t+18  headline mask-reveals up
 *   t+30  logo wordmark reveals with halo bloom
 *   t+42  optional URL text fades in below the logo (if `urlText` set)
 *
 * Hold: halo breathes, bloom oscillates. The block has no exit by
 * default — CTA is the last scene and the video ends with the card
 * fully on screen.
 *
 * The optional `urlText` prop renders a small mono-font line under the
 * logo for videos where a specific landing URL must be visible. Default
 * is OFF — the logo alone implies the brand homepage; only opt in when
 * driving traffic to a specific landing.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Logo } from '../../components/Logo';
import { LineDraw } from '../../components/LineDraw';
import { MaskReveal } from '../../components/MaskReveal';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion, breathe } from '../../design/motion';
import { useCurrentMode } from '../ModeContext';
import { useThemeTokens } from '../ThemeContext';
import { useCurrentAccountMode } from '../AccountModeContext';
import type { ClosingCardBlock as ClosingCardBlockSpec } from '../../schema/types';

interface Props {
  block: ClosingCardBlockSpec;
  startFrame: number;
  exitFrame?: number; // typically undefined — CTA holds until the end
}

export const ClosingCardBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mode = useCurrentMode();
  const theme = useThemeTokens();
  // Personal mode: NO Luby branding. The closing-card still shows the
  // eyebrow + headline + URL but the Luby wordmark is suppressed.
  const accountMode = useCurrentAccountMode();
  const showLubyLogo = accountMode === 'corporate';

  // Internal beat anchors — same numbers the v3.1 CTAScene used
  const tBloom    = startFrame;
  const tEyebrow  = startFrame + 6;
  const tAccent   = startFrame + 12;
  const tHeadline = startFrame + 18;
  const tLogo     = startFrame + 30;
  // tUrl + urlP + urlExitP intentionally removed 2026-05 — the URL
  // text is no longer rendered in the closing-card by project rule.
  // See the explanatory block at the bottom of the return().

  // Background bloom — grows during the CTA, gives warmth.
  // Suppressed entirely in minimal mode (minimal has no element-blooms).
  const bloomP = interpolate(
    frame,
    [tBloom, tBloom + motion.enterDramatic + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const bloomBreath = breathe({ frame, fps, speed: 0.3, min: 0.7, max: 1 });
  const showBloom = mode === 'luby-premium';

  // Eyebrow letter-tracking settles after entrance
  const eyebrowP = interpolate(
    frame,
    [tEyebrow, tEyebrow + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const eyebrowTracking = interpolate(eyebrowP, [0, 1], [0.5, 0.34]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: gap.elements, // 24px between sibling pieces
        position: 'relative',
      }}
    >
      {/* Background bloom — sits behind everything */}
      {showBloom && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: 1600,
            height: 1600,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.glow40} 0%, ${colors.glow20} 25%, ${colors.glow05} 50%, transparent 70%)`,
            opacity: bloomP * bloomBreath,
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Eyebrow — optional */}
      {block.eyebrow && (
        <MaskReveal enterAt={tEyebrow} exitAt={exitFrame} direction="up" translate={8}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 16,
              fontWeight: weights.regular,
              letterSpacing: `${eyebrowTracking}em`,
              color: colors.blueBright,
              textTransform: 'uppercase',
              textShadow: showBloom ? `0 0 24px ${colors.glow60}` : undefined,
            }}
          >
            {block.eyebrow}
          </div>
        </MaskReveal>
      )}

      {/* Top accent line */}
      <LineDraw
        width={48}
        thickness={2}
        color={colors.blueBright}
        enterAt={tAccent}
        exitAt={exitFrame}
        glow={showBloom}
      />

      {/* Headline */}
      <MaskReveal enterAt={tHeadline} exitAt={exitFrame} direction="up" translate={28}>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.semibold,
            fontSize: 72,
            textAlign: 'center',
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
            color: theme.fg,
            maxWidth: 1500,
            textShadow: showBloom && theme.name !== 'light' ? `0 0 60px ${colors.glow30}` : undefined,
          }}
        >
          {block.headline}
        </div>
      </MaskReveal>

      {/* Logo signature — variant adapts to theme. SUPPRESSED in
          personal account mode: directive is that personal videos
          carry no Luby branding (only the speaker identity from the
          BrandFrame top-left). */}
      {showLubyLogo && (
        <Logo
          variant={theme.logoVariant}
          height={block.logoHeight ?? 140}
          animated
          startFrame={tLogo}
          exitFrame={exitFrame}
          idleBreathe={showBloom}
        />
      )}

      {/* URL text is NEVER rendered in the closing-card (project rule
          2026-05). Directive from Cleidson: the closing scene should
          stay clean — eyebrow + headline + logo (corporate) only.
          The URL belongs in the LinkedIn post copy, not on the video.

          The `urlText` field is kept in the schema for backward-compat
          with older specs but the renderer ignores it. To force a URL
          on screen for an exceptional case, use a separate text block
          inside the CTA scene with explicit position. */}
    </div>
  );
};
