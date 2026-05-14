/**
 * validate.ts — runtime validation for VideoSpec.
 *
 * TypeScript types catch errors when the schema is authored as a .ts file
 * with autocomplete. But the long-term plan is for schemas to come from
 * JSON files, web forms, and LLM output — none of which TS can check at
 * compile time. This module provides a runtime guard so a malformed
 * schema fails LOUDLY at composition load, not silently mid-render.
 *
 * Why hand-rolled instead of Zod / Yup / io-ts?
 *   - Zero deps (the project already has a heavy stack)
 *   - Schema is small enough that ~100 lines of checks cover it
 *   - We can produce schema-specific error messages ("scene #3 is missing
 *     `mode`") instead of generic "expected string at .scenes[3].mode"
 *
 * If the schema grows beyond ~20 block kinds or starts needing features
 * like discriminated-union refinement chains, swap to Zod.
 */

import type {
  VideoSpec,
  SceneSpec,
  Block,
  BlockKind,
  VisualMode,
  Lang,
  Mode,
} from './types';

// ─── Public API ─────────────────────────────────────────────────────────────

export interface ValidationError {
  /** Dotted path into the schema, e.g. "scenes[1].blocks[2].kind". */
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validates a VideoSpec at runtime. Returns a list of all errors found
 * (not just the first) so authors can fix everything in one pass.
 */
export const validateVideoSpec = (spec: unknown): ValidationResult => {
  const errors: ValidationError[] = [];
  const ctx = makeCtx(errors);

  if (!isObject(spec)) {
    ctx.error('', 'expected an object');
    return { valid: false, errors };
  }

  ctx.requireString(spec, 'id');
  ctx.requireString(spec, 'title');

  if (ctx.requireObject(spec, 'output')) {
    const o = spec.output as Record<string, unknown>;
    ctx.requirePositiveNumber(o, 'output.width');
    ctx.requirePositiveNumber(o, 'output.height');
    ctx.requirePositiveNumber(o, 'output.fps');
    ctx.requirePositiveNumber(o, 'output.durationFrames');
  }

  if (ctx.requireObject(spec, 'context')) {
    const c = spec.context as Record<string, unknown>;
    ctx.requireOneOf(c, 'context.lang', VALID_LANGS);
    ctx.requireOneOf(c, 'context.mode', VALID_MODES);
  }

  if (ctx.requireObject(spec, 'audio')) {
    // All audio fields optional — no required checks beyond the object existing.
  }

  if (ctx.requireArray(spec, 'scenes')) {
    const scenes = spec.scenes as unknown[];
    if (scenes.length === 0) {
      ctx.error('scenes', 'must contain at least one scene');
    }
    scenes.forEach((scene, i) => validateScene(scene, `scenes[${i}]`, ctx));
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Throwing variant — useful at composition-load time when there is no
 * sane fallback. Errors are joined into a single human-readable message.
 */
export const assertValidVideoSpec = (spec: unknown): asserts spec is VideoSpec => {
  const result = validateVideoSpec(spec);
  if (!result.valid) {
    const summary = result.errors
      .map((e) => `  - ${e.path || '<root>'}: ${e.message}`)
      .join('\n');
    throw new Error(`Invalid VideoSpec:\n${summary}`);
  }
};

// ─── Scene + block walkers ─────────────────────────────────────────────────

const validateScene = (scene: unknown, path: string, ctx: Ctx): void => {
  if (!isObject(scene)) {
    ctx.error(path, 'expected an object');
    return;
  }
  ctx.requireString(scene, 'id', path);
  ctx.requireOneOf(scene, 'mode', VALID_MODES_VISUAL, path);

  if (ctx.requireObject(scene, 'enter', path)) {
    const e = (scene.enter as Record<string, unknown>);
    ctx.requireNumber(e, 'enter.at', path);
    ctx.requirePositiveNumber(e, 'enter.duration', path);
  }

  if ('exit' in scene && scene.exit !== undefined) {
    if (ctx.requireObject(scene, 'exit', path)) {
      const x = (scene.exit as Record<string, unknown>);
      ctx.requireNumber(x, 'exit.at', path);
      ctx.requirePositiveNumber(x, 'exit.duration', path);
    }
  }

  if (ctx.requireArray(scene, 'blocks', path)) {
    const blocks = (scene as { blocks: unknown[] }).blocks;
    if (blocks.length === 0) {
      ctx.error(`${path}.blocks`, 'must contain at least one block');
    }
    blocks.forEach((b, i) => validateBlock(b, `${path}.blocks[${i}]`, ctx));
  }
};

const validateBlock = (block: unknown, path: string, ctx: Ctx): void => {
  if (!isObject(block)) {
    ctx.error(path, 'expected an object');
    return;
  }
  const kind = (block as Record<string, unknown>).kind;
  if (typeof kind !== 'string') {
    ctx.error(`${path}.kind`, 'expected a string');
    return;
  }
  if (!VALID_BLOCK_KINDS.includes(kind as BlockKind)) {
    ctx.error(`${path}.kind`, `unknown kind "${kind}". Valid: ${VALID_BLOCK_KINDS.join(', ')}`);
    return;
  }

  // Per-kind required fields. Keep tight: only check what would actually
  // crash the renderer if missing. Optional fields are validated by TS at
  // schema-author time.
  const b = block as Record<string, unknown>;
  switch (kind as BlockKind) {
    case 'logo-mark':
      ctx.requirePositiveNumber(b, 'height', path);
      break;
    case 'eyebrow':
    case 'tagline':
      ctx.requireString(b, 'text', path);
      break;
    case 'sentence-with-syncs':
      ctx.requireString(b, 'text', path);
      break;
    case 'concept-pair':
      ctx.requireObject(b, 'left', path);
      ctx.requireObject(b, 'right', path);
      break;
    case 'pipeline':
      ctx.requireString(b, 'startLabel', path);
      ctx.requireString(b, 'endLabel', path);
      ctx.requireArray(b, 'stages', path);
      break;
    case 'big-stat':
      ctx.requireString(b, 'value', path);
      ctx.requireString(b, 'caption', path);
      break;
    case 'closing-card':
      ctx.requireString(b, 'headline', path);
      break;
    case 'accent-line':
      // No required fields beyond 'kind'.
      break;
    case 'multiplication-equation':
      ctx.requireObject(b, 'left', path);
      ctx.requireObject(b, 'right', path);
      ctx.requireObject(b, 'result', path);
      break;
    case 'concept-row':
      ctx.requireArray(b, 'concepts', path);
      break;
    case 'metric-grid':
      ctx.requireArray(b, 'metrics', path);
      break;
    case 'feature-grid':
      ctx.requireArray(b, 'features', path);
      break;
    case 'quote':
      ctx.requireString(b, 'quote', path);
      ctx.requireString(b, 'attribution', path);
      break;
    case 'logo-row':
      ctx.requireArray(b, 'logos', path);
      break;
    case 'timeline':
      ctx.requireArray(b, 'events', path);
      break;

    // ─── Archetype library (Wave 3) ──────────────────────────────────
    case 'split-screen-comparison':
      ctx.requireObject(b, 'left', path);
      ctx.requireObject(b, 'right', path);
      break;
    case 'vertical-stack':
      ctx.requireArray(b, 'items', path);
      break;
    case 'central-spotlight-with-satellites':
      ctx.requireObject(b, 'center', path);
      ctx.requireArray(b, 'satellites', path);
      break;
    case 'giant-statement':
      ctx.requireString(b, 'text', path);
      break;
    case 'quadrante-2x2':
      ctx.requireObject(b, 'axisX', path);
      ctx.requireObject(b, 'axisY', path);
      ctx.requireObject(b, 'quadrants', path);
      break;

    // ─── Archetype library (Wave 4) ─────────────────────────────────
    case 'iceberg-revelation':
      ctx.requireObject(b, 'surface', path);
      ctx.requireObject(b, 'depth', path);
      break;

    // ─── Archetype library (Wave 5) ─────────────────────────────────
    case 'onion-peel-revelation':
      ctx.requireObject(b, 'visible', path);
      ctx.requireArray(b, 'layers', path);
      break;
  }
};

// ─── Tiny check helpers (Ctx) ──────────────────────────────────────────────

interface Ctx {
  error(path: string, message: string): void;
  requireString(obj: unknown, key: string, parentPath?: string): boolean;
  requireNumber(obj: unknown, key: string, parentPath?: string): boolean;
  requirePositiveNumber(obj: unknown, key: string, parentPath?: string): boolean;
  requireObject(obj: unknown, key: string, parentPath?: string): boolean;
  requireArray(obj: unknown, key: string, parentPath?: string): boolean;
  requireOneOf<T extends string>(obj: unknown, key: string, allowed: readonly T[], parentPath?: string): boolean;
}

const makeCtx = (errors: ValidationError[]): Ctx => {
  const join = (parent: string | undefined, key: string): string =>
    parent ? `${parent}.${key}` : key;

  const get = (obj: unknown, key: string): unknown => {
    if (!isObject(obj)) return undefined;
    // Support dotted keys for nested checks ("output.width")
    return key.split('.').reduce<unknown>((acc, k) => {
      if (!isObject(acc)) return undefined;
      return (acc as Record<string, unknown>)[k];
    }, obj);
  };

  return {
    error(path, message) {
      errors.push({ path, message });
    },
    requireString(obj, key, parent) {
      const v = get(obj, key);
      if (typeof v !== 'string' || v.length === 0) {
        errors.push({ path: join(parent, key), message: 'expected a non-empty string' });
        return false;
      }
      return true;
    },
    requireNumber(obj, key, parent) {
      const v = get(obj, key);
      if (typeof v !== 'number' || !Number.isFinite(v)) {
        errors.push({ path: join(parent, key), message: 'expected a finite number' });
        return false;
      }
      return true;
    },
    requirePositiveNumber(obj, key, parent) {
      const v = get(obj, key);
      if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) {
        errors.push({ path: join(parent, key), message: 'expected a positive number' });
        return false;
      }
      return true;
    },
    requireObject(obj, key, parent) {
      const v = get(obj, key);
      if (!isObject(v)) {
        errors.push({ path: join(parent, key), message: 'expected an object' });
        return false;
      }
      return true;
    },
    requireArray(obj, key, parent) {
      const v = get(obj, key);
      if (!Array.isArray(v)) {
        errors.push({ path: join(parent, key), message: 'expected an array' });
        return false;
      }
      return true;
    },
    requireOneOf<T extends string>(obj: unknown, key: string, allowed: readonly T[], parent?: string) {
      const v = get(obj, key);
      if (typeof v !== 'string' || !allowed.includes(v as T)) {
        errors.push({ path: join(parent, key), message: `expected one of: ${allowed.join(', ')}` });
        return false;
      }
      return true;
    },
  };
};

// ─── Constants used for membership checks ──────────────────────────────────

const VALID_LANGS: readonly Lang[] = ['pt', 'en'];
const VALID_MODES: readonly Mode[] = ['corporate', 'personal'];
const VALID_MODES_VISUAL: readonly VisualMode[] = ['luby-premium', 'luby-minimal'];
const VALID_BLOCK_KINDS: readonly BlockKind[] = [
  'logo-mark',
  'eyebrow',
  'tagline',
  'accent-line',
  'sentence-with-syncs',
  'concept-pair',
  'concept-row',
  'pipeline',
  'big-stat',
  'closing-card',
  'multiplication-equation',
  'metric-grid',
  'feature-grid',
  'quote',
  'logo-row',
  'timeline',
  // Wave 3 — archetype library
  'split-screen-comparison',
  'vertical-stack',
  'central-spotlight-with-satellites',
  'giant-statement',
  'quadrante-2x2',
  // Wave 4 — archetype library
  'iceberg-revelation',
  // Wave 5 — archetype library
  'onion-peel-revelation',
];

const isObject = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

// Light type-check (un-used vars allowed) — silences TS6133 in case a Block
// shape changes and one of the imports above becomes momentarily unused.
void ({} as Block);
void ({} as SceneSpec);
void ({} as VideoSpec);
