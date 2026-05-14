/**
 * Pipeline
 *
 * Horizontal sequence of gates connected left-to-right. Communicates a
 * PROCESS over time, not just a list. Built specifically for the
 * BulletsScene's "three pillars" beat:
 *
 *   [ start ] ──→ ⬢ stage1 ──→ ⬢ stage2 ──→ ⬢ stage3 ──→ [ end ]
 *
 * What it choreographs:
 *   1. The start label slides in from the left
 *   2. The first connector draws toward stage1
 *   3. Stage1 hex pops in (icon + label + caption)
 *   4. Connector stage1→stage2 draws
 *   5. Stage2 hex pops in
 *   6. ... and so on through stage3 and the end label
 *   7. Hold: every connector carries flow dots, every gate idle-breathes
 *   8. Exit (optional): all elements fade together with a tiny scale-down
 *
 * The component manages its own internal stagger. The caller only passes
 * `startFrame` (when the WHOLE pipeline begins) and `exitFrame`. Per-stage
 * timing is derived from beats so it stays musical.
 *
 * Coords are absolute over the full 1920×1080 canvas — the component fills
 * the AbsoluteFill it sits inside, and lays everything out around its
 * `centerY` (defaults to 540). Use `xRange` to control horizontal spread.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
// useVideoConfig is used in the Gate sub-component below
import type { LucideIcon } from 'lucide-react';
import { colors, fonts, weights, radius, pillars } from '../design/tokens';
import type { PillarKey } from '../design/tokens';
import { easings } from '../design/easings';
import { motion, beats, breathe } from '../design/motion';
import { useThemeTokens } from '../renderer/ThemeContext';
import { Icon } from './Icon';
import { Connector } from './Connector';

export interface PipelineStage {
  IconComponent: LucideIcon;
  title: string;
  caption?: string;
  /** Which pillar tone owns this stage (defaults: 1, 2, 3 in order). */
  pillar?: PillarKey;
}

interface Props {
  /** Label shown at the very start of the pipeline (e.g. "PR"). */
  startLabel: string;
  /** Label shown at the very end (e.g. "Deploy"). */
  endLabel: string;
  /** The three (or N) middle stages. 3 is the designed-for case. */
  stages: PipelineStage[];
  /** Frame at which the whole pipeline begins. */
  startFrame: number;
  /** Frame at which the whole pipeline begins exiting. */
  exitFrame?: number;
  /** Vertical center of the pipeline. Default 540 (1080/2). */
  centerY?: number;
  /** Left/right canvas bounds for the pipeline. Default [240, 1680]. */
  xRange?: [number, number];
  /** Hex/gate diameter in px. Default 120. */
  gateSize?: number;
}

const HEX_VERTICES = (cx: number, cy: number, r: number): string => {
  // Pointy-top hexagon — 6 vertices at 60° intervals starting from top
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (-Math.PI / 2) + i * (Math.PI / 3);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push(`${x},${y}`);
  }
  return pts.join(' ');
};

export const Pipeline: React.FC<Props> = ({
  startLabel,
  endLabel,
  stages,
  startFrame,
  exitFrame,
  centerY = 540,
  xRange = [240, 1680],
  gateSize = 120,
}) => {
  const frame = useCurrentFrame();

  // ── Layout: distribute start label, N gates, end label evenly along xRange.
  // We want start and end labels to feel like "endpoints", not gates, so they
  // sit at the bounds with the gates spread between them.
  const N = stages.length;
  const totalSlots = N + 2; // start + N stages + end
  const xStep = (xRange[1] - xRange[0]) / (totalSlots - 1);
  const startX = xRange[0];
  const endX   = xRange[1];
  const stageX = (i: number): number => xRange[0] + xStep * (i + 1);

  // ── Beat-based timing
  // Choreography (each step = ~1 beat = 12f):
  //   t0  +0   start label slides in
  //   t1  +6   connector start→stage1 draws
  //   t2  +18  stage1 pops
  //   t3  +30  connector 1→2
  //   t4  +42  stage2 pops
  //   t5  +54  connector 2→3
  //   t6  +66  stage3 pops
  //   t7  +78  connector 3→end
  //   t8  +90  end label slides in
  //
  // Tight enough that the whole pipeline assembles in ~3 seconds, leaving
  // most of the bullets-scene window (~13s) for held flow dots.
  const T = {
    start:        startFrame,
    connStart:    startFrame + 6,
    stage:        (i: number) => startFrame + beats(1.5) + i * beats(2),    // 18, 42, 66...
    connBetween:  (i: number) => startFrame + beats(2.5) + i * beats(2),    // 30, 54, 78
    end:          startFrame + beats(1.5) + N * beats(2) + beats(0.5),       // after last stage
    connToEnd:    startFrame + beats(1) + N * beats(2),                       // last connector
  };

  // ── Endpoint label animations (start + end)
  const labelEnter = (at: number): number =>
    interpolate(frame, [at, at + motion.enter], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter,
    });
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;

  const startP = labelEnter(T.start);
  const endP   = labelEnter(T.end);

  // Connector endpoints sit just outside each gate so the line doesn't visually
  // overlap the hex border. For endpoint pills (start/end), we use a tighter
  // edge offset because the pill is smaller than a gate.
  const gateRadius = gateSize / 2;
  const gateEdge   = gateRadius + 8;
  const pillEdge   = 60; // approx pill width / 2 + small gap

  // Stages render as a gate group; the gate itself is an SVG hex behind a
  // centred Lucide icon (positioned via absolute div for crisp text).
  return (
    <>
      {/* ── Endpoint label: start ──────────────────────────────────────── */}
      <EndpointLabel
        text={startLabel}
        x={startX}
        y={centerY}
        progress={startP}
        exit={exitP}
      />

      {/* ── Connector: start → stage1 ─────────────────────────────────── */}
      <Connector
        from={{ x: startX + pillEdge, y: centerY }}
        to={{   x: stageX(0) - gateEdge, y: centerY }}
        startFrame={T.connStart}
        drawDuration={motion.enter}
        exitFrame={exitFrame}
        thickness={2.5}
        color={pillars.pillar1.color}
        flow
        flowCount={1}
        flowColor={pillars.pillar1.color}
        glow
      />

      {/* ── Stages with their connectors ─────────────────────────────── */}
      {stages.map((stage, i) => {
        const px = stageX(i);
        // Cycle through the 3 brand pillars when there are more than 3
        // stages. Author can override per-stage via `stage.pillar`.
        // Why cycle: tokens.pillars only defines pillar1/2/3 (3 blue
        // family tones). Going beyond would introduce off-brand colors;
        // cycling keeps the pipeline in the brand family even for
        // longer cycles (4-5 stages).
        const pillarKey: PillarKey =
          stage.pillar ?? (`pillar${(i % 3) + 1}` as PillarKey);
        const pillar = pillars[pillarKey];
        const at = T.stage(i);

        return (
          <React.Fragment key={i}>
            {/* Gate (hex + icon + labels) */}
            <Gate
              x={px}
              y={centerY}
              size={gateSize}
              IconComponent={stage.IconComponent}
              title={stage.title}
              caption={stage.caption}
              startFrame={at}
              exitFrame={exitFrame}
              color={pillar.color}
              glowColor={pillar.glow}
              glowSoftColor={pillar.glowSoft}
            />

            {/* Connector to the NEXT stage (or to end label if last) */}
            {i < N - 1 ? (
              <Connector
                from={{ x: px + gateEdge, y: centerY }}
                to={{   x: stageX(i + 1) - gateEdge, y: centerY }}
                startFrame={T.connBetween(i)}
                drawDuration={motion.enter}
                exitFrame={exitFrame}
                thickness={2.5}
                color={pillars[`pillar${((i + 1) % 3) + 1}` as PillarKey].color}
                flow
                flowCount={1}
                flowColor={pillars[`pillar${((i + 1) % 3) + 1}` as PillarKey].color}
                glow
              />
            ) : null}
          </React.Fragment>
        );
      })}

      {/* ── Connector: last stage → end ───────────────────────────────── */}
      <Connector
        from={{ x: stageX(N - 1) + gateEdge, y: centerY }}
        to={{   x: endX - pillEdge, y: centerY }}
        startFrame={T.connToEnd}
        drawDuration={motion.enter}
        exitFrame={exitFrame}
        thickness={2.5}
        color={pillars.pillar3.color}
        flow
        flowCount={1}
        flowColor={pillars.pillar3.color}
        arrow="end"
        glow
      />

      {/* ── Endpoint label: end ───────────────────────────────────────── */}
      <EndpointLabel
        text={endLabel}
        x={endX}
        y={centerY}
        progress={endP}
        exit={exitP}
        emphasized // the destination — slightly brighter
      />

    </>
  );
};

// ─── Gate (hex + icon + labels) ───────────────────────────────────────────
interface GateProps {
  x: number;
  y: number;
  size: number;
  IconComponent: LucideIcon;
  title: string;
  caption?: string;
  startFrame: number;
  exitFrame?: number;
  color: string;
  glowColor: string;
  glowSoftColor: string;
}

const Gate: React.FC<GateProps> = ({
  x, y, size, IconComponent, title, caption, startFrame, exitFrame, color, glowColor, glowSoftColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useThemeTokens();
  const r = size / 2;

  const enterP = interpolate(
    frame,
    [startFrame, startFrame + motion.enter],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.emphasis },
  );

  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;

  const idleBreath = breathe({ frame, fps, speed: 0.35, min: 0.92, max: 1.0 });
  const haloBreath = breathe({ frame, fps, speed: 0.4, min: 0.6, max: 1.0, phase: startFrame * 0.05 });

  const opacity = Math.min(enterP, exitP);
  const scale = (0.5 + 0.5 * enterP) * idleBreath
    * interpolate(exitP, [0, 1], [0.92, 1]);

  const titleStart = startFrame + 6;
  const titleP = interpolate(
    frame,
    [titleStart, titleStart + motion.enter],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const titleInset = (1 - titleP) * 100;
  const titleY = (1 - titleP) * 8;

  const captionStart = startFrame + 12;
  const captionP = caption
    ? interpolate(
        frame,
        [captionStart, captionStart + motion.enter],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
      )
    : 0;
  const captionInset = (1 - captionP) * 100;

  // We render the hex as inline SVG so it stays crisp at any size. Position
  // is via an absolutely-placed wrapper at (x, y) so the SVG just draws at
  // the origin of its own little world.
  const svgSize = size + 40; // leave room for glow

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center',
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      <div style={{ position: 'relative', width: svgSize, height: svgSize }}>
        {/* Halo behind the hex */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: -size * 0.4,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${glowSoftColor} 0%, transparent 60%)`,
            opacity: haloBreath,
            filter: 'blur(6px)',
            pointerEvents: 'none',
          }}
        />

        {/* Hex shape */}
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={`gate-fill-${startFrame}`} x1="0" y1="0" x2="0" y2="1">
              {/* Light theme: navy translucent fill so the hex reads as
                  a shape on off-white. Dark theme: original white-alpha. */}
              <stop offset="0%" stopColor={theme.name === 'light' ? 'rgba(15,35,65,0.12)' : colors.whiteA15} />
              <stop offset="100%" stopColor={theme.name === 'light' ? 'rgba(15,35,65,0.05)' : colors.whiteA05} />
            </linearGradient>
          </defs>
          <polygon
            points={HEX_VERTICES(svgSize / 2, svgSize / 2, r)}
            fill={`url(#gate-fill-${startFrame})`}
            stroke={color}
            strokeWidth={2}
            style={{
              filter: `drop-shadow(0 0 ${size * 0.18}px ${glowColor})`,
            }}
          />
        </svg>

        {/* Centred icon */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            Component={IconComponent}
            size={size * 0.5}
            color={color}
            strokeWidth={2.2}
            startFrame={startFrame + 4}
            exitFrame={exitFrame}
            preset="pop"
            idleBreathe
          />
        </div>
      </div>

      {/* Title under the hex */}
      <div
        style={{
          position: 'absolute',
          top: svgSize / 2 + r + 24,
          left: '50%',
          transform: `translate(-50%, ${titleY}px)`,
          fontFamily: fonts.display,
          fontWeight: weights.semibold,
          fontSize: 22,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: theme.fg,
          whiteSpace: 'nowrap',
          opacity: titleP,
          clipPath: `inset(${titleInset}% 0 0 0)`,
          WebkitClipPath: `inset(${titleInset}% 0 0 0)`,
        }}
      >
        {title}
      </div>

      {/* Caption (optional) */}
      {caption && (
        <div
          style={{
            position: 'absolute',
            top: svgSize / 2 + r + 60,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: fonts.display,
            fontWeight: weights.regular,
            fontSize: 16,
            lineHeight: 1.35,
            letterSpacing: '0.01em',
            color: theme.fgMuted,
            textAlign: 'center',
            maxWidth: 220,
            opacity: captionP,
            clipPath: `inset(${captionInset}% 0 0 0)`,
            WebkitClipPath: `inset(${captionInset}% 0 0 0)`,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

// ─── Endpoint label (start / end pills) ───────────────────────────────────
interface EndpointProps {
  text: string;
  x: number;
  y: number;
  progress: number;
  exit: number;
  emphasized?: boolean;
}

const EndpointLabel: React.FC<EndpointProps> = ({ text, x, y, progress, exit, emphasized }) => {
  const theme = useThemeTokens();
  const opacity = Math.min(progress, exit);
  const slideX = (1 - progress) * (emphasized ? 24 : -24);
  const scale = interpolate(progress, [0, 1], [0.92, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translateX(${slideX}px) scale(${scale})`,
        transformOrigin: 'center',
        opacity,
        padding: '14px 22px',
        borderRadius: radius.md,
        background: theme.name === 'light'
          ? `linear-gradient(160deg, ${theme.surfaceStrong}, ${theme.surface})`
          : (emphasized
              ? `linear-gradient(160deg, ${colors.whiteA20}, ${colors.whiteA10})`
              : `linear-gradient(160deg, ${colors.whiteA10}, ${colors.whiteA05})`),
        border: `1px solid ${theme.name === 'light' ? theme.border : (emphasized ? colors.whiteA40 : colors.whiteA20)}`,
        backdropFilter: 'blur(10px)',
        boxShadow: theme.name === 'light'
          ? `0 8px 24px rgba(15, 35, 65, 0.08)`
          : (emphasized
              ? `0 0 30px ${colors.glow40}, 0 0 60px ${colors.glow20}`
              : `0 0 20px ${colors.glow20}`),
        fontFamily: fonts.display,
        fontWeight: weights.semibold,
        fontSize: 24,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: emphasized ? theme.fg : theme.fgMuted,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};
