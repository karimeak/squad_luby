/**
 * PipelineBlock — renders a `kind: 'pipeline'` block.
 *
 * Thin wrapper around the existing <Pipeline> primitive. Translates the
 * schema's flat data shape (startLabel, endLabel, stages[]) into the
 * Pipeline's existing prop API.
 *
 *   [ start ] ──→ ⬢ stage1 ──→ ⬢ stage2 ──→ ⬢ stage3 ──→ [ end ]
 *
 * For: process / sequence beats — "PR → review → vuln-scan → deploy",
 * "ideação → design → implementação → entrega", anything that's a
 * left-to-right journey through gates.
 *
 * The Pipeline component handles its own stagger and choreography; this
 * block just resolves icon keys to Lucide components and forwards.
 */

import React from 'react';
import { Pipeline } from '../../components/Pipeline';
import { resolveIcon } from '../../schema/iconMap';
import type { PipelineBlock as PipelineBlockSpec } from '../../schema/types';

interface Props {
  block: PipelineBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

export const PipelineBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  // Resolve icon keys to Lucide components for each stage
  const stages = block.stages
    .map((stage) => {
      const IconComponent = resolveIcon(stage.icon);
      if (!IconComponent) return null;
      return {
        IconComponent,
        title: stage.title,
        caption: stage.caption,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  if (stages.length === 0) return null;

  return (
    <Pipeline
      startLabel={block.startLabel}
      endLabel={block.endLabel}
      stages={stages}
      startFrame={startFrame}
      exitFrame={exitFrame}
    />
  );
};
