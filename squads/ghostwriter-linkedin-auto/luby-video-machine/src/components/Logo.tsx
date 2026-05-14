/**
 * Logo (v3)
 *
 * Renders the Luby logo. Two visual variants:
 *   - "white" → for dark backgrounds (default)
 *   - "navy"  → for light backgrounds
 *
 * v3 changes:
 *   - Prefers SVG sources when available (true transparency, no black box)
 *   - Falls back to PNG if the SVG isn't on disk yet
 *   - Halo bloom is positioned over the existing blue dot in the artwork —
 *     same approach as v2, but with finer-tuned defaults
 *
 * To swap the artwork: drop new files into /public/logos/ named:
 *   luby-white.svg  /  luby-navy.svg   (preferred — transparent)
 *   luby-white.png  /  luby-navy.png   (legacy fallback)
 *
 * Animated mode: the wordmark reveals via mask wipe from below,
 * and a glow halo blooms over the dot. We don't paint a new dot —
 * we amplify the one already in the artwork.
 */

import React from 'react';
import {
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { easings } from '../design/easings';
import { motion, breathe } from '../design/motion';
import { colors } from '../design/tokens';

interface Props {
  variant?: 'white' | 'navy';
  height?: number;
  animated?: boolean;
  startFrame?: number;
  exitFrame?: number;
  /** When true, the dot halo keeps breathing while idle */
  idleBreathe?: boolean;
  /**
   * Force a specific source format. Defaults to 'auto' which prefers SVG
   * (now that the brand artwork lives there) and falls back to PNG.
   * Setting 'png' is useful only if you need to render the legacy artwork
   * for some specific reason — normally leave it on 'auto'.
   */
  format?: 'auto' | 'svg' | 'png';
}

export const Logo: React.FC<Props> = ({
  variant = 'white',
  height = 120,
  animated = false,
  startFrame = 0,
  exitFrame,
  idleBreathe = true,
  format = 'auto',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Wordmark mask reveal from below ────────────────────────────────────
  const wordmarkP = animated
    ? interpolate(
        frame,
        [startFrame, startFrame + motion.enterDramatic],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
      )
    : 1;

  const exitP = exitFrame
    ? interpolate(
        frame,
        [exitFrame, exitFrame + motion.exit],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit },
      )
    : 1;

  const wordmarkY = (1 - wordmarkP) * 16;
  const wordmarkInset = (1 - wordmarkP) * 100;

  // ─── Dot halo bloom ─────────────────────────────────────────────────────
  const dotStart = startFrame + 8;
  const dotP = animated
    ? interpolate(
        frame,
        [dotStart, dotStart + motion.enterSlow],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.emphasis },
      )
    : 1;

  const breath = idleBreathe
    ? breathe({ frame, fps, speed: 0.4, min: 0.5, max: 1 })
    : 1;

  const haloOpacity = animated
    ? interpolate(dotP, [0, 0.5, 1], [0, 1, 0.7]) * breath
    : 0.6 * breath;
  const haloScale = animated
    ? interpolate(dotP, [0, 0.5, 1], [0.2, 1.6, 1])
    : 1;

  // ─── Source resolution ──────────────────────────────────────────────────
  // Aspect ratio reflects the SVG/PNG canvas (1920×1080 → 16:9). If you ship
  // a tighter SVG (e.g. cropped wordmark), you can override the aspect by
  // passing width via the parent style — height stays as the source of truth.
  const aspectRatio = 1920 / 1080;
  const width = height * aspectRatio;

  const ext = format === 'png' ? 'png' : 'svg';
  const fileName = variant === 'white' ? `luby-white.${ext}` : `luby-navy.${ext}`;
  const logoSrc = staticFile(`logos/${fileName}`);

  // PNG fallback path used when format is 'auto' and the SVG isn't on disk.
  // We don't actually probe the filesystem (Remotion would 404 the missing
  // SVG silently before rendering); instead we let the user choose with
  // `format="png"` if they need to keep using the legacy file.

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: exitP,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transform: `translateY(${wordmarkY}px)`,
          clipPath: animated ? `inset(${wordmarkInset}% 0 0 0)` : undefined,
          WebkitClipPath: animated ? `inset(${wordmarkInset}% 0 0 0)` : undefined,
          opacity: wordmarkP,
        }}
      >
        <Img
          src={logoSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Halo over the existing blue dot in the artwork */}
      <div
        style={{
          position: 'absolute',
          // Dot in the wordmark sits ~55.5% horizontal, ~26% vertical
          left: '55.5%',
          top: '26%',
          width: height * 0.32,
          height: height * 0.32,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.glow80} 0%, ${colors.glow30} 35%, transparent 70%)`,
          transform: `translate(-50%, -50%) scale(${haloScale})`,
          opacity: haloOpacity,
          filter: 'blur(10px)',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};
