/**
 * VideoRenderer — top-level renderer that turns a VideoSpec into pixels.
 *
 * This is the entry point of the schema-driven video machine. It receives
 * one VideoSpec (the data) and assembles the entire video stack:
 *
 *   1. <ModeProvider> with the mode schedule derived from spec.scenes
 *   2. <BackgroundAtmosphere> — persistent ambient layer
 *   3. <LightOverlay> — fades in during scheduled light windows (theme axis)
 *   4. <MinimalOverlay> — fades in during scheduled minimal windows (mode axis)
 *   5. <VideoAudio> — BGM + narration + ducking, driven by spec.audio
 *   6. <BrandFrame> — persistent chrome, now mode-aware
 *   7. Per-scene: <PremiumScene> or <MinimalScene> dispatched by scene.mode
 *   8. <TransitionFlash> on every premium↔minimal boundary (auto)
 *
 * THE ARCHITECTURE
 *   - Schema (data) lives in src/schema/.
 *   - Renderers (components) live in src/renderer/.
 *   - Brand vocabulary (colors, easings, motion, modes) lives in src/design/.
 *   - Reusable visual primitives live in src/components/.
 *
 *   No video-specific code lives in src/components/ or src/scenes/. Every
 *   video is a VideoSpec; producing a new video means writing a new spec
 *   file and registering a Composition that points VideoRenderer at it.
 *
 * SCHEMA OVERRIDES
 *   The optional `overrides` prop lets the Composition layer push runtime
 *   values (lang, mode, speaker) into spec.context. This preserves the
 *   existing pattern where a single video file ships in PT/EN/personal
 *   variants without duplicating the schema.
 */

import React, { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';

import { BackgroundAtmosphere } from '../components/BackgroundAtmosphere';
import { LightOverlay } from '../components/LightOverlay';
import { MinimalOverlay } from '../components/MinimalOverlay';
import { TransitionFlash } from '../components/TransitionFlash';
import { BrandFrame } from '../components/BrandFrame';
import { VideoAudio } from '../audio/VideoAudio';

import { buildModeSchedule, findModeBoundaries } from '../design/modes';
import { strings } from '../i18n/strings';
import { ModeProvider } from './ModeContext';
import { ThemeProvider } from './ThemeContext';
import { AccountModeProvider } from './AccountModeContext';
import { PremiumScene } from './PremiumScene';
import { MinimalScene } from './MinimalScene';

import type { VideoSpec, SceneSpec, TransitionFlashSpec } from '../schema/types';
import type { Lang, Mode, SpeakerInfo } from '../compositions/types';

interface Props {
  spec: VideoSpec;
  /**
   * Runtime context overrides — typically supplied by the Composition
   * (PT vs EN, corporate vs personal, with-speaker variants). Each field
   * patches `spec.context.<field>` if provided.
   */
  overrides?: {
    lang?: Lang;
    mode?: Mode;
    speaker?: SpeakerInfo;
  };
}

export const VideoRenderer: React.FC<Props> = ({ spec, overrides }) => {
  // Effective context — overrides win over schema defaults.
  const lang = overrides?.lang ?? spec.context.lang;
  const mode = overrides?.mode ?? spec.context.mode;
  const speaker = overrides?.speaker ?? spec.context.speaker;
  const t = strings[lang];

  // Mode schedule derived from the scene list (memoised — schedule only
  // changes when the spec changes, not on every frame).
  const modeSchedule = useMemo(
    () => buildModeSchedule(spec.scenes, spec.output.durationFrames),
    [spec.scenes, spec.output.durationFrames],
  );

  // Auto-emit transition flashes on every mode boundary unless the
  // schema explicitly says otherwise. Pass `transitions: []` in the
  // spec to suppress all auto-flashes; pass `transitions: [...]` to
  // override with a custom list.
  const transitions: TransitionFlashSpec[] = useMemo(() => {
    if (spec.transitions !== undefined) return spec.transitions;
    return findModeBoundaries(modeSchedule).map(
      (atFrame): TransitionFlashSpec => ({ atFrame }),
    );
  }, [spec.transitions, modeSchedule]);

  return (
    <ModeProvider schedule={modeSchedule}>
      <ThemeProvider schedule={spec.themeSchedule ?? []}>
      <AccountModeProvider mode={mode}>
      <AbsoluteFill>
        {/* Layer 1: persistent atmosphere */}
        <BackgroundAtmosphere intensity={1} hero />

        {/* Layer 2: light theme overlay. Reads the per-video schedule
            from the spec (defaults to empty = no light windows for this
            video). Without this, the LightOverlay would fall back to the
            project-level THEME_SCHEDULE constant, which only matches
            the legacy luby-demo's Stat window — wrong for any other
            video that doesn't want light. */}
        <LightOverlay schedule={spec.themeSchedule ?? []} />

        {/* Layer 3: minimal mode overlay (reads mode context). Paints
            surface0 over the atmosphere during minimal windows. */}
        <MinimalOverlay />

        {/* Layer 4: audio (BGM + narration + auto-ducking) */}
        <VideoAudio
          bgmId={spec.audio.bgmId}
          bgmVolume={spec.audio.bgmVolume}
          bgmVolumeDucked={spec.audio.bgmVolumeDucked}
          narrationVolume={spec.audio.narrationVolume}
          bgmDisabled={spec.audio.bgmId === undefined}
          narrationEnabled={spec.audio.narrationEnabled ?? false}
          lang={lang}
        />

        {/* Layer 5: scenes — mounted directly without BrandFrame chrome.
            Brand recognition comes from the Intro logo + CTA closing-card,
            not from a persistent top-left wordmark. The lang badge and
            progress bar were also removed (LinkedIn auto-shows lang in
            captions; 30s videos don't need a progress indicator).

            Personal mode still mounts BrandFrame because the speaker
            badge is content-bearing (the collaborator's identity is
            part of the video's message, not chrome). */}
        {mode === 'personal' ? (
          <BrandFrame
            lang={lang}
            mode={mode}
            speaker={speaker}
            langBadge={t.langBadge}
          >
            {spec.scenes.map((scene) => (
              <AbsoluteFill key={scene.id}>
                <SceneDispatcher scene={scene} />
              </AbsoluteFill>
            ))}
          </BrandFrame>
        ) : (
          spec.scenes.map((scene) => (
            <AbsoluteFill key={scene.id}>
              <SceneDispatcher scene={scene} />
            </AbsoluteFill>
          ))
        )}

        {/* Layer 6: transition flashes — sit on top of everything,
            invisible outside their 4-frame window. */}
        {transitions.map((tx, i) => (
          <TransitionFlash
            key={`flash-${i}-${tx.atFrame}`}
            atFrame={tx.atFrame}
            durationFrames={tx.durationFrames}
            color={tx.color}
          />
        ))}
      </AbsoluteFill>
      </AccountModeProvider>
      </ThemeProvider>
    </ModeProvider>
  );
};

// ─── Scene dispatch ────────────────────────────────────────────────────────

const SceneDispatcher: React.FC<{ scene: SceneSpec }> = ({ scene }) => {
  switch (scene.mode) {
    case 'luby-premium':
      return <PremiumScene scene={scene} />;
    case 'luby-minimal':
      return <MinimalScene scene={scene} />;
  }
};
