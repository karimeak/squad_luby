/**
 * SplitScreenComparison — archetype "split-screen-comparison".
 *
 *   ┌──────────────────────┬──────────────────────┐
 *   │                      │                      │
 *   │   DARK PANEL         │   LIGHT PANEL        │
 *   │   ─────────────      │   ─────────────      │
 *   │   [icon]             │   [icon]             │
 *   │   Title              │   Title              │
 *   │   caption            │   caption            │
 *   │                      │                      │
 *   └──────────────────────┴──────────────────────┘
 *                         ≠
 *                       (or vs / × / →)
 *
 * Redesign 2026-05: the archetype is now LITERALLY dark on one side,
 * light on the other. Each side fills its half of the canvas with its
 * own background (navy on left, off-white on right) and matching text
 * tones. The center symbol straddles the seam. Reads as "two worlds"
 * — exactly the contrast metaphor calls for.
 *
 * Previous version used two glass cards on a uniform background — too
 * subtle for a contrast statement. This version foregrounds the
 * material difference as the visual argument.
 *
 * The `highlightSide` prop lifts that side: slightly larger icon, brand
 * blue accent on the title, subtle glow. The non-highlight side stays
 * neutral so the contrast lands cleanly.
 *
 * CHOREOGRAPHY:
 *   t=0   heading mask-reveals above both panels
 *   t=10  panel backgrounds slide in (dark from left, light from right)
 *   t=18  non-highlight side content pops in
 *   t=26  center symbol scales in
 *   t=34  highlight side content pops in (held back for rhetorical weight)
 *
 * Doesn't honor the document-level theme — this archetype DEFINES its
 * own two themes. The heading/symbol use the document theme so the
 * surrounding scene (intro/cta) reads consistent.
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import type { LucideIcon } from 'lucide-react';
import { MaskReveal } from '../../components/MaskReveal';
import { Icon } from '../../components/Icon';
import { resolveIcon } from '../../schema/iconMap';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion } from '../../design/motion';
import { useThemeTokens } from '../ThemeContext';
import type { SplitScreenComparisonBlock } from '../../schema/types';

interface Props {
  block: SplitScreenComparisonBlock;
  startFrame: number;
  exitFrame?: number;
}

const T_HEADING        = 0;
const T_PANELS         = 10;
const T_NON_HIGHLIGHT  = 18;
const T_CENTER_SYMBOL  = 26;
const T_HIGHLIGHT      = 34;

// Canvas is 1920×1080. Each panel takes half the width and the
// full height so the archetype reads as TWO WORLDS, not two cards
// on a backdrop.
const PANEL_W = 960;
const PANEL_H = 1080;

// Dark / light palettes — these are FIXED for this archetype, not driven
// by the document theme. The whole point is the contrast.
const DARK_BG    = colors.navy;
const DARK_FG    = colors.white;
const DARK_MUTED = colors.gray100;

const LIGHT_BG    = '#F4F6FA';  // matches themes.light.bg
const LIGHT_FG    = colors.navyDeep;
const LIGHT_MUTED = '#3A4A66';  // matches themes.light.fgMuted

export const SplitScreenComparison: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const LeftIcon  = resolveIcon(block.left.icon);
  const RightIcon = resolveIcon(block.right.icon);
  if (!LeftIcon || !RightIcon) return null;

  const highlight = block.highlightSide ?? 'none';
  const leftIsHighlight  = highlight === 'left';
  const rightIsHighlight = highlight === 'right';

  const leftStart =
    leftIsHighlight  ? startFrame + T_HIGHLIGHT     : startFrame + T_NON_HIGHLIGHT;
  const rightStart =
    rightIsHighlight ? startFrame + T_HIGHLIGHT     : startFrame + T_NON_HIGHLIGHT;

  return (
    <div
      style={{
        // Escape the scene's flex layout — split-screen must take the
        // full canvas (1920×1080) to read as "two worlds". zIndex 0 so
        // sibling blocks rendered after it (numbered eyebrow in the
        // catalog) can layer above via z-index auto.
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {block.heading && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            zIndex: 5,
            display: 'flex',
            justifyContent: 'center',
            // Heading sits on whichever color is dominant at its position.
            // Center it and let each side's text contrast carry it.
          }}
        >
          <Heading text={block.heading} startFrame={startFrame + T_HEADING} exitFrame={exitFrame} />
        </div>
      )}

      <div
        style={{
          position: 'relative',
          width: PANEL_W * 2,
          height: PANEL_H,
        }}
      >
        {/* LEFT PANEL — dark background */}
        <Panel
          side="left"
          background={DARK_BG}
          startFrame={startFrame + T_PANELS}
          exitFrame={exitFrame}
        />

        {/* RIGHT PANEL — light background */}
        <Panel
          side="right"
          background={LIGHT_BG}
          startFrame={startFrame + T_PANELS + 2}
          exitFrame={exitFrame}
        />

        {/* LEFT CONTENT (over dark panel) */}
        <SideContent
          side="left"
          IconComponent={LeftIcon}
          title={block.left.title}
          caption={block.left.caption}
          fg={DARK_FG}
          muted={DARK_MUTED}
          accent={leftIsHighlight ? colors.blueBright : colors.blue}
          isHighlight={leftIsHighlight}
          startFrame={leftStart}
          exitFrame={exitFrame}
        />

        {/* RIGHT CONTENT (over light panel) */}
        <SideContent
          side="right"
          IconComponent={RightIcon}
          title={block.right.title}
          caption={block.right.caption}
          fg={LIGHT_FG}
          muted={LIGHT_MUTED}
          accent={rightIsHighlight ? colors.blueDeep : colors.blue}
          isHighlight={rightIsHighlight}
          startFrame={rightStart}
          exitFrame={exitFrame}
        />

        {/* CENTER SYMBOL — straddles the seam between panels */}
        <CenterSymbol
          text={block.centerSymbol ?? '≠'}
          startFrame={startFrame + T_CENTER_SYMBOL}
          exitFrame={exitFrame}
        />
      </div>
    </div>
  );
};

// ─── Panel (the colored half) ────────────────────────────────────────────

const Panel: React.FC<{
  side: 'left' | 'right';
  background: string;
  startFrame: number;
  exitFrame?: number;
}> = ({ side, background, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();

  // Slide in from the outside edge toward the seam
  const enterP = interpolate(
    frame,
    [startFrame, startFrame + motion.enterDramatic],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;

  // Mask wipe from the OUTSIDE edge toward the seam.
  // Left panel: clip-right starts at 100%, ends at 0% (reveals leftward in).
  // Right panel: clip-left similarly.
  const insetFromOutside = (1 - enterP) * 100;
  const clipPath = side === 'left'
    ? `inset(0 0 0 ${insetFromOutside}%)`
    : `inset(0 ${insetFromOutside}% 0 0)`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: side === 'left' ? 0 : PANEL_W,
        width: PANEL_W,
        height: PANEL_H,
        background,
        opacity: Math.min(enterP, exitP),
        clipPath,
        WebkitClipPath: clipPath,
        // Subtle inner glow / vignette to give each panel a hint of depth
        // (a perfectly flat color looks like PowerPoint).
        boxShadow: side === 'left'
          ? `inset -2px 0 12px rgba(0, 0, 0, 0.2)`
          : `inset 2px 0 12px rgba(15, 35, 65, 0.05)`,
      }}
    />
  );
};

// ─── Side content (icon + title + caption inside a panel) ────────────────

const SideContent: React.FC<{
  side: 'left' | 'right';
  IconComponent: LucideIcon;
  title: string;
  caption?: string;
  fg: string;
  muted: string;
  accent: string;
  isHighlight: boolean;
  startFrame: number;
  exitFrame?: number;
}> = ({ side, IconComponent, title, caption, fg, muted, accent, isHighlight, startFrame, exitFrame }) => {
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

  const opacity = Math.min(enterP, exitP);
  const enterY = (1 - enterP) * 16;
  const enterScale = interpolate(enterP, [0, 1], [0.94, 1]);

  // Highlighted side scales up slightly (1.05) to win the read
  const finalScale = enterScale * (isHighlight ? 1.05 : 1);

  const iconSize = isHighlight ? 124 : 96;
  const titleSize = isHighlight ? 56 : 44;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: side === 'left' ? 0 : PANEL_W,
        width: PANEL_W,
        height: PANEL_H,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: gap.elements,
        padding: '0 80px',
        opacity,
        transform: `translateY(${enterY}px) scale(${finalScale})`,
        transformOrigin: 'center',
      }}
    >
      <Icon
        Component={IconComponent}
        size={iconSize}
        color={accent}
        strokeWidth={2.2}
        startFrame={startFrame}
        exitFrame={exitFrame}
        preset="pop"
      />
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.semibold,
          fontSize: titleSize,
          color: isHighlight ? accent : fg,
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
          textAlign: 'center',
          textShadow: isHighlight
            ? `0 0 24px ${accent}40`
            : undefined,
        }}
      >
        {title}
      </div>
      {caption && (
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.regular,
            fontSize: 22,
            color: muted,
            letterSpacing: '0.005em',
            lineHeight: 1.35,
            textAlign: 'center',
            maxWidth: 480,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

// ─── Heading above the comparison ─────────────────────────────────────────

// Heading sits over the seam between the dark and light panels. To
// stay readable on both sides simultaneously, we wrap it in a small
// dark "tablet" pill background — works in both themes since the
// surface is fixed dark navy and text is fixed white.
const Heading: React.FC<{ text: string; startFrame: number; exitFrame?: number }> = ({
  text, startFrame, exitFrame,
}) => (
  <MaskReveal enterAt={startFrame} exitAt={exitFrame} direction="up" translate={16}>
    <div
      style={{
        fontFamily: fonts.display,
        fontWeight: weights.semibold,
        fontSize: 52,
        color: colors.white,
        letterSpacing: '-0.025em',
        lineHeight: 1.1,
        textAlign: 'center',
        maxWidth: 1500,
        padding: '14px 36px',
        background: `linear-gradient(135deg, ${colors.navyDeep} 0%, ${colors.navy} 100%)`,
        border: `1px solid rgba(65, 160, 220, 0.40)`,
        borderRadius: 999,
        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.30), 0 0 32px ${colors.glow30}`,
      }}
    >
      {text}
    </div>
  </MaskReveal>
);

// ─── Center symbol — sits on the seam between the two panels ─────────────

const CenterSymbol: React.FC<{
  text: string;
  startFrame: number;
  exitFrame?: number;
}> = ({ text, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();

  const enterP = interpolate(
    frame,
    [startFrame, startFrame + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.emphasis },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;

  const opacity = Math.min(enterP, exitP);
  const scale = interpolate(enterP, [0, 1], [0.6, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: PANEL_W,
        top: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        // Symbol sits in a circular badge to give it material presence
        // straddling the seam between dark and light panels. The badge
        // background is brand blue so it works against both sides.
        width: 160,
        height: 160,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.blue} 0%, ${colors.blueDeep} 100%)`,
        boxShadow: `0 0 60px ${colors.glow60}, 0 0 24px ${colors.glow40}, inset 0 2px 4px rgba(255,255,255,0.3)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.semibold,
          fontSize: 84,
          lineHeight: 1,
          color: colors.white,
          letterSpacing: '-0.04em',
        }}
      >
        {text}
      </div>
    </div>
  );
};
