# Implementation Notes — Software que parece pronto mas não está

## Arquivos alterados
- `src/Root.tsx` — registradas 3 novas Compositions
  (`software-que-parece-pronto-pt`, `-en`, `-personal`)
- `src/schema/types.ts` — adicionado `OnionPeelRevelationBlock` à
  union `Block` + interface
- `src/schema/validate.ts` — `onion-peel-revelation` em
  `VALID_BLOCK_KINDS` + per-kind required check
  (visible object + layers array)
- `src/renderer/PremiumScene.tsx` — import + dispatch case
- `src/renderer/MinimalScene.tsx` — import + dispatch case
  (mode-aware via ModeContext)

## Arquivos criados
- `src/renderer/archetypes/OnionPeelRevelation.tsx` — archetype novo
  Wave 5. Visible item proudo no topo + N camadas empilhadas com
  tom progressivamente mais escuro (sugere "mais profundo"). Mask
  reveal lateral (peeling) por camada. Theme + mode aware.
- `src/schema/examples/software-que-parece-pronto.ts` — exporta
  `softwareQuePareceProntoPtSpec` + `softwareQuePareceProntoEnSpec`.
  Spec único parametrizado por idioma via factory `buildSpec(lang, copy)`.
- `src/compositions/SoftwareQuePareceProntoPt.tsx`
- `src/compositions/SoftwareQuePareceProntoEn.tsx`
- `src/compositions/SoftwareQuePareceProntoPersonal.tsx` (usa
  ptSpec, lang=pt, mode=personal — sem speaker)

## Primitivas reaproveitadas
- `VideoRenderer`, `BackgroundAtmosphere`, `LightOverlay`,
  `MinimalOverlay` (camadas)
- `LogoMarkBlock`, `EyebrowBlock`, `TaglineBlock`, `AccentLineBlock`
  (Intro)
- `SplitScreenComparison` archetype (Wave 4 — Hook full-bleed
  primeira aparição em vídeo real desde o smoke-test)
- `OnionPeelRevelation` archetype (NOVO Wave 5 — Bullets HERO)
- `BigStatBlock` style typographic (Stat — primeira aparição em
  vídeo real desde luby-demo legacy)
- `ClosingCardBlock` (CTA — logo Luby auto-suprimida em personal)
- `Icon`, `MaskReveal` (dentro do OnionPeelRevelation)

## Primitivas criadas
- **`OnionPeelRevelation`** — primeiro archetype da Wave 5. Decisão
  no gate archetype-new (auto-aprovado por instrução do briefing
  "no checkpoints"). Justificativa: metáfora `camadas-de-cebola`
  é o caminho exato pra tese "você viu 1, tem N abaixo"; iceberg
  estava proibido por memória entre runs (cliente-ve-time-entrega
  já usou).

## Render — 3 variantes (regra Wave 5)

| Variante | MP4 | Composition ID | Tamanho |
|----------|-----|----------------|---------|
| PT-corporate | `out/video-pt.mp4` | `software-que-parece-pronto-pt` | 6.1 MB |
| EN-corporate | `out/video-en.mp4` | `software-que-parece-pronto-en` | 6.2 MB |
| Personal (PT, sem branding) | `out/video-personal.mp4` | `software-que-parece-pronto-personal` | 6.1 MB |

- **Duração real**: 30.00s (todas as variantes — 900 frames @ 30fps)
- **Speaker (personal)**: NENHUM — diretiva 2026-05-12 do Cleidson:
  personal mode é só "vídeo sem branding Luby", não inclui speaker
  badge.

### Translation notes (EN)

Decisões idiomáticas tomadas na tradução PT→EN:

- **"Pronto" / "Done"**: paralelismo perfeito. Ambos os idiomas
  aceitam aspas em torno do termo questionado. Não usei
  "production-ready" (mais técnico, menos universal).
- **"Parece pronto" → "Looks done"**: literal funciona. Mantive
  verbo simples.
- **"Está pronto" → "Actually done"**: o "está" do PT carrega ênfase
  (vs "parece"). Em EN o "actually" entrega esse contraste sem ficar
  pesado.
- **"O que sustenta o software" → "What sustains the software"**:
  literal funciona. "Sustains" é pouco usual em B2B mas não
  parece traduzido — é mais semântico que "supports" ou "powers".
- **"DEPOIS da feature funcionar" → "AFTER the feature works"**:
  caps mantidas em ambas (são o pivô semântico).
- **"se quebrar" → "when things break"**: PT usa subjuntivo ("se"),
  EN usa "when" (mais direto, sugere inevitabilidade — fit pro
  tom).
- **"Estimativa intuitiva, não auditada" → "Intuitive estimate, not
  audited"**: literal. Mantém a honestidade do disclaimer.
- **CTA "definimos" → "we define"**: literal.

Não usei Google Translate em nenhum momento.

## Smoke-stills aprovados (Passo 4)

| Frame | Cena | Path |
|-------|------|------|
| 480 | bullets HERO (onion-peel) | `out/preview/HERO-bullets-onion.png` |
| 165 | hook (split full-bleed) | `out/preview/HOOK-split.png` |
| 700 | stat (typographic + light theme) | `out/preview/STAT-light.png` |
| 40 | personal intro (sem logo) | `out/preview/PERSONAL-intro.png` |
| 860 | personal cta (sem logo) | `out/preview/PERSONAL-cta.png` |

Smoke-still gate disparou + auto-aprovado conforme briefing
"no checkpoints, no pauses". Validação interna OK em todos os 5
frames. Personal-intro e personal-cta confirmaram que o
LogoMarkBlock e ClosingCardBlock (logo Luby) suprimem em personal
mode como esperado.

## Decisões em gates

- **Archetype-new gate**: DISPAROU. Decisão = (a) implementar
  archetype novo `onion-peel-revelation`. Auto-aprovado pelo
  briefing. Em modo normal seria pausa para humano confirmar
  interface + custo (~75 min implementação).
- **Smoke-still gate**: DISPAROU + auto-aprovado idem. Validação
  interna foi suficiente porque o HERO renderizou de primeira sem
  ajuste.

## Decisões técnicas

1. **Spec bilingue via factory** — `buildSpec(lang, copy)` retorna
   `VideoSpec` parametrizado. PT e EN compartilham 100% da estrutura
   (timing, blocks, archetypes), só os textos mudam. Compositions
   PT e Personal consomem `ptSpec`; Composition EN consome `enSpec`.

2. **Personal sem speaker** (diretiva 2026-05-12). O componente
   `BrandFrame` já tem `if (!speaker) return null;` no SpeakerBadge
   — basta não passar `speaker` no `defaultProps` do Composition
   Personal e o badge não renderiza. Ficou: lang badge top-right
   + conteúdo do vídeo + nada de Luby nem speaker.

3. **Light theme schedule no Stat** — `themeSchedule: [{ theme:
   'light', from: 610, to: 775 }]`. Primeiro vídeo real desde o
   luby-demo legacy a usar isto. LightOverlay já existe e adapta
   transition via THEME_FADE_FRAMES.

4. **`transitions: []`** — premium uniforme, sem flash entre cenas.
   O cross-fade do theme cuida da transição visual da Stat.

5. **`autoResolveIcons: false`** (default) — todos os ícones
   explicitados.

6. **Wave 5 archetype `onion-peel-revelation`**: distinto do
   `iceberg-revelation` (Wave 4) pelo argumento — iceberg argumenta
   PROPORÇÃO (pequeno acima / grande abaixo); onion-peel argumenta
   COUNT (você viu 1, são N). Mesma família visual (visible vs
   hidden) mas vocabulário diferente. Documentado no JSDoc do
   componente e na interface do schema.

## Desvios do storyboard

| Pedido | O que foi feito | Por quê |
|--------|-----------------|---------|
| (nenhum) | (nenhum) | Spec mapeia 1:1 com storyboard. |

## Notas para o Revisor

- **Frame 480 (Bullets HERO)** — primeiro uso real do
  `onion-peel-revelation`. Verificar se a tese "1 visible + 7 hidden"
  chega visualmente como argumento de COUNT (não de proporção
  física como iceberg).
- **Frame 165 (Hook split-screen)** — primeira aparição do
  split-screen full-bleed em vídeo real (estreia em smoke-test
  apenas). Validar que o `≠` central + lados tinted (dark esquerdo,
  light direito) entregam o contraste categorial.
- **Frame 700 (Stat light theme)** — primeira run real desde
  luby-demo a usar `themeSchedule`. Validar que o cross-fade do
  LightOverlay funciona: dark (Bullets) → light (Stat) → dark (CTA).
- **Personal mode** — confirmado que LogoMarkBlock retorna null
  e ClosingCardBlock suprime Logo wordmark. Sem speaker badge
  (não passei `speaker` no defaultProps). Resultado: zero Luby
  branding, vídeo limpo pronto pra colaborador postar.
- **EN translation** — tradução cuidadosa, manual, com decisões
  documentadas acima. Vale humano nativo validar antes da
  publicação real.
- **URL `luby.co/definition-of-done`** — placeholder. Confirmar
  com marketing.

## Perguntas em aberto

1. **Spec bilingue** — manteve duas exportações (`ptSpec`/`enSpec`)
   geradas pela factory. É padrão limpo pra próximos vídeos sob
   regra de 3 variantes? Considerar promover esse padrão pra um
   helper compartilhado em `src/schema/buildBilingualSpec.ts`
   futuro.
2. **Speaker badge em personal** — agora suprimido por padrão
   (não passamos `speaker`). Se algum vídeo futuro QUISER speaker
   em personal, basta passar `speaker` no defaultProps do
   Composition Personal. Documentado na persona 04.
3. **Onion-peel layers cap** — interface aceita até 7 layers.
   Vídeos futuros com 8+ camadas precisariam variant ou cap.
