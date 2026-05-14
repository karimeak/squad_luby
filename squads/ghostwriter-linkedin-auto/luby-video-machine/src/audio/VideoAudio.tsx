/**
 * VideoAudio
 *
 * Three layers:
 *   1. BGM — single track playing the whole video, low volume.
 *   2. Narration — one TTS clip per scene, queued at each scene's enter
 *      frame. Optional (default off) because most iterations don't need
 *      voice-over.
 *   3. SFX — sound effects at specific TIMELINE frames. Default off; the
 *      project tested AudioLDM2-generated SFX and quality didn't meet the
 *      bar. Kept in the code in case a curated library is added later.
 *
 * AUTO-DUCKING. When narration is enabled, the BGM volume is computed
 * per-frame: it sits at `bgmVolume` (12%) by default and drops to
 * `bgmVolumeDucked` (5%) during any narration window, with a short
 * cross-fade on the boundaries. This is the standard "voice-over rides
 * the bed" treatment, no extra mixing needed.
 *
 * Each layer degrades gracefully: if the manifest doesn't have the asset
 * (e.g. you haven't run `npm run audio:narrate` yet), the component just
 * skips that piece and the video plays with whatever is available.
 *
 * Usage in DemoVideo:
 *
 *   <VideoAudio />                                          // BGM only (default)
 *   <VideoAudio narrationEnabled lang="pt" />               // BGM + narração PT
 *   <VideoAudio bgmId="corporate-tech-cinematic-1" />       // pick a BGM track
 *   <VideoAudio sfxEnabled />                               // opt into SFX
 */

import React from 'react';
import { Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { findBgm, findSfx, findNarration, defaultBgmId } from './manifest';
import { SFX_CUES } from './sfx-timeline';
import { TIMELINE, SCENE_BREATH } from '../design/timeline';
import type { Lang } from '../compositions/types';

// Scene keys in narration.json correspond 1-to-1 with TIMELINE keys.
type SceneKey = 'intro' | 'hook' | 'bullets' | 'stat' | 'cta';
const SCENE_ORDER: SceneKey[] = ['intro', 'hook', 'bullets', 'stat', 'cta'];

interface Props {
  /** Override the default BGM. Defaults to the first track in the manifest. */
  bgmId?: string;
  /** Master BGM volume when no narration is active (0..1). Default 0.12. */
  bgmVolume?: number;
  /** BGM volume DURING narration windows (0..1). Default 0.05. */
  bgmVolumeDucked?: number;
  /** Master SFX volume (0..1). Default 0.30. Multiplied by each cue's volume. */
  sfxVolume?: number;
  /** Master narration volume (0..1). Default 0.95. */
  narrationVolume?: number;
  /** Disable BGM entirely. */
  bgmDisabled?: boolean;
  /** Opt INTO SFX. Default false (see component docstring). */
  sfxEnabled?: boolean;
  /**
   * Enable per-scene narration. Default FALSE so most renders are silent
   * voice-over (visual iteration is faster without re-burning TTS time).
   * Pass `narrationEnabled lang="pt"` (or "en") to switch on.
   */
  narrationEnabled?: boolean;
  /** Language for narration. Required if narrationEnabled. */
  lang?: Lang;
}

/**
 * Narration window for a given scene: the frames during which the TTS
 * clip is playing. `from` is offset by SCENE_BREATH so it lines up with
 * when the scene's content starts entering (matches the visual timing).
 */
interface NarrationWindow {
  sceneKey: SceneKey;
  from: number;
  to: number; // exclusive end frame (last narration sample is at to-1)
  file: string;
  volume: number;
}

export const VideoAudio: React.FC<Props> = ({
  bgmId,
  bgmVolume = 0.12,
  bgmVolumeDucked = 0.05,
  sfxVolume = 0.30,
  narrationVolume = 0.95,
  bgmDisabled = false,
  sfxEnabled = false,
  narrationEnabled = false,
  lang,
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  // ── BGM layer ──────────────────────────────────────────────────────────
  const resolvedBgmId = bgmId ?? defaultBgmId();
  const bgmAsset = resolvedBgmId ? findBgm(resolvedBgmId) : undefined;

  // ── Narration layer ────────────────────────────────────────────────────
  // Build the windows once — they're driven by TIMELINE so the math is
  // stable across re-renders. Each window starts at scene.enter.at +
  // SCENE_BREATH (the same offset visual elements use to wait for the
  // previous scene to clear) and ends at scene.exit.at (or end of video
  // for the CTA which has no exit).
  const narrationWindows: NarrationWindow[] = (() => {
    if (!narrationEnabled || !lang) return [];
    return SCENE_ORDER.flatMap((sceneKey): NarrationWindow[] => {
      const clip = findNarration(lang, sceneKey);
      if (!clip) return [];
      // SceneSpec keys in TIMELINE match the narration scene keys 1:1
      const spec = TIMELINE[sceneKey];
      // Intro doesn't need SCENE_BREATH (nothing before it); other scenes do.
      const breath = sceneKey === 'intro' ? 0 : SCENE_BREATH;
      const from = spec.enter.at + breath;
      // CTA has no `exit` field (it holds until the video ends), so we
      // fall back to durationInFrames there.
      const specExit = ('exit' in spec ? spec.exit : undefined) as { at: number } | undefined;
      const to = specExit?.at ?? durationInFrames;
      if (from >= durationInFrames || to <= from) return [];
      return [{
        sceneKey,
        from,
        to: Math.min(to, durationInFrames),
        file: clip.file,
        volume: narrationVolume,
      }];
    });
  })();

  // ── BGM ducking ────────────────────────────────────────────────────────
  // When any narration window is active, the BGM drops to bgmVolumeDucked.
  // We give a 6-frame cross-fade on each boundary so the duck doesn't
  // feel like a chop. The function form of `volume` is a frame-level
  // callback that Remotion samples per audio frame during render.
  const DUCK_FADE = 6;
  const bgmVolumeAt = (videoFrame: number): number => {
    if (narrationWindows.length === 0) return bgmVolume;

    // For each window, compute the duck factor (0 = no ducking, 1 = full duck).
    // We take the max across all windows — if you happen to have overlapping
    // narrations (we don't, but just in case), the duck doesn't multiply.
    let duckFactor = 0;
    for (const w of narrationWindows) {
      // Fully ducked while inside the window
      if (videoFrame >= w.from && videoFrame < w.to) {
        duckFactor = 1;
        break;
      }
      // Fade in to duck on the leading edge
      if (videoFrame >= w.from - DUCK_FADE && videoFrame < w.from) {
        const t = (videoFrame - (w.from - DUCK_FADE)) / DUCK_FADE;
        duckFactor = Math.max(duckFactor, t);
      }
      // Fade out of duck on the trailing edge
      if (videoFrame >= w.to && videoFrame < w.to + DUCK_FADE) {
        const t = 1 - (videoFrame - w.to) / DUCK_FADE;
        duckFactor = Math.max(duckFactor, t);
      }
    }

    // Lerp between full BGM volume and ducked volume
    return bgmVolume + (bgmVolumeDucked - bgmVolume) * duckFactor;
  };

  // ── SFX layer ──────────────────────────────────────────────────────────
  const sfxToRender = !sfxEnabled
    ? []
    : SFX_CUES.map((cue) => ({
        cue,
        asset: findSfx(cue.id),
      })).filter((entry) => entry.asset !== undefined);

  return (
    <>
      {/* BGM — full-duration stem with dynamic ducking volume */}
      {!bgmDisabled && bgmAsset && (
        <Audio
          src={staticFile(`audio/${bgmAsset.file}`)}
          volume={bgmVolumeAt}
        />
      )}

      {/* Narration — one Sequence per scene, each holding its TTS clip.
          We don't trim the audio file itself; the Sequence's
          durationInFrames caps how long it can play. If the TTS clip is
          longer than the scene window (sometimes happens), it gets cut
          when the next scene starts — which is the correct behavior. */}
      {narrationWindows.map((w) => {
        const playbackFrames = Math.max(1, w.to - w.from);
        return (
          <Sequence
            key={`narr-${w.sceneKey}`}
            from={w.from}
            durationInFrames={playbackFrames}
            layout="none"
          >
            <Audio
              src={staticFile(`audio/${w.file}`)}
              volume={w.volume}
            />
          </Sequence>
        );
      })}

      {/* SFX — each cue wrapped in a <Sequence> so it triggers at its frame */}
      {sfxToRender.map(({ cue, asset }, i) => {
        if (!asset) return null;
        const cueVolume = sfxVolume * (cue.volume ?? 1);
        const remainingFrames = Math.max(0, durationInFrames - cue.atFrame);
        const assetDurationFrames = Math.ceil(asset.duration_s * fps);
        const playbackFrames = Math.min(remainingFrames, assetDurationFrames);
        if (playbackFrames <= 0) return null;
        return (
          <Sequence
            key={`${cue.id}-${i}-${cue.atFrame}`}
            from={cue.atFrame}
            durationInFrames={playbackFrames}
            layout="none"
          >
            <Audio
              src={staticFile(`audio/${asset.file}`)}
              volume={cueVolume}
            />
          </Sequence>
        );
      })}
    </>
  );
};
