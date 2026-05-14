/**
 * SFX → TIMELINE mapping.
 *
 * Defines which sound effect plays at which frame, drawn from the master
 * TIMELINE so the SFX move automatically if scene boundaries shift.
 *
 * Each entry is "play this SFX id at this frame, optionally with these
 * volume/playback adjustments". The VideoAudio component iterates this
 * list and renders one <Audio> per entry, each with a startFrom that
 * positions it on the global frame.
 *
 * Curated to be RESTRAINED — the danger of programmatic SFX is over-doing
 * it, where every visual event clicks. We pick 5–6 anchor moments that
 * a viewer would actually expect a sound to land:
 *
 *   - Intro logo bloom         → soft impact (brand "stamp")
 *   - Hook cards arriving      → soft pops (one per card)
 *   - Pipeline first connector → whoosh (process kicks off)
 *   - Stat reveal start        → soft impact (the "moment of truth")
 *   - CTA logo signature       → soft chime (closing punctuation)
 *
 * This vocabulary mirrors how Apple keynotes use sound design: punctuate
 * brand moments, leave the rest silent.
 */

import { TIMELINE } from '../design/timeline';

export interface SfxCue {
  /** SFX id from prompts.json — must match one entry in manifest.sfx */
  id: string;
  /** Frame at which the SFX begins playing (inclusive, in 30fps frames). */
  atFrame: number;
  /**
   * Per-cue volume multiplier (0..1+). Default is 1. Use sub-1 to duck a
   * specific cue if it's competing with BGM at that moment.
   */
  volume?: number;
  /** Optional human-readable note for debugging the timeline. */
  note?: string;
}

export const SFX_CUES: SfxCue[] = [
  // Intro: soft impact when the Luby wordmark blooms (around the dot halo peak)
  {
    id: 'impact-soft',
    atFrame: TIMELINE.intro.enter.at + 14,
    volume: 0.7,
    note: 'Luby logo halo bloom',
  },

  // Hook: a soft pop on each card landing
  {
    id: 'pop-soft',
    atFrame: TIMELINE.hook.enter.at + 12,
    volume: 0.6,
    note: 'left concept card slide-in',
  },
  {
    id: 'pop-soft',
    atFrame: TIMELINE.hook.enter.at + 18,
    volume: 0.6,
    note: 'right concept card slide-in',
  },

  // Bullets pipeline: whoosh as the first connector starts drawing
  {
    id: 'transition-whoosh',
    atFrame: TIMELINE.bullets.enter.at + 6,
    volume: 0.7,
    note: 'pipeline start → first connector',
  },

  // Stat: soft impact at the moment the donut begins filling — the result lands
  {
    id: 'impact-soft',
    atFrame: TIMELINE.stat.enter.at + 8,
    volume: 0.85,
    note: 'donut count-up begins (the result lands)',
  },

  // CTA: soft chime on the logo wordmark reveal — the closing signature
  {
    id: 'chime-soft',
    atFrame: TIMELINE.cta.enter.at + 30,
    volume: 0.75,
    note: 'CTA logo signature',
  },
];
