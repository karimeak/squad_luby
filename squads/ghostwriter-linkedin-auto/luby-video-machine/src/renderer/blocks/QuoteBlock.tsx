/**
 * QuoteBlock — renders a `kind: 'quote'` block.
 *
 *   "
 *    Lorem ipsum dolor sit amet, consectetur
 *    adipiscing elit, sed do eiusmod.
 *
 *   — Name
 *     Role, Company
 *
 * REDESIGN 2026-05: previous version had quote marks FLOATING at top-left
 * and bottom-right with the text centered between them, and attribution
 * pulled to the right — felt scattered. New version is a CLEAN LEFT-
 * ALIGNED COLUMN: opening quote at top, text, attribution on the same
 * column below. The closing quote mark is dropped (the opening one is
 * enough as a typographic device).
 *
 * For: case study testimonials, board endorsements, positioning pulls.
 */

import React from 'react';
import { useCurrentFrame, interpolate, Img, staticFile } from 'remotion';
import { MaskReveal } from '../../components/MaskReveal';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion } from '../../design/motion';
import { useThemeTokens } from '../ThemeContext';
import type { QuoteBlock as QuoteBlockSpec } from '../../schema/types';

interface Props {
  block: QuoteBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

const T_OPEN_QUOTE = 0;
const T_TEXT       = 6;
const T_ATTR       = 24;

export const QuoteBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const theme = useThemeTokens();
  const isLight = theme.name === 'light';

  // Opening quote mark — fade-in + exit fade
  const openP = interpolate(
    frame,
    [startFrame + T_OPEN_QUOTE, startFrame + T_OPEN_QUOTE + motion.enterFast],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.emphasis },
  );
  const quoteMarkExitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: gap.intra,
        // Constrain width and let the column sit naturally — the scene
        // flex parent centers it.
        maxWidth: 1100,
        position: 'relative',
      }}
    >
      {/* Opening quote mark — oversized but inline with the column start */}
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.bold,
          fontSize: 140,
          color: isLight ? colors.blueDeep : colors.blueBright,
          lineHeight: 0.7,
          opacity: openP * quoteMarkExitP * 0.5,
          textShadow: isLight ? 'none' : `0 0 40px ${colors.glow40}`,
          marginBottom: -16,
        }}
      >
        “
      </div>

      <MaskReveal enterAt={startFrame + T_TEXT} exitAt={exitFrame} direction="up" translate={20}>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.medium,
            fontSize: 44,
            color: theme.fg,
            letterSpacing: '-0.015em',
            lineHeight: 1.3,
            textAlign: 'left',
            maxWidth: 1100,
          }}
        >
          {block.quote}
        </div>
      </MaskReveal>

      {/* Attribution — same left column, just below the text */}
      <Attribution
        name={block.attribution}
        role={block.role}
        avatarUrl={block.avatarUrl}
        startFrame={startFrame + T_ATTR}
        exitFrame={exitFrame}
      />
    </div>
  );
};

// ─── Attribution row ─────────────────────────────────────────────────────

const Attribution: React.FC<{
  name: string;
  role?: string;
  avatarUrl?: string;
  startFrame: number;
  exitFrame?: number;
}> = ({ name, role, avatarUrl, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const theme = useThemeTokens();

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
  const y = (1 - enterP) * 12;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: visible,
        transform: `translateY(${y}px)`,
        marginTop: gap.elements,
        // Anchor to the left, same column as the quote text.
        alignSelf: 'flex-start',
      }}
    >
      {avatarUrl && (
        <Img
          src={avatarUrl.startsWith('http') ? avatarUrl : staticFile(avatarUrl)}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            objectFit: 'cover',
            border: `2px solid ${theme.border}`,
          }}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.semibold,
            fontSize: 22,
            color: theme.fg,
            letterSpacing: '-0.005em',
          }}
        >
          — {name}
        </span>
        {role && (
          <span
            style={{
              fontFamily: fonts.display,
              fontWeight: weights.regular,
              fontSize: 16,
              color: theme.fgMuted,
              letterSpacing: '0.005em',
              marginTop: 2,
            }}
          >
            {role}
          </span>
        )}
      </div>
    </div>
  );
};
