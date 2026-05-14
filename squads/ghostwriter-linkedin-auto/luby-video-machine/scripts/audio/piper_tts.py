"""
piper.py -- Generate per-scene narration via Piper TTS (MIT license).

Reads narration.json, produces one .wav per (scene x language) into
public/audio/narration/{lang}/{sceneKey}.wav.

Why Piper instead of MeloTTS / XTTS?
  - MIT license, no commercial restrictions
  - Has an official PT-BR voice (Edresson) -- MeloTTS does NOT
  - Pure ONNX inference -- no torch, no PyAV, no setuptools games
  - Fast on CPU (~0.5s per 5s of audio)

Tradeoffs vs paid TTS:
  - Less expressive prosody
  - One voice per language
  - Brand-name pronunciation may need phonetic spelling in narration.json
    (e.g. "Lubi" instead of "Luby" if the model mispronounces it)

Usage (called by generate.mjs, not directly):
    .venv-tts/Scripts/python piper.py --out-dir <abs path>
        [--force]              regenerate even if file exists
        [--scenes intro,hook]  only these scene keys
        [--langs PT,EN]        only these languages
"""

import argparse
import io
import json
import sys
import time
import wave
from pathlib import Path

# UTF-8 stdout for accents in PT narration logs
if sys.stdout and hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
if sys.stderr and hasattr(sys.stderr, 'buffer'):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from piper import PiperVoice

# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
NARRATION_FILE = SCRIPT_DIR / 'narration.json'
VOICES_DIR = SCRIPT_DIR / 'piper-voices'

# Map narration.json language codes to (folder, voice file basename).
# The voice file is the .onnx; piper-tts loads .onnx.json automatically
# from the same path.
LANG_TO_VOICE = {
    'PT': {
        'folder': 'pt',
        'voice_file': 'pt_BR-edresson-low.onnx',
        'lang_dir_name': 'pt',
    },
    'EN': {
        'folder': 'en',
        'voice_file': 'en_US-hfc_female-medium.onnx',
        'lang_dir_name': 'en',
    },
}


def log(msg: str) -> None:
    print(f'[piper] {msg}', flush=True)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser()
    p.add_argument('--out-dir', required=True)
    p.add_argument('--force', action='store_true')
    p.add_argument('--scenes', default='')
    p.add_argument('--langs', default='')
    return p.parse_args()


def load_narration() -> dict:
    with open(NARRATION_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def synthesize(voice: PiperVoice, text: str, out_path: Path) -> None:
    """Write a single utterance to a WAV file.

    piper-tts 1.4.x changed `synthesize()` to return an iterable of
    AudioChunk objects (each with `audio_int16_bytes`, `sample_rate`,
    `sample_width`, `sample_channels`). We accumulate them and write a
    standard PCM WAV manually.
    """
    chunks = list(voice.synthesize(text))
    if not chunks:
        raise RuntimeError(f'piper produced no audio for: {text!r}')

    first = chunks[0]
    with wave.open(str(out_path), 'wb') as wf:
        wf.setnchannels(first.sample_channels)
        wf.setsampwidth(first.sample_width)
        wf.setframerate(first.sample_rate)
        for chunk in chunks:
            wf.writeframes(chunk.audio_int16_bytes)


def main() -> int:
    args = parse_args()
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    data = load_narration()
    scenes = data.get('scenes', {})

    wanted_scenes = set(s.strip() for s in args.scenes.split(',')) if args.scenes else None
    wanted_langs = set(s.strip().upper() for s in args.langs.split(',')) if args.langs else None

    work = []
    for scene_key, scene in scenes.items():
        if scene_key.startswith('_'):
            continue
        if wanted_scenes and scene_key not in wanted_scenes:
            continue
        for lang_code, entry in scene.items():
            if lang_code.startswith('_'):
                continue
            if wanted_langs and lang_code not in wanted_langs:
                continue
            if lang_code not in LANG_TO_VOICE:
                log(f'Skip unsupported lang {lang_code} for scene {scene_key}')
                continue

            voice_cfg = LANG_TO_VOICE[lang_code]
            lang_dir = out_dir / voice_cfg['lang_dir_name']
            lang_dir.mkdir(parents=True, exist_ok=True)
            out_path = lang_dir / f'{scene_key}.wav'

            if not args.force and out_path.exists():
                log(f'Skip {lang_code}/{scene_key} (already exists)')
                continue

            work.append({
                'scene_key': scene_key,
                'lang_code': lang_code,
                'text': entry['text'],
                'out_path': out_path,
                'voice_cfg': voice_cfg,
            })

    if not work:
        log('All narration already generated. Done.')
        return 0

    # Load each unique voice once (lazy)
    voices = {}  # lang_code -> PiperVoice
    for entry in work:
        lang_code = entry['lang_code']
        scene_key = entry['scene_key']
        text = entry['text']
        out_path = entry['out_path']
        voice_cfg = entry['voice_cfg']

        if lang_code not in voices:
            voice_path = VOICES_DIR / voice_cfg['folder'] / voice_cfg['voice_file']
            if not voice_path.exists():
                log(f'ERROR: voice file missing at {voice_path}')
                log('Run: npm run audio:setup')
                return 2
            log(f'Loading voice {voice_cfg["voice_file"]} ...')
            t0 = time.time()
            voices[lang_code] = PiperVoice.load(str(voice_path))
            log(f'  loaded in {time.time() - t0:.1f}s')

        voice = voices[lang_code]
        log(f'Generating {lang_code}/{scene_key} ({len(text)} chars) ...')
        t0 = time.time()
        synthesize(voice, text, out_path)
        log(f'  -> {out_path} in {time.time() - t0:.1f}s')

    log(f'Done. {len(work)} narration clips generated.')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        log('Interrupted.')
        sys.exit(130)
