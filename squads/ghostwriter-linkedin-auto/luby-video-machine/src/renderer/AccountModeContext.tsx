/**
 * AccountModeContext — bridges the loaded video's account mode to React.
 *
 * Account mode = corporate vs personal. Corporate is the brand voice
 * (Luby logo + chrome); personal is a colaborador speaking, where
 * NO Luby branding should appear (only the speaker identity).
 *
 * Mirror of ModeContext / ThemeContext but for the ACCOUNT axis.
 *
 * VideoRenderer wraps the tree in <AccountModeProvider> with the
 * resolved spec.context.mode (or override). Components consult
 * useCurrentAccountMode() to decide whether to render Luby branding.
 *
 * Default outside a provider: 'corporate' (the project default).
 */

import React, { createContext, useContext, useMemo } from 'react';
import type { Mode } from '../compositions/types';

interface AccountModeContextValue {
  mode: Mode;
}

const DEFAULT_VALUE: AccountModeContextValue = { mode: 'corporate' };

const AccountModeContext = createContext<AccountModeContextValue>(DEFAULT_VALUE);

export interface AccountModeProviderProps {
  mode: Mode;
  children: React.ReactNode;
}

export const AccountModeProvider: React.FC<AccountModeProviderProps> = ({ mode, children }) => {
  const value = useMemo(() => ({ mode }), [mode]);
  return <AccountModeContext.Provider value={value}>{children}</AccountModeContext.Provider>;
};

/**
 * Returns 'corporate' | 'personal' for the current video.
 *
 * Use this in blocks/archetypes that need to decide whether to render
 * Luby branding (logos, "powered by Luby" lines, etc). The directive
 * is: in personal mode, NO Luby branding renders. Only the speaker.
 */
export const useCurrentAccountMode = (): Mode => {
  return useContext(AccountModeContext).mode;
};
