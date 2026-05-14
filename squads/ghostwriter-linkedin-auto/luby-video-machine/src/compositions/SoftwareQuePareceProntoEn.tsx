/**
 * SoftwareQuePareceProntoEn — EN-US variant.
 *
 * Wave 5: Translation handled by Motion Designer (no Google Translate).
 * Translation decisions documented in 04-implementation-notes.md.
 */

import React from 'react';
import { VideoRenderer } from '../renderer/VideoRenderer';
import { softwareQuePareceProntoEnSpec } from '../schema/examples/software-que-parece-pronto';
import type { CommonProps } from './types';

export const SoftwareQuePareceProntoEn: React.FC<CommonProps> = ({ lang, mode, speaker }) => {
  return (
    <VideoRenderer
      spec={softwareQuePareceProntoEnSpec}
      overrides={{ lang, mode, speaker }}
    />
  );
};
