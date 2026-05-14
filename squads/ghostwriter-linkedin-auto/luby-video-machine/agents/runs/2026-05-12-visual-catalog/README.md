# Visual Catalog — 21 composições da Luby Video Machine

Vídeo interno de validação visual. Não é peça de marketing. Cada
cena (numerada 01 a 21) demonstra um archetype ou block do catálogo
da máquina, em isolamento, com eyebrow `## / 21 · <NOME>` no topo.

Três variantes renderizadas — mesmas 21 cenas em modes/themes
diferentes pra você comparar lado a lado:

| Arquivo | Mode visual | Theme | Tamanho | Duração |
|---------|-------------|-------|---------|---------|
| `out/catalog-premium-dark.mp4` | luby-premium | dark | 38.6 MB | 111s |
| `out/catalog-minimal-dark.mp4` | luby-minimal | dark | 14.5 MB | 111s |
| `out/catalog-premium-light.mp4` | luby-premium | light (body scenes) | 32.9 MB | 111s |

A variante light tem o intro/CTA em dark (Logo + chrome desenhados
pra dark) e as 21 cenas do miolo em light theme — primeiro teste real
de como os componentes seguram no off-white.

---

## Mapa de cenas (01–21)

Use estes números pra dar feedback preciso ("ajustar o 14", "o 9 ficou
melhor que o 11", etc).

| N | Composição | Frame inicial | Frame final | Onde aparece em vídeo real |
|---|---|---|---|---|
| — | INTRO (premium) | 0 | 90 | — |
| 01 | chrome combo (eyebrow `pill` + tagline + accent-line) | 90 | 240 | usado em Intros de vídeos reais |
| 02 | closing-card | 240 | 390 | CTAs |
| 03 | sentence-with-syncs | 390 | 540 | luby-demo Hook |
| 04 | concept-row (3 cards, sem highlight) | 540 | 690 | how-we-apply Bullets-1 |
| 05 | concept-row (com highlight) | 690 | 840 | time-220 Hook, pergunta-errada Hook |
| 06 | pipeline (start → 4 stages → end) | 840 | 990 | how-we-apply Bullets HERO |
| 07 | multiplication-equation | 990 | 1140 | time-220 Bullets HERO |
| 08 | big-stat (typographic) | 1140 | 1290 | luby-demo Stat |
| 09 | big-stat (donut) | 1290 | 1440 | cliente-ve-time-entrega Stat |
| 10 | big-stat (comparison-bars) | 1440 | 1590 | time-220 Stat |
| 11 | metric-grid (2 KPIs) | 1590 | 1740 | pergunta-errada Stat, how-we-apply Stat |
| 12 | feature-grid (4 features 2×2) | 1740 | 1890 | pergunta-errada Bullets-2 |
| 13 | quote | 1890 | 2040 | (ainda não usado em vídeo real) |
| 14 | logo-row (4 logos — Luby ×4 como placeholder) | 2040 | 2190 | (placeholder; assets Fortune 500 pendentes) |
| 15 | timeline (5 marcos horizontais) | 2190 | 2340 | (ainda não usado em vídeo real) |
| 16 | split-screen-comparison | 2340 | 2490 | how-we-apply Hook, cliente-ve... metaphor proximal |
| 17 | vertical-stack (5 itens) | 2490 | 2640 | (ainda não usado em vídeo real) |
| 18 | central-spotlight-with-satellites | 2640 | 2790 | smoke-test apenas |
| 19 | giant-statement | 2790 | 2940 | smoke-test apenas |
| 20 | quadrante-2x2 (matriz com eixos) | 2940 | 3090 | smoke-test apenas |
| 21 | iceberg-revelation (superfície vs profundidade) | 3090 | 3240 | cliente-ve-time-entrega Hook+Bullets |
| — | CTA (premium) | 3240 | 3330 | — |

**Total de frames**: 3330 (111s @ 30fps).

---

## Notas técnicas

1. **`logo-row` (#14) usa 4 cópias da logo da Luby** como placeholder.
   Quando assets de clientes Fortune 500 (LexisNexis, Bridgestone,
   Siemens, Sunwest) chegarem em `public/logos/clients/`, basta
   atualizar a spec.

2. **Variante light**: a única alteração entre `premium-dark` e
   `premium-light` é o `themeSchedule` ativando theme `light` nos
   frames 90 a 3240 (todas as 21 cenas do miolo). Intro e CTA ficam
   em dark.

3. **Numeração via `eyebrow` block** com style `mono` em todas as
   cenas do miolo. Texto: `NN / 21 · NOME-COMPOSIÇÃO`. Não usa
   numbering primitive nova — é só o block existente com texto
   formatado.

4. **Sem narração, sem BGM, sem transições**. Catálogo é silencioso
   por design — foco visual puro. Sem `TransitionFlash` entre cenas
   (cuts diretos).

5. **3330 frames > 900 frames do padrão Luby**. O Root.tsx registra
   essas 3 compositions com `durationInFrames=VISUAL_CATALOG_TOTAL_FRAMES`
   (exportado pelo spec) em vez de `VIDEO.durationFrames`.

---

## Como ver

Abra os 3 MP4 lado a lado em janelas separadas (ou em players com
playback sync) e pause no mesmo frame pra comparar. Cenas duram 5s
cada — tempo suficiente pra ler/absorver e julgar se a composição
funciona naquele mode/theme específico.

Quando quiser dar feedback: cite o número da cena, o mode, e o que
ajustar. Exemplo: "no 14 minimal-dark, os logos ficaram apagados
demais; no 18 premium-light, o conector do spotlight some no fundo
branco."

---

## Arquivos novos criados nesta run

- `src/schema/examples/visual-catalog.ts` — spec gerador das 3 variantes
- `src/compositions/VisualCatalog.tsx` — 3 composition shells
- `src/Root.tsx` — registro de 3 Compositions com duração custom

Não foi tocado código de archetypes/blocks — só consumo do que existe.
