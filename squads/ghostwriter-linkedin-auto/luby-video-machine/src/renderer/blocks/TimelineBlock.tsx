/**
 * TimelineBlock — renders a `kind: 'timeline'` block.
 *
 *   2019 ──● 2020 ──● 2022 ──● 2024 ──● 2026
 *          │         │         │         │
 *        First    Series A  1k proj  AI agents
 *
 * For: milestones, history beats, evolution narratives.
 *
 * Layout: horizontal axis line with markers at each event. Year labels
 * above the line, event descriptions below. The horizontal line draws
 * left-to-right; markers pop in at their positions; descriptions
 * mask-reveal up. One event can be `highlight: true` (the climax) —
 * gets a larger marker and brand accent.
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { MaskReveal } from '../../components/MaskReveal';
import { Icon } from '../../components/Icon';
import { resolveIcon } from '../../schema/iconMap';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { motion, stagger } from '../../design/motion';
import { useThemeTokens } from '../ThemeContext';
import type { TimelineBlock as TimelineBlockSpec } from '../../schema/types';

interface Props {
  block: TimelineBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

const HEADING_OFFSET = 0;
const AXIS_DRAW_OFFSET = 12;
const AXIS_DRAW_DURATION = 36;
const FIRST_MARKER_OFFSET = 30;
const STAGGER_GAP = 6;

// Visual constants — bumped 2026-05 for stronger read
const AXIS_Y = 0; // relative within the timeline group
const MARKER_SIZE = 28;            // was 16 — too small to read
const MARKER_HIGHLIGHT_SIZE = 44;  // was 24 — highlight now visibly larger

export const TimelineBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const theme = useThemeTokens();
  const events = block.events.slice(0, 7); // cap at 7
  if (events.length < 2) return null;

  // Total layout width — adapt to event count
  const TIMELINE_WIDTH = Math.min(1500, events.length * 240);

  // Horizontal positions (0..1) along the axis
  const eventPositions = events.map((_, i) => i / (events.length - 1));

  // Axis draw progress + exit fade.
  // Bug fix 2026-05-12: previously the axis only had enter progress, so
  // after the scene exited the axis line stayed visible forever.
  const axisP = interpolate(
    frame,
    [startFrame + AXIS_DRAW_OFFSET, startFrame + AXIS_DRAW_OFFSET + AXIS_DRAW_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );
  const axisExitP = exitFrame !== undefined
    ? interpolate(frame, [exitFrame, exitFrame + motion.exit], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.exit,
      })
    : 1;

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
        <MaskReveal enterAt={startFrame + HEADING_OFFSET} exitAt={exitFrame} direction="up" translate={16}>
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: weights.semibold,
              fontSize: 56,
              color: theme.fg,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              textAlign: 'center',
              maxWidth: 1500,
              textShadow: theme.name === 'light' ? 'none' : `0 0 40px ${colors.glow30}`,
            }}
          >
            {block.heading}
          </div>
        </MaskReveal>
      )}

      <div
        style={{
          position: 'relative',
          width: TIMELINE_WIDTH,
          // Bumped 280→340 to give the larger when/what labels breathing room.
          height: 340,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Axis line — draws left to right, fades out with scene exit.
            Bumped thickness 2026-05: 2 → 4 for stronger spine read. */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: TIMELINE_WIDTH * axisP,
            height: 4,
            background: theme.name === 'light'
              ? `linear-gradient(90deg, ${colors.blueDeep}, ${colors.blue})`
              : `linear-gradient(90deg, ${colors.blue}, ${colors.blueBright})`,
            boxShadow: theme.name === 'light' ? undefined : `0 0 20px ${colors.glow40}`,
            transform: 'translateY(-50%)',
            opacity: axisExitP,
            borderRadius: 2,
          }}
        />

        {/* Markers + labels */}
        {events.map((event, i) => {
          const markerStart = stagger({
            index: i,
            base: startFrame + FIRST_MARKER_OFFSET,
            gap: STAGGER_GAP,
            total: events.length,
            easingFn: easings.enter,
          });
          const xPercent = eventPositions[i] * 100;
          return (
            <TimelineEvent
              key={i}
              when={event.when}
              what={event.what}
              iconKey={event.icon}
              highlight={event.highlight ?? false}
              xPercent={xPercent}
              startFrame={markerStart}
              exitFrame={exitFrame}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─── Single event marker + labels ────────────────────────────────────────

const TimelineEvent: React.FC<{
  when: string;
  what: string;
  iconKey?: import('../../schema/iconMap').IconKey;
  highlight: boolean;
  xPercent: number;
  startFrame: number;
  exitFrame?: number;
}> = ({ when, what, iconKey, highlight, xPercent, startFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const theme = useThemeTokens();

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

  const visible = Math.min(enterP, exitP);
  const scale = interpolate(enterP, [0, 1], [0, 1]);

  const labelStart = startFrame + 6;
  const labelP = interpolate(
    frame,
    [labelStart, labelStart + motion.enter],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.enter },
  );

  const markerSize = highlight ? MARKER_HIGHLIGHT_SIZE : MARKER_SIZE;
  const markerColor = highlight ? colors.blueBright : colors.blue;

  const IconComponent = iconKey ? resolveIcon(iconKey) : undefined;

  // REDESIGN 2026-05: each event uses ABSOLUTE positioning relative to
  // the axis (50% Y), so the marker sits EXACTLY on the line regardless
  // of label height. A vertical "stem" connects the marker to the when
  // label above, signalling structurally that the date belongs to the
  // point on the line.
  const stemColor = theme.name === 'light' ? colors.blueDeep : colors.blueBright;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${xPercent}%`,
        top: 0,
        height: '100%',
        transform: 'translateX(-50%)',
        opacity: visible,
        // Width gives the children (when/what labels) a column to wrap in
        // without affecting marker position (marker is absolute).
        width: 200,
      }}
    >
      {/* Vertical stem — connects marker (on the axis) to the "when"
          label above. Subtle but anchors the date to the point. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: 'calc(50% - 32px)',
          transform: 'translateX(-50%)',
          width: 1,
          height: 28,
          background: stemColor,
          opacity: labelP * 0.4,
        }}
      />

      {/* "When" label — positioned above the axis at fixed offset.
          Always lands ABOVE the marker now, regardless of font size. */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          // 50% (axis) minus marker radius minus stem 28 minus label height ~30
          top: 'calc(50% - 72px)',
          transform: 'translateX(-50%)',
          fontFamily: fonts.mono,
          fontSize: highlight ? 26 : 22,
          fontWeight: weights.bold,
          letterSpacing: '0.06em',
          color: highlight
            ? (theme.name === 'light' ? colors.blueDeep : colors.blueBright)
            : theme.fg,
          opacity: labelP,
          textShadow: highlight && theme.name !== 'light'
            ? `0 0 16px ${colors.glow40}`
            : undefined,
          whiteSpace: 'nowrap',
        }}
      >
        {when}
      </div>

      {/* Marker — sits EXACTLY on the axis (centered at 50% Y) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          width: markerSize,
          height: markerSize,
          borderRadius: '50%',
          background: markerColor,
          boxShadow: highlight
            ? `0 0 24px ${colors.blueBright}, 0 0 48px ${colors.glow60}`
            : `0 0 12px ${colors.glow40}`,
          border: highlight ? `2px solid ${colors.white}` : 'none',
        }}
      />

      {/* "What" description — positioned below the axis */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          // 50% (axis) plus marker radius plus gap
          top: 'calc(50% + 36px)',
          transform: 'translateX(-50%)',
          fontFamily: fonts.display,
          fontWeight: highlight ? weights.semibold : weights.medium,
          fontSize: highlight ? 26 : 22,
          color: highlight ? theme.fg : theme.fgMuted,
          letterSpacing: '-0.005em',
          lineHeight: 1.25,
          textAlign: 'center',
          width: 200,
          opacity: labelP,
        }}
      >
        {what}
      </div>

      {/* Optional icon — sits between marker and when label, inline.
          Kept for backward-compat with specs that pass an icon. */}
      {IconComponent && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 'calc(50% - 102px)',
            transform: 'translateX(-50%)',
          }}
        >
          <Icon
            Component={IconComponent}
            size={24}
            color={markerColor}
            startFrame={startFrame}
            exitFrame={exitFrame}
            preset="pop"
            idleBreathe={false}
          />
        </div>
      )}
    </div>
  );
};
