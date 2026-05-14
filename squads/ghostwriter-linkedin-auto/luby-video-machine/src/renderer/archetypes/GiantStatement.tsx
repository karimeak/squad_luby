/**
 * GiantStatement — archetype "giant-statement".
 *
 *
 *
 *           OBSOLETO.
 *
 *
 *
 * Uma palavra/frase ocupando praticamente toda a tela. Tipografia
 * gigante (≥160px), motion mínimo. Sem ícone, sem card. O peso
 * visual É a mensagem.
 *
 * REVEAL VARIANTS:
 *   - 'mask-up'                 (default) — palavra inteira revela via clip-path up
 *   - 'word-by-word'            — cada palavra entra com stagger, mask-up individual
 *   - 'letterspacing-settle'    — entra com letter-spacing aberto, settla apertado
 *
 * REUSA: tipografia de tokens + MaskReveal para variant 'mask-up'.
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { MaskReveal } from '../../components/MaskReveal';
import { colors, fonts, weights } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion } from '../../design/motion';
import type { GiantStatementBlock } from '../../schema/types';

interface Props {
  block: GiantStatementBlock;
  startFrame: number;
  exitFrame?: number;
}

export const GiantStatement: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const size = block.size ?? 200;
  const weight = block.weight ?? 'semibold';
  const reveal = block.reveal ?? 'mask-up';
  const accent = block.accent ?? 'white';

  const color = accent === 'bright' ? colors.blueBright
              : accent === 'deep'   ? colors.blueDeep
              : colors.white;

  const fontWeight = weight === 'bold'   ? weights.bold
                   : weight === 'black'  ? weights.black
                   : weights.semibold;

  // Shared text styles
  const baseTextStyle: React.CSSProperties = {
    fontFamily: fonts.display,
    fontWeight,
    fontSize: size,
    color,
    letterSpacing: '-0.04em',
    lineHeight: 0.95,
    textAlign: 'center',
    // Generous shadow on display tier — reads as "lit by the brand glow",
    // not as drop-shadow.
    textShadow: accent === 'white'
      ? `0 0 80px ${colors.glow40}, 0 0 24px ${colors.glow30}`
      : 'none',
    maxWidth: 1700,
  };

  if (reveal === 'word-by-word') {
    return (
      <WordByWord
        text={block.text}
        baseStyle={baseTextStyle}
        startFrame={startFrame}
        exitFrame={exitFrame}
      />
    );
  }

  if (reveal === 'letterspacing-settle') {
    return (
      <LetterSpacingSettle
        text={block.text}
        baseStyle={baseTextStyle}
        startFrame={startFrame}
        exitFrame={exitFrame}
      />
    );
  }

  // Default: mask-up
  return (
    <MaskReveal
      enterAt={startFrame}
      exitAt={exitFrame}
      enterDuration={motion.enterDramatic}
      direction="up"
      translate={48}
    >
      <div style={baseTextStyle}>{block.text}</div>
    </MaskReveal>
  );
};

// ─── word-by-word reveal ────────────────────────────────────────────────

const WordByWord: React.FC<{
  text: string;
  baseStyle: React.CSSProperties;
  startFrame: number;
  exitFrame?: number;
}> = ({ text, baseStyle, startFrame, exitFrame }) => {
  const words = text.split(/\s+/);
  const PER_WORD_STAGGER = 8;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.3em',
        ...baseStyle,
      }}
    >
      {words.map((w, i) => (
        <MaskReveal
          key={i}
          enterAt={startFrame + i * PER_WORD_STAGGER}
          exitAt={exitFrame}
          enterDuration={motion.enterSlow}
          direction="up"
          translate={32}
        >
          <span>{w}</span>
        </MaskReveal>
      ))}
    </div>
  );
};

// ─── letterspacing settle ──────────────────────────────────────────────

const LetterSpacingSettle: React.FC<{
  text: string;
  baseStyle: React.CSSProperties;
  startFrame: number;
  exitFrame?: number;
}> = ({ text, baseStyle, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();

  // Settle: starts open (~0.04em), settles to design value (-0.04em)
  const settleP = interpolate(
    frame,
    [startFrame, startFrame + motion.enterDramatic],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const tracking = interpolate(settleP, [0, 1], [0.06, -0.04]);

  const opacity = interpolate(
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

  return (
    <div
      style={{
        ...baseStyle,
        letterSpacing: `${tracking}em`,
        opacity: Math.min(opacity, exitP),
      }}
    >
      {text}
    </div>
  );
};
