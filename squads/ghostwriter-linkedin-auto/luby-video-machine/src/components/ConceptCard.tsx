/**
 * ConceptCard
 *
 * Glass-morphism card that holds a single concept: an icon, a title,
 * and an optional caption. Used to give scenes visual density without
 * leaving the brand vocabulary — the card itself is animated, AND the
 * children inside it animate in a coordinated sequence:
 *
 *   t=0      card scales/clips in from a small footprint
 *   t≈+4f    icon blooms (halo + scale with overshoot)
 *   t≈+10f   title mask-reveals up
 *   t≈+18f   caption mask-reveals up (when present)
 *
 * On exit (if exitFrame is provided), everything scales+fades together
 * so the card reads as a single unit leaving the screen.
 *
 * SIZES
 *   compact   — small inline card, used in dense rows (icon 56, title 24)
 *   standard  — default (icon 88, title 38)
 *   feature   — hero card for HookScene-style moments (icon 124, title 56)
 *
 * SMART LAYOUT (auto-decisions, no caller intervention required)
 *   The component decides whether the caption should actually render
 *   based on the title length:
 *     • Title ≤ 3 words AND caption provided → render both (hero concept)
 *     • Title > 3 words → caption suppressed (the title already carries
 *       context; adding a caption visually crowds the card)
 *     • No caption provided → tighter padding so the card doesn't feel
 *       like something is missing
 *   You can override the decision with `showCaption='always'|'never'`.
 *
 * POSITIONING
 *   By default the card is a normal flex/inline-flex element. Pass
 *   `absolute={{ x, y, centered }}` to position it in absolute canvas
 *   coordinates — useful when paired with Connector, which also reads
 *   absolute coords.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import type { LucideIcon } from 'lucide-react';
import { colors, fonts, weights, radius, space } from '../design/tokens';
import { easings } from '../design/easings';
import { motion, breathe } from '../design/motion';
import { useThemeTokens } from '../renderer/ThemeContext';
import { Icon } from './Icon';

type Size = 'compact' | 'standard' | 'feature';
type Layout = 'vertical' | 'horizontal';

interface Props {
  IconComponent: LucideIcon;
  title: string;
  caption?: string;
  startFrame: number;
  exitFrame?: number;
  size?: Size;
  /** Brand-tinted accent for icon + glow. Defaults to brand blue. */
  accent?: string;
  layout?: Layout;
  /** Optional absolute positioning in 1920×1080 canvas coords. */
  absolute?: { x: number; y: number; centered?: boolean };
  /** Optional fixed width override (otherwise the card sizes to content). */
  width?: number;
  /**
   * Override the caption auto-decision.
   *   'auto'   (default) — show iff title ≤ 3 words AND caption is provided
   *   'always' — always show the caption when provided
   *   'never'  — suppress the caption regardless
   */
  showCaption?: 'auto' | 'always' | 'never';
}

const SIZE_TOKENS = {
  compact:  { iconSize: 56,  titleSize: 24, captionSize: 14, padX: 24, padY: 20, gap: 12 },
  standard: { iconSize: 88,  titleSize: 36, captionSize: 18, padX: 36, padY: 32, gap: 18 },
  feature:  { iconSize: 124, titleSize: 56, captionSize: 22, padX: 48, padY: 44, gap: 24 },
} as const;

export const ConceptCard: React.FC<Props> = ({
  IconComponent,
  title,
  caption,
  startFrame,
  exitFrame,
  size = 'standard',
  accent = colors.blue,
  layout = 'vertical',
  absolute,
  width,
  showCaption = 'auto',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tokens = SIZE_TOKENS[size];
  const theme = useThemeTokens();

  // ── Smart caption decision ────────────────────────────────────────────
  // The heuristic encodes a motion-design judgement: short titles are
  // "concept words" that benefit from a supporting caption; long titles
  // are already full sentences and a caption clutters them.
  const titleWordCount = title.trim().split(/\s+/).length;
  const captionShouldShow =
    showCaption === 'always'
      ? Boolean(caption)
      : showCaption === 'never'
        ? false
        : Boolean(caption) && titleWordCount <= 3;

  // When there's no caption to show, the card looks "balanced" with a
  // slightly tighter vertical padding so it doesn't feel half-empty.
  const padYAdjusted = captionShouldShow ? tokens.padY : Math.round(tokens.padY * 0.85);

  // Container enter — clip-path reveals up, scale settles
  const containerP = interpolate(
    frame,
    [startFrame, startFrame + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );

  // Container exit — coordinated fade + slight scale-down
  const exitP = exitFrame !== undefined
    ? interpolate(
        frame,
        [exitFrame, exitFrame + motion.exit],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit },
      )
    : 1;

  const opacity = Math.min(containerP, exitP);
  const enterScale = interpolate(containerP, [0, 1], [0.92, 1]);
  const exitScale  = interpolate(exitP,      [0, 1], [0.95, 1]);
  const enterY     = (1 - containerP) * 16;

  // Mask wipe up on the card itself — adds the "designed" feel rather than a plain fade
  const inset = (1 - containerP) * 100;
  const clipPath = `inset(${inset}% 0 0 0)`;

  // Idle breathing on the border glow — same speed as Pill so the whole frame
  // feels rhythmically aligned
  const borderGlow = breathe({ frame, fps, speed: 0.4, min: 0.5, max: 1.0 });

  // Coordinated child timing
  const ICON_OFFSET    = 4;   // 4f after card starts
  const TITLE_OFFSET   = 10;
  const CAPTION_OFFSET = 18;

  const titleP = interpolate(
    frame,
    [startFrame + TITLE_OFFSET, startFrame + TITLE_OFFSET + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const titleInset = (1 - titleP) * 100;
  const titleY     = (1 - titleP) * 14;

  const captionP = captionShouldShow
    ? interpolate(
        frame,
        [startFrame + CAPTION_OFFSET, startFrame + CAPTION_OFFSET + motion.enterSlow],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
      )
    : 0;
  const captionInset = (1 - captionP) * 100;
  const captionY     = (1 - captionP) * 12;

  // Children-on-exit: when the card is fading, hide text+icon a hair earlier
  // so the card doesn't appear to "empty out" mid-fade.
  const childExit = exitP;

  // Build absolute positioning style if requested
  const absoluteStyle: React.CSSProperties = absolute
    ? {
        position: 'absolute',
        left: absolute.x,
        top: absolute.y,
        transform: absolute.centered
          ? `translate(-50%, -50%) translateY(${enterY}px) scale(${enterScale * exitScale})`
          : `translateY(${enterY}px) scale(${enterScale * exitScale})`,
        transformOrigin: absolute.centered ? 'center' : 'top left',
      }
    : {
        transform: `translateY(${enterY}px) scale(${enterScale * exitScale})`,
        transformOrigin: 'center',
      };

  return (
    <div
      style={{
        ...absoluteStyle,
        display: 'inline-flex',
        flexDirection: layout === 'vertical' ? 'column' : 'row',
        alignItems: layout === 'vertical' ? 'flex-start' : 'center',
        gap: tokens.gap,
        padding: `${padYAdjusted}px ${tokens.padX}px`,
        borderRadius: radius.lg,
        // Glass surface adapts to theme — in light theme we use the
        // theme.surface tokens (navy at low alpha on off-white) so the
        // card reads as a soft shape on the surface, not as a dark slab.
        background: theme.name === 'light'
          ? `linear-gradient(160deg, ${theme.surface}, ${theme.surfaceStrong})`
          : `linear-gradient(160deg, ${colors.whiteA10}, ${colors.whiteA05})`,
        border: `1px solid ${theme.border}`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: `
          0 0 0 1px ${colors.whiteA10} inset,
          0 24px 60px ${colors.blackA40},
          0 0 80px ${colors.glow20}
        `,
        opacity,
        clipPath,
        WebkitClipPath: clipPath,
        width,
        // The border glow sits in a pseudo-element via box-shadow; we modulate
        // its intensity through breath for the idle-alive feel.
        outline: `1px solid rgba(65, 160, 220, ${0.10 * borderGlow})`,
        outlineOffset: 0,
        willChange: 'transform, opacity, clip-path',
      }}
    >
      {/* Icon — uses bloom preset for the strongest "this is the concept" read */}
      <div style={{ opacity: childExit }}>
        <Icon
          Component={IconComponent}
          size={tokens.iconSize}
          color={accent}
          strokeWidth={size === 'compact' ? 2 : 2.2}
          startFrame={startFrame + ICON_OFFSET}
          exitFrame={exitFrame}
          preset="bloom"
          glowColor={colors.glow60}
          glowSize={2.2}
          idleBreathe
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: captionShouldShow ? Math.round(tokens.gap * 0.5) : 0,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.semibold,
            fontSize: tokens.titleSize,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: theme.fg,
            opacity: titleP * childExit,
            clipPath: `inset(${titleInset}% 0 0 0)`,
            WebkitClipPath: `inset(${titleInset}% 0 0 0)`,
            transform: `translateY(${titleY}px)`,
            willChange: 'transform, opacity, clip-path',
          }}
        >
          {title}
        </span>

        {captionShouldShow && (
          <span
            style={{
              fontFamily: fonts.display,
              fontWeight: weights.regular,
              fontSize: tokens.captionSize,
              lineHeight: 1.35,
              letterSpacing: '0.01em',
              color: theme.fgMuted,
              opacity: captionP * childExit,
              clipPath: `inset(${captionInset}% 0 0 0)`,
              WebkitClipPath: `inset(${captionInset}% 0 0 0)`,
              transform: `translateY(${captionY}px)`,
              willChange: 'transform, opacity, clip-path',
              maxWidth: layout === 'horizontal' ? 280 : 360,
            }}
          >
            {caption}
          </span>
        )}
      </div>

      {/* Subtle inner highlight along the top edge — pure CSS, no animation */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius.lg,
          background: `linear-gradient(180deg, ${colors.whiteA10} 0%, transparent 30%)`,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
};
