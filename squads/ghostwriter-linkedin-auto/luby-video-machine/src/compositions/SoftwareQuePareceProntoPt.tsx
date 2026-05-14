/**
 * SoftwareQuePareceProntoPt — PT-BR variant.
 *
 * Wave 5 (2026-05): the 3-variants rule means each video registers
 * 3 compositions. This is the PT-BR corporate variant.
 */

import React from 'react';
import { VideoRenderer } from '../renderer/VideoRenderer';
import { softwareQuePareceProntoPtSpec } from '../schema/examples/software-que-parece-pronto';
import type { CommonProps } from './types';

export const SoftwareQuePareceProntoPt: React.FC<CommonProps> = ({ lang, mode, speaker }) => {
  return (
    <VideoRenderer
      spec={softwareQuePareceProntoPtSpec}
      overrides={{ lang, mode, speaker }}
    />
  );
};
