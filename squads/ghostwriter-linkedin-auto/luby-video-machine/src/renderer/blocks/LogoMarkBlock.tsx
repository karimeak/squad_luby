/**
 * LogoMarkBlock — renders a `kind: 'logo-mark'` block.
 *
 * Thin wrapper around the existing <Logo> primitive. Translates the
 * schema's flat data shape (height, animated, idleBreathe) into the
 * Logo's existing prop API. No design logic here — schema is the
 * source of truth, Logo is the artist.
 */

import React from 'react';
import { Logo } from '../../components/Logo';
import { useThemeTokens } from '../ThemeContext';
import { useCurrentAccountMode } from '../AccountModeContext';
import type { LogoMarkBlock as LogoMarkBlockSpec } from '../../schema/types';

interface Props {
  block: LogoMarkBlockSpec;
  startFrame: number;
  exitFrame?: number;
}

export const LogoMarkBlock: React.FC<Props> = ({ block, startFrame, exitFrame }) => {
  // Logo variant follows the theme — white wordmark on dark, navy on light.
  const theme = useThemeTokens();
  // Personal account mode: NO Luby branding renders. The block returns
  // null silently so surrounding scene composition stays intact (e.g.
  // an Intro that has logo + eyebrow + tagline + accent-line still
  // shows the eyebrow/tagline/accent-line, just without the logo).
  const accountMode = useCurrentAccountMode();
  if (accountMode === 'personal') return null;

  return (
    <Logo
      variant={theme.logoVariant}
      height={block.height}
      animated={block.animated ?? true}
      startFrame={startFrame}
      exitFrame={exitFrame}
      idleBreathe={block.idleBreathe ?? true}
    />
  );
};
