/**
 * iconMap — string-keyed dictionary of available icons.
 *
 * Why string keys instead of importing LucideIcon components directly into
 * the schema? Because the schema is meant to be SERIALIZABLE. A future web
 * UI, an LLM that drafts a video from a brief, or a JSON file in /briefs/
 * cannot produce React component references — but it CAN produce strings
 * like "shield-check". This module is the single place where strings get
 * resolved into the actual Lucide React components.
 *
 * Adding a new icon: import it from lucide-react, add an entry below.
 *
 * Naming convention: kebab-case matching the Lucide library's published
 * names (https://lucide.dev/icons). When in doubt, copy the icon's URL
 * slug from lucide.dev. Stable across Lucide versions.
 *
 * The keyword auto-resolver below maps Portuguese AND English words/phrases
 * to icon keys. The Luby Video Machine produces videos in PT and EN, and
 * keyword matching needs to work in both. Add new entries as the brand's
 * vocabulary grows. Match is case-insensitive and ignores diacritics for
 * PT terms.
 */

import {
  // Brand / business
  Building2,
  Briefcase,
  Users,
  Target,
  TrendingUp,
  Award,
  Sparkles,

  // AI / technology
  Brain,
  Cpu,
  Zap,
  Bot,

  // Security / compliance
  ShieldCheck,
  Shield,
  Lock,
  KeyRound,
  ShieldAlert,
  FileCheck2,

  // Code / development
  Code2,
  GitPullRequest,
  GitBranch,
  GitMerge,
  Terminal,
  Bug,

  // Process / flow
  Rocket,
  Gauge,
  Workflow,
  Repeat,

  // Data / analytics
  BarChart3,
  LineChart,
  TrendingDown,
  Activity,

  // Comms / sync
  CheckCircle2,
  CircleDashed,
  Clock,

  // Search / analysis
  Search,

  // Generic
  Star,
  Eye,
  Scissors,
  type LucideIcon,
} from 'lucide-react';

/**
 * The full catalog. Add an entry here whenever you need a new icon.
 * Keys are kebab-case strings the schema can reference.
 */
export const iconMap = {
  // Brand
  'building': Building2,
  'briefcase': Briefcase,
  'users': Users,
  'target': Target,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'award': Award,
  'sparkles': Sparkles,

  // AI / tech
  'brain': Brain,
  'cpu': Cpu,
  'zap': Zap,
  'bot': Bot,

  // Security
  'shield-check': ShieldCheck,
  'shield': Shield,
  'shield-alert': ShieldAlert,
  'lock': Lock,
  'key': KeyRound,
  'file-check': FileCheck2,

  // Code
  'code': Code2,
  'pull-request': GitPullRequest,
  'git-branch': GitBranch,
  'git-merge': GitMerge,
  'terminal': Terminal,
  'bug': Bug,

  // Process
  'rocket': Rocket,
  'gauge': Gauge,
  'workflow': Workflow,
  'repeat': Repeat,

  // Data
  'bar-chart': BarChart3,
  'line-chart': LineChart,
  'activity': Activity,

  // Comms
  'check': CheckCircle2,
  'circle-dashed': CircleDashed,
  'clock': Clock,

  // Search / analysis
  'search': Search,

  // Generic
  'star': Star,
  'eye': Eye,
  'scissors': Scissors,
} as const satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof iconMap;

/**
 * Resolve an icon key into its Lucide component.
 * Returns undefined if the key isn't in the map — callers should treat
 * that as "skip the icon" rather than crash.
 */
export const resolveIcon = (key: string): LucideIcon | undefined => {
  return (iconMap as Record<string, LucideIcon>)[key];
};

/**
 * Keyword → icon-key auto-resolver.
 *
 * Maps common business terms (PT and EN) to a default icon key. Used by
 * the schema's `sentence-with-syncs` block when the author wants to mark
 * a word for sync but doesn't want to spell out the icon manually.
 *
 * The match is case-insensitive and diacritic-insensitive (PT "segurança"
 * matches the key "seguranca"). The schema can still override per word.
 *
 * If you find yourself reaching for the same word→icon mapping twice in
 * different videos, add it here so the next video gets it for free.
 */
/**
 * Some terms are SHARED between PT and EN (loanwords used in PT IT
 * vocabulary and original English): "review", "deploy", "compliance",
 * "code", "pipeline". They appear ONCE in this map.
 *
 * Where the same word means different things across languages
 * (e.g. "time" — PT "equipe" = users, EN "clock"), we keep the English
 * meaning because IT vocabulary defaults to English; PT authors should
 * write the unambiguous PT word ("equipe") to get the team icon.
 */
const keywordToIcon: Record<string, IconKey> = {
  // ── Security / compliance ─────────────────────────────────────────────
  'seguranca':         'shield-check',
  'seguro':            'shield-check',
  'security':          'shield-check',
  'secure':            'shield-check',
  'protecao':          'shield',
  'protection':        'shield',
  'compliance':        'file-check',
  'auditoria':         'file-check',
  'audit':             'file-check',

  // ── AI / intelligence ─────────────────────────────────────────────────
  'ia':                'sparkles',
  'ai':                'sparkles',
  'ai-fast':           'zap',
  'inteligencia':      'brain',
  'intelligence':      'brain',
  'automacao':         'bot',
  'automation':        'bot',
  'automatizado':      'bot',
  'automated':         'bot',

  // ── Speed / agility ───────────────────────────────────────────────────
  'velocidade':        'zap',
  'velocity':          'gauge',
  'rapido':            'zap',
  'fast':              'zap',
  'acelerar':          'zap',
  'speed':             'zap',
  'agilidade':         'gauge',

  // ── Code / dev (loanwords used in both langs) ────────────────────────
  'codigo':            'code',
  'code':              'code',
  'pr':                'pull-request',
  'deploy':            'rocket',
  'review':            'eye',

  // ── People / org ──────────────────────────────────────────────────────
  'equipe':            'users',
  'team':              'users',
  'cliente':           'briefcase',
  'client':            'briefcase',
  'empresa':           'building',
  'company':           'building',

  // ── Results / data ────────────────────────────────────────────────────
  'resultado':         'trending-up',
  'result':            'trending-up',
  'crescimento':       'trending-up',
  'growth':            'trending-up',
  'metrica':           'bar-chart',
  'metric':            'bar-chart',
  'dados':             'line-chart',
  'data':              'line-chart',

  // ── Process / time ────────────────────────────────────────────────────
  'processo':          'workflow',
  'process':           'workflow',
  'pipeline':          'workflow',
  'tempo':             'clock',
  'time':              'clock',
};

/**
 * Strips diacritics (PT á → a, ç → c) and lowercases. Used so PT keyword
 * lookups don't break on accented input.
 */
const normalize = (s: string): string =>
  s
    .normalize('NFD')
    // Strip Unicode "Mark Nonspacing" (combining diacritics).
    // Using \p{Mn} + /u flag is more robust than a literal range that
    // depends on the source file's encoding being preserved end-to-end.
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .replace(/[?!.,;:]/g, '')
    .trim();

/**
 * Best-effort: given a word from a sentence, return the default icon key
 * for it (or undefined if not in the keyword map).
 *
 *   suggestIconForWord('segurança?') → 'shield-check'
 *   suggestIconForWord('AI-fast')    → 'zap'
 *   suggestIconForWord('como')       → undefined  (function word, no icon)
 */
export const suggestIconForWord = (word: string): IconKey | undefined => {
  const normalized = normalize(word);
  return keywordToIcon[normalized];
};
