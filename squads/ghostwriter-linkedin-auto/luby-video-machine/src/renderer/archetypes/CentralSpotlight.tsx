/**
 * CentralSpotlight — archetype "central-spotlight-with-satellites".
 *
 *           [satellite]
 *               │
 *   [satellite]─┼─[satellite]
 *               │
 *           [satellite]
 *
 * Conceito-âncora no centro (icon + título grande), 3-5 satélites
 * dispostos radialmente em volta. Satélites entram com stagger
 * angular (não linear) — primeiro o de cima, depois sentido
 * horário. Conectores opcionais (linhas SVG) ligando centro a cada
 * satélite.
 *
 * REUSA: Icon primitive + tipografia de tokens. Não wrappa em
 * ConceptCard porque os satélites são pequenos (icon ~56px + label
 * curto), não cards full.
 *
 * GEOMETRIA:
 *   Canvas é 1920×1080. Centro fixado em meio do quadro útil
 *   (após SAFE margins). Raio dos satélites: ~340px. Cada satélite
 *   posicionado por ângulo uniformemente distribuído começando às
 *   12h (-90deg) e indo sentido horário.
 *
 * MODE-AWARENESS:
 *   - Conectores em premium têm gradient + glow leve
 *   - Conectores em minimal são linhas finas brancas com baixa opacidade
 *   - Center icon pega o glow do mode automaticamente via Icon component
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Icon } from '../../components/Icon';
import { MaskReveal } from '../../components/MaskReveal';
import { resolveIcon } from '../../schema/iconMap';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion } from '../../design/motion';
import { useCurrentMode } from '../ModeContext';
import { useThemeTokens } from '../ThemeContext';
import type { CentralSpotlightBlock } from '../../schema/types';

interface Props {
  block: CentralSpotlightBlock;
  startFrame: number;
  exitFrame?: number;
}

const T_HEADING        = 0;
const T_CENTER         = 8;
const T_FIRST_SAT      = 22;
const SAT_STAGGER      = 5;
const T_CONNECTORS     = 14; // entram entre o centro e os satélites

// Geometric constants — radial layout.
const RADIUS = 340;          // distance center → satellite anchor

export const CentralSpotlight: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const mode = useCurrentMode();
  const theme = useThemeTokens();
  const isPremium = mode === 'luby-premium';

  const CenterIcon = resolveIcon(block.center.icon);
  if (!CenterIcon) return null;

  const satellites = block.satellites.slice(0, 5); // cap at 5
  if (satellites.length < 3) return null;          // archetype needs ≥3

  const showConnectors = block.showConnectors ?? true;

  // Compute each satellite's angle. Start at 12h (-90deg) and distribute
  // uniformly clockwise. For 4 sats → 12h, 3h, 6h, 9h. For 3 → 12h, 4h, 8h.
  const angleAt = (i: number): number => {
    const stepDeg = 360 / satellites.length;
    return -90 + i * stepDeg;
  };

  // Satellite (x, y) offset from center, in pixels
  const satOffset = (i: number): { x: number; y: number } => {
    const rad = (angleAt(i) * Math.PI) / 180;
    return { x: Math.cos(rad) * RADIUS, y: Math.sin(rad) * RADIUS };
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: gap.group,
        // Constrain so the radial layout has predictable space (centered
        // in the surrounding scene flex column).
      }}
    >
      {/* Heading — now ABOVE the radial container, not overlapping it.
          Previously the heading was absolute-positioned at top: -12 of
          the radial container, which collided with the satellite at 12h
          and with the center title. Pulling it out as a regular flex
          child gives both the heading and the radial diagram their own
          breathing room. */}
      {block.heading && (
        <MaskReveal
          enterAt={startFrame + T_HEADING}
          exitAt={exitFrame}
          direction="up"
          translate={16}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: weights.semibold,
              fontSize: 48,
              color: theme.fg,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              textAlign: 'center',
              textShadow: theme.name === 'light' ? 'none' : `0 0 40px ${colors.glow30}`,
            }}
          >
            {block.heading}
          </div>
        </MaskReveal>
      )}

      {/* Radial diagram container */}
      <div style={{ position: 'relative', width: 1100, height: 760 }}>
        {/* Connectors layer (SVG behind everything) */}
        {showConnectors && (
          <svg
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            {satellites.map((_, i) => {
              const off = satOffset(i);
              return (
                <Connector
                  key={i}
                  x2={off.x}
                  y2={off.y}
                  startFrame={startFrame + T_CONNECTORS + i * 2}
                  exitFrame={exitFrame}
                  isPremium={isPremium}
                />
              );
            })}
          </svg>
        )}

        {/* Center node */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: gap.intra,
            zIndex: 2,
          }}
        >
          <CenterNode
            IconComponent={CenterIcon}
            title={block.center.title}
            caption={block.center.caption}
            startFrame={startFrame + T_CENTER}
            exitFrame={exitFrame}
          />
        </div>

        {/* Satellites */}
        {satellites.map((sat, i) => {
          const SatIcon = resolveIcon(sat.icon);
          if (!SatIcon) return null;
          const off = satOffset(i);
          const satStart = startFrame + T_FIRST_SAT + i * SAT_STAGGER;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `calc(50% + ${off.x}px)`,
                top: `calc(50% + ${off.y}px)`,
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
              }}
            >
              <Satellite
                IconComponent={SatIcon}
                label={sat.label}
                startFrame={satStart}
                exitFrame={exitFrame}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Center node ────────────────────────────────────────────────────────

const CenterNode: React.FC<{
  IconComponent: any;
  title: string;
  caption?: string;
  startFrame: number;
  exitFrame?: number;
  // Closure note: this component is used only inside CentralSpotlight,
  // so it inherits theme via useThemeTokens() inside its own body.
}> = ({ IconComponent, title, caption, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const theme = useThemeTokens();
  const enterP = interpolate(
    frame, [startFrame, startFrame + motion.enterSlow], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;
  const opacity = Math.min(enterP, exitP);
  const scale = interpolate(enterP, [0, 1], [0.7, 1]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: gap.intra,
        opacity,
        transform: `scale(${scale})`,
        textAlign: 'center',
      }}
    >
      <Icon
        Component={IconComponent}
        size={108}
        color={colors.blueBright}
        startFrame={startFrame}
        exitFrame={exitFrame}
        preset="bloom"
        glowColor={colors.glow80}
        glowSize={2.6}
        idleBreathe
      />
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.semibold,
          fontSize: 38,
          color: theme.fg,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          maxWidth: 380,
          textShadow: theme.name === 'light' ? 'none' : `0 0 24px ${colors.glow30}`,
        }}
      >
        {title}
      </div>
      {caption && (
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.regular,
            fontSize: 18,
            color: theme.fgMuted,
            lineHeight: 1.3,
            maxWidth: 360,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

// ─── Satellite ──────────────────────────────────────────────────────────

const Satellite: React.FC<{
  IconComponent: any;
  label: string;
  startFrame: number;
  exitFrame?: number;
}> = ({ IconComponent, label, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const theme = useThemeTokens();
  const enterP = interpolate(
    frame, [startFrame, startFrame + motion.enter], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.emphasis },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;
  const opacity = Math.min(enterP, exitP);
  const scale = interpolate(enterP, [0, 1], [0.6, 1]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: gap.tight,
        opacity,
        transform: `scale(${scale})`,
        width: 200,
        textAlign: 'center',
      }}
    >
      <Icon
        Component={IconComponent}
        size={56}
        color={colors.blue}
        startFrame={startFrame}
        exitFrame={exitFrame}
        preset="pop"
      />
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.semibold,
          fontSize: 22,
          color: theme.fg,
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ─── Connector line (SVG) ───────────────────────────────────────────────

const Connector: React.FC<{
  /** End point relative to a coordinate system where (0, 0) is the canvas centre. */
  x2: number;
  y2: number;
  startFrame: number;
  exitFrame?: number;
  isPremium: boolean;
}> = ({ x2, y2, startFrame, exitFrame, isPremium }) => {
  const frame = useCurrentFrame();
  const drawP = interpolate(
    frame, [startFrame, startFrame + motion.enterSlow], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const exitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;
  const opacity = Math.min(drawP, exitP);

  // SVG coordinate system: place line in the parent container with
  // viewport translate to centre. We use percentage anchors via x1/y1
  // 50%/50% conceptually but SVG percent on x1/x2 needs viewBox math —
  // simpler approach: position the SVG fill the parent and use a
  // transformed group anchored at (cx, cy) computed from container size.
  // Here container is 1100×800 (set on parent) so centre is (550, 400).
  const cx = 550;
  const cy = 380;
  const endX = cx + x2;
  const endY = cy + y2;

  // Visible length grows with drawP via stroke-dasharray trick.
  const fullLen = Math.hypot(x2, y2);
  const dash = `${fullLen}`;
  const offset = fullLen * (1 - drawP);

  const stroke = isPremium ? colors.blue : colors.whiteA20;
  const strokeWidth = isPremium ? 1.5 : 1;
  const filter = isPremium ? `drop-shadow(0 0 6px ${colors.glow40})` : 'none';

  return (
    <line
      x1={cx}
      y1={cy}
      x2={endX}
      y2={endY}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={opacity * 0.7}
      strokeDasharray={dash}
      strokeDashoffset={offset}
      strokeLinecap="round"
      style={{ filter }}
    />
  );
};
