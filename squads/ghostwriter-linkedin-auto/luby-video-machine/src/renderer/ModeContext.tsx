/**
 * ModeContext — bridges the loaded video's mode schedule to React.
 *
 * The renderer wraps the entire <DemoVideo> tree in <ModeProvider> with
 * the schedule derived from the loaded VideoSpec. Any component below can
 * call useCurrentMode() / useMinimalness() to know what mode is active
 * at the current frame, without having the schedule passed as a prop.
 *
 * If a component is mounted OUTSIDE a provider (e.g. in a Storybook-like
 * isolated test), the hooks return safe defaults: 'luby-premium' and 0.
 * That way components keep rendering instead of crashing.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import {
  resolveMode,
  minimalness,
  type VisualMode,
  type ModeWindow,
} from '../design/modes';

interface ModeContextValue {
  schedule: ModeWindow[];
}

const DEFAULT_VALUE: ModeContextValue = { schedule: [] };

const ModeContext = createContext<ModeContextValue>(DEFAULT_VALUE);

export interface ModeProviderProps {
  schedule: ModeWindow[];
  children: React.ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ schedule, children }) => {
  // Stabilize the value so consumers don't re-render on every parent render
  // unless the schedule actually changes.
  const value = useMemo(() => ({ schedule }), [schedule]);
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};

/**
 * Returns the visual mode active at the current frame.
 * Falls back to 'luby-premium' if no provider is mounted.
 */
export const useCurrentMode = (): VisualMode => {
  const frame = useCurrentFrame();
  const { schedule } = useContext(ModeContext);
  return resolveMode(frame, schedule);
};

/**
 * Returns 0..1 — how "minimal" the current frame is, with a short
 * cross-fade on boundaries. Use this for tweenable properties; use
 * useCurrentMode() for hard switches.
 */
export const useMinimalness = (): number => {
  const frame = useCurrentFrame();
  const { schedule } = useContext(ModeContext);
  return minimalness(frame, schedule);
};

/**
 * Returns the raw schedule. Useful for components that need to render
 * absolute-positioned overlays for entire windows (e.g. MinimalOverlay
 * which paints a solid bg during minimal frames).
 */
export const useModeSchedule = (): ModeWindow[] => {
  return useContext(ModeContext).schedule;
};
