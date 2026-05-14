# Audio pipeline

Generates BGM tracks AND per-scene narration for the Luby Video Machine,
locally, on your GPU, with no API keys and no recurring cost. Built on:

- **MusicGen** (Meta) — text-to-music via Hugging Face `transformers`,
  generates ~30s background tracks
- **Piper TTS** (rhasspy, MIT license) — text-to-speech for PT-BR
  (Edresson voice) and EN-US (Hfc-Female voice). Pure ONNX inference,
  runs on CPU, no torch needed for narration.
- **Remotion `<Audio>`** — consumes the generated files in [DemoVideo.tsx](../../src/compositions/DemoVideo.tsx),
  with auto-ducking of BGM during narration

> **Audio policy: BGM only.** The pipeline used to also generate SFX via
> AudioLDM2 (whoosh, tick, chime, etc.), but the output quality was
> inconsistent and didn't reach the bar Cleidson sets for the channel.
> The SFX scaffolding (Python script, prompts category, Remotion
> `<VideoAudio sfxEnabled>` prop) is still in the repo for future use,
> but is not part of the standard generation. If SFX is reintroduced, a
> curated library (Mixkit, Pixabay) is the recommended source rather than
> generation.

**Why transformers and not audiocraft (Meta's official wrapper)?**
Audiocraft has a hard dependency on PyAV (`av`), which on Windows
requires Visual C++ Build Tools to compile from source — adding ~2GB of
toolchain on every contributor machine. The Hugging Face `transformers`
library has its own MusicGen integration via
`MusicgenForConditionalGeneration` that produces identical audio, uses
the same model weights, and is pure-Python on top of torch.

## First-time setup (do once)

Requirements:

- **Python 3.11.x** on PATH ([download](https://www.python.org/downloads/) — check "Add to PATH")
- **NVIDIA GPU** with CUDA 12.1+ driver (RTX 3060 or better recommended)
- ~6GB free disk space (model weights cache)

Run:

```powershell
npm run audio:setup
```

The setup script:

1. Verifies Python + GPU are visible
2. Creates `scripts/audio/.venv/` (gitignored)
3. Installs torch with the CUDA 12.1 wheel (~2.5GB download)
4. Installs `audiocraft`, `diffusers`, and helpers
5. Pre-fetches MusicGen and AudioLDM2 weights (~5GB total)
6. Smoke-tests CUDA visibility

Setup is idempotent — re-running it just confirms everything is healthy.
The `.venv` folder is local to this project; nothing is installed
system-wide.

## Generating the audio library

```powershell
# BGM (default — runs on every audio:generate)
npm run audio:generate          # any missing BGM, no narration
npm run audio:generate -- --bgm-only
npm run audio:regenerate        # force regenerate BGM (--force)

# Narration (TTS, opt-in)
npm run audio:narrate           # generate any missing narration clips
npm run audio:narrate:force     # regenerate all narration

# Combined (rare — most days you only need BGM or narration, not both)
npm run audio:generate -- --with-narration
```

### Editing narration scripts

Narration text lives in [`narration.json`](narration.json), one entry
per scene per language. To change what the voice-over says:

1. Edit the `text` field for the scene/lang you want
2. Optionally bump the `seed` to force a different take of the same text
3. Run `npm run audio:narrate:force --` (or just delete the .wav file
   you want to redo) — the generator skips already-generated files

Watch out for: brand names like "Luby" are sometimes mispronounced by
the TTS model. If that happens, write the phonetic spelling in
narration.json (e.g. "Lúbi" or "Loobie") and regenerate. The visible
strings in the i18n file are NOT affected — narration.json is the
source of truth for what the TTS reads.

This:

1. Reads [prompts.json](prompts.json) — the curated prompt library
2. Generates each missing asset (skips files already on disk unless
   `--force`)
3. Converts WAV → MP3 with ffmpeg if available (otherwise leaves WAV)
4. Writes [`public/audio/manifest.json`](../../public/audio/manifest.json)
   — the index Remotion consumes

Generation is **deterministic**: each prompt has a fixed seed, so the
same prompt always produces byte-identical output. The library is
reproducible across machines.

Time on an RTX 3060:

- ~10–15s per 32s BGM track (MusicGen-medium)
- ~3–5s per SFX (AudioLDM 2)
- First run takes longer because models load into VRAM

## How to extend the library

Open [prompts.json](prompts.json). Each entry has:

```json
{
  "id": "corporate-tech-uplifting-1",
  "prompt": "upbeat corporate technology background music, ...",
  "duration_s": 32,
  "seed": 1001
}
```

To add a new BGM:

1. Append a new entry to `bgm[]`
2. Pick a unique `id` (becomes the filename)
3. Pick a unique `seed` (4-digit; 1xxx for BGM, 2xxx for SFX)
4. Run `npm run audio:generate` — only the new entry is generated

To add a new SFX cue (an SFX that plays at a specific frame):

1. Add the SFX entry to `prompts.json` `sfx[]` and run generation
2. Open [src/audio/sfx-timeline.ts](../../src/audio/sfx-timeline.ts)
3. Add an entry to `SFX_CUES` referencing the new id and the frame

## Tuning prompts

MusicGen and AudioLDM2 both respond to **musical/audio vocabulary**:

- BPM ("110 bpm", "slow", "uptempo")
- Genre ("ambient electronic", "cinematic", "lo-fi")
- Mood ("optimistic", "tense", "warm")
- Instruments ("synth pads", "soft piano", "kick drum")
- Negative ("no lyrics", "no vocals" — important for BGM under voiceover)

Avoid:

- Mentioning specific artists or song names (model trained without them)
- Long descriptive paragraphs (first 30-40 tokens dominate)
- Genre conflicts ("orchestral hip-hop") — picks one and ignores the other

Prompts in this library were tuned for **B2B premium** (Stripe / Linear /
Notion product video soundtrack). For a different brand voice, fork the
prompts.

## Troubleshooting

**`torch.cuda.is_available() == False` after setup**

- Update NVIDIA driver to >= 525
- Check `nvidia-smi` runs (should show your GPU)
- Re-run `npm run audio:setup` (the venv may need rebuild after driver update)

**`OutOfMemoryError` during MusicGen generation**

- Close GPU-heavy apps (Chrome with hardware acceleration, Photoshop, games)
- The 12GB RTX 3060 fits `musicgen-medium` with ~3GB free; if it OOMs, try
  switching to `musicgen-small` in [musicgen.py](musicgen.py) — quality
  drops slightly but it always fits

**SFX comes out as music or vice-versa**

- The two models have different strengths. If a sound prompt is being
  interpreted as music by MusicGen, move it to AudioLDM2 (or vice-versa)
  by re-categorizing it in `prompts.json`

**`ffmpeg` not found, files stay as WAV**

- Remotion plays WAV fine — this is just a size optimization
- To install: `winget install ffmpeg` (Windows) or download from
  https://ffmpeg.org/download.html and add to PATH
- Re-run `npm run audio:generate` to convert existing files

## Files

```
scripts/audio/
├── README.md            this file
├── setup.ps1            one-time venv + deps install
├── generate.mjs         orchestrator (npm run audio:generate)
├── prompts.json         curated prompt library (edit to extend)
├── musicgen.py          BGM generator (MusicGen)
├── audioldm.py          SFX generator (AudioLDM 2)
├── requirements.txt     pinned Python deps
└── .venv/               (gitignored) Python venv

public/audio/
├── manifest.json        generated index — committed, used by Remotion
├── bgm/*.{wav,mp3}      generated tracks — MP3s committed, WAVs ignored
└── sfx/*.{wav,mp3}      generated effects — MP3s committed, WAVs ignored

src/audio/
├── manifest.ts          typed wrapper over manifest.json
├── sfx-timeline.ts      SFX → frame mapping (edit to add cues)
└── VideoAudio.tsx       layered Audio component used by DemoVideo
```
