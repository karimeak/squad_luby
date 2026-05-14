"""Pre-download MusicGen-medium weights (~3GB) so first generation doesn't hang.

Uses the Hugging Face transformers integration (no audiocraft / no PyAV).
"""
import warnings
warnings.filterwarnings('ignore')  # silence deprecation notices on stderr

import torch
from transformers import AutoProcessor, MusicgenForConditionalGeneration

MODEL = 'facebook/musicgen-medium'
print(f'Loading {MODEL} processor ...')
AutoProcessor.from_pretrained(MODEL)
print(f'Loading {MODEL} model weights ...')
MusicgenForConditionalGeneration.from_pretrained(MODEL, torch_dtype=torch.float16)
print('MusicGen weights cached.')
