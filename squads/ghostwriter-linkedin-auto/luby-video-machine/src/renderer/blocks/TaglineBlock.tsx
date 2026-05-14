/**
 * TaglineBlock — renders a `kind: 'tagline'` block.
 *
 * The headline-tier display text in a scene. Used as the brand voice line
 * in IntroScene ("Desenvolvimento com IA, com segurança") and as the
 * closing statement in CTAScene ("Construa com IA. Construa com
 * segurança.").
 *
 * Motion: mask-reveal up from below with a 20px translate. Easings.enter
 * over motion.enterSlow (24f) in premium; motion.enter (18f) in minimal.
 * Tagline isn't usually mounted in minimal scenes — the SentenceWithSyncs
 * block plays that role there — but the support exists for consistency.
 */

import React from 'react';
import { MaskReveal } from '../../components/MaskReveal';
import { fonts, weights } from '../../design/tokens';
import { motion } from '../../design/motion';
import { useCurrentMode } from '../ModeContext';
import { useThemeTokens } from '../ThemeContext';
import type { TaglineBlock as TaglineBlockSpec } from '../../schema/types';

interface Props {
  block: TaglineBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

export const TaglineBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const mode = useCurrentMode();
  const theme = useThemeTokens();

  const size = block.size ?? (mode === 'luby-minimal' ? 64 : 52);
  const align = block.align ?? 'center';
  const enterDuration = mode === 'luby-minimal' ? motion.enter : motion.enterSlow;

  // Theme-aware color:
  //   - Dark theme + minimal mode → pure white (high contrast on navy)
  //   - Dark theme + premium mode → gray100 (slightly softer)
  //   - Light theme → navyDeep (theme.fg — readable on off-white)
  const textColor = theme.name === 'light'
    ? theme.fg
    : (mode === 'luby-minimal' ? theme.fg : theme.fgMuted);

  return (
    <MaskReveal
      enterAt={startFrame}
      enterDuration={enterDuration}
      exitAt={exitFrame}
      direction="up"
      translate={20}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: mode === 'luby-minimal' ? weights.bold : weights.regular,
          fontSize: size,
          color: textColor,
          letterSpacing: '-0.02em',
          textAlign: align,
          maxWidth: 1400,
          lineHeight: 1.18,
        }}
      >
        {block.text}
      </div>
    </MaskReveal>
  );
};
