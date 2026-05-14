/**
 * FeatureGridBlock — renders a `kind: 'feature-grid'` block.
 *
 * 3-4 features arranged horizontally with icon + title + description:
 *
 *   ┌────────┐  ┌────────┐  ┌────────┐
 *   │  [🛡]  │  │  [⚡]  │  │  [📊]  │
 *   │ Title  │  │ Title  │  │ Title  │
 *   │ desc.  │  │ desc.  │  │ desc.  │
 *   └────────┘  └────────┘  └────────┘
 *
 * For: capability-spotlight format. Cards have equal weight (no
 * highlight/protagonist) — that's the difference from concept-row.
 *
 * Layout: row of cards. 2 cards per row if N=4, otherwise single row.
 */

import React from 'react';
import { ConceptCard } from '../../components/ConceptCard';
import { MaskReveal } from '../../components/MaskReveal';
import { resolveIcon } from '../../schema/iconMap';
import { colors, fonts, weights, gap } from '../../design/tokens';
import { easings } from '../../design/easings';
import { stagger } from '../../design/motion';
import { useThemeTokens } from '../ThemeContext';
import type { FeatureGridBlock as FeatureGridBlockSpec } from '../../schema/types';

interface Props {
  block: FeatureGridBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

const HEADING_OFFSET = 0;
const FIRST_CARD_OFFSET = 14;
const STAGGER_GAP = 8;

export const FeatureGridBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const theme = useThemeTokens();
  const features = block.features.slice(0, 4); // cap at 4
  if (features.length === 0) return null;

  // Layout: 4 features → 2x2 grid, 2-3 features → single row
  const cols = features.length === 4 ? 2 : features.length;

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
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(320px, 380px))`,
          gap: gap.elements,
          justifyContent: 'center',
        }}
      >
        {features.map((feature, i) => {
          const IconComponent = resolveIcon(feature.icon);
          if (!IconComponent) return null;

          const cardStart = stagger({
            index: i,
            base: startFrame + FIRST_CARD_OFFSET,
            gap: STAGGER_GAP,
            total: features.length,
            easingFn: easings.enter,
          });

          return (
            <ConceptCard
              key={i}
              IconComponent={IconComponent}
              title={feature.title}
              caption={feature.description}
              startFrame={cardStart}
              exitFrame={exitFrame}
              size="standard"
              accent={colors.blueBright}
              layout="vertical"
              showCaption="always"
            />
          );
        })}
      </div>
    </div>
  );
};
