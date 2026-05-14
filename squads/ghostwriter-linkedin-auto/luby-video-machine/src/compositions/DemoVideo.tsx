/**
 * DemoVideo (v4 — schema-driven)
 *
 * THIN COMPOSITION SHELL.
 *
 * The video machine is fully data-driven: a video is now a `VideoSpec`
 * object (see src/schema/types.ts). This file is just the Composition
 * entry point — it loads the canonical Luby demo schema and delegates
 * EVERYTHING to <VideoRenderer>.
 *
 * Runtime props (lang, mode, speaker) come from the Composition's
 * `defaultProps` and are passed as `overrides` to the renderer, which
 * patches them onto the schema's `context` field. That preserves the
 * ability to ship the same video in PT/EN/personal variants without
 * duplicating the schema.
 *
 * TO ADD A NEW VIDEO
 *   1. Copy src/schema/examples/luby-demo.ts and edit
 *   2. Create a new composition file similar to this one (or add a new
 *      <Composition> in src/Root.tsx pointing to a new spec)
 *   3. Run `npm start` — the new video shows up in Studio's sidebar
 *
 * No React, no design tokens, no motion code needs to be touched per
 * video. The renderer handles everything generic; the spec describes
 * everything specific.
 */

import React from 'react';
import { VideoRenderer } from '../renderer/VideoRenderer';
import { lubyDemoSpec } from '../schema/examples/luby-demo';
import type { CommonProps } from './types';

export const DemoVideo: React.FC<CommonProps> = ({ lang, mode, speaker }) => {
  return (
    <VideoRenderer
      spec={lubyDemoSpec}
      overrides={{ lang, mode, speaker }}
    />
  );
};
