/**
 * VisualCatalog — composition shells for the 3 catalog variants.
 *
 * Internal showcase, not marketing. 21 numbered scenes + intro/CTA.
 * Three variants:
 *   - Premium / Dark   (mode=luby-premium, theme=dark)
 *   - Minimal / Dark   (mode=luby-minimal, theme=dark)
 *   - Premium / Light  (mode=luby-premium, theme=light on body scenes)
 */

import React from 'react';
import { VideoRenderer } from '../renderer/VideoRenderer';
import {
  visualCatalogPremiumDarkSpec,
  visualCatalogMinimalDarkSpec,
  visualCatalogPremiumLightSpec,
} from '../schema/examples/visual-catalog';
import type { CommonProps } from './types';

export const VisualCatalogPremiumDark: React.FC<CommonProps> = ({ lang, mode, speaker }) => (
  <VideoRenderer spec={visualCatalogPremiumDarkSpec} overrides={{ lang, mode, speaker }} />
);

export const VisualCatalogMinimalDark: React.FC<CommonProps> = ({ lang, mode, speaker }) => (
  <VideoRenderer spec={visualCatalogMinimalDarkSpec} overrides={{ lang, mode, speaker }} />
);

export const VisualCatalogPremiumLight: React.FC<CommonProps> = ({ lang, mode, speaker }) => (
  <VideoRenderer spec={visualCatalogPremiumLightSpec} overrides={{ lang, mode, speaker }} />
);
