/**
 * SoftwareQuePareceProntoPersonal — Personal variant (PT, no Luby branding).
 *
 * Wave 5: per the 3-variants rule, every video has a Personal variant
 * intended for colaborador to repost on their own profile. The mode
 * 'personal' suppresses Luby branding throughout (Intro logo, Closing
 * logo, BrandFrame footer). Per the directive of 2026-05-12, this
 * variant does NOT include a speaker badge — it's a "clean" video
 * with no branding at all (the colaborador adds their own context
 * in the LinkedIn post copy).
 *
 * Uses the PT spec because the colaborador's audience is BR.
 */

import React from 'react';
import { VideoRenderer } from '../renderer/VideoRenderer';
import { softwareQuePareceProntoPtSpec } from '../schema/examples/software-que-parece-pronto';
import type { CommonProps } from './types';

export const SoftwareQuePareceProntoPersonal: React.FC<CommonProps> = ({ lang, mode, speaker }) => {
  return (
    <VideoRenderer
      spec={softwareQuePareceProntoPtSpec}
      overrides={{ lang, mode, speaker }}
    />
  );
};
