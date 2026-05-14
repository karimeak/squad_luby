/**
 * SyncWord
 *
 * The atomic unit of the luby-minimal vocabulary: a single word paired
 * with an icon that appears in PERFECT sync. Same startFrame, same
 * duration, same easing. The word and the icon are visually two pieces
 * of the same gesture.
 *
 *   above:        below:        inline-right:
 *      [ icon ]     "word"          "word" [icon]
 *      "word"       [ icon ]
 *
 * The component is mode-aware:
 *   - In luby-minimal: white-or-blue word, bold weight, no text-shadow.
 *     Icon is flat (no halo, no glow), 1.75 stroke, `pop` preset.
 *   - In luby-premium: word can keep optional text-shadow, icon retains
 *     its bloom halo, idle-breathes.
 *
 * SYNC DETAIL
 * The word and the icon are driven by the SAME startFrame and duration.
 * They share the same easing curve (defaults to emphasis — quick scale
 * with light overshoot). On exit (if exitFrame is passed), they leave
 * together too. This matches the briefing's principle: word and image
 * are one event, not two.
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import type { LucideIcon } from 'lucide-react';
import { colors, fonts, weights } from '../design/tokens';
import { easings } from '../design/easings';
import { motion } from '../design/motion';
import { modes, type VisualMode } from '../design/modes';
import { useCurrentMode } from '../renderer/ModeContext';
import { useThemeTokens } from '../renderer/ThemeContext';
import { Icon } from './Icon';

interface Props {
  word: string;
  IconComponent: LucideIcon;
  startFrame: number;
  exitFrame?: number;
  /**
   * If true, the word renders in brand blue (#41A0DC). If false, the
   * word renders white. Default: true (highlighted words are the whole
   * reason this component exists).
   */
  highlight?: boolean;
  /** Pixel size of the icon. Defaults by mode (~80 minimal, ~64 premium). */
  iconSize?: number;
  /** Pixel size of the word. Defaults to 72 in both modes. */
  fontSize?: number;
  /** Where the icon sits relative to the word. */
  placement?: 'above' | 'below' | 'inline-right';
  /** Override the active visual mode. */
  mode?: VisualMode;
  /**
   * Override the icon's enter duration. Defaults to motion.enterFast (6f)
   * in minimal mode, motion.enter (18f) in premium.
   */
  enterDuration?: number;
}

export const SyncWord: React.FC<Props> = ({
  word,
  IconComponent,
  startFrame,
  exitFrame,
  highlight = true,
  iconSize,
  fontSize = 72,
  placement = 'above',
  mode: modeOverride,
  enterDuration,
}) => {
  const frame = useCurrentFrame();

  // Mode resolution — same pattern as Icon.tsx
  const ctxMode = useCurrentMode();
  const activeMode = modeOverride ?? ctxMode;
  const modePreset = modes[activeMode];
  const isMinimal = activeMode === 'luby-minimal';

  // Theme tokens — used so non-highlighted words stay legible on light
  // theme. Highlighted words always use brand blue (works in both themes).
  const theme = useThemeTokens();

  const effectiveEnterDuration = enterDuration ?? modePreset.motion.enterDuration;
  // Icon size defaults PROPORTIONAL to the word's font size — keeps the
  // pairing visually balanced regardless of fontSize the parent chose.
  // Multiplier 0.85 means a 56px word gets a ~48px icon, a 72px word
  // gets a ~61px icon — icon reads as "attached to" the word, not
  // dominating it (which 80px did at every font size).
  const effectiveIconSize = iconSize ?? Math.round(fontSize * 0.85);

  // Word enter / exit progresses — share the SAME timing as the icon
  // (the Icon component below also reads startFrame + enterDuration, so
  // by passing identical values, the two are frame-perfect synced).
  const enterP = interpolate(
    frame,
    [startFrame, startFrame + effectiveEnterDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easings.emphasis,
    },
  );

  const exitP = exitFrame !== undefined
    ? interpolate(
        frame,
        [exitFrame, exitFrame + motion.exit],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit },
      )
    : 1;

  const visible = Math.min(enterP, exitP);

  // Subtle scale-in on the word (matches the icon's pop preset for a
  // unified gesture). 0.85 → 1.0.
  const wordScale = interpolate(enterP, [0, 1], [0.85, 1])
    * interpolate(exitP, [0, 1], [0.94, 1]);

  // Highlighted: brand blue (legible on both themes).
  // Non-highlighted: theme.fg (white on dark, navyDeep on light).
  const wordColor = highlight ? colors.blue : theme.fg;
  const wordWeight = isMinimal ? weights.bold : modePreset.text.weight;

  // Layout: container is a flex column (above/below) or row (inline-right).
  // Gap between icon and word is intentionally tight — they should read as
  // one gesture, not two separate elements.
  const isInline = placement === 'inline-right';
  const flexDirection: React.CSSProperties['flexDirection'] =
    placement === 'above'  ? 'column' :
    placement === 'below'  ? 'column-reverse' :
                              'row';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection,
        alignItems: 'center',
        justifyContent: 'center',
        // Tighter gap (8px non-inline, 14px inline) so icon and word read
        // as a single gesture, not two separate elements. Previous 12px
        // felt loose; the icon-above-word pairing wants visual tension.
        gap: isInline ? 14 : 8,
        verticalAlign: 'middle',
      }}
    >
      <Icon
        Component={IconComponent}
        size={effectiveIconSize}
        color={highlight ? colors.blue : theme.fg}
        startFrame={startFrame}
        exitFrame={exitFrame}
        enterDuration={effectiveEnterDuration}
        preset="pop"
        // Force flat in minimal regardless of context fallback. Premium
        // callers can still wrap with mode override at the call site.
        mode={activeMode}
        idleBreathe={false}
      />

      <span
        style={{
          fontFamily: fonts.display,
          fontWeight: wordWeight,
          fontSize,
          color: wordColor,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          opacity: visible,
          transform: `scale(${wordScale})`,
          transformOrigin: 'center',
          whiteSpace: 'nowrap',
          // No text-shadow in minimal — that's the brand grammar of this mode
          textShadow: isMinimal
            ? undefined
            : highlight
              ? `0 0 40px ${colors.glow40}`
              : undefined,
        }}
      >
        {word}
      </span>
    </div>
  );
};
