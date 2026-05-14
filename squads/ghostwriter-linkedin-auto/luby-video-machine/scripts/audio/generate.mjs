#!/usr/bin/env node
//
// generate.mjs — Orchestrator for the Luby Video Machine audio pipeline.
//
// Steps:
//   1. Activate the venv (scripts/audio/.venv) and run musicgen.py for BGM
//   2. Run audioldm.py for SFX
//   3. Convert any newly produced .wav to .mp3 (via ffmpeg if available),
//      keeping the original .wav files since Remotion handles both — MP3
//      is smaller for repo storage; WAV is the lossless source.
//   4. Write public/audio/manifest.json — a generated index that
//      src/audio/manifest.ts re-exports as a typed object the rest of
//      the app consumes.
//
// Usage:
//   npm run audio:generate                 # generate all missing assets
//   npm run audio:generate -- --force      # regenerate everything
//   npm run audio:generate -- --bgm-only   # only BGM (faster iteration)
//   npm run audio:generate -- --sfx-only   # only SFX

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ── Paths ────────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
// Two venvs: main for MusicGen/AudioLDM2, separate for MeloTTS (dep conflicts).
const VENV_PYTHON = path.join(__dirname, '.venv', 'Scripts', 'python.exe');
const TTS_VENV_PYTHON = path.join(__dirname, '.venv-tts', 'Scripts', 'python.exe');
const PROMPTS_FILE = path.join(__dirname, 'prompts.json');
const NARRATION_FILE = path.join(__dirname, 'narration.json');
const PUBLIC_AUDIO = path.join(PROJECT_ROOT, 'public', 'audio');
const BGM_DIR = path.join(PUBLIC_AUDIO, 'bgm');
const SFX_DIR = path.join(PUBLIC_AUDIO, 'sfx');
const NARRATION_DIR = path.join(PUBLIC_AUDIO, 'narration');
const MANIFEST_FILE = path.join(PUBLIC_AUDIO, 'manifest.json');

// ── Args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flags = {
  force:           argv.includes('--force'),
  bgmOnly:         argv.includes('--bgm-only'),
  sfxOnly:         argv.includes('--sfx-only'),
  narrationOnly:   argv.includes('--narration-only'),
  // Skip narration by default until you want voice-over. The Coqui-style
  // "auto" generation is enabled per video, not per render — most days
  // you're tweaking visuals and don't need to re-burn TTS GPU time.
  withNarration:   argv.includes('--with-narration') || argv.includes('--narration-only'),
};

const log = (msg) => console.log(`[audio] ${msg}`);
const fail = (msg) => { console.error(`[audio] ERROR: ${msg}`); process.exit(1); };

// ── Pre-flight ───────────────────────────────────────────────────────────────
if (!existsSync(PROMPTS_FILE)) {
  fail(`prompts.json missing at ${PROMPTS_FILE}`);
}

mkdirSync(BGM_DIR, { recursive: true });
mkdirSync(SFX_DIR, { recursive: true });
mkdirSync(NARRATION_DIR, { recursive: true });

// ── Helpers ──────────────────────────────────────────────────────────────────
// Each generator runs in its own venv:
//   musicgen.py + audioldm.py → main venv (.venv)
//   melotts.py                → tts venv (.venv-tts)
const runPython = (script, outDir, { useTtsVenv = false } = {}) => {
  const venv = useTtsVenv ? TTS_VENV_PYTHON : VENV_PYTHON;
  if (!existsSync(venv)) {
    fail(`venv not found at ${venv}\n` +
         `Run \`npm run audio:setup\` first.`);
  }

  const args = [path.join(__dirname, script), '--out-dir', outDir];
  if (flags.force) args.push('--force');

  log(`Running ${script} (venv=${useTtsVenv ? 'tts' : 'main'}) ...`);
  const result = spawnSync(venv, args, {
    stdio: 'inherit',
    cwd: __dirname,
  });
  if (result.status !== 0) {
    fail(`${script} exited with code ${result.status}`);
  }
};

const findFfmpeg = () => {
  // Prefer ffmpeg on PATH; fall back to common Windows install locations.
  const candidates = [
    'ffmpeg',
    'C:\\ffmpeg\\bin\\ffmpeg.exe',
    'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe',
  ];
  for (const cmd of candidates) {
    try {
      execFileSync(cmd, ['-version'], { stdio: 'ignore' });
      return cmd;
    } catch (_) { /* not found, try next */ }
  }
  return null;
};

const convertWavToMp3 = (dir, ffmpegBin) => {
  if (!ffmpegBin) {
    log('ffmpeg not found — leaving WAV files as-is. Remotion can play them; if you want smaller files, install ffmpeg.');
    return;
  }
  const files = readdirSync(dir).filter((f) => f.endsWith('.wav'));
  for (const wavFile of files) {
    const wavPath = path.join(dir, wavFile);
    const mp3Path = path.join(dir, wavFile.replace(/\.wav$/, '.mp3'));
    // Skip if MP3 is newer than WAV
    if (existsSync(mp3Path) && statSync(mp3Path).mtimeMs > statSync(wavPath).mtimeMs) {
      continue;
    }
    log(`  → mp3: ${path.basename(mp3Path)}`);
    try {
      execFileSync(ffmpegBin, [
        '-y',
        '-i', wavPath,
        '-codec:a', 'libmp3lame',
        '-qscale:a', '2',
        mp3Path,
      ], { stdio: 'pipe' });
    } catch (err) {
      log(`  ffmpeg failed for ${wavFile}: ${err.message}`);
    }
  }
};

const buildManifest = () => {
  const prompts = JSON.parse(readFileSync(PROMPTS_FILE, 'utf-8'));
  const narration = existsSync(NARRATION_FILE)
    ? JSON.parse(readFileSync(NARRATION_FILE, 'utf-8'))
    : { scenes: {} };

  const collect = (dir, prefix, list) =>
    list
      .map((entry) => {
        const mp3 = path.join(dir, `${entry.id}.mp3`);
        const wav = path.join(dir, `${entry.id}.wav`);
        const file = existsSync(mp3) ? `${entry.id}.mp3` : existsSync(wav) ? `${entry.id}.wav` : null;
        if (!file) return null;
        return {
          id: entry.id,
          file: `${prefix}/${file}`,
          duration_s: entry.duration_s,
          prompt: entry.prompt,
        };
      })
      .filter(Boolean);

  // Narration manifest: nested {lang: {sceneKey: {file, text}}}
  // The langs MUST match the TS Lang type ('pt' | 'en'), so we lowercase.
  const collectNarration = () => {
    const langDirs = ['pt', 'en']; // file system folder names
    const result = {};
    for (const langDir of langDirs) {
      const upperLang = langDir.toUpperCase();
      const folder = path.join(NARRATION_DIR, langDir);
      if (!existsSync(folder)) continue;
      result[langDir] = {};
      const scenes = narration.scenes || {};
      for (const [sceneKey, sceneEntry] of Object.entries(scenes)) {
        if (sceneKey.startsWith('_')) continue;
        const langEntry = sceneEntry[upperLang];
        if (!langEntry) continue;
        const wav = path.join(folder, `${sceneKey}.wav`);
        const mp3 = path.join(folder, `${sceneKey}.mp3`);
        const file = existsSync(mp3) ? `${sceneKey}.mp3` : existsSync(wav) ? `${sceneKey}.wav` : null;
        if (!file) continue;
        result[langDir][sceneKey] = {
          file: `narration/${langDir}/${file}`,
          text: langEntry.text,
        };
      }
    }
    return result;
  };

  const narrationManifest = collectNarration();
  const narrationCount = Object.values(narrationManifest)
    .reduce((acc, perLang) => acc + Object.keys(perLang).length, 0);

  const manifest = {
    generatedAt: new Date().toISOString(),
    bgm: collect(BGM_DIR, 'bgm', prompts.bgm || []),
    sfx: collect(SFX_DIR, 'sfx', prompts.sfx || []),
    narration: narrationManifest,
  };

  writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  log(`Manifest written: ${path.relative(PROJECT_ROOT, MANIFEST_FILE)}`);
  log(`  bgm: ${manifest.bgm.length} tracks`);
  log(`  sfx: ${manifest.sfx.length} effects`);
  log(`  narration: ${narrationCount} clips across ${Object.keys(narrationManifest).length} langs`);
};

// ── Run ──────────────────────────────────────────────────────────────────────
// Mode resolution. Most days you only iterate visuals, so the default is
// "BGM + SFX from the existing prompts.json, no narration regen". To pull
// in narration (slower, GPU-heavy), pass --with-narration. To run ONLY
// narration (e.g. after editing narration.json), pass --narration-only.
const start = Date.now();

const runBgm = !flags.sfxOnly && !flags.narrationOnly;
const runSfx = !flags.bgmOnly && !flags.narrationOnly;
const runNarration = flags.withNarration;

if (runBgm) runPython('musicgen.py', BGM_DIR);
if (runSfx) runPython('audioldm.py', SFX_DIR);
if (runNarration) runPython('piper_tts.py', NARRATION_DIR, { useTtsVenv: true });

const ffmpegBin = findFfmpeg();
log(`Converting WAV → MP3 ${ffmpegBin ? `(via ${ffmpegBin})` : '(skipped — no ffmpeg)'} ...`);
if (runBgm) convertWavToMp3(BGM_DIR, ffmpegBin);
if (runSfx) convertWavToMp3(SFX_DIR, ffmpegBin);
if (runNarration) {
  // Narration files live in subfolders (pt/, en/), so we recurse one level.
  for (const lang of ['pt', 'en']) {
    const langDir = path.join(NARRATION_DIR, lang);
    if (existsSync(langDir)) convertWavToMp3(langDir, ffmpegBin);
  }
}

buildManifest();

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
log(`Done in ${elapsed}s.`);
