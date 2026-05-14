/**
 * ThemeContext — bridges the loaded video's theme schedule to React.
 *
 * Mirror of ModeContext but for the THEME axis (dark vs light). Theme
 * changes the PALETTE; mode changes the VOCABULARY. They're orthogonal.
 *
 * The renderer wraps the tree in <ThemeProvider> with the per-video
 * themeSchedule. Components consult useCurrentTheme() to know which
 * theme is active at the current frame, and useThemeTokens() to read
 * the right color values for text/border/surface without hardcoding.
 *
 * If mounted outside a provider, hooks return 'dark' as a safe default
 * (matches the default video look since launch).
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { themes, type ThemeName, type Theme } from '../design/tokens';
import type { ThemeWindowSpec } from '../schema/types';

interface ThemeContextValue {
  schedule: ThemeWindowSpec[];
}

const DEFAULT_VALUE: ThemeContextValue = { schedule: [] };

const ThemeContext = createContext<ThemeContextValue>(DEFAULT_VALUE);

export interface ThemeProviderProps {
  schedule: ThemeWindowSpec[];
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ schedule, children }) => {
  const value = useMemo(() => ({ schedule }), [schedule]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Returns 'dark' | 'light' for the current frame.
 *
 * Cross-fade between themes is handled visually by LightOverlay (which
 * fades over THEME_FADE_FRAMES). For hard logical decisions, we pick
 * the dominant theme: theme is 'light' when frame is inside a light
 * window (including the fade range), else 'dark'.
 */
export const useCurrentTheme = (): ThemeName => {
  const frame = useCurrentFrame();
  const { schedule } = useContext(ThemeContext);
  for (const win of schedule) {
    if (win.theme === 'light' && frame >= win.from && frame < win.to) {
      return 'light';
    }
  }
  return 'dark';
};

/**
 * Returns the full theme token bundle for the current frame.
 *
 * Example:
 *   const t = useThemeTokens();
 *   <div style={{ color: t.fg, background: t.surface }} />
 *
 * Don't hardcode colors.white / colors.gray300 in blocks that need to
 * stay legible across themes — read from this hook instead.
 */
export const useThemeTokens = (): Theme => {
  const name = useCurrentTheme();
  return themes[name];
};
