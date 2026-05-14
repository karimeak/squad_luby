/**
 * BigStatBlock — renders a `kind: 'big-stat'` block.
 *
 * Three visual styles supported via the schema:
 *
 *   'typographic'      — number + caption + source, no decoration. Default.
 *   'donut'            — radial progress ring + count-up number in centre.
 *   'comparison-bars'  — number on the left + two stacked bars on the
 *                        right (baseline 1× pre-filled + target N×
 *                        animating). For "before vs after" beats.
 *
 * Number parsing: if `value` contains a single parseable number (e.g.
 * "60%", "3x", "1.2k"), the renderer animates a count-up from 0 to that
 * number. If `value` contains a range or non-parseable text (e.g. "3-5×",
 * "muitos", "GA"), it renders STATICALLY — count-up doesn't make sense
 * for a range. The string is preserved exactly as authored.
 *
 * Mode-awareness:
 *   - Premium: heavy gradient text, glow halo behind number, breathing
 *   - Minimal: solid white number, no halo, no breathing
 *   The block reads useCurrentMode(); per-call override not exposed.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion, breathe } from '../../design/motion';
import { useCurrentMode } from '../ModeContext';
import { useThemeTokens } from '../ThemeContext';
import { RadialStat } from '../../components/RadialStat';
import type { BigStatBlock as BigStatBlockSpec } from '../../schema/types';

interface Props {
  block: BigStatBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

/**
 * Tries to extract a single number + prefix + suffix from the value
 * string. Returns null if the string contains a range, multiple numbers,
 * or no parseable number — in which case the renderer keeps the string
 * literal (no count-up).
 */
const tryParseSingleNumber = (raw: string): { num: number; prefix: string; suffix: string } | null => {
  // Reject ranges immediately ("3-5x", "3 to 5x", "1.2-2.4k")
  if (/\d.*[-–—].*\d/.test(raw)) return null;
  const match = raw.match(/^([^\d.,-]*)([\d.,]+)(.*)$/);
  if (!match) return null;
  const [, prefix, numStr, suffix] = match;
  const num = parseFloat(numStr.replace(/,/g, ''));
  if (!Number.isFinite(num)) return null;
  return { num, prefix, suffix };
};

export const BigStatBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mode = useCurrentMode();
  const theme = useThemeTokens();
  const isMinimal = mode === 'luby-minimal';
  const style = block.style ?? 'typographic';

  // ── Container enter / exit ──────────────────────────────────────────────
  const enterDuration = isMinimal ? motion.enter : motion.enterSlow;
  const containerP = interpolate(
    frame,
    [startFrame, startFrame + enterDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;
  const opacity = Math.min(containerP, exitP);
  const enterScale = interpolate(containerP, [0, 1], [0.94, 1]);
  const exitScale = interpolate(exitP, [0, 1], [0.95, 1]);

  // ── Number rendering: count-up if parseable, static otherwise ───────────
  const parsed = tryParseSingleNumber(block.value);
  let numberDisplay: string;
  if (parsed) {
    const numberStart = startFrame + 8;
    const numberP = interpolate(
      frame,
      [numberStart, numberStart + motion.enterDramatic + 12],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
    );
    const liveNum = parsed.num * numberP;
    const isInteger = Number.isInteger(parsed.num);
    const formatted = isInteger ? Math.round(liveNum).toString() : liveNum.toFixed(1);
    numberDisplay = `${parsed.prefix}${formatted}${parsed.suffix}`;
  } else {
    numberDisplay = block.value; // verbatim, no animation
  }

  // ── Caption + source mask reveals ───────────────────────────────────────
  const captionStart = startFrame + 24;
  const captionP = interpolate(
    frame,
    [captionStart, captionStart + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const captionInset = (1 - captionP) * 100;
  const captionY = (1 - captionP) * 12;

  const sourceStart = startFrame + 40;
  const sourceP = block.source
    ? interpolate(frame, [sourceStart, sourceStart + motion.enter], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enterSoft,
      })
    : 0;
  const sourceY = (1 - sourceP) * 14;

  // ── Halo (premium only) ─────────────────────────────────────────────────
  const haloBreath = breathe({ frame, fps, speed: 0.5, min: 0.7, max: 1 });
  const haloOpacity = !isMinimal ? containerP * haloBreath * 0.7 : 0;

  // Style dispatch — branch ONLY differs in layout chrome around number.
  // The number element + caption + source are reused.
  if (style === 'donut') {
    // Delegate to RadialStat (existing primitive). Parses value to extract
    // num + unit; falls back to typographic if value can't be parsed.
    if (parsed) {
      return (
        <RadialStat
          value={parsed.num}
          unit={parsed.suffix}
          caption={block.caption}
          source={block.source}
          startFrame={startFrame}
          exitFrame={exitFrame}
          size={460}
          thickness={26}
          theme={theme.name}
        />
      );
    }
    // value is non-parseable (e.g. "3-5×") → fall through to typographic
  }

  if (style === 'comparison-bars' && block.comparisonBars) {
    return (
      <ComparisonBarsLayout
        block={block}
        comparisonBars={block.comparisonBars}
        numberDisplay={numberDisplay}
        opacity={opacity}
        enterScale={enterScale}
        exitScale={exitScale}
        captionP={captionP}
        captionY={captionY}
        captionInset={captionInset}
        sourceP={sourceP}
        sourceY={sourceY}
        haloOpacity={haloOpacity}
        isMinimal={isMinimal}
        themeFg={theme.fg}
        startFrame={startFrame}
        frame={frame}
      />
    );
  }

  // 'typographic' (default) and 'donut' (TODO — falls back to typographic
  // for now; donut renderer is in src/components/RadialStat.tsx and would
  // be wired here in a follow-up if a video needs it).
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        // Typographic variant now CENTERS the number + caption + source.
        // Previously flex-start, which made the caption + source align
        // left below the number — feedback was "centralizar tudo".
        alignItems: 'center',
        opacity,
        transform: `scale(${enterScale * exitScale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Halo behind the number (premium only) — centered now */}
      {!isMinimal && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: '40%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            height: 500,
            background: `radial-gradient(ellipse, ${colors.glow40} 0%, transparent 60%)`,
            opacity: haloOpacity,
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
      )}

      <NumberDisplay value={numberDisplay} isMinimal={isMinimal} themeFg={theme.fg} />

      <div
        style={{
          marginTop: gap.elements,
          fontFamily: fonts.display,
          fontWeight: weights.regular,
          fontSize: 38,
          lineHeight: 1.3,
          color: theme.name === 'light' ? theme.fg : (isMinimal ? colors.white : colors.gray100),
          opacity: captionP,
          clipPath: `inset(${captionInset}% 0 0 0)`,
          WebkitClipPath: `inset(${captionInset}% 0 0 0)`,
          transform: `translateY(${captionY}px)`,
          maxWidth: 1000,
          letterSpacing: '-0.01em',
          textAlign: 'center',
        }}
      >
        {block.caption}
      </div>

      {block.source && (
        <div
          style={{
            marginTop: gap.intra,
            fontFamily: fonts.mono,
            fontSize: 16,
            letterSpacing: '0.08em',
            color: theme.name === 'light' ? theme.fgSubtle : (isMinimal ? colors.gray300 : colors.gray400),
            opacity: sourceP * 0.9,
            transform: `translateY(${sourceY}px)`,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {block.source}
        </div>
      )}
    </div>
  );
};

// ─── Number display (shared between layouts) ───────────────────────────────

const NumberDisplay: React.FC<{ value: string; isMinimal: boolean; themeFg?: string }> = ({ value, isMinimal, themeFg }) => {
  // Premium: gradient brand-blue text shine + tabular nums
  // Minimal: solid theme.fg (white on dark, navy on light)
  const baseStyle: React.CSSProperties = {
    fontFamily: fonts.display,
    fontWeight: weights.bold,
    fontSize: 280,
    lineHeight: 0.95,
    letterSpacing: '-0.05em',
    fontVariantNumeric: 'tabular-nums',
  };

  // Minimal mode: solid theme.fg, no gradient.
  if (isMinimal) {
    return <div style={{ ...baseStyle, color: themeFg ?? colors.white }}>{value}</div>;
  }

  // Light theme detection (themeFg passed from BigStatBlock — see callers).
  // The gradient trick (background-clip: text + transparent fill) is the
  // brand wordmark look on dark, but it failed to render on light in
  // some browsers (the gradient leaked as a solid block over the number).
  // On light theme we render the number as a SOLID navy/blueDeep instead
  // of trying the gradient — keeps it bullet-proof.
  const isLightTheme = themeFg !== undefined && themeFg !== colors.white;
  if (isLightTheme) {
    return (
      <div
        style={{
          ...baseStyle,
          color: colors.navyDeep,
          // Subtle drop shadow to give the heavy number a hint of weight
          // on the off-white surface, without competing with brand glows.
          textShadow: `0 2px 24px rgba(15, 35, 65, 0.10)`,
        }}
      >
        {value}
      </div>
    );
  }

  // Dark theme: the brand wordmark gradient — white at top → bright blue at bottom.
  return (
    <div
      style={{
        ...baseStyle,
        background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.blueBright} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {value}
    </div>
  );
};

// ─── Comparison-bars layout ────────────────────────────────────────────────

interface ComparisonBarsLayoutProps {
  block: BigStatBlockSpec;
  comparisonBars: NonNullable<BigStatBlockSpec['comparisonBars']>;
  numberDisplay: string;
  opacity: number;
  enterScale: number;
  exitScale: number;
  captionP: number;
  captionY: number;
  captionInset: number;
  sourceP: number;
  sourceY: number;
  haloOpacity: number;
  isMinimal: boolean;
  themeFg?: string;
  startFrame: number;
  frame: number;
}

const ComparisonBarsLayout: React.FC<ComparisonBarsLayoutProps> = ({
  block, comparisonBars, numberDisplay, opacity, enterScale, exitScale,
  captionP, captionY, captionInset, sourceP, sourceY, haloOpacity, isMinimal,
  themeFg, startFrame, frame,
}) => {
  // Detect light theme by checking if themeFg is the navy color from
  // the light theme tokens. (Plumbing the theme name explicitly through
  // 5 levels of props would be messier than this one check.)
  const isLightTheme = themeFg === colors.navyDeep;
  const { baseline, target } = comparisonBars;

  // Bar geometry — both bars share the same UNIT width. The baseline
  // bar renders at `baseline.ratio × unit`; the target bar grows from
  // 0 to `target.ratio × unit` over the animation window.
  // We size the unit so the larger bar fits comfortably in ~520px (the
  // right column of a 1920px frame after the number on the left).
  const maxRatio = Math.max(baseline.ratio, target.ratio);
  const UNIT_PX = Math.min(120, 520 / maxRatio); // adaptive unit
  const baselineWidth = baseline.ratio * UNIT_PX;
  const targetMaxWidth = target.ratio * UNIT_PX;

  // Target bar grows from frame +20 to +50 (after the number is mid-count)
  const targetGrowStart = startFrame + 20;
  const targetGrowEnd = targetGrowStart + 30;
  const targetGrowP = interpolate(
    frame,
    [targetGrowStart, targetGrowEnd],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const targetCurrentWidth = targetMaxWidth * targetGrowP;

  // Baseline bar fades in slightly before the target starts growing
  const baselineFadeStart = startFrame + 12;
  const baselineP = interpolate(
    frame,
    [baselineFadeStart, baselineFadeStart + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enterSoft },
  );

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 80,
        opacity,
        transform: `scale(${enterScale * exitScale})`,
        transformOrigin: 'center',
      }}
    >
      {/* Halo behind the whole composition (premium only) */}
      {!isMinimal && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: -100,
            top: -100,
            width: 1200,
            height: 600,
            background: `radial-gradient(ellipse, ${colors.glow40} 0%, transparent 60%)`,
            opacity: haloOpacity,
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* LEFT: number + caption + source */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <NumberDisplay value={numberDisplay} isMinimal={isMinimal} themeFg={themeFg} />

        <div
          style={{
            marginTop: gap.elements,
            fontFamily: fonts.display,
            fontWeight: weights.regular,
            fontSize: 32,
            lineHeight: 1.3,
            color: isLightTheme ? themeFg : (isMinimal ? colors.white : colors.gray100),
            opacity: captionP,
            clipPath: `inset(${captionInset}% 0 0 0)`,
            WebkitClipPath: `inset(${captionInset}% 0 0 0)`,
            transform: `translateY(${captionY}px)`,
            maxWidth: 480,
            letterSpacing: '-0.01em',
          }}
        >
          {block.caption}
        </div>

        {block.source && (
          <div
            style={{
              marginTop: gap.intra,
              fontFamily: fonts.mono,
              fontSize: 14,
              letterSpacing: '0.08em',
              color: isLightTheme ? '#6B7894' : (isMinimal ? colors.gray300 : colors.gray400),
              opacity: sourceP * 0.9,
              transform: `translateY(${sourceY}px)`,
              textTransform: 'uppercase',
              maxWidth: 480,
            }}
          >
            {block.source}
          </div>
        )}
      </div>

      {/* RIGHT: stacked comparison bars with dataviz craft */}
      <ComparisonBarsPanel
        baseline={baseline}
        target={target}
        baselineWidth={baselineWidth}
        targetCurrentWidth={targetCurrentWidth}
        targetMaxWidth={targetMaxWidth}
        targetGrowP={targetGrowP}
        baselineP={baselineP}
        isMinimal={isMinimal}
        isLightTheme={isLightTheme}
        UNIT_PX={UNIT_PX}
        maxRatio={maxRatio}
      />
    </div>
  );
};

// ─── Comparison bars panel — full dataviz layout ─────────────────────────
//
// Premium-craft comparison bars: gradient fill on the active bar, soft
// glow, delta annotation between the two bars (e.g. "+300%"), unit tick
// marks below the bars to ground them in a scale, and a rendered ratio
// value at the right end of each bar (e.g. "1×", "4×"). Bars are stacked
// with the BASELINE on top (smaller, dim) and TARGET on bottom (larger,
// active, glowing) — reading order: "this WAS the world, this is now".

interface ComparisonBarsPanelProps {
  baseline: { label: string; ratio: number };
  target:   { label: string; ratio: number };
  baselineWidth: number;
  targetCurrentWidth: number;
  targetMaxWidth: number;
  targetGrowP: number;
  baselineP: number;
  isMinimal: boolean;
  isLightTheme?: boolean;
  UNIT_PX: number;
  maxRatio: number;
}

const ComparisonBarsPanel: React.FC<ComparisonBarsPanelProps> = ({
  baseline, target, baselineWidth, targetCurrentWidth, targetMaxWidth,
  targetGrowP, baselineP, isMinimal, isLightTheme, UNIT_PX, maxRatio,
}) => {
  // Delta percentage (e.g. 4× vs 1× → +300%)
  const deltaPercent = Math.round(((target.ratio - baseline.ratio) / baseline.ratio) * 100);
  const deltaText = `+${deltaPercent}%`;

  // Tick marks: render one mark per unit ratio (1×, 2×, 3×, ... up to maxRatio)
  // Subtle vertical lines below the bars, anchored to the same UNIT_PX grid.
  const tickCount = Math.floor(maxRatio);
  const ticks = Array.from({ length: tickCount }, (_, i) => i + 1);

  // The delta annotation fades in slightly after the target bar finishes growing
  const deltaP = Math.max(0, (targetGrowP - 0.7) / 0.3);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        minWidth: maxRatio * UNIT_PX + 120,
        position: 'relative',
      }}
    >
      {/* Baseline row (top) */}
      <BarRow
        label={baseline.label}
        ratio={baseline.ratio}
        width={baselineWidth}
        maxWidth={targetMaxWidth}
        opacity={baselineP}
        isMinimal={isMinimal}
        isLightTheme={isLightTheme}
        variant="baseline"
      />

      {/* Target row (bottom) — the protagonist */}
      <BarRow
        label={target.label}
        ratio={target.ratio}
        width={targetCurrentWidth}
        maxWidth={targetMaxWidth}
        opacity={baselineP}
        isMinimal={isMinimal}
        isLightTheme={isLightTheme}
        variant="target"
        // Only show the ratio readout once the bar is mostly grown
        showRatio={targetGrowP > 0.7}
      />

      {/* Tick scale under the bars — subtle anchor to a numeric grid */}
      <div
        style={{
          position: 'relative',
          height: 18,
          marginTop: 4,
          opacity: baselineP * 0.6,
        }}
      >
        {ticks.map((tick) => (
          <div
            key={tick}
            style={{
              position: 'absolute',
              left: tick * UNIT_PX - 1,
              top: 0,
              width: 2,
              height: 6,
              background: isLightTheme ? 'rgba(15, 35, 65, 0.20)' : colors.whiteA20,
            }}
          />
        ))}
        {ticks.map((tick) => (
          <div
            key={`label-${tick}`}
            style={{
              position: 'absolute',
              left: tick * UNIT_PX,
              top: 10,
              transform: 'translateX(-50%)',
              fontFamily: fonts.mono,
              // Bumped 10→14 — was illegible at small sizes.
              fontSize: 14,
              letterSpacing: '0.04em',
              color: isLightTheme ? '#6B7894' : colors.gray400,
              fontWeight: weights.medium,
            }}
          >
            {tick}×
          </div>
        ))}
      </div>

      {/* Delta annotation — "+300%" floating between baseline and target,
          to the right side, signalling the magnitude of the difference */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 30, // between the two rows visually
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          opacity: deltaP,
          transform: `translateY(${(1 - deltaP) * 8}px)`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.bold,
            // Bumped 28→38 — delta is the punchline number; should command
            // the right column.
            fontSize: 38,
            color: isLightTheme ? colors.blueDeep : colors.blueBright,
            letterSpacing: '-0.01em',
            textShadow: !isMinimal && !isLightTheme ? `0 0 16px ${colors.glow40}` : undefined,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {deltaText}
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            // Bumped 10→14
            fontSize: 14,
            letterSpacing: '0.16em',
            color: isLightTheme ? '#6B7894' : colors.gray400,
            textTransform: 'uppercase',
            marginTop: 4,
            fontWeight: weights.semibold,
          }}
        >
          DELTA
        </div>
      </div>
    </div>
  );
};

// ─── A single bar row (label + bar + ratio readout) ──────────────────────

interface BarRowProps {
  label: string;
  ratio: number;
  width: number;
  maxWidth: number;
  opacity: number;
  isMinimal: boolean;
  isLightTheme?: boolean;
  variant: 'baseline' | 'target';
  showRatio?: boolean;
}

const BarRow: React.FC<BarRowProps> = ({
  label, ratio, width, maxWidth, opacity, isMinimal, isLightTheme, variant, showRatio = true,
}) => {
  const isTarget = variant === 'target';
  // Light theme: target uses blueDeep (legible navy-blue on off-white).
  // Baseline label/ratio uses a darker gray (#6B7894 from theme.fgSubtle).
  const labelColor = isTarget
    ? (isLightTheme ? colors.blueDeep : (isMinimal ? colors.white : colors.blueBright))
    : (isLightTheme ? '#3A4A66' : colors.gray300);
  const ratioColor = isTarget
    ? (isLightTheme ? colors.blueDeep : (isMinimal ? colors.white : colors.blueBright))
    : (isLightTheme ? '#6B7894' : colors.gray400);

  // Bar fill style. Light theme: target = brand gradient blueDeep→blue
  // (visible on off-white); baseline = navy at 15% alpha.
  const barBackground = isTarget
    ? (isLightTheme
        ? `linear-gradient(90deg, ${colors.blueDeep} 0%, ${colors.blue} 100%)`
        : (isMinimal
            ? colors.blueBright
            : `linear-gradient(90deg, ${colors.blue} 0%, ${colors.blueBright} 100%)`))
    : (isLightTheme ? 'rgba(15, 35, 65, 0.15)' : (isMinimal ? colors.gray400 : colors.whiteA20));

  const barBoxShadow = isTarget && !isMinimal && !isLightTheme
    ? `0 0 32px ${colors.glow60}, 0 0 8px ${colors.glow40}, inset 0 1px 0 ${colors.whiteA20}`
    : undefined;

  return (
    <div style={{ opacity, position: 'relative' }}>
      {/* Label row — name + ratio readout on the right */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 8,
          width: maxWidth + 60,
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: isTarget ? weights.semibold : weights.regular,
            // Bumped 18→24 — was too small to read in motion (feedback).
            fontSize: 24,
            letterSpacing: '0.01em',
            color: labelColor,
          }}
        >
          {label}
        </div>
        {showRatio && (
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: weights.bold,
              // Bumped 22→32 — the ratio number should read clearly.
              fontSize: 32,
              letterSpacing: '-0.01em',
              color: ratioColor,
              fontVariantNumeric: 'tabular-nums',
              textShadow: isTarget && !isMinimal && !isLightTheme ? `0 0 12px ${colors.glow40}` : undefined,
            }}
          >
            {ratio}×
          </div>
        )}
      </div>

      {/* Bar track + fill — bumped height 28→36 for stronger read */}
      <div
        style={{
          height: 36,
          width: maxWidth,
          background: isLightTheme
            ? 'rgba(15, 35, 65, 0.06)'
            : (isMinimal ? 'rgba(255,255,255,0.04)' : colors.whiteA05),
          borderRadius: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width,
            background: barBackground,
            borderRadius: 6,
            boxShadow: barBoxShadow,
            // Subtle inner shine on the target bar (premium)
            position: 'relative',
          }}
        />
        {/* Inner sheen on the target bar — gives the bar a "lit" look,
            placed via a second overlay div so it doesn't fight the fill */}
        {isTarget && !isMinimal && width > 0 && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width,
              height: '50%',
              background: `linear-gradient(180deg, ${colors.whiteA10} 0%, transparent 100%)`,
              borderRadius: '6px 6px 0 0',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
};
