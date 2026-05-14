"""Smoke test — verifies torch + CUDA are functional in the venv."""
import torch

print(f"torch={torch.__version__}, cuda={torch.cuda.is_available()}, device_count={torch.cuda.device_count()}")
if torch.cuda.is_available():
    print(f"device_name={torch.cuda.get_device_name(0)}")
