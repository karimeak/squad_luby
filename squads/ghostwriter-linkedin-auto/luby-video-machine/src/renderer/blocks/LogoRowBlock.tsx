/**
 * LogoRowBlock — renders a `kind: 'logo-row'` block.
 *
 *   [LexisNexis]   [Bridgestone]   [Siemens]   [Sunwest]
 *
 * For: social proof, "trusted by" beats, partnership announcements.
 *
 * Logos crossfade in with eased stagger and hold at uniform desaturated
 * tone (mode='mono') so individual brand colors don't fight each other.
 * Authors who want preserved colors pass tint='preserve' per logo.
 *
 * Layout: horizontal row, evenly spaced. 2-6 logos cap.
 */

import React from 'react';
import { useCurrentFrame, interpolate, Img, staticFile } from 'remotion';
import { MaskReveal } from '../../components/MaskReveal';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion, stagger } from '../../design/motion';
import { useThemeTokens } from '../ThemeContext';
import type { LogoRowBlock as LogoRowBlockSpec } from '../../schema/types';

interface Props {
  block: LogoRowBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

const HEADING_OFFSET = 0;
const FIRST_LOGO_OFFSET = 12;
const STAGGER_GAP = 4;

export const LogoRowBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const theme = useThemeTokens();
  const logos = block.logos.slice(0, 6);
  if (logos.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: gap.group,
      }}
    >
      {block.heading && (
        <MaskReveal enterAt={startFrame + HEADING_OFFSET} exitAt={exitFrame} direction="up" translate={12}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 20,
              fontWeight: weights.regular,
              letterSpacing: '0.34em',
              color: theme.fgMuted,
              textTransform: 'uppercase',
            }}
          >
            {block.heading}
          </div>
        </MaskReveal>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: gap.section, // generous space between logos so each breathes
          flexWrap: 'wrap',
          maxWidth: 1700,
        }}
      >
        {logos.map((logo, i) => {
          const logoStart = stagger({
            index: i,
            base: startFrame + FIRST_LOGO_OFFSET,
            gap: STAGGER_GAP,
            total: logos.length,
            easingFn: easings.enter,
          });
          return (
            <LogoCell
              key={i}
              src={logo.src}
              name={logo.name}
              tint={logo.tint ?? 'mono'}
              themeName={theme.name}
              startFrame={logoStart}
              exitFrame={exitFrame}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─── Single logo cell ────────────────────────────────────────────────────

const LogoCell: React.FC<{
  src: string;
  name: string;
  tint: 'mono' | 'preserve';
  themeName?: 'dark' | 'light';
  startFrame: number;
  exitFrame?: number;
}> = ({ src, name, tint, themeName, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();

  const enterP = interpolate(
    frame,
    [startFrame, startFrame + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;

  const visible = Math.min(enterP, exitP);
  const y = (1 - enterP) * 8;

  // Mono tint adapts to theme:
  //   - Dark theme: brightness(2.5) ghost-white over navy
  //   - Light theme: brightness(0) darkens to navy over off-white
  // Preserve tint: original colors untouched in both themes.
  const isLight = themeName === 'light';
  const filter = tint === 'mono'
    ? (isLight
        ? 'grayscale(1) brightness(0) opacity(0.7)'
        : 'grayscale(1) brightness(2.5) opacity(0.85)')
    : 'none';

  // Asset swap: when the source is a Luby brand asset designed for dark
  // backgrounds (luby-white.svg/png), automatically use the navy variant
  // on light theme so the wordmark remains visible.
  // Heuristic: only swap luby-* assets; client logos pass through as-is.
  let effectiveSrc = src;
  if (isLight && /luby-white\.(svg|png)$/i.test(src)) {
    effectiveSrc = src.replace(/luby-white/i, 'luby-navy');
  }
  const resolvedSrc = effectiveSrc.startsWith('http') || effectiveSrc.startsWith('data:')
    ? effectiveSrc
    : staticFile(effectiveSrc);

  return (
    <Img
      src={resolvedSrc}
      alt={name}
      style={{
        height: 56,
        width: 'auto',
        maxWidth: 240,
        objectFit: 'contain',
        opacity: visible * 0.85,
        transform: `translateY(${y}px)`,
        filter,
      }}
    />
  );
};
