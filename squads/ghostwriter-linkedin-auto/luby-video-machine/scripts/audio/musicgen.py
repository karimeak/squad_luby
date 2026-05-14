# -*- coding: utf-8 -*-
"""
musicgen.py — Generate BGM tracks via MusicGen (Hugging Face transformers).

Reads `prompts.json` from this directory, generates each BGM entry that
isn't already on disk, writes WAV files to `public/audio/bgm/`. The
orchestrator (generate.mjs) converts WAV → MP3 with ffmpeg afterwards.

Why transformers and not audiocraft? Audiocraft requires PyAV which
needs Visual C++ Build Tools to compile on Windows. The transformers
implementation uses the same MusicGen model weights but is pure-Python
on top of torch, so it works on any machine with a working torch+CUDA.
The audio output is identical given the same seed.

Usage (called by generate.mjs, not directly):
    .venv/Scripts/python musicgen.py --out-dir <abs path to public/audio/bgm>
        [--force]        regenerate even if file exists
        [--ids id1,id2]  only generate these IDs (default: all)
"""

import argparse
import io
import json
import sys
import time
from pathlib import Path

# Force UTF-8 on stdout/stderr so log messages with non-ASCII chars (→, etc.)
# don't crash on Windows' default cp1252 codec. Must come before any other
# print or import that prints.
if sys.stdout and hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
if sys.stderr and hasattr(sys.stderr, 'buffer'):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import numpy as np
import scipy.io.wavfile as wavfile
import torch
from transformers import AutoProcessor, MusicgenForConditionalGeneration

# ── Config ───────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).resolve().parent
PROMPTS_FILE = SCRIPT_DIR / 'prompts.json'

# musicgen-medium is the sweet spot: 1.5B params, ~3GB VRAM, much better
# quality than -small without the 12GB+ VRAM cost of -large. Fits on the
# RTX 3060 (12GB) with comfortable headroom.
MODEL_NAME = 'facebook/musicgen-medium'

# MusicGen samples at 32kHz; transformers exposes this on the model config.
# We persist via scipy.wavfile (int16 PCM).


def log(msg: str) -> None:
    print(f'[musicgen] {msg}', flush=True)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser()
    p.add_argument('--out-dir', required=True, help='Absolute path to public/audio/bgm')
    p.add_argument('--force', action='store_true', help='Regenerate even if file exists')
    p.add_argument('--ids', default='', help='Comma-separated IDs to generate (default: all)')
    return p.parse_args()


def load_prompts() -> list[dict]:
    with open(PROMPTS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data.get('bgm', [])


def main() -> int:
    args = parse_args()
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    prompts = load_prompts()
    if args.ids:
        wanted = set(s.strip() for s in args.ids.split(','))
        prompts = [p for p in prompts if p['id'] in wanted]

    if not prompts:
        log('No BGM prompts to generate. Done.')
        return 0

    # Filter out already-existing tracks unless --force
    pending = []
    for prompt in prompts:
        wav_path = out_dir / f"{prompt['id']}.wav"
        mp3_path = out_dir / f"{prompt['id']}.mp3"
        if not args.force and (wav_path.exists() or mp3_path.exists()):
            log(f"Skip {prompt['id']} (already exists; use --force to regenerate)")
            continue
        pending.append(prompt)

    if not pending:
        log('All BGM tracks already generated. Done.')
        return 0

    # ── Load model + processor once for all generations ─────────────────────
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    dtype = torch.float16 if device == 'cuda' else torch.float32

    log(f'Loading {MODEL_NAME} on {device} ...')
    t0 = time.time()
    processor = AutoProcessor.from_pretrained(MODEL_NAME)
    model = MusicgenForConditionalGeneration.from_pretrained(MODEL_NAME, torch_dtype=dtype)
    model = model.to(device)
    sample_rate = model.config.audio_encoder.sampling_rate
    log(f'Model loaded in {time.time() - t0:.1f}s. CUDA={torch.cuda.is_available()}, sr={sample_rate}')

    # MusicGen runs at ~50 tokens/sec of audio. Convert duration in seconds
    # to max_new_tokens so transformers knows when to stop generating.
    # The model's audio_encoder has a frame_rate the processor uses internally.
    frame_rate = model.config.audio_encoder.frame_rate

    # ── Generate each pending track ─────────────────────────────────────────
    for i, prompt in enumerate(pending, 1):
        prompt_id = prompt['id']
        prompt_text = prompt['prompt']
        duration = float(prompt['duration_s'])
        seed = int(prompt.get('seed', 0))

        # Deterministic seed → reproducible builds. Same prompt + seed
        # always yields the same audio, so the library can be regenerated
        # bit-perfectly later (useful for git'd manifests).
        torch.manual_seed(seed)
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(seed)

        # Tokens needed for the requested duration
        max_new_tokens = int(duration * frame_rate)

        log(f'[{i}/{len(pending)}] Generating "{prompt_id}" ({duration}s, {max_new_tokens} tokens) ...')
        t0 = time.time()

        inputs = processor(text=[prompt_text], padding=True, return_tensors='pt').to(device)

        with torch.no_grad():
            audio_values = model.generate(
                **inputs,
                do_sample=True,
                guidance_scale=3.0,  # classifier-free guidance — higher = more prompt-adherent
                max_new_tokens=max_new_tokens,
            )

        # audio_values is shape (batch, channels, samples). Pull the first
        # batch entry, convert to mono float32 numpy.
        audio = audio_values[0, 0].cpu().float().numpy()

        # Normalize and convert to int16 PCM
        audio = np.clip(audio, -1.0, 1.0)
        audio_i16 = (audio * 32767).astype(np.int16)

        out_path = out_dir / f'{prompt_id}.wav'
        wavfile.write(str(out_path), sample_rate, audio_i16)
        log(f'  Generated in {time.time() - t0:.1f}s → {out_path}')

    log(f'Done. {len(pending)} BGM tracks generated.')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        log('Interrupted.')
        sys.exit(130)
