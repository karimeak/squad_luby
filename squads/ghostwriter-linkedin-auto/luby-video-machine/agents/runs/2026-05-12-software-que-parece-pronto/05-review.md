# Review — Software que parece pronto mas não está

## Decisão final
**APROVADO**

**Retry count**: 0

Vídeo entrega tese de posicionamento com tom calibrado: cumplicidade
técnica, não superioridade. Wave 5 estreia com 4 firsts em uma run só:
archetype novo `onion-peel-revelation`, split-screen full-bleed em
real, big-stat typographic em real, light theme schedule em real
(desde luby-demo legacy). E é o primeiro vídeo sob a regra das 3
variantes (PT/EN/Personal). Tudo entregou — zero ressalvas
bloqueantes, 2 minor pra v2.

---

## Bloco A — Técnico

| Item | Status |
|------|--------|
| Resolução 1920×1080 | ✅ todas as 3 variantes |
| Duração 30s (900 frames @ 30fps) | ✅ todas |
| FPS 30 | ✅ |
| Áudio sincronizado | N/A (narração off) |
| Texto legível (≥32px) | ✅ |
| Paleta on-brand | ✅ apenas tokens |
| Tipografia correta | ✅ Aspekta + Inter fallback |
| Logo presente | ✅ Intro + CTA das variantes corporate; SUPRIMIDO em personal (correto) |
| Sem glitches | ✅ |
| Render limpo | ✅ 6.1-6.2 MB cada |

**Veredicto Bloco A**: PASSOU

---

## Bloco B — Densidade visual

| Cena | Elementos visuais | Veredicto |
|------|-------------------|-----------|
| Intro | logo (corp) + eyebrow + tagline + accent-line | ✅ |
| Hook | split-screen full-bleed: 2 sides + ícones + badge ≠ central | ✅ |
| Bullets | onion-peel: 1 visible + 7 layers, cada uma com ícone | ✅ HERO |
| Stat | big-stat typographic em light theme: 70% + caption + source | ✅ |
| CTA | closing-card: eyebrow + headline + logo + URL | ✅ |

**Veredicto Bloco B**: PASSOU. Bullets é particularmente forte —
8 entidades empilhadas em ordem semântica clara, com tom
progressivamente mais escuro reforçando "mais profundo".

---

## Bloco C — Sincronização

Storyboard usa sync via archetype embedded (não sentence-with-syncs).
Cada item carrega seu próprio ícone semântico.

| Conceito | Cena | Ícone | Semântica |
|----------|------|-------|-----------|
| Parece pronto | Hook left | `eye` | ✅ "o que se vê" |
| Está pronto | Hook right (highlight) | `shield-check` | ✅ "o que sustenta" |
| A feature funciona | Bullets visible | `eye` | ✅ callback do Hook |
| Tratamento de erro | Bullets layer 1 | `shield-alert` | ✅ |
| Performance | Bullets layer 2 | `gauge` | ✅ |
| Segurança | Bullets layer 3 | `shield-check` | ✅ callback do Hook |
| Observabilidade | Bullets layer 4 | `activity` | ✅ |
| Testes de borda | Bullets layer 5 | `check` | ✅ |
| Migração | Bullets layer 6 | `repeat` | ✅ |
| Rollback | Bullets layer 7 | `circle-dashed` | ⚠️ semântica fraca |

**Veredicto Bloco C**: PASSOU. Reuso intencional do `eye` (Hook
left → Bullets visible) e `shield-check` (Hook right → Bullets
layer 3) cria ressonância visual. Issue minor #1 abaixo (`circle-
dashed` pra rollback).

---

## Bloco D — Retenção

- **Primeiros 3s**: **strong** — "A definição de pronto mente." é
  declarativa e desconfortável. CTO sênior reconhece a tese
  imediatamente. Tom calibrado entre cumplíce e provocador.
- **Variação de ritmo**: **strong** — Intro estática → Hook split
  (2 cards entrando) → Bullets denso (8 elementos em stagger top→
  bottom) → Stat focado em light theme (respiro analítico) → CTA
  sereno. A passagem dark→light no Stat é o respiro narrativo.
- **Highlight memorável**:
  - **Existe**: sim
  - **Frame**: 480 (Bullets — onion-peel completo)
  - **Descrição**: 1 item visível ("A feature funciona") com tag
    "VISÍVEL" em destaque, + 7 camadas abaixo cada uma com ícone
    semântico, em tom progressivamente mais escuro. Esse é o
    frame "ah, é tudo isso que não aparece". Screenshot
    compartilhável.
- **Clareza do CTA**: **strong-medium** — "Veja como definimos
  'pronto'." faz callback direto à tagline da Intro. URL legível.
  Sem urgência (correto pra vídeo de posicionamento).
- **Presença da marca**: **balanced** — logo em Intro + CTA das
  variantes corporate, paleta consistente. Em personal: zero
  branding, conforme regra Wave 5.

---

## Pontos fortes

1. **Wave 5 archetype `onion-peel-revelation` materializa a tese**.
   A diferença entre 1 visible (bright tag "VISÍVEL") + 7 layers
   (cada uma mais escura) entrega o argumento de COUNT de forma
   que iceberg não daria — iceberg argumenta proporção, esse
   archetype argumenta quantidade. Distinção sutil mas decisiva.

2. **Memória entre runs respeitada com disciplina**. O Diretor
   considerou 2-3 alternativas por cena e descartou explicitamente
   iceberg (usado em cliente-ve), concept-row highlight (usado em
   3 das 4 runs), e donut/comparison-bars/metric-grid no Stat
   (cada um já queimado). Resultado: 4 firsts em uma run só.

3. **Light theme schedule no Stat funciona narrativamente**. O
   "respiro analítico" entre Bullets denso e CTA sereno acontece
   visualmente — o cross-fade do LightOverlay entrega a transição
   sem corte. Primeiro uso real desde luby-demo legacy.

4. **Tradução EN cuidada**. As decisões idiomáticas estão
   documentadas no implementation-notes ("Looks done" /
   "Actually done", "When things break", caps mantidas em DEPOIS/
   AFTER). Não cheira a Google Translate.

5. **Personal mode entrega o que prometeu**. LogoMarkBlock retorna
   null no Intro, ClosingCardBlock suprime Logo no CTA, BrandFrame
   sem "made @ Luby". Sem speaker badge porque diretiva diz "só
   sem logo, sem speaker". Visualmente: vídeo limpo, pronto pra
   colaborador postar.

6. **Validação visual antes do render full** funcionou. O HERO
   onion-peel-revelation (archetype novo, alto risco de bug
   visual) renderizou de primeira em PT, sem precisar ajustar.
   Smoke-still gate cumpriu seu papel.

---

## Pontos a corrigir

### Issue #1 — Ícone `circle-dashed` pra Rollback é semanticamente fraco
- **Cena**: bullets layer 7
- **Severidade**: minor
- **Problema**: `circle-dashed` é genericamente "pendente / em
  processo". Para "Rollback" um ícone como `repeat` (já usado em
  layer 6 para Migração) ou `arrow-counterclockwise` seria mais
  semântico. Mas `repeat` já está em uso e arrow não está no
  iconMap. Aceito como está.
- **Correção sugerida** (v2): adicionar `arrow-counterclockwise` ao
  iconMap (do Lucide `ArrowCounterclockwise` se existir, ou
  `RotateCcw`).
- **Não bloqueia**.

### Issue #2 — Bullets onion-peel layer 1 mal alinhado com o "Visível" no eixo X
- **Cena**: bullets (frame 480)
- **Severidade**: minor (visual)
- **Observação**: Olhando o still, o bloco "Visível" tem um padding
  X maior (28px) que as layers (28px também — confere). Mas o
  `tag VISÍVEL` à direita do row do visible item desloca
  visualmente o ícone esquerdo um pouco. Não é desalinhamento
  real, é percepção. Aceito.
- **Não bloqueia**.

### Issue #3 — URL `luby.co/definition-of-done` ainda placeholder
- **Cena**: cta
- **Severidade**: minor (operacional)
- **Correção**: confirmar com marketing antes de publicar. URL
  alternativas no roteiro: `luby.co/production-ready`,
  `luby.co/engineering-rigor`.

---

## Risco para publicação

- **Risco baixo**. Vídeos publicáveis. Tom calibrado, tese clara,
  visual diferenciado das runs anteriores.
- **Risco médio EN**: traduções idiomáticas merecem revisão de
  nativo antes da publicação real (mesmo cuidando, "actually done"
  pode soar coloquial pra alguns ouvidos US — alternativas:
  "truly done", "really done"; "actually" foi escolha minha pelo
  contraste tonal).
- **Risco operacional**: confirmar URL.

---

## Próxima ação

- **Tipo**: publish (após confirmar URL + revisar EN com nativo se
  possível)
- **Responsável**: marketing / squad
- **Instruções**:
  1. Confirmar `luby.co/definition-of-done`.
  2. Idealmente, revisar EN com nativo americano (15 min de leitura
     suficiente — mas não bloqueante).
  3. Publicar `out/video-pt.mp4` (LinkedIn Luby Brasil),
     `out/video-en.mp4` (LinkedIn Luby global). Personal fica
     disponível pra qualquer colaborador postar (`out/video-personal.mp4`).
  4. Tracking: brand-recall + engagement qualificado. Target:
     save/share ratio > 3%, 15+ comentários "exatamente isso" /
     "passei por isso" em 45 dias.

---

**Resumo executivo**: APROVADO. Wave 5 pronta pra plugar no squad
do ponto de vista de máquina. As 3 variantes funcionam. O archetype
novo `onion-peel-revelation` materializou a tese sem fricção. Tom
e variação visual em ordem. Uma pendência operacional (URL) e uma
sugestão de polimento (review EN com nativo) — nenhuma bloqueia
publicação.
