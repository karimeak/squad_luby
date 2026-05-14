/**
 * PremiumScene — renderer for luby-premium scenes.
 *
 * Receives a SceneSpec (mode: 'luby-premium') and renders each of its
 * blocks. Owns:
 *   - timing: applies SCENE_BREATH if the scene asks for it, assigns
 *     sequential default startOffsets to blocks that omit them
 *   - layout: blocks without `position` flow in a centred flex column;
 *     blocks with `position` are mounted absolutely at the given coords
 *   - dispatch: switches on block.kind and mounts the right block renderer
 *
 * What this renderer DOES NOT do:
 *   - Decide what scenes look like (that's the schema's job)
 *   - Apply visual mode chrome (that's MinimalOverlay / background atmosphere)
 *   - Insert transitions (that's the top-level VideoRenderer)
 *
 * Premium-only blocks supported in this iteration:
 *   logo-mark, eyebrow, tagline, accent-line, closing-card
 *
 * Blocks that don't apply to premium scenes (sentence-with-syncs,
 * concept-pair, pipeline, big-stat) are routed to their dedicated
 * renderers via the top-level VideoRenderer — this component never
 * sees them. If one slips through (author error), we render an
 * obvious DEV warning instead of crashing the video.
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { gap } from '../design/tokens';
import { SCENE_BREATH } from '../design/timeline';
import type { Block, SceneSpec } from '../schema/types';

import { LogoMarkBlock } from './blocks/LogoMarkBlock';
import { EyebrowBlock } from './blocks/EyebrowBlock';
import { TaglineBlock } from './blocks/TaglineBlock';
import { AccentLineBlock } from './blocks/AccentLineBlock';
import { ClosingCardBlock } from './blocks/ClosingCardBlock';
import { SentenceWithSyncsBlock } from './blocks/SentenceWithSyncsBlock';
import { ConceptRowBlock } from './blocks/ConceptRowBlock';
import { MultiplicationEquationBlock } from './blocks/MultiplicationEquationBlock';
import { BigStatBlock } from './blocks/BigStatBlock';
import { PipelineBlock } from './blocks/PipelineBlock';
import { MetricGridBlock } from './blocks/MetricGridBlock';
import { FeatureGridBlock } from './blocks/FeatureGridBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { LogoRowBlock } from './blocks/LogoRowBlock';
import { TimelineBlock } from './blocks/TimelineBlock';

// Wave 3 — archetype library
import { SplitScreenComparison } from './archetypes/SplitScreenComparison';
import { VerticalStack } from './archetypes/VerticalStack';
import { CentralSpotlight } from './archetypes/CentralSpotlight';
import { GiantStatement } from './archetypes/GiantStatement';
import { Quadrante2x2 } from './archetypes/Quadrante2x2';

// Wave 4 — archetype library
import { IcebergRevelation } from './archetypes/IcebergRevelation';

// Wave 5 — archetype library
import { OnionPeelRevelation } from './archetypes/OnionPeelRevelation';

interface Props {
  scene: SceneSpec;
}

/**
 * Default offsets used when a block omits `startOffset`. The cadence
 * matches the v3 IntroScene rhythm: 0 (anchor), +14 (eyebrow), +18
 * (tagline), +26 (accent). Beyond index 3 we fall back to +6f per
 * block, which is roughly motion.enterFast.
 */
const DEFAULT_OFFSETS = [0, 14, 18, 26];
const FALLBACK_STEP = 6;

const defaultOffsetForIndex = (i: number): number =>
  DEFAULT_OFFSETS[i] ?? (DEFAULT_OFFSETS[DEFAULT_OFFSETS.length - 1] + (i - DEFAULT_OFFSETS.length + 1) * FALLBACK_STEP);

export const PremiumScene: React.FC<Props> = ({ scene }) => {
  // SCENE_BREATH offset — defaults to true for every scene except those
  // explicitly opted out (the Intro is the only one in practice).
  const applyBreath = scene.applyBreath ?? true;
  const sceneEnter = scene.enter.at + (applyBreath ? SCENE_BREATH : 0);
  const sceneExit = scene.exit?.at;

  // Render each block. We split into two passes — positioned blocks
  // mounted absolutely, flow blocks stacked centred — so a single scene
  // can mix both ("logo here at exact coords + tagline flowing centred
  // below"). Positioned blocks come AFTER flow blocks in DOM order so
  // their absolute layout sits on top.
  const flowBlocks: React.ReactElement[] = [];
  const positionedBlocks: React.ReactElement[] = [];

  scene.blocks.forEach((block, i) => {
    const offset = block.startOffset ?? defaultOffsetForIndex(i);
    const startFrame = sceneEnter + offset;
    const node = renderBlock(block, startFrame, sceneExit);

    if (!node) return;

    if (block.position) {
      positionedBlocks.push(
        <div
          key={`${block.id ?? block.kind}-${i}`}
          style={{
            position: 'absolute',
            left: block.position.x,
            top: block.position.y,
            transform: block.position.centered ? 'translate(-50%, -50%)' : undefined,
          }}
        >
          {node}
        </div>,
      );
    } else {
      flowBlocks.push(
        <React.Fragment key={`${block.id ?? block.kind}-${i}`}>{node}</React.Fragment>,
      );
    }
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        // gap.block (48): the rhythm Intro/CTA use between logo block ↔ text
        gap: gap.block,
      }}
    >
      {flowBlocks}
      {positionedBlocks}
    </AbsoluteFill>
  );
};

// ─── Block dispatch ────────────────────────────────────────────────────────

/**
 * Returns the rendered node for a given block, or null if the block kind
 * isn't supported in premium mode. Returning null silently is a delibarate
 * decision — top-level VideoRenderer is responsible for routing each
 * block to its proper renderer based on scene.mode, so by the time a
 * block reaches THIS function it should always be a premium kind.
 */
const renderBlock = (
  block: Block,
  startFrame: number,
  exitFrame: number | undefined,
): React.ReactNode => {
  switch (block.kind) {
    case 'logo-mark':
      return <LogoMarkBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'eyebrow':
      return <EyebrowBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'tagline':
      return <TaglineBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'accent-line':
      return <AccentLineBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'closing-card':
      return <ClosingCardBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'concept-row':
      return <ConceptRowBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'multiplication-equation':
      return <MultiplicationEquationBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'big-stat':
      return <BigStatBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'pipeline':
      return <PipelineBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'metric-grid':
      return <MetricGridBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'feature-grid':
      return <FeatureGridBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'quote':
      return <QuoteBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'logo-row':
      return <LogoRowBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'timeline':
      return <TimelineBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;

    // ─── Archetype library (Wave 3) ────────────────────────────────────
    case 'split-screen-comparison':
      return <SplitScreenComparison block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'vertical-stack':
      return <VerticalStack block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'central-spotlight-with-satellites':
      return <CentralSpotlight block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'giant-statement':
      return <GiantStatement block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'quadrante-2x2':
      return <Quadrante2x2 block={block} startFrame={startFrame} exitFrame={exitFrame} />;

    // ─── Archetype library (Wave 4) ────────────────────────────────────
    case 'iceberg-revelation':
      return <IcebergRevelation block={block} startFrame={startFrame} exitFrame={exitFrame} />;

    // ─── Archetype library (Wave 5) ────────────────────────────────────
    case 'onion-peel-revelation':
      return <OnionPeelRevelation block={block} startFrame={startFrame} exitFrame={exitFrame} />;

    case 'sentence-with-syncs':
      return <SentenceWithSyncsBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;

    // Stub block — not yet implemented. Returning null silently keeps
    // the video renderable while the author iterates.
    case 'concept-pair':
      return null;
  }
};
