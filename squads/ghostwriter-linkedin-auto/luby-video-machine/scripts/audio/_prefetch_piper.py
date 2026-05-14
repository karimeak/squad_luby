"""Pre-download Piper TTS voice models.

We grab two voices:
  - PT-BR: Edresson medium  (the de-facto open-source PT-BR voice)
  - EN-US: Hfc-Female medium (clean female narrator, brand-friendly)

Both files are pulled from the official Piper voices Hugging Face repo:
https://huggingface.co/rhasspy/piper-voices

Each voice is two files:
  <voice>.onnx       -- the model (~63MB)
  <voice>.onnx.json  -- the config (~10KB)

Stored in scripts/audio/piper-voices/{lang}/.
"""
import warnings
warnings.filterwarnings('ignore')

import io
import sys
from pathlib import Path
from urllib.request import urlretrieve

# UTF-8 stdout for safety on Windows
if sys.stdout and hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SCRIPT_DIR = Path(__file__).resolve().parent
VOICES_DIR = SCRIPT_DIR / 'piper-voices'

# Voice catalog. Each entry: (folder, files-to-fetch, base-url-on-HF)
# The HF repo serves models under
#   https://huggingface.co/rhasspy/piper-voices/resolve/main/<lang>/<region>/<name>/<quality>/<file>
VOICES = [
    {
        'lang_dir': 'pt',
        'voice_id': 'pt_BR-edresson-low',
        'base_url': 'https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/edresson/low',
        'files': ['pt_BR-edresson-low.onnx', 'pt_BR-edresson-low.onnx.json'],
    },
    {
        'lang_dir': 'en',
        'voice_id': 'en_US-hfc_female-medium',
        'base_url': 'https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/hfc_female/medium',
        'files': ['en_US-hfc_female-medium.onnx', 'en_US-hfc_female-medium.onnx.json'],
    },
]


def download_one(voice):
    target_dir = VOICES_DIR / voice['lang_dir']
    target_dir.mkdir(parents=True, exist_ok=True)

    for filename in voice['files']:
        target = target_dir / filename
        if target.exists() and target.stat().st_size > 0:
            print(f'  cached: {filename}')
            continue

        url = f"{voice['base_url']}/{filename}"
        print(f'  downloading {filename} ...')
        try:
            urlretrieve(url, str(target))
            size_mb = target.stat().st_size / (1024 * 1024)
            print(f'    {size_mb:.1f}MB')
        except Exception as e:
            print(f'    ERROR: {e}')
            if target.exists():
                target.unlink()
            raise


def main():
    print(f'Voices dir: {VOICES_DIR}')
    for voice in VOICES:
        print(f"Voice: {voice['voice_id']}")
        download_one(voice)
    print('Piper voices ready.')


if __name__ == '__main__':
    main()
