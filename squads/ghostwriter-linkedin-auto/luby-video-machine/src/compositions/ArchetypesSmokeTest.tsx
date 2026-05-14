/**
 * ArchetypesSmokeTest — composition shell para validação técnica
 * dos arquétipos da Wave 3.
 */

import React from 'react';
import { VideoRenderer } from '../renderer/VideoRenderer';
import { archetypesSmokeTestSpec } from '../schema/examples/archetypes-smoke-test';
import type { CommonProps } from './types';

export const ArchetypesSmokeTest: React.FC<CommonProps> = ({ lang, mode, speaker }) => {
  return (
    <VideoRenderer
      spec={archetypesSmokeTestSpec}
      overrides={{ lang, mode, speaker }}
    />
  );
};
