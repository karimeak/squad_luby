/**
 * ConceptRowBlock — renders a `kind: 'concept-row'` block.
 *
 * N concepts arranged horizontally as cards. One concept can be flagged
 * `highlight: true` — it renders one size up and in brand accent, lands
 * slightly later in the entrance choreography, and pulls focus.
 *
 *   [card A]   [card B]   [card C★]
 *
 * Optional heading sits above the row.
 *
 * CHOREOGRAPHY
 *   Non-highlight cards enter with eased stagger (4-6f apart). The
 *   highlight card enters LAST with an extra hold-off of ~8f to give
 *   visual emphasis to the "resolution" / protagonist.
 *
 * LAYOUT
 *   Centred horizontal flex with generous gap. Cards self-size — the
 *   highlight card is `standard` (or 'feature' if size='standard' was
 *   passed) while the rest are `compact` (or 'standard').
 *
 * SUPPORTS
 *   2-5 concepts. Less than 2 = renders empty. More than 5 = renders
 *   first 5 silently (deliberate constraint; if you need more, this
 *   is the wrong block).
 *
 * REPERTORIO
 *   Use for: contrarian framings (A, B, but THERE'S C), before/after/
 *   now timelines, comparison of options, evolution phases. The
 *   highlight flag is the key — it carries the rhetorical weight.
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { ConceptCard } from '../../components/ConceptCard';
import { MaskReveal } from '../../components/MaskReveal';
import { resolveIcon } from '../../schema/iconMap';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion } from '../../design/motion';
import { useThemeTokens } from '../ThemeContext';
import type { ConceptRowBlock as ConceptRowBlockSpec } from '../../schema/types';

interface Props {
  block: ConceptRowBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

// Max number of concepts we'll render. Beyond this, the visual gets crowded.
const MAX_CONCEPTS = 5;

// Stagger between non-highlight cards
const STAGGER_FRAMES = 6;
// Extra hold-off for the highlight card after the non-highlights have all started
const HIGHLIGHT_HOLDOFF = 14;
// Heading anchor offset
const T_HEADING = 0;
// First card starts after the heading (if present)
const T_FIRST_CARD = 8;

export const ConceptRowBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const concepts = block.concepts.slice(0, MAX_CONCEPTS);
  if (concepts.length < 2) return null;

  // Default size BUMPED from 'compact' to 'standard' (project standard
  // 2026-05) — Cleidson directive: "explore mais a tela". Compact cards
  // were leaving too much canvas empty. Authors who want truly small
  // cards (e.g. 5+ concepts in a row that need to fit) can pass
  // size="compact" explicitly.
  const baseSize = block.size ?? 'standard';
  // Highlight gets one size up: compact → standard, standard → feature
  const highlightSize: 'standard' | 'feature' = baseSize === 'standard' ? 'feature' : 'standard';

  // Pre-compute startFrame per concept. Non-highlights stagger normally;
  // highlight goes LAST regardless of array position, with the hold-off.
  const nonHighlightIndices = concepts
    .map((_, i) => i)
    .filter((i) => !concepts[i].highlight);
  const highlightIndex = concepts.findIndex((c) => c.highlight);

  // Map: concept index → its startFrame
  const startFrames: number[] = concepts.map(() => 0);
  // Non-highlights stagger first
  nonHighlightIndices.forEach((conceptIdx, order) => {
    startFrames[conceptIdx] = startFrame + T_FIRST_CARD + order * STAGGER_FRAMES;
  });
  // Highlight enters after all non-highlights have started, plus hold-off
  if (highlightIndex >= 0) {
    const lastNonHighlightStart =
      startFrame + T_FIRST_CARD + (nonHighlightIndices.length - 1) * STAGGER_FRAMES;
    startFrames[highlightIndex] = lastNonHighlightStart + HIGHLIGHT_HOLDOFF;
  }

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
        <Heading text={block.heading} startFrame={startFrame + T_HEADING} exitFrame={exitFrame} />
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: gap.elements, // 24px between cards — tight enough to read as a row
        }}
      >
        {concepts.map((concept, i) => {
          const IconComponent = resolveIcon(concept.icon);
          if (!IconComponent) return null;

          const isHighlight = Boolean(concept.highlight);
          const hasAnyHighlight = highlightIndex >= 0;
          // When SOME card is highlighted, non-highlight cards dim down
          // to 0.65 opacity — the visual "fade-back" creates the contrast
          // that makes the highlight read. Without this, the highlight
          // only competes on size, not weight.
          const dimNonHighlight = hasAnyHighlight && !isHighlight;

          const accent = isHighlight
            ? colors.blueBright
            : (concept.accent === 'deep'
                ? colors.blueDeep
                : concept.accent === 'bright'
                  ? colors.blueBright
                  : colors.blue);

          return (
            <ConceptCardWrapper
              key={i}
              isHighlight={isHighlight}
              startFrame={startFrames[i]}
              exitFrame={exitFrame}
              dim={dimNonHighlight}
            >
              <ConceptCard
                IconComponent={IconComponent}
                title={concept.title}
                caption={concept.caption}
                startFrame={startFrames[i]}
                exitFrame={exitFrame}
                size={isHighlight ? highlightSize : baseSize}
                accent={accent}
                layout="vertical"
                showCaption="auto"
              />
            </ConceptCardWrapper>
          );
        })}
      </div>
    </div>
  );
};

// ─── Wrapper around each card to add highlight halo + dim non-highlights ──

const ConceptCardWrapper: React.FC<{
  isHighlight: boolean;
  dim: boolean;
  startFrame: number;
  exitFrame?: number;
  children: React.ReactNode;
}> = ({ isHighlight, dim, startFrame, exitFrame, children }) => {
  const frame = useCurrentFrame();
  const theme = useThemeTokens();
  const isLight = theme.name === 'light';

  // Wrapper enter follows the inner card so dim/highlight transitions
  // line up with the card itself.
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

  // Dim wrapper: non-highlights fade to 0.65 once they've fully entered.
  // The dim animates in slightly delayed so the card still reads clearly
  // for a moment before dropping back.
  const dimP = dim
    ? interpolate(frame, [startFrame + 20, startFrame + 40], [1, 0.65], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      })
    : 1;
  const opacity = Math.min(enterP, exitP) * dimP;

  // Highlight: surround the card with a soft brand-blue halo so the
  // viewer's eye is pulled there without needing more typography.
  if (isHighlight) {
    return (
      <div style={{ position: 'relative', opacity, display: 'inline-block' }}>
        {/* Halo glow behind the card */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: -32,
            borderRadius: 40,
            background: isLight
              ? `radial-gradient(ellipse, rgba(65, 160, 220, 0.20) 0%, transparent 70%)`
              : `radial-gradient(ellipse, ${colors.glow60} 0%, ${colors.glow20} 50%, transparent 75%)`,
            filter: 'blur(24px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
        {/* "Star" badge at top-right indicating the protagonist */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: -14,
            right: -14,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: isLight ? colors.blueDeep : colors.blueBright,
            color: colors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 700,
            boxShadow: isLight
              ? `0 4px 12px rgba(15, 35, 65, 0.2)`
              : `0 0 16px ${colors.glow60}, 0 4px 12px ${colors.blackA40}`,
            zIndex: 2,
          }}
        >
          ★
        </div>
        {children}
      </div>
    );
  }

  return (
    <div style={{ opacity, transition: 'opacity 0.3s' }}>
      {children}
    </div>
  );
};

// ─── Heading above the row ────────────────────────────────────────────────

const Heading: React.FC<{ text: string; startFrame: number; exitFrame?: number }> = ({
  text, startFrame, exitFrame,
}) => {
  // Letter-spacing settles after entrance, same as IntroScene's eyebrow
  const frame = useCurrentFrame();
  const theme = useThemeTokens();
  const settleP = interpolate(
    frame,
    [startFrame, startFrame + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const tracking = interpolate(settleP, [0, 1], [0.02, 0]);

  return (
    <MaskReveal enterAt={startFrame} exitAt={exitFrame} direction="up" translate={16}>
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.semibold,
          fontSize: 56,
          color: theme.fg,
          letterSpacing: `${tracking}em`,
          lineHeight: 1.1,
          textAlign: 'center',
          maxWidth: 1500,
          textShadow: theme.name === 'light' ? 'none' : `0 0 40px ${colors.glow30}`,
        }}
      >
        {text}
      </div>
    </MaskReveal>
  );
};
