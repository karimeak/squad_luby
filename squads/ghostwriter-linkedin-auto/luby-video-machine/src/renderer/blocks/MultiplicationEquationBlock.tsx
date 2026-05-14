/**
 * MultiplicationEquationBlock — renders a `kind: 'multiplication-equation'` block.
 *
 * Visual layout (premium-craft):
 *
 *   ┌──────────┐         ┌──────────┐         ┌──────────┐
 *   │  [icon]  │    ×    │  [icon]  │    =    │  [3-5×]  │
 *   │  label   │         │  label   │         │  sublbl  │
 *   │  sublbl  │         │  sublbl  │         │          │
 *   └──────────┘         └──────────┘         └──────────┘
 *
 * Each slot is a ConceptCard (glass-morphism: backdrop-blur, border, halo
 * on the icon). The operators × and = sit between the cards as elegant
 * typography — present but not competing with the slots for attention.
 *
 * Coordinated entrance (each card animates in via ConceptCard's internal
 * sequence, plus operators):
 *   t+0    eyebrow (if present)
 *   t+12   left card slides in (ConceptCard scale+clip reveal)
 *   t+36   op1 (×) pops in
 *   t+48   right card slides in
 *   t+96   op2 (=) appears
 *   t+108  result card lands with the punchline number
 *
 * The whole equation holds visible until exitFrame.
 *
 * MODE-AWARENESS
 *   Premium: ConceptCard's full glass-morphism with halos, breath, depth
 *   Minimal: ConceptCard still works but its inner styling adapts via
 *     useCurrentMode() inside (flat-ish surface, no idle breath on halos)
 *   So this single block serves both vocabularies.
 *
 * REPERTORIO
 *   This block is the canonical "A × B = C" composition. Variations
 *   (3+ operands, addition, division) would be new block kinds, NOT
 *   parameters of this one — keeps each block's intent clear.
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion } from '../../design/motion';
import { resolveIcon } from '../../schema/iconMap';
import { ConceptCard } from '../../components/ConceptCard';
import { MaskReveal } from '../../components/MaskReveal';
import { useThemeTokens } from '../ThemeContext';
import type {
  MultiplicationEquationBlock as MultEqBlockSpec,
  EquationSlot,
} from '../../schema/types';

interface Props {
  block: MultEqBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

// Internal beat anchors — RELATIVE to startFrame
const T_EYEBROW = 0;
const T_LEFT    = 12;
const T_OP1     = 36;
const T_RIGHT   = 48;
const T_OP2     = 96;
const T_RESULT  = 108;

export const MultiplicationEquationBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const op1 = block.op1 ?? '×';
  const op2 = block.op2 ?? '=';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: gap.group, // generous space between eyebrow and equation
      }}
    >
      {block.eyebrow && (
        <MaskReveal enterAt={startFrame + T_EYEBROW} exitAt={exitFrame} direction="up" translate={8}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 18,
              fontWeight: weights.regular,
              letterSpacing: '0.34em',
              color: colors.blueBright,
              textTransform: 'uppercase',
              textShadow: `0 0 24px ${colors.glow60}`,
            }}
          >
            {block.eyebrow}
          </div>
        </MaskReveal>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          // gap.block now that cards are `feature` size — more breathing
          // room so operators have presence without crowding the slots.
          gap: gap.block,
        }}
      >
        <SlotCard slot={block.left} startFrame={startFrame + T_LEFT} exitFrame={exitFrame} />
        <OperatorSymbol symbol={op1} startFrame={startFrame + T_OP1} exitFrame={exitFrame} hero />
        <SlotCard slot={block.right} startFrame={startFrame + T_RIGHT} exitFrame={exitFrame} />
        <OperatorSymbol symbol={op2} startFrame={startFrame + T_OP2} exitFrame={exitFrame} />
        <SlotCard slot={block.result} startFrame={startFrame + T_RESULT} exitFrame={exitFrame} isResult />
      </div>
    </div>
  );
};

// ─── Slot rendered as ConceptCard ──────────────────────────────────────────

interface SlotProps {
  slot: EquationSlot;
  startFrame: number;
  exitFrame?: number;
  /** When true (the result slot), uses brighter accent + number-as-title. */
  isResult?: boolean;
}

const SlotCard: React.FC<SlotProps> = ({ slot, startFrame, exitFrame, isResult }) => {
  if (slot.kind === 'icon-label') {
    const IconComponent = resolveIcon(slot.icon);
    if (!IconComponent) return null;

    return (
      <ConceptCard
        IconComponent={IconComponent}
        title={slot.label}
        caption={slot.subLabel}
        startFrame={startFrame}
        exitFrame={exitFrame}
        // Bumped from 'standard' to 'feature' (project standard 2026-05):
        // explore more of the canvas. icon=124, title=56, generous padding.
        size="feature"
        accent={slot.accent ? colors.blueBright : colors.blue}
        layout="vertical"
        width={380}
        showCaption="always"
      />
    );
  }

  // 'number' slot — render as a ConceptCard-shaped panel but with the
  // big number where the icon-stack normally sits. Reuses card chrome
  // (glass, halo, breath) so the equation reads as ONE composition.
  return <NumberSlotCard slot={slot} startFrame={startFrame} exitFrame={exitFrame} isResult={isResult} />;
};

// ─── Number slot: glass card with big number instead of icon ──────────────

const NumberSlotCard: React.FC<{
  slot: Extract<EquationSlot, { kind: 'number' }>;
  startFrame: number;
  exitFrame?: number;
  isResult?: boolean;
}> = ({ slot, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const theme = useThemeTokens();
  // On light theme, the un-accented number uses navy (theme.fg) so it
  // reads on off-white. Accented stays brand blue (works on both).
  const accent = slot.accent !== false ? colors.blueBright : theme.fg;

  // Container enter — same cadence ConceptCard uses
  const containerP = interpolate(
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

  const opacity = Math.min(containerP, exitP);
  const enterScale = interpolate(containerP, [0, 1], [0.92, 1]);
  const exitScale = interpolate(exitP, [0, 1], [0.95, 1]);
  const enterY = (1 - containerP) * 16;

  // Mask wipe up on the card surface (same as ConceptCard)
  const inset = (1 - containerP) * 100;

  // Number reveals after the card lands
  const numberStart = startFrame + 4;
  const numberP = interpolate(
    frame,
    [numberStart, numberStart + motion.enter],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.emphasis },
  );
  const subStart = startFrame + 12;
  const subP = slot.subLabel
    ? interpolate(frame, [subStart, subStart + motion.enter], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter,
      })
    : 0;

  // Sub-label clip-path mask reveal (matches ConceptCard's title behavior)
  const subInset = (1 - subP) * 100;
  const subY = (1 - subP) * 12;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        // Bumped padding to match `feature` size cards (project standard 2026-05)
        padding: '44px 48px',
        borderRadius: 22,
        background: theme.name === 'light'
          ? `linear-gradient(160deg, ${theme.surfaceStrong}, ${theme.surface})`
          : `linear-gradient(160deg, ${colors.whiteA10}, ${colors.whiteA05})`,
        border: `1px solid ${theme.border}`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: theme.name === 'light'
          ? `0 24px 40px rgba(15, 35, 65, 0.08), 0 0 40px ${colors.glow10}`
          : `
              0 0 0 1px ${colors.whiteA10} inset,
              0 24px 60px ${colors.blackA40},
              0 0 80px ${colors.glow20}
            `,
        opacity,
        transform: `translateY(${enterY}px) scale(${enterScale * exitScale})`,
        transformOrigin: 'center',
        clipPath: `inset(${inset}% 0 0 0)`,
        WebkitClipPath: `inset(${inset}% 0 0 0)`,
        // Width + minHeight bumped to match `feature` ConceptCard
        width: 380,
        minHeight: 320,
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Halo behind the number (mirror of ConceptCard's icon bloom) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 240,
          height: 240,
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${colors.glow40} 0%, transparent 60%)`,
          opacity: 0.7 * numberP,
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />

      {/* The big number */}
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.bold,
          // Bumped from 96 to 128 to match `feature` card hierarchy
          fontSize: 128,
          color: accent,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          textAlign: 'center',
          opacity: numberP,
          textShadow: `0 0 40px ${colors.glow40}`,
          fontVariantNumeric: 'tabular-nums',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {slot.numberLabel}
      </div>

      {/* Sub-label (caption-style, like ConceptCard's caption) */}
      {slot.subLabel && (
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.regular,
            fontSize: 18,
            color: theme.fgMuted,
            letterSpacing: '0.01em',
            lineHeight: 1.35,
            textAlign: 'center',
            opacity: subP,
            clipPath: `inset(${subInset}% 0 0 0)`,
            WebkitClipPath: `inset(${subInset}% 0 0 0)`,
            transform: `translateY(${subY}px)`,
            maxWidth: 240,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {slot.subLabel}
        </div>
      )}

      {/* Inner highlight along the top edge — same trick ConceptCard uses
          to give the glass a "lit" feel from above */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          background: `linear-gradient(180deg, ${colors.whiteA10} 0%, transparent 30%)`,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
};

// ─── Operator symbol (× and =) ─────────────────────────────────────────────

const OperatorSymbol: React.FC<{
  symbol: string;
  startFrame: number;
  exitFrame?: number;
  hero?: boolean;
}> = ({ symbol, startFrame, exitFrame, hero }) => {
  const frame = useCurrentFrame();
  const theme = useThemeTokens();

  const enterP = interpolate(
    frame,
    [startFrame, startFrame + motion.enter],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: hero ? easings.emphasis : easings.enter,
    },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;

  const visible = Math.min(enterP, exitP);
  const scale = interpolate(enterP, [0, 1], [hero ? 0.7 : 0.85, 1]);

  return (
    <div
      style={{
        fontFamily: fonts.display,
        fontWeight: weights.semibold,
        // Bumped to match `feature` cards: × is now hero-sized (140),
        // = is supporting (110). Operators are part of the visual
        // statement, not just punctuation.
        fontSize: hero ? 140 : 110,
        // Operator color: on light theme use navy at 60% alpha for
        // legible-but-supporting weight; on dark keep the original whiteA60.
        color: theme.name === 'light' ? 'rgba(15, 35, 65, 0.55)' : colors.whiteA60,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        opacity: visible,
        transform: `scale(${scale})`,
        textShadow: `0 0 32px ${colors.glow40}`,
      }}
    >
      {symbol}
    </div>
  );
};
