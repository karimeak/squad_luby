/**
 * SentenceWithSyncsBlock — renders a `kind: 'sentence-with-syncs'` block.
 *
 * The heart of the luby-minimal vocabulary. Renders a sentence word by
 * word, with designated keywords appearing alongside synchronized icons.
 *
 *   "Como acelerar com IA sem abrir mão da segurança?"
 *           ↑                              ↑
 *         [zap]                       [shield-check]
 *
 * Each word enters in sequence (stagger). For keywords (defined either
 * by the schema's `syncs` array or auto-resolved by the iconMap keyword
 * dictionary), the word renders via <SyncWord> so the icon enters in
 * the same frame as the word. Function words enter as plain text with
 * the same stagger cadence.
 *
 * MATCHING WORD ↔ SYNC SPEC
 * ─────────────────────────
 * Punctuation is normalized away on both sides so `{ word: 'segurança' }`
 * matches the token `'segurança?'` in the sentence. Match is also
 * case-insensitive and diacritic-insensitive (so 'IA' matches 'ia',
 * 'segurança' matches 'seguranca').
 *
 * DECISION HIERARCHY PER WORD
 * ───────────────────────────
 *   1. Schema lists this word with `icon: 'none'`  → plain text (explicit opt-out)
 *   2. Schema lists this word with a valid icon    → SyncWord with that icon
 *   3. iconMap auto-suggests a default for this word → SyncWord with auto-icon
 *   4. None of the above                            → plain text
 *
 * WRAPPING
 * ────────
 * The sentence is a flex-wrap row of words. For a 72px font and a 1920px
 * canvas, ~6-8 short words fit per line. Longer sentences wrap to multiple
 * lines naturally. Authors with very long sentences should either reduce
 * `size` or split into two `sentence-with-syncs` blocks.
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { resolveIcon, suggestIconForWord, type IconKey } from '../../schema/iconMap';
import { SyncWord } from '../../components/SyncWord';
import { fonts, weights } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion, stagger } from '../../design/motion';
import { useCurrentMode } from '../ModeContext';
import { useThemeTokens } from '../ThemeContext';
import type { SentenceWithSyncsBlock as SentenceWithSyncsBlockSpec, SyncWordSpec } from '../../schema/types';

interface Props {
  block: SentenceWithSyncsBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

/**
 * Normalize a word for matching: strip punctuation, lowercase, remove
 * combining diacritics. Same recipe used by iconMap.suggestIconForWord.
 */
const normalize = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .replace(/[?!.,;:]/g, '')
    .trim();

export const SentenceWithSyncsBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const mode = useCurrentMode();
  const isMinimal = mode === 'luby-minimal';

  const words = block.text.split(/\s+/).filter((w) => w.length > 0);
  const totalWords = words.length;

  const align = block.align ?? 'center';
  // 56px is the sweet spot for minimal sentences: large enough to read
  // as a hero statement, small enough that 8-10 words fit on ONE LINE in
  // a 1500px max-width — keeping the composition as a single horizontal
  // tape instead of wrapping. Authors with longer sentences should either
  // accept the wrap or split into two `sentence-with-syncs` blocks.
  const fontSize = block.size ?? (isMinimal ? 56 : 48);
  const staggerGap = block.wordStaggerFrames ?? (isMinimal ? 6 : 8);

  // Build a normalized → SyncWordSpec lookup from the schema's `syncs` array.
  // Multiple syncs targeting the same word collapse to the LAST one (rare
  // but defined behavior — easier for authors than throwing).
  const syncLookup = new Map<string, SyncWordSpec>();
  for (const sync of block.syncs ?? []) {
    syncLookup.set(normalize(sync.word), sync);
  }

  // Resolve each word's render strategy ONCE upfront. This makes the
  // hot-path render below trivial and keeps the decision tree readable.
  const resolved = words.map((word, i) => {
    const key = normalize(word);
    const fromSchema = syncLookup.get(key);

    // Per-word startFrame using the project's eased-stagger helper —
    // gives the wave-of-words feel premium motion has, instead of a
    // mechanical metronome.
    const wordStart = stagger({
      index: i,
      base: startFrame,
      gap: staggerGap,
      total: totalWords,
      // Use 'enter' easing in premium (groups toward end), 'swift' in
      // minimal (more linear → matches reading cadence).
      easingFn: isMinimal ? easings.swift : easings.enter,
    });

    // Decide icon resolution
    let iconKey: IconKey | undefined;
    let highlight = false;
    let iconSize: number | undefined;
    let placement: 'above' | 'below' | 'inline-right' = 'above';

    if (fromSchema) {
      if (fromSchema.icon === 'none') {
        // Explicit opt-out — render as plain text
      } else {
        iconKey = fromSchema.icon;
        highlight = fromSchema.highlight ?? true;
        iconSize = fromSchema.iconSize;
        placement = fromSchema.placement ?? 'above';
      }
    } else if (block.autoResolveIcons) {
      // Author OPTED IN to the global keyword auto-resolver. Without
      // this opt-in, words not in `syncs` always render as plain text.
      // (Auto-resolve is a footgun: words like 'time' [PT 'equipe'] map
      // to 'clock' which makes no sense in the wrong context.)
      const suggested = suggestIconForWord(word);
      if (suggested) {
        iconKey = suggested;
        highlight = true;
      }
    }

    const IconComponent = iconKey ? resolveIcon(iconKey) : undefined;

    return {
      word,
      wordStart,
      IconComponent,
      highlight,
      iconSize,
      placement,
    };
  });

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        // flex-end alignment so words with icons-above and plain words sit
        // on the SAME visual baseline (icons protrude upward instead of
        // pushing the row apart). `baseline` alignment broke when SyncWord
        // wrappers introduced a column flex parent — the children inside
        // a SyncWord no longer share a baseline with sibling spans.
        alignItems: 'flex-end',
        columnGap: '0.32em',
        rowGap: '0.4em',
        fontSize,
        // Enough width to comfortably fit the canonical 8-10-word
        // minimal sentence on one line at 56px.
        maxWidth: 1700,
        margin: '0 auto',
      }}
    >
      {resolved.map((r, i) => {
        const { word, wordStart, IconComponent, highlight, iconSize, placement } = r;

        if (IconComponent) {
          // Synced word + icon — entry handled inside SyncWord
          return (
            <SyncWord
              key={i}
              word={word}
              IconComponent={IconComponent}
              startFrame={wordStart}
              exitFrame={exitFrame}
              highlight={highlight}
              iconSize={iconSize}
              fontSize={fontSize}
              placement={placement}
            />
          );
        }

        // Plain function word — same stagger cadence, no icon
        return (
          <PlainWord
            key={i}
            word={word}
            startFrame={wordStart}
            exitFrame={exitFrame}
            fontSize={fontSize}
            isMinimal={isMinimal}
            frame={frame}
          />
        );
      })}
    </div>
  );
};

// ─── Plain word renderer ───────────────────────────────────────────────────

interface PlainWordProps {
  word: string;
  startFrame: number;
  exitFrame?: number;
  fontSize: number;
  isMinimal: boolean;
  frame: number;
}

const PlainWord: React.FC<PlainWordProps> = ({ word, startFrame, exitFrame, fontSize, isMinimal, frame }) => {
  const theme = useThemeTokens();
  // Same enter shape as SyncWord (emphasis easing, motion.enterFast) so
  // plain and synced words feel like part of the same gesture.
  const enterDuration = isMinimal ? motion.enterFast : motion.enter;
  const enterP = interpolate(
    frame,
    [startFrame, startFrame + enterDuration],
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
  const scale = interpolate(enterP, [0, 1], [0.85, 1])
    * interpolate(exitP, [0, 1], [0.94, 1]);

  return (
    <span
      style={{
        fontFamily: fonts.display,
        fontWeight: isMinimal ? weights.bold : weights.regular,
        fontSize,
        color: theme.fg,
        letterSpacing: '-0.02em',
        lineHeight: 1.05,
        opacity: visible,
        transform: `scale(${scale})`,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {word}
    </span>
  );
};
