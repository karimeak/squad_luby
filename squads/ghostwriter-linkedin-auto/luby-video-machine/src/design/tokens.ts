/**
 * Luby Video Machine — Design Tokens (v2).
 *
 * Anchor: official Luby palette (#0F2341 navy + #41A0DC blue) + neutrals.
 * Extended with gradient stops, multi-tier glow alphas, surface variations,
 * and dedicated motion-relevant values.
 */

export const colors = {
  // Brand — primary
  navy:       '#0F2341',
  navyDeep:   '#091831',
  navyDark:   '#050D1B',
  navyMuted:  '#1A2F4D',
  navyLight:  '#2A3F5F',

  // Brand — accent
  blue:       '#41A0DC',
  blueBright: '#5FB6E8',
  blueDeep:   '#2D7AAB',
  blueDim:    '#1F5A80',
  blueGhost:  '#7FC4F0', // very light, for highlights/sparks

  // Surfaces (very dark backgrounds, layered)
  surface0:   '#020610', // deepest backdrop
  surface1:   '#040912',
  surface2:   '#0A1424',
  surface3:   '#11203A',

  // Neutrals
  white:      '#FFFFFF',
  offWhite:   '#EEF2F8',
  gray100:    '#D5DCE6',
  gray300:    '#A0ABBE',
  gray400:    '#7C8AA0',
  gray500:    '#5E6B82',
  gray600:    '#4A5566',
  gray700:    '#2F3845',
  gray800:    '#1F2733',

  // Glow tiers (used for atmospheric effects)
  glow05:     'rgba(65, 160, 220, 0.05)',
  glow10:     'rgba(65, 160, 220, 0.10)',
  glow20:     'rgba(65, 160, 220, 0.20)',
  glow30:     'rgba(65, 160, 220, 0.30)',
  glow40:     'rgba(65, 160, 220, 0.40)',
  glow60:     'rgba(65, 160, 220, 0.60)',
  glow80:     'rgba(65, 160, 220, 0.80)',

  // Bright glow (the lighter blue)
  brightGlow30: 'rgba(127, 196, 240, 0.30)',
  brightGlow60: 'rgba(127, 196, 240, 0.60)',

  // White alphas
  whiteA05:   'rgba(255, 255, 255, 0.05)',
  whiteA10:   'rgba(255, 255, 255, 0.10)',
  whiteA15:   'rgba(255, 255, 255, 0.15)',
  whiteA20:   'rgba(255, 255, 255, 0.20)',
  whiteA40:   'rgba(255, 255, 255, 0.40)',
  whiteA60:   'rgba(255, 255, 255, 0.60)',
  whiteA80:   'rgba(255, 255, 255, 0.80)',

  // Black alphas (for vignettes, depth)
  blackA20:   'rgba(0, 0, 0, 0.20)',
  blackA40:   'rgba(0, 0, 0, 0.40)',
  blackA60:   'rgba(0, 0, 0, 0.60)',
  blackA80:   'rgba(0, 0, 0, 0.80)',
} as const;

/**
 * Pillar palette — three blue-family tones for a 3-stage diagram.
 *
 * Why three blues instead of three different hues? The brand vocabulary is
 * navy + blue; introducing greens/oranges/etc would feel off-brand. Using
 * the gradient from light → mid → deep gives visual differentiation while
 * staying inside the family. Each pillar also carries its own glow alpha,
 * matching the same hue, so glows stay coherent with their owner stage.
 *
 * Order convention: pillar1 = first stage (lightest, "incoming"), pillar3
 * = final stage (deepest, "settled / committed"). Read left-to-right, the
 * sequence visually matures.
 */
export const pillars = {
  pillar1: {
    color:    colors.blueGhost,         // #7FC4F0 — light, "fresh"
    glow:     colors.brightGlow60,
    glowSoft: colors.brightGlow30,
  },
  pillar2: {
    color:    colors.blue,              // #41A0DC — brand mid
    glow:     colors.glow80,
    glowSoft: colors.glow30,
  },
  pillar3: {
    color:    colors.blueDeep,          // #2D7AAB — deep, "committed"
    glow:     'rgba(45, 122, 171, 0.75)',
    glowSoft: 'rgba(45, 122, 171, 0.30)',
  },
} as const;

export type PillarKey = keyof typeof pillars;

/**
 * Theme tokens.
 *
 * The project supports two themes: `dark` (default — navy hero look) and
 * `light` (off-white, used as a "breathing moment" between dark scenes).
 * Components that need to invert colours (text fg, surface bg, border,
 * logo variant) read from `themes[name]` instead of hardcoding `colors.white`.
 *
 * Why off-white instead of pure #FFFFFF? Pure white on a 1080p video on
 * LinkedIn auto-burns retinas during scroll. The off-white softens the
 * contrast just enough to feel premium without losing the "light scene"
 * intent.
 */
export const themes = {
  dark: {
    name:           'dark',
    bg:             colors.navyDark,
    bgSurface:      colors.surface1,
    fg:             colors.white,
    fgMuted:        colors.gray100,
    fgSubtle:       colors.gray400,
    border:         colors.whiteA20,
    borderSubtle:   colors.whiteA10,
    surface:        colors.whiteA10,
    surfaceStrong:  colors.whiteA20,
    accent:         colors.blue,
    accentBright:   colors.blueBright,
    accentDeep:     colors.blueDeep,
    logoVariant:    'white' as const,
    badgeText:      colors.gray300,
    badgeBg:        colors.whiteA10,
    badgeBorder:    colors.whiteA20,
  },
  light: {
    name:           'light',
    bg:             '#F4F6FA',          // soft off-white with a hint of cool
    bgSurface:      '#EAEEF5',
    fg:             colors.navyDeep,
    fgMuted:        '#3A4A66',
    fgSubtle:       '#6B7894',
    border:         'rgba(15, 35, 65, 0.18)',
    borderSubtle:   'rgba(15, 35, 65, 0.10)',
    surface:        'rgba(15, 35, 65, 0.04)',
    surfaceStrong:  'rgba(15, 35, 65, 0.08)',
    accent:         colors.blueDeep,    // deeper for contrast on light bg
    accentBright:   colors.blue,
    accentDeep:     colors.navyDeep,
    logoVariant:    'navy' as const,
    badgeText:      '#3A4A66',
    badgeBg:        'rgba(15, 35, 65, 0.06)',
    badgeBorder:    'rgba(15, 35, 65, 0.18)',
  },
} as const;

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName];

/**
 * Pre-built gradients used across atmospheric backgrounds.
 */
export const gradients = {
  // Heroic radial — navy core, blue rim, fades to black
  hero: `
    radial-gradient(ellipse 60% 80% at 50% 50%, ${colors.navy} 0%, ${colors.navyDark} 50%, ${colors.surface0} 100%)
  `,

  // Top-left blue glow over deep base
  topLeftGlow: `
    radial-gradient(ellipse 50% 40% at 25% 25%, ${colors.glow20} 0%, transparent 60%),
    radial-gradient(ellipse 70% 50% at 80% 90%, rgba(15, 35, 65, 0.6) 0%, transparent 70%),
    linear-gradient(180deg, ${colors.surface0} 0%, ${colors.navyDark} 100%)
  `,

  // Centered orb — for hero stat scenes
  centerOrb: `
    radial-gradient(circle at 50% 50%, ${colors.glow30} 0%, ${colors.glow10} 30%, transparent 60%),
    linear-gradient(180deg, ${colors.surface1} 0%, ${colors.surface0} 100%)
  `,

  // Brand stripe — vertical accent
  brandStripe: `linear-gradient(180deg, ${colors.blueDeep}, ${colors.blue} 50%, ${colors.blueBright})`,

  // Number text gradient — for big stat values
  numberShine: `linear-gradient(135deg, ${colors.white} 0%, ${colors.blueBright} 60%, ${colors.blue} 100%)`,

  // Progress bar — premium feel
  progressBar: `linear-gradient(90deg, ${colors.blueDeep}, ${colors.blue} 50%, ${colors.blueBright})`,
} as const;

/**
 * Typography stack.
 * Aspekta is the brand font; Inter is the guaranteed fallback.
 */
export const fonts = {
  display: '"Aspekta", "Inter", -apple-system, system-ui, sans-serif',
  body:    '"Aspekta", "Inter", -apple-system, system-ui, sans-serif',
  mono:    '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',
} as const;

export const weights = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
  black:    900,
} as const;

export const radius = {
  sm:   8,
  md:   14,
  lg:   22,
  xl:   32,
  pill: 999,
} as const;

/**
 * Legacy space scale — kept for backwards compatibility with v2 components
 * that haven't yet been migrated to the v3 `gap` scale below. New code
 * should prefer `gap.*` (8-px-aligned, semantic names).
 */
export const space = {
  xxs: 4,
  xs:  8,
  sm:  16,
  md:  32,
  lg:  56,
  xl:  88,
  xxl: 144,
} as const;

/**
 * Spacing scale — STRICT 8-px grid.
 *
 * Every gap, padding and margin in the project should be one of these
 * values. The names are semantic, not numeric, so the choice forces you
 * to think about *what role* the space is playing — section break,
 * element pair, intra-component breath, etc.
 *
 * Hierarchy (largest → smallest):
 *   section → block → group → elements → intra → tight
 *
 * Use:
 *   gap.tight    (8)   between siblings of the same atom (icon ↔ label)
 *   gap.intra    (16)  between sub-parts of an element (label ↔ caption)
 *   gap.elements (24)  between sibling elements in a row/column
 *   gap.group    (32)  between distinct groups (eyebrow ↔ title)
 *   gap.block    (48)  between logical blocks (title block ↔ diagram)
 *   gap.section  (96)  between major sections of a scene
 *   gap.scene    (160) reserved for full-scene-level breathing
 */
export const gap = {
  tight:    8,
  intra:    16,
  elements: 24,
  group:    32,
  block:    48,
  section:  96,
  scene:    160,
} as const;

/**
 * Type scale — 6 canonical sizes, modular 1.25× progression.
 *
 * Use semantically. Don't reach for arbitrary fontSizes.
 *
 *   display   96px  — hero typography (CTA headline, intro tagline)
 *   headline  64px  — scene-level titles (bulletsTitle)
 *   title     36px  — element titles (ConceptCard, gate labels in lists)
 *   body      22px  — main paragraph copy, captions for cards
 *   caption   16px  — supporting text, secondary labels
 *   eyebrow   14px  — uppercase tracked labels (Pill, source lines)
 *
 * Line-height defaults are tuned per role: tighter for display, looser
 * for body. Letter-spacing follows the same rule (negative for display,
 * neutral for body, positive for eyebrow).
 */
export const type = {
  display: {
    size:          96,
    lineHeight:    1.05,
    letterSpacing: '-0.03em',
  },
  headline: {
    size:          64,
    lineHeight:    1.1,
    letterSpacing: '-0.025em',
  },
  title: {
    size:          36,
    lineHeight:    1.2,
    letterSpacing: '-0.015em',
  },
  body: {
    size:          22,
    lineHeight:    1.4,
    letterSpacing: '-0.005em',
  },
  caption: {
    size:          16,
    lineHeight:    1.45,
    letterSpacing: '0.01em',
  },
  eyebrow: {
    size:          14,
    lineHeight:    1.2,
    letterSpacing: '0.18em',
  },
} as const;

/**
 * Weight policy — applied across the project.
 *
 * Project decision: every text in the video uses ONE TIER LIGHTER than
 * the natural pre-v3 default. This makes the video read as "refined
 * premium B2B" instead of "loud marketing". Heavy weights felt visually
 * crowded — particularly black (900) on Aspekta, which is genuinely
 * extra-bold and reads as shouting at large sizes.
 *
 * Use these named tokens INSTEAD OF reaching for `weights.*` directly:
 *
 *   typeWeight.display   600  — hero headlines (was 900 in v2)
 *   typeWeight.headline  600  — scene titles (was 900)
 *   typeWeight.title     500  — element titles (was 700)
 *   typeWeight.body      400  — body text (was 500)
 *   typeWeight.caption   400  — captions (was 500)
 *   typeWeight.eyebrow   500  — uppercase labels (was 600)
 *
 * The raw `weights` map below is still exported for components that
 * legitimately need a non-default weight (e.g. an emphasis span).
 */
export const typeWeight = {
  display:  600,
  headline: 600,
  title:    500,
  body:     400,
  caption:  400,
  eyebrow:  500,
} as const;

/**
 * Output spec for LinkedIn horizontal video.
 */
export const VIDEO = {
  width:           1920,
  height:          1080,
  fps:             30,
  durationFrames:  900, // 30 seconds
} as const;

/**
 * Layout safe zones — keeps content away from frame elements
 * (logo top-left, lang badge top-right, progress bar bottom).
 */
export const SAFE = {
  top:    140,
  right:  140,
  bottom: 140,
  left:   140,
} as const;
