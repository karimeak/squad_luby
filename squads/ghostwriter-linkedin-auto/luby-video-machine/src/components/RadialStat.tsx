/**
 * RadialStat
 *
 * Hero stat rendered as a radial donut: a track ring representing 100%,
 * an animated arc representing the value, and a synchronized count-up
 * number sitting in the donut's hole.
 *
 *           ╭─────────╮
 *          ╱           ╲
 *         │   60%       │       caption: "menos vulnerabilidades"
 *          ╲           ╱       source:  "Média Luby — 2025"
 *           ╰─────────╯
 *
 * Why a donut and not just a big number:
 *   - The track ring tells the eye what "100%" looks like, so the
 *     filled arc reads as "this much of the whole" — no ambiguity.
 *   - The arc growing in sync with the number locks the two together,
 *     turning two abstract elements (a shape, a number) into one
 *     evidence-driven statement.
 *
 * Animation:
 *   - Track fades in immediately
 *   - Arc grows 0 → value/100 of a full circle, with easings.enter
 *   - Number counts up in sync (same eased progress)
 *   - Glow head pulses at the arc tip while the stat holds
 *   - Caption mask-reveals after the number settles
 *   - Source slides in below
 *   - Exit: ring contracts slightly, everything fades
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { colors, fonts, weights, gradients } from '../design/tokens';
import { easings } from '../design/easings';
import { motion, breathe } from '../design/motion';

interface Props {
  /** The numeric value to count up to (e.g. 60 for "60%"). */
  value: number;
  /** Scale max — typically 100 for percentages. */
  max?: number;
  /** Suffix appended to the readout (e.g. "%", "x", " min"). */
  unit?: string;
  /** Caption shown below the donut. */
  caption: string;
  /** Optional small uppercase source line below the caption. */
  source?: string;
  startFrame: number;
  exitFrame?: number;
  /** Outer diameter of the donut in px. Default 480. */
  size?: number;
  /** Stroke width of the ring in px. Default 28. */
  thickness?: number;
  /** Override the arc colour. Defaults to the brand gradient look. */
  color?: string;
  /** Decimal places for the readout. Defaults to integer if value is integer. */
  decimals?: number;
  /**
   * Visual theme. 'dark' (default) renders the donut for navy backgrounds:
   * white-alpha track, white→blue gradient number, blue glows. 'light'
   * inverts to a navy-on-off-white look: navy-tinted track, navy→blue
   * gradient number, restrained halo so glow doesn't smudge on white.
   */
  theme?: 'dark' | 'light';
}

export const RadialStat: React.FC<Props> = ({
  value,
  max = 100,
  unit = '%',
  caption,
  source,
  startFrame,
  exitFrame,
  size = 480,
  thickness = 28,
  color = colors.blue,
  decimals,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Container enter: scale + clip-fade ─────────────────────────────────
  const containerP = interpolate(
    frame,
    [startFrame, startFrame + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );

  // ── Arc fill + number count-up: SAME progress, so they stay in lockstep
  const fillStart = startFrame + 8;
  const fillP = interpolate(
    frame,
    [fillStart, fillStart + motion.enterDramatic + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );

  // ── Exit
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;

  const opacity = Math.min(containerP, exitP);
  const enterScale = interpolate(containerP, [0, 1], [0.92, 1]);
  const exitScale  = interpolate(exitP,      [0, 1], [0.95, 1]);

  // ── Geometry
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const ratio = Math.max(0, Math.min(1, value / max));
  const filledRatio = ratio * fillP; // animated fill amount

  // We rotate the SVG so the arc starts at 12 o'clock and grows clockwise.
  // The dasharray trick: filled length = circumference * filledRatio.
  const dashArray = `${circumference * filledRatio} ${circumference}`;

  // ── Number formatting
  const displayedValue = value * fillP;
  const isIntegerValue = decimals === undefined ? Number.isInteger(value) : decimals === 0;
  const formatted = isIntegerValue
    ? Math.round(displayedValue).toString()
    : displayedValue.toFixed(decimals ?? 1);

  // ── Glow head at the arc tip (only meaningful once arc has length)
  // Position: angle θ = -π/2 + 2π * filledRatio  (start at top, sweep clockwise)
  const tipAngle = -Math.PI / 2 + 2 * Math.PI * filledRatio;
  const tipX = cx + r * Math.cos(tipAngle);
  const tipY = cy + r * Math.sin(tipAngle);
  const tipBreath = breathe({ frame, fps, speed: 0.5, min: 0.65, max: 1.0 });
  const tipVisible = filledRatio > 0.005;

  // ── Background halo behind the donut (intensifies during count)
  const haloIntensity = interpolate(fillP, [0, 1], [0, 1]);
  const haloBreath = breathe({ frame, fps, speed: 0.3, min: 0.7, max: 1.0 });

  // ── Caption / source timing
  const captionStart = startFrame + 36;
  const captionP = interpolate(
    frame,
    [captionStart, captionStart + motion.enterSlow],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const captionInset = (1 - captionP) * 100;
  const captionY = (1 - captionP) * 14;

  const sourceStart = startFrame + 50;
  const sourceP = source
    ? interpolate(
        frame,
        [sourceStart, sourceStart + motion.enter],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enterSoft },
      )
    : 0;
  const sourceY = (1 - sourceP) * 14;

  const gradId = `radial-arc-${startFrame}`;
  const glowFilterId = `radial-glow-${startFrame}`;

  // The arc gradient: from blueDeep to blueBright sweeping along the path.
  // SVG linearGradient is axis-aligned, so we cheat with two stops on a 45°
  // gradient — close enough that the eye reads it as "the arc has a glow tail".
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        transform: `scale(${enterScale * exitScale})`,
        transformOrigin: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background halo — restrained on light to avoid muddy blooms */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: size * 1.4,
            height: size * 1.4,
            borderRadius: '50%',
            background: isLight
              ? `radial-gradient(circle, rgba(65, 160, 220, 0.18) 0%, rgba(65, 160, 220, 0.05) 40%, transparent 65%)`
              : `radial-gradient(circle, ${colors.glow40} 0%, ${colors.glow10} 40%, transparent 65%)`,
            opacity: haloIntensity * haloBreath * (isLight ? 0.6 : 0.85),
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        {/* The donut SVG */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ position: 'relative', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              {/* On light backgrounds the gradient flips so the arc reads as
                  navy-deep rather than washing out against off-white */}
              <stop offset="0%"  stopColor={isLight ? colors.navyDeep : colors.blueDeep} />
              <stop offset="50%" stopColor={isLight ? colors.blueDeep : color} />
              <stop offset="100%" stopColor={isLight ? color : colors.blueBright} />
            </linearGradient>

            <filter id={glowFilterId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation={thickness * 0.4} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track ring — represents 100%. Theme-aware: dark uses white-alpha,
              light uses navy-alpha so the track stays subtly visible against
              an off-white surface without dominating it. */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={isLight ? 'rgba(15, 35, 65, 0.10)' : colors.whiteA10}
            strokeWidth={thickness}
          />

          {/* Filled arc — value/max of the circle */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={dashArray}
            // Rotate -90° so the arc starts at 12 o'clock
            transform={`rotate(-90 ${cx} ${cy})`}
            filter={`url(#${glowFilterId})`}
          />

          {/* Glow head at the tip of the arc */}
          {tipVisible && (
            <circle
              cx={tipX}
              cy={tipY}
              r={thickness * 0.55}
              fill={colors.blueBright}
              opacity={tipBreath}
              style={{
                filter: `drop-shadow(0 0 ${thickness * 0.6}px ${colors.blueBright}) drop-shadow(0 0 ${thickness * 1.2}px ${colors.glow80})`,
              }}
            />
          )}
        </svg>

        {/* The big number sitting in the donut hole. The gradient flips by
            theme: dark uses white→blue (light against navy), light uses
            navyDeep→blueDeep (dark against off-white) — both keep the
            "metallic shine" look that the original gradient sells. */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            fontFamily: fonts.display,
            fontWeight: weights.bold,
            fontSize: size * 0.32,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            background: isLight
              ? `linear-gradient(135deg, ${colors.navyDeep} 0%, ${colors.blueDeep} 60%, ${colors.blue} 100%)`
              : gradients.numberShine,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatted}
          <span
            style={{
              fontSize: size * 0.14,
              fontWeight: weights.semibold,
              marginLeft: 4,
              letterSpacing: '-0.02em',
            }}
          >
            {unit}
          </span>
        </div>
      </div>

      {/* Caption */}
      <div
        style={{
          marginTop: 28,
          fontFamily: fonts.display,
          fontWeight: weights.regular,
          fontSize: 32,
          lineHeight: 1.3,
          color: isLight ? '#3A4A66' : colors.gray100,
          textAlign: 'center',
          maxWidth: 800,
          letterSpacing: '-0.005em',
          opacity: captionP,
          clipPath: `inset(${captionInset}% 0 0 0)`,
          WebkitClipPath: `inset(${captionInset}% 0 0 0)`,
          transform: `translateY(${captionY}px)`,
        }}
      >
        {caption}
      </div>

      {/* Source */}
      {source && (
        <div
          style={{
            marginTop: 16,
            fontFamily: fonts.mono,
            fontSize: 14,
            letterSpacing: '0.1em',
            color: isLight ? '#6B7894' : colors.gray400,
            textTransform: 'uppercase',
            opacity: sourceP * 0.9,
            transform: `translateY(${sourceY}px)`,
          }}
        >
          {source}
        </div>
      )}
    </div>
  );
};
