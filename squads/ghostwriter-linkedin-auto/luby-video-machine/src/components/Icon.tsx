/**
 * Icon
 *
 * Wrapper around a Lucide icon with motion presets that fit the project's
 * vocabulary. Lucide ships pure-SVG icons with consistent stroke widths,
 * which means we can animate them — including a "draw" preset that animates
 * stroke-dashoffset on every path inside the icon.
 *
 * PRESETS
 *   - 'draw'   stroke-dashoffset reveal (the icon literally draws itself).
 *              Best for hero moments where the eye should follow the line.
 *   - 'pop'    scale 0→1 with overshoot (easings.emphasis).
 *              Best for fast, punchy entrances inside denser scenes.
 *   - 'bloom'  pop + a radial halo that breathes behind the icon.
 *              Best for "this is the concept" moments inside ConceptCard.
 *   - 'slide'  translates in from a direction with fade.
 *              Best for icons that arrive *with* a card from the side.
 *   - 'fade'   opacity-only (with easings.enter, never linear).
 *              The neutral default when the parent already animates.
 *
 * All presets support an optional exit at exitFrame and idle breathing.
 *
 * MODE-AWARENESS (v4)
 * ───────────────────
 * The icon now reacts to the active VISUAL MODE (luby-premium /
 * luby-minimal). When mounted inside a <ModeProvider>, it auto-detects
 * the current mode at the current frame; explicit `mode` prop overrides
 * the detection.
 *
 * In luby-minimal mode the icon's defaults FLATTEN automatically:
 *   - strokeWidth drops from 2 to 1.75 (matches the brand's minimal grammar)
 *   - the drop-shadow / bloom halo is suppressed entirely
 *   - idleBreathe is forced off
 *   - the default preset is 'pop' (no halo) instead of whatever the call site requested
 *
 * Per-call props still WIN over mode defaults — passing `glow={true}` in
 * a minimal scene re-enables the halo for that one icon. So scenes can
 * be minimal-by-default and break the rule for one accent moment.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import type { LucideIcon } from 'lucide-react';
import { colors } from '../design/tokens';
import { easings } from '../design/easings';
import { motion, breathe } from '../design/motion';
import { modes, type VisualMode } from '../design/modes';
import { useCurrentMode } from '../renderer/ModeContext';

export type IconPreset = 'draw' | 'pop' | 'bloom' | 'slide' | 'fade';

interface Props {
  /** A Lucide icon component (e.g. import { Zap } from 'lucide-react'; pass Zap). */
  Component: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
  startFrame: number;
  exitFrame?: number;
  enterDuration?: number;
  exitDuration?: number;
  preset?: IconPreset;
  /** For 'slide' preset: where the icon comes FROM. */
  slideFrom?: 'left' | 'right' | 'top' | 'bottom';
  /** For 'bloom' preset: halo color (defaults to brand glow). */
  glowColor?: string;
  /** Halo radius multiplier (default 2.4× the icon size). */
  glowSize?: number;
  /** Subtle idle breathing on the icon itself (scale + opacity). */
  idleBreathe?: boolean;
  /**
   * Override the active visual mode. If omitted, reads from <ModeProvider>
   * via useCurrentMode(). Default fallback (no provider) is 'luby-premium'.
   */
  mode?: VisualMode;
  /**
   * Override the mode-default suppression of the drop-shadow glow.
   * Useful for one-off accent icons in an otherwise minimal scene.
   */
  glow?: boolean;
}

export const Icon: React.FC<Props> = ({
  Component,
  size = 64,
  color = colors.blue,
  strokeWidth,
  startFrame,
  exitFrame,
  enterDuration,
  exitDuration = motion.exit,
  preset,
  slideFrom = 'bottom',
  glowColor = colors.glow60,
  glowSize = 2.4,
  idleBreathe,
  mode: modeOverride,
  glow: glowOverride,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Mode resolution ────────────────────────────────────────────────────
  // Auto-detect from context if not explicitly provided. The fallback
  // (no provider) is 'luby-premium' — preserves the look of any
  // legacy components still mounted outside a renderer.
  const ctxMode = useCurrentMode();
  const activeMode: VisualMode = modeOverride ?? ctxMode;
  const modePreset = modes[activeMode];

  // ── Resolve defaults from mode if caller didn't override ──────────────
  const effectiveStrokeWidth = strokeWidth ?? modePreset.icon.strokeWidth;
  const effectiveIdleBreathe = idleBreathe ?? modePreset.icon.idleBreathe;
  const effectivePreset: IconPreset = preset ?? modePreset.icon.defaultPreset;
  const effectiveEnterDuration = enterDuration ?? modePreset.motion.enterDuration;
  // Glow: explicit override wins; otherwise mode controls. Premium = true,
  // minimal = false. Bloom preset implies a halo regardless of glow flag.
  const effectiveGlow = glowOverride ?? modePreset.icon.glow;

  // Enter / exit progresses are shared across presets — what changes is
  // how each preset MAPS those progresses to transform/clip-path/opacity.
  const enterEasing =
    effectivePreset === 'pop' || effectivePreset === 'bloom'
      ? easings.emphasis
      : easings.enter;

  const enterP = interpolate(
    frame,
    [startFrame, startFrame + effectiveEnterDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: enterEasing },
  );

  const exitP = exitFrame !== undefined
    ? interpolate(
        frame,
        [exitFrame, exitFrame + exitDuration],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit },
      )
    : 1;

  // Idle breath — applied to anything that holds on screen for a while.
  const idle = effectiveIdleBreathe
    ? breathe({ frame, fps, speed: 0.35, min: 0.92, max: 1.0 })
    : 1;

  // Per-preset visual computation
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let opacity = Math.min(enterP, exitP);
  const clipPath: string | undefined = undefined;

  switch (effectivePreset) {
    case 'pop': {
      scale = 0.4 + 0.6 * enterP; // 0.4 → 1
      scale *= idle;
      break;
    }
    case 'bloom': {
      scale = 0.5 + 0.5 * enterP;
      scale *= idle;
      break;
    }
    case 'slide': {
      const dist = 48;
      const offset = (1 - enterP) * dist;
      if (slideFrom === 'left')   translateX = -offset;
      if (slideFrom === 'right')  translateX = offset;
      if (slideFrom === 'top')    translateY = -offset;
      if (slideFrom === 'bottom') translateY = offset;
      scale = idle;
      break;
    }
    case 'fade': {
      scale = interpolate(enterP, [0, 1], [0.96, 1]) * idle;
      break;
    }
    case 'draw': {
      scale = idle;
      opacity = Math.min(enterP > 0 ? 1 : 0, exitP);
      break;
    }
  }

  // For exit, give the icon a slight scale-down on exit so it doesn't just
  // "blink out". Skipping for slide (which translates).
  if (effectivePreset !== 'slide') {
    scale *= interpolate(exitP, [0, 1], [0.92, 1]);
  } else {
    const dist = 48;
    const out = (1 - exitP) * dist;
    if (slideFrom === 'left')   translateX -= out;
    if (slideFrom === 'right')  translateX += out;
    if (slideFrom === 'top')    translateY -= out;
    if (slideFrom === 'bottom') translateY += out;
  }

  // Bloom halo size + breathing.
  // The bloom preset implies a halo regardless of `effectiveGlow`. Other
  // presets only show their drop-shadow when `effectiveGlow` is true.
  const haloBreath = breathe({ frame, fps, speed: 0.4, min: 0.7, max: 1.0, phase: startFrame * 0.05 });
  const haloOpacity = effectivePreset === 'bloom' ? Math.min(enterP, exitP) * 0.9 * haloBreath : 0;
  const haloDiameter = size * glowSize;

  // For 'draw' preset we control stroke-dashoffset / opacity at the SVG level.
  const drawProgress = effectivePreset === 'draw' ? enterP : 1;
  const pathStrokeDasharray = effectivePreset === 'draw' ? 1 : undefined;
  const pathStrokeDashoffset = effectivePreset === 'draw' ? 1 - drawProgress : undefined;

  // Drop-shadow filter. Suppressed in minimal mode (effectiveGlow=false)
  // unless caller forces it. Saves the "glow on a flat icon" look the
  // minimal vocabulary explicitly forbids.
  const dropShadowFilter = effectiveGlow
    ? `drop-shadow(0 0 ${size * 0.18}px ${glowColor})`
    : undefined;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Bloom halo — sits behind the icon. Independent of effectiveGlow:
          if you explicitly chose 'bloom' preset, the halo renders. */}
      {effectivePreset === 'bloom' && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: haloDiameter,
            height: haloDiameter,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)`,
            opacity: haloOpacity,
            filter: 'blur(2px)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          opacity,
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          transformOrigin: 'center',
          willChange: 'transform, opacity',
          clipPath,
          WebkitClipPath: clipPath,
          filter: dropShadowFilter,
          lineHeight: 0,
        }}
      >
        <Component
          size={size}
          color={color}
          strokeWidth={effectiveStrokeWidth}
          pathLength={1}
          style={{
            strokeDasharray: pathStrokeDasharray,
            strokeDashoffset: pathStrokeDashoffset,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }}
        />
      </div>
    </div>
  );
};
