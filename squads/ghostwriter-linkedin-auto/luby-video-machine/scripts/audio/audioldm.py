# -*- coding: utf-8 -*-
"""
audioldm.py — Generate SFX via AudioLDM2.

Same shape as musicgen.py but for short sound effects: tiny clips
(0.4-1.5s) for transitions, count-up ticks, chimes, etc.

AudioLDM2 is much better than MusicGen at non-musical sounds — whooshes,
clicks, impacts. MusicGen pretends every prompt is a song; AudioLDM2 was
trained on AudioSet (~5k hours of YouTube audio) so it actually produces
sound design.

Usage (called by generate.mjs):
    .venv/Scripts/python audioldm.py --out-dir <abs path to public/audio/sfx>
        [--force]
        [--ids id1,id2]
"""

import argparse
import io
import json
import sys
import time
from pathlib import Path

# Force UTF-8 on stdout/stderr — Windows default cp1252 chokes on '→' etc.
if sys.stdout and hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
if sys.stderr and hasattr(sys.stderr, 'buffer'):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import numpy as np
import torch
import scipy.io.wavfile as wavfile
from diffusers import AudioLDM2Pipeline

# ── Config ───────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).resolve().parent
PROMPTS_FILE = SCRIPT_DIR / 'prompts.json'

MODEL_NAME = 'cvssp/audioldm2'

# Negative prompt: tells the model what to AVOID. For B2B SFX we want clean,
# dry, professional sounds — no hiss, no muddiness, no music interpretation.
NEGATIVE_PROMPT = 'low quality, noisy, hiss, muddy, distorted, music, melody, talking, voice'

# 25 inference steps is the sweet spot — beyond that quality plateaus and
# generation time grows linearly. Below 20 steps quality drops noticeably.
NUM_INFERENCE_STEPS = 25
GUIDANCE_SCALE = 3.5  # higher = more prompt-adherent, lower = more variety


def log(msg: str) -> None:
    print(f'[audioldm] {msg}', flush=True)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser()
    p.add_argument('--out-dir', required=True, help='Absolute path to public/audio/sfx')
    p.add_argument('--force', action='store_true', help='Regenerate even if file exists')
    p.add_argument('--ids', default='', help='Comma-separated IDs to generate')
    return p.parse_args()


def load_prompts() -> list[dict]:
    with open(PROMPTS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data.get('sfx', [])


def main() -> int:
    args = parse_args()
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    prompts = load_prompts()
    if args.ids:
        wanted = set(s.strip() for s in args.ids.split(','))
        prompts = [p for p in prompts if p['id'] in wanted]

    if not prompts:
        log('No SFX prompts to generate. Done.')
        return 0

    # Skip existing
    pending = []
    for prompt in prompts:
        wav_path = out_dir / f"{prompt['id']}.wav"
        mp3_path = out_dir / f"{prompt['id']}.mp3"
        if not args.force and (wav_path.exists() or mp3_path.exists()):
            log(f"Skip {prompt['id']} (already exists)")
            continue
        pending.append(prompt)

    if not pending:
        log('All SFX already generated. Done.')
        return 0

    # ── Load pipeline once ──────────────────────────────────────────────────
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    dtype = torch.float16 if device == 'cuda' else torch.float32

    log(f'Loading {MODEL_NAME} on {device} ...')
    t0 = time.time()
    pipe = AudioLDM2Pipeline.from_pretrained(MODEL_NAME, torch_dtype=dtype)
    pipe = pipe.to(device)
    log(f'Pipeline loaded in {time.time() - t0:.1f}s')

    # ── Generate each SFX ───────────────────────────────────────────────────
    for i, prompt in enumerate(pending, 1):
        prompt_id = prompt['id']
        prompt_text = prompt['prompt']
        duration = float(prompt['duration_s'])
        seed = int(prompt.get('seed', 0))

        generator = torch.Generator(device=device).manual_seed(seed)

        log(f'[{i}/{len(pending)}] Generating "{prompt_id}" ({duration}s) ...')
        t0 = time.time()

        result = pipe(
            prompt_text,
            negative_prompt=NEGATIVE_PROMPT,
            num_inference_steps=NUM_INFERENCE_STEPS,
            guidance_scale=GUIDANCE_SCALE,
            audio_length_in_s=duration,
            generator=generator,
        )

        # diffusers returns audios as a (batch, samples) numpy array at 16kHz
        audio = result.audios[0]
        sample_rate = 16000

        # Normalize to int16 PCM range [-32768, 32767]
        audio = np.clip(audio, -1.0, 1.0)
        audio_i16 = (audio * 32767).astype(np.int16)

        out_path = out_dir / f'{prompt_id}.wav'
        wavfile.write(str(out_path), sample_rate, audio_i16)
        log(f'  Generated in {time.time() - t0:.1f}s → {out_path}')

    log(f'Done. {len(pending)} SFX generated.')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        log('Interrupted.')
        sys.exit(130)
