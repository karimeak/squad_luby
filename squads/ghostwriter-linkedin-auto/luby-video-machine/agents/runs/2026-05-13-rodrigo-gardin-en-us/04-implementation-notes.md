# Implementation Notes — Substrate (Rodrigo, EN-Personal)

## Spec arquivo
- **Path**: `src/schema/examples/rodrigo-gardin-substrate-en.ts`
- **Export**: `rodrigoGardinSubstrateEnSpec`

## Composition arquivo
- **Path**: `src/compositions/RodrigoGardinSubstrateEn.tsx`
- **Component**: `RodrigoGardinSubstrateEn`
- **Composition ID em Root.tsx**: `rodrigo-gardin-substrate-en`
- **Default props**: `lang='en'`, `mode='personal'`, `speaker={ name: 'Rodrigo Gardin', role: 'Técnico / CTO @ Luby' }`

## Mapeamento storyboard → blocks
| Cena | Frames | Archetype | Block kinds |
|---|---|---|---|
| Intro | 0-90 | logo-with-bloom | logo-mark, eyebrow, tagline, accent-line |
| Hook | 90-250 | giant-statement | giant-statement + tagline (sub-line) |
| Bullets | 250-610 | multiplication-equation | multiplication-equation |
| Stat | 610-775 | stat-with-comparison-bars | big-stat (style: 'comparison-bars') |
| CTA | 775-900 | logo-with-bloom | closing-card |

## Decisões e desvios do storyboard
1. **Hook**: tagline auxiliar `size: 22` adicionada como sub-line embaixo do giant-statement (a tela ficaria grande demais com só "19% slower." sem contexto).
2. **Bullets**: `result.accent: true` no icon-label pra destacar "Working agent" como protagonista visual da equação.
3. **Stat comparison-bars ratios**: baseline 1× / target 3.43× (242.7% increase = 3.427× o baseline). Arredondado pra 3.43 pra glyph rendering melhor.
4. **CTA headline em 1 linha** (sem URL no card — regra fixa global #1).
5. **Audio off direto no spec** (mesmo padrão de karime-kumagai-revops-en).

## Ícones usados (validados em iconMap.ts)
| Ícone | Cena | OK? |
|---|---|---|
| `check` | Bullets (result da equação) | ✓ |

## Personal mode behavior
- BrandFrame mounted (mode='personal' + speaker definido) → Rodrigo speaker badge top-left visível 30s
- logo-mark Intro → auto-suppressed via useCurrentAccountMode()
- closing-card CTA → logo Luby auto-suppressed
- Sem chrome Luby (lang badge top-right, footer) — auto-removidos

## Gates auto-aprovados (Cleidim)
```yaml
gate_decisions:
  gate1: not-triggered
  gate1_reason: "Zero archetype novo. Todos os blocks (logo-mark, eyebrow, tagline, accent-line, giant-statement, multiplication-equation, big-stat com comparison-bars, closing-card) já existem na Wave 5."
  gate2: auto-approved-skip-stills
  gate2_reason: "Cleidim auto-aprovou pular smoke-still PNG. Todos os blocks são bem-conhecidos e o spec foi revisado pelo Revisor (passo 05) — risco de descobrir problema visual só no MP4 baixo."
```

## Render command
```bash
cd squads/ghostwriter-linkedin-auto/luby-video-machine
npx remotion render rodrigo-gardin-substrate-en \
  agents/runs/2026-05-13-rodrigo-gardin-en-us/out/video-personal.mp4
```

## Upload destino
```
linkedin-ghostwriter-videos/083b8487-8e7b-49de-88aa-e58e79fe98af/2026-05-13-claude-code-applied-to-systems-architecture-en-us.mp4
```
