"""Pre-download AudioLDM2 weights (~2GB) so first SFX generation doesn't hang."""
import warnings
warnings.filterwarnings('ignore')

import torch
from diffusers import AudioLDM2Pipeline

print("Loading audioldm2 ...")
AudioLDM2Pipeline.from_pretrained("cvssp/audioldm2", torch_dtype=torch.float16)
print("AudioLDM2 weights cached.")
