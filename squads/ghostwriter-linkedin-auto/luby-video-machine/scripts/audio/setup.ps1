#
# setup.ps1 -- One-time setup of the Python audio environments.
#
# This project has TWO Python venvs, intentionally separated:
#
#   scripts/audio/.venv      -- MusicGen (BGM) + AudioLDM2 (SFX)
#                               heavy: torch CUDA + transformers + diffusers
#   scripts/audio/.venv-tts  -- Piper TTS (narration, PT-BR Edresson voice)
#                               light: piper-tts + ONNX Runtime CPU only
#
# Why two venvs? Piper has minimal deps (piper-tts is a tiny package and
# ONNX runtime is much smaller than torch). Keeping it separate avoids
# any chance of dep churn affecting the GPU-heavy main venv.
#
# IMPORTANT: this file is intentionally ASCII-only. Windows PowerShell
# 5.1 reads .ps1 as the system codepage (cp1252) when there is no BOM,
# so any UTF-8 multibyte char (em-dash, box-drawing, accents) corrupts
# the parser. Stick to plain ASCII unless you switch to PowerShell 7+.
#
# Run once:   npm run audio:setup
# Idempotent: re-running skips already-installed packages and cached
# model weights, only fetching what's missing.
#
# Requirements:
#   - Python 3.11.x on PATH (run python --version to check)
#   - NVIDIA GPU with CUDA 12.1 driver (run nvidia-smi to check)
#

# Native commands (Python, pip) often write benign UserWarning text to
# stderr, which under Stop policy crashes the script. We use Continue and
# rely on explicit exit-code checks for actual failures.
$ErrorActionPreference = 'Continue'

$audioDir = $PSScriptRoot
$projectRoot = Split-Path -Parent (Split-Path -Parent $audioDir)
$venvDir = Join-Path $audioDir '.venv'
$ttsVenvDir = Join-Path $audioDir '.venv-tts'

Write-Host ''
Write-Host '=== Luby Video Machine - Audio Setup ===' -ForegroundColor Cyan
Write-Host ''

# 1. Verify Python is available --------------------------------------------
$pyExe = $null
foreach ($cmd in @('python', 'py')) {
    $check = Get-Command $cmd -ErrorAction SilentlyContinue
    if ($check) {
        $version = & $cmd --version 2>&1
        if ($version -match 'Python 3\.11\.') {
            $pyExe = $cmd
            Write-Host "Found Python: $version" -ForegroundColor Green
            break
        }
    }
}

if (-not $pyExe) {
    Write-Host 'ERROR: Python 3.11.x not found on PATH.' -ForegroundColor Red
    Write-Host 'Install from https://www.python.org/downloads/ (check "Add to PATH")'
    exit 1
}

# 2. Verify NVIDIA GPU is available ----------------------------------------
$nvidiaSmi = Get-Command 'nvidia-smi' -ErrorAction SilentlyContinue
if ($nvidiaSmi) {
    $gpuInfo = & nvidia-smi --query-gpu=name,memory.total --format=csv,noheader 2>&1 | Select-Object -First 1
    Write-Host "Found GPU: $gpuInfo" -ForegroundColor Green
} else {
    Write-Host 'WARNING: nvidia-smi not found. Generation will fall back to CPU and be very slow.' -ForegroundColor Yellow
}

# ==========================================================================
# VENV #1: MAIN (MusicGen + AudioLDM2)
# ==========================================================================

Write-Host ''
Write-Host '---- Setting up MAIN venv (MusicGen + AudioLDM2) ----' -ForegroundColor Magenta

if (-not (Test-Path $venvDir)) {
    Write-Host "Creating venv at $venvDir ..." -ForegroundColor Cyan
    & $pyExe -m venv $venvDir
}

$venvPython = Join-Path $venvDir 'Scripts\python.exe'
$venvPip = Join-Path $venvDir 'Scripts\pip.exe'

if (-not (Test-Path $venvPython)) {
    Write-Host 'ERROR: main venv creation failed.' -ForegroundColor Red
    exit 1
}

Write-Host ''
Write-Host 'Upgrading pip + wheel ...' -ForegroundColor Cyan
& $venvPython -m pip install --upgrade pip wheel setuptools 2>&1 | Out-Host

Write-Host ''
Write-Host 'Installing torch (CUDA 12.1 wheel, ~2.5GB if not cached) ...' -ForegroundColor Cyan
& $venvPip install torch==2.3.1 torchaudio==2.3.1 --index-url https://download.pytorch.org/whl/cu121 2>&1 | Out-Host

Write-Host ''
Write-Host 'Installing transformers + diffusers + helpers ...' -ForegroundColor Cyan
$reqFile = Join-Path $audioDir 'requirements.txt'
& $venvPip install -r $reqFile 2>&1 | Out-Host

# Make sure librosa is on a recent version (the one MeloTTS pins downgrades
# it to 0.9.1, which uses pkg_resources and breaks on setuptools >= 81).
& $venvPip install --no-input "librosa>=0.10.0" 2>&1 | Out-Null

Write-Host ''
Write-Host 'Verifying main venv (torch + CUDA) ...' -ForegroundColor Cyan
$smokeScript = Join-Path $audioDir '_smoke_torch.py'
$smokeTest = & $venvPython $smokeScript 2>&1
Write-Host $smokeTest

if ($smokeTest -match 'cuda=False') {
    Write-Host 'WARNING: CUDA not visible. Generation will use CPU (slow).' -ForegroundColor Yellow
    Write-Host 'Likely cause: NVIDIA driver outdated. Update to >= 525.'
}

# Pre-download MusicGen + AudioLDM2 weights (idempotent if cached) ----------
Write-Host ''
Write-Host 'Pre-fetching MusicGen weights (~3GB if not cached) ...' -ForegroundColor Cyan
& $venvPython (Join-Path $audioDir '_prefetch_musicgen.py') 2>&1 | Out-Host

Write-Host ''
Write-Host 'Pre-fetching AudioLDM2 weights (~2GB if not cached) ...' -ForegroundColor Cyan
& $venvPython (Join-Path $audioDir '_prefetch_audioldm.py') 2>&1 | Out-Host

# ==========================================================================
# VENV #2: TTS (Piper - PT-BR + EN narration)
# ==========================================================================

Write-Host ''
Write-Host '---- Setting up TTS venv (Piper narration) ----' -ForegroundColor Magenta

if (-not (Test-Path $ttsVenvDir)) {
    Write-Host "Creating venv at $ttsVenvDir ..." -ForegroundColor Cyan
    & $pyExe -m venv $ttsVenvDir
}

$ttsPython = Join-Path $ttsVenvDir 'Scripts\python.exe'
$ttsPip = Join-Path $ttsVenvDir 'Scripts\pip.exe'

if (-not (Test-Path $ttsPython)) {
    Write-Host 'ERROR: tts venv creation failed.' -ForegroundColor Red
    exit 1
}

Write-Host ''
Write-Host 'Upgrading pip + wheel in TTS venv ...' -ForegroundColor Cyan
& $ttsPython -m pip install --upgrade pip wheel setuptools 2>&1 | Out-Host

Write-Host ''
Write-Host 'Installing piper-tts (CPU ONNX runtime) ...' -ForegroundColor Cyan
# piper-tts 1.4.2+ ships its own phonemizer (espeak-ng based) and works
# with Python 3.11 wheels on Windows. Older versions (1.2.0, 1.3.0)
# depend on the separate piper-phonemize package which has no Windows
# wheels for Python 3.11.
& $ttsPip install --no-input piper-tts==1.4.2 2>&1 | Out-Host

# Download the actual voice models from the Piper voices Hugging Face repo.
# We use the Edresson PT-BR voice (medium quality, ~63MB) and the
# Hfc-Female EN-US voice for English (~63MB). Models live next to the
# venv so they're easy to find / replace.
$voicesDir = Join-Path $audioDir 'piper-voices'
New-Item -ItemType Directory -Force -Path $voicesDir | Out-Null

Write-Host ''
Write-Host 'Downloading Piper voice models (PT-BR Edresson + EN Hfc) ...' -ForegroundColor Cyan
& $ttsPython (Join-Path $audioDir '_prefetch_piper.py') 2>&1 | Out-Host

# ==========================================================================
Write-Host ''
Write-Host '=== Setup complete ===' -ForegroundColor Green
Write-Host 'Run:  npm run audio:generate    # BGM' -ForegroundColor Green
Write-Host 'Run:  npm run audio:narrate     # narration' -ForegroundColor Green
Write-Host ''
