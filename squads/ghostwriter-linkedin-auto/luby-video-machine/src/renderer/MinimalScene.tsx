/**
 * MinimalScene — renderer for luby-minimal scenes.
 *
 * Mirror of PremiumScene but specialised for the minimal vocabulary:
 *
 *   - Background is the MinimalOverlay (mounted by VideoRenderer); this
 *     scene just paints content on top.
 *   - Default startOffsets are tighter (4f cadence vs 6f) because the
 *     minimal motion feel is punchier.
 *   - Auto-layout: a single block centres in the canvas; multiple blocks
 *     stack centred with a smaller gap (gap.elements vs gap.block).
 *   - Block kinds supported: sentence-with-syncs, big-stat, concept-pair,
 *     pipeline, eyebrow. (logo-mark, tagline, accent-line, closing-card
 *     return null — they're premium-mode kinds.)
 *
 * The two scene renderers are intentionally KEPT SEPARATE rather than
 * merged into a polymorphic "Scene" component. Reason: their layout
 * defaults and supported blocks differ enough that a unified component
 * would be a mess of `if (mode === ...)` branches. Top-level
 * VideoRenderer picks the right one per scene.
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { gap } from '../design/tokens';
import { SCENE_BREATH } from '../design/timeline';
import type { Block, SceneSpec } from '../schema/types';

import { SentenceWithSyncsBlock } from './blocks/SentenceWithSyncsBlock';
import { EyebrowBlock } from './blocks/EyebrowBlock';
import { BigStatBlock } from './blocks/BigStatBlock';
import { MultiplicationEquationBlock } from './blocks/MultiplicationEquationBlock';
import { ConceptRowBlock } from './blocks/ConceptRowBlock';
import { PipelineBlock } from './blocks/PipelineBlock';
import { MetricGridBlock } from './blocks/MetricGridBlock';
import { FeatureGridBlock } from './blocks/FeatureGridBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { LogoRowBlock } from './blocks/LogoRowBlock';
import { TimelineBlock } from './blocks/TimelineBlock';

// Wave 3 — archetype library (mode-aware via ModeContext)
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

// Minimal mode's default cadence is tighter — words and elements snap in
// faster than in premium. Authors can override per-block with startOffset.
const DEFAULT_OFFSETS = [0, 8, 14, 20];
const FALLBACK_STEP = 6;

const defaultOffsetForIndex = (i: number): number =>
  DEFAULT_OFFSETS[i] ?? (DEFAULT_OFFSETS[DEFAULT_OFFSETS.length - 1] + (i - DEFAULT_OFFSETS.length + 1) * FALLBACK_STEP);

export const MinimalScene: React.FC<Props> = ({ scene }) => {
  const applyBreath = scene.applyBreath ?? true;
  const sceneEnter = scene.enter.at + (applyBreath ? SCENE_BREATH : 0);
  const sceneExit = scene.exit?.at;

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
        // Minimal scenes typically have a single hero block (the sentence
        // or the stat). Using gap.elements (24) instead of gap.block (48)
        // keeps multi-block compositions tight without crowding.
        gap: gap.elements,
      }}
    >
      {flowBlocks}
      {positionedBlocks}
    </AbsoluteFill>
  );
};

// ─── Block dispatch ────────────────────────────────────────────────────────

const renderBlock = (
  block: Block,
  startFrame: number,
  exitFrame: number | undefined,
): React.ReactNode => {
  switch (block.kind) {
    case 'sentence-with-syncs':
      return <SentenceWithSyncsBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'eyebrow':
      // Eyebrow can appear in minimal scenes (e.g. small section label
      // above a sentence). Reuses the same renderer; EyebrowBlock detects
      // the active mode and adapts (no text-shadow, no settle animation).
      return <EyebrowBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'big-stat':
      return <BigStatBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'multiplication-equation':
      return <MultiplicationEquationBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
    case 'concept-row':
      return <ConceptRowBlock block={block} startFrame={startFrame} exitFrame={exitFrame} />;
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

    // Blocks not yet ported. Returning null until a video needs them.
    case 'concept-pair':
      return null;

    // Premium-mode kinds — silently ignored if listed under a minimal scene
    case 'logo-mark':
    case 'tagline':
    case 'accent-line':
    case 'closing-card':
      return null;
  }
};
