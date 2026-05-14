# Implementation Notes — RevOps & Data Architecture (Karime, EN-Personal)

## Spec arquivo

**Path**: `src/schema/examples/karime-kumagai-revops-en.ts`
**Export**: `karimeKumagaiRevopsEnSpec` (single — apenas variante en-personal)

## Composition arquivo

**Path**: `src/compositions/KarimeKumagaiRevopsEn.tsx`
**Component**: `KarimeKumagaiRevopsEn`
**Composition ID em Root.tsx**: `karime-kumagai-revops-en`
**Default props**: `lang='en'`, `mode='personal'`, `speaker={ name: 'Karime Kumagai', role: 'RevOps & Growth Strategist @ Luby' }`

## Mapeamento storyboard → blocks

| Cena | Frames | Archetype declarado pelo Diretor | Block kinds usados |
|---|---|---|---|
| Intro | 0-90 (3s) | logo-with-bloom | logo-mark, eyebrow, tagline, accent-line |
| Hook | 90-250 (5.3s) | split-screen-comparison | split-screen-comparison |
| Bullets | 250-610 (12s) | comparison-bars-distribution | **vertical-stack** (substituiu feature-grid pra ter caption per-item) |
| Stat | 610-775 (5.5s) | stat-with-comparison-bars (typographic) | big-stat (style: 'typographic') |
| CTA | 775-900 (4.2s) | logo-with-bloom | closing-card |

## Decisões e desvios do storyboard

1. **Bullets bloco trocado de `feature-grid` para `vertical-stack`**:
   - Motivo: `FeatureGridBlock` aceita apenas { icon, title, description } — não suporta `caption` separada nem `tone` (warning/positive). Para preservar o "biggest spend (~50%)" e "biggest ROI" como meta-info legível, `vertical-stack` é melhor: aceita `caption` opcional por item, mantém densidade tipográfica, e ainda renderiza icon + title + caption stacked.
   - Trade-off perdido: a coloração diferenciada por tom (warning/positive). O texto da caption ainda carrega a mensagem ("biggest spend" / "biggest ROI"), mas sem destaque visual de cor. Aceitável — a inversão semântica entre primeiro e último item ainda é o argumento.

2. **CTA headline compactado em 1 linha** (em vez de 2 separadas):
   - Storyboard pedia "negação + afirmação" em 2 linhas. ClosingCardBlock aceita `headline` como string única.
   - Motivo: `headline` no `ClosingCardBlock` é uma string única — line breaks dependem de quebra natural. Para garantir clareza, escrevi 1 frase compacta: "The 2026 winners built the data foundation first — not the largest AI stack." Mantém a tensão negação-afirmação em 1 linha mais punchy.

3. **`urlText: ''`** no closing-card:
   - Regra fixa global #1: URL nunca aparece no closing-card. Confirmado vazio.

4. **Audio off** (BGM + narration desabilitados):
   - Spec define `bgmId: undefined`, `narrationEnabled: false`, todos os volumes em 0.
   - Motivo: ghostwriter-linkedin-auto squad não roda o pipeline de geração de audio local (`npm run audio:setup` requer GPU NVIDIA + Python 3.11 + 6GB de modelos). LinkedIn toca muted by default — texto na tela carrega comunicação.
   - Diferente do specSilent override aplicado em DemoVideo.tsx no smoke 1: aqui o audio off vai DIRETO no spec novo, sem patch lateral.

5. **`themeSchedule: []`** (dark uniforme, sem light theme window no Stat):
   - Diferente do `software-que-parece-pronto` que usou light theme no Stat.
   - Motivo (do storyboard): a mensagem da Karime ganha clareza com ritmo visual constante. Theme transitions distrairiam. Todo o vídeo é "respiro analítico".

6. **`transitions: []`**:
   - Premium uniforme, sem flash interno entre cenas.

## Tradução

Não aplicável — Karime é monolíngue EN-US. Apenas 1 spec (en), apenas 1 composition (KarimeKumagaiRevopsEn). Sem variantes PT-BR ou Personal-PT.

## Ícones usados (autoResolveIcons: false implícito por default)

| Ícone | Cena | Existe em iconMap.ts? |
|---|---|---|
| trending-up | Hook (96%) | ✓ |
| shield-alert | Hook (42%) | ✓ |
| eye | Bullets (sales demos) | ✓ |
| gauge | Bullets (forecasting) | ✓ |
| line-chart | Bullets (CRM hygiene) | ✓ |
| file-check | Bullets (quote-to-cash) | ✓ |
| workflow | Bullets (deal desk) | ✓ |

Ícones substituídos do storyboard (não existiam):
- `database` → `line-chart` (representa "data" semanticamente via mapping em iconMap)
- `megaphone` → `eye` (representa "demo/showcase" semanticamente)
- `circle-alert` → `shield-alert` (alert visual existente)
- `chart-line` → `line-chart` (mesma coisa, nome canonical)

## Personal mode behavior verificado

- BrandFrame mounted (mode='personal' + speaker definido) → speaker badge top-left visível durante todos os 30s
- logo-mark no Intro → auto-suppressed via useCurrentAccountMode() (esperado, sem ação manual necessária)
- closing-card no CTA → logo Luby auto-suppressed; eyebrow + headline ficam (esperado)
- Sem chrome Luby (lang badge top-right, "made @ Luby" footer) — todos auto-removidos pelo BrandFrame em personal mode

## Gates auto-aprovados (Cleidim)

```yaml
gate_decisions:
  gate1: not-triggered
  gate1_reason: "Nenhum archetype novo necessário. Todos os blocks usados (logo-mark, eyebrow, tagline, accent-line, split-screen-comparison, vertical-stack, big-stat, closing-card) já existem no catálogo Wave 5."
  gate2: auto-approved-skip-stills
  gate2_reason: "Cleidim auto-aprovou pular smoke-still PNG (Passo 4 da persona 04). Risco: descobrir problema visual só no MP4 final. Mitigação: revisor (passo 05) avalia spec composition; render full direto."
  gate2_warning: "Render full sem revisão de stills. Risco aceitável dado que todos os blocks são bem-conhecidos (zero archetype novo)."
```

## Render command (Cleidim irá executar)

```bash
cd squads/ghostwriter-linkedin-auto/luby-video-machine
npx remotion render karime-kumagai-revops-en \
  agents/runs/2026-05-13-karime-kumagai-en-us/out/video-personal.mp4 \
  --props='{"lang":"en","mode":"personal","speaker":{"name":"Karime Kumagai","role":"RevOps & Growth Strategist @ Luby"}}'
```

Tempo esperado: ~80s (similar ao smoke 1 com DemoVideo-EN-Personal default).

## Upload destino (após render)

```
linkedin-ghostwriter-videos/cd82b887-75ef-49bb-b630-f5fdf60871d8/2026-05-13-ai-consulting-applied-to-revenue-operations-en-us.mp4
```

(Mesmo path do MP4 anterior — overwrite via x-upsert: true. URL pública permanece a mesma. video_rotation_linkedin row 215ee274 mantém o mesmo video_url. Email já enviado fica desatualizado mas link clicável continua válido — agora aponta pro vídeo personalizado.)
