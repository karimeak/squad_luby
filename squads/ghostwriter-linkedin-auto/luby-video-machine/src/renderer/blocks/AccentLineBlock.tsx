/**
 * AccentLineBlock — renders a `kind: 'accent-line'` block.
 *
 * Thin wrapper around the existing <LineDraw> primitive. The horizontal
 * accent line under a tagline / eyebrow. In premium mode it glows by
 * default; minimal scenes typically don't use accent lines (they have
 * the sync'd words instead) so the glow flag is mode-suppressed here.
 */

import React from 'react';
import { LineDraw } from '../../components/LineDraw';
import { colors } from '../../design/tokens';
import { useCurrentMode } from '../ModeContext';
import type { AccentLineBlock as AccentLineBlockSpec } from '../../schema/types';

interface Props {
  block: AccentLineBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

export const AccentLineBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  const mode = useCurrentMode();
  // Glow follows the mode unless the schema explicitly says otherwise.
  const glow = block.glow ?? mode === 'luby-premium';

  return (
    <LineDraw
      width={block.width ?? 120}
      thickness={block.thickness ?? 2}
      color={colors.blue}
      enterAt={startFrame}
      exitAt={exitFrame}
      glow={glow}
    />
  );
};
