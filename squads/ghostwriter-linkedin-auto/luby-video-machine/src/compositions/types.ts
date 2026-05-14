/**
 * Shared types for the Luby Video Machine.
 *
 * Two cross-cutting dimensions parameterize every video:
 *   - lang: "pt" | "en"        → drives copy + (eventually) narration voice
 *   - mode: "corporate" | "personal" → drives tone, logo presence, palette emphasis
 */

export type Lang = 'pt' | 'en';
export type Mode = 'corporate' | 'personal';

export interface SpeakerInfo {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface CommonProps {
  lang: Lang;
  mode: Mode;
  speaker?: SpeakerInfo;
}
