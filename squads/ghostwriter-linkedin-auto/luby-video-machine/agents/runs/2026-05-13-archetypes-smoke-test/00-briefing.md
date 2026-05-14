# Briefing — Smoke-test: archetype library

## Metadata
- **Source**: text
- **Language**: pt
- **Mode**: corporate
- **Type**: TECHNICAL TEST (não conteúdo de marketing)

## Content
Vídeo de validação técnica da Wave 3 (archetype library). Objetivo:
renderizar 4 arquétipos novos em 4 cenas de miolo, com Intro e CTA
premium padrão. Cada cena exercita um arquétipo diferente para
verificar que todos renderizam visualmente sem quebrar e sem
sobreposições.

Arquétipos exercitados (ordem narrativa de teste):
- Intro: `logo-with-bloom` (existente)
- Hook: `giant-statement` (NOVO)
- Bullets-1: `split-screen-comparison` (NOVO)
- Bullets-2: `central-spotlight-with-satellites` (NOVO)
- Stat: `quadrante-2x2` (NOVO)
- (sem cena dedicada para `vertical-stack` — exercitado em vídeo
  futuro pra não inflar este teste)
- CTA: `logo-with-bloom` (closing-card variant, existente)

## References
- Catálogo formal em `agents/archetypes.md`
- Implementação dos novos em `src/renderer/archetypes/`

## Constraints
- Conteúdo de teste, NÃO de marketing
- Cada cena 4-5s pra dar tempo de cada arquétipo respirar
- Premium uniforme (sem flash interno) — mesma decisão dos vídeos reais
- Sem narração (mute-first design pad rão)

## Notes
Audiência interna (Cleidson + dev). Aprova/reprova baseado em "isso
renderizou direito?", não retenção.
