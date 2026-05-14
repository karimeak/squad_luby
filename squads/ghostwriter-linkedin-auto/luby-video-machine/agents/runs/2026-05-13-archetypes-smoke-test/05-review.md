# Review — Smoke-test archetype library

## Decisão final
**APROVADO COM RESSALVAS** (smoke-test técnico passou; ajustes de
polimento mapeados como follow-up).

---

## Bloco A — Técnico

| Item | Status |
|------|--------|
| Resolução 1920×1080 | ✅ |
| Duração 30s (900 frames @ 30fps) | ✅ |
| FPS 30 | ✅ |
| Áudio | N/A (narração off por design) |
| Texto legível | ✅ headings 48-56px, axis labels 14px (limite mas legível) |
| Paleta on-brand | ✅ apenas tokens |
| Tipografia correta | ✅ Aspekta + Inter fallback |
| Logo presente | ✅ Intro + CTA |
| Sem glitches | ✅ todos os 4 archetypes novos renderizam sem sobreposição/explosão |
| Render limpo | ✅ 6.5 MB, sem artefatos |

**Veredicto Bloco A**: PASSOU

---

## Validação por arquétipo

### `giant-statement` — Hook, frame 165
- ✅ Reveal `mask-up` funcionando.
- ✅ Tipografia 240px, glow sutil, alinhamento centralizado.
- ✅ Sem overflow do canvas.

### `split-screen-comparison` — Bullets-1, frame 330
- ✅ Cards ConceptCard nos dois lados.
- ✅ Símbolo `vs` central oversized com glow.
- ✅ `highlightSide: 'right'` funcionando: lado direito em `feature`
  size + accent bright; esquerdo em `standard` + accent deep.
- ✅ Heading "Antes da Wave 3 vs agora" acima.

### `central-spotlight-with-satellites` — Bullets-2, frame 520
- ✅ Centro Brain bloom + título "AI-augmented engineering" +
  caption "núcleo do modelo".
- ✅ 4 satélites em layout cruz (12h/3h/6h/9h) — Governança no
  topo, Compliance à direita, Velocidade embaixo, Contexto à
  esquerda.
- ✅ Conectores SVG visíveis com glow azul.
- ✅ Heading no topo do container.

### `quadrante-2x2` — Stat, frame 720
- ✅ 4 quadrantes posicionados corretamente (TL/TR/BL/BR).
- ✅ Eixos (linhas SVG cinza claro) formando + central.
- ✅ Axis labels mono uppercase nos extremos.
- ✅ Quadrante top-right "Modelo Luby" com accent bright (highlight).
- ✅ Highlight halo atrás do card highlighted.

---

## Issues encontrados e correções

### Issue #1 — Ícones nos quadrantes parecem grandes relativos ao card compact
- **Cena**: Stat (frame 720)
- **Severidade**: minor
- **Observação**: Os ícones dentro dos `ConceptCard size='compact'`
  no quadrante-2x2 ficam visualmente proeminentes — quase do
  tamanho do título. Não é bug; é a proporção atual do `compact`
  size do ConceptCard (icon 56px, title 24px). Em layouts mais
  apertados como o quadrante (cards de ~480px de largura) a
  proporção fica tight.
- **Correção sugerida** (follow-up, não bloqueia): adicionar uma
  variant `quadrant-cell` no ConceptCard com icon 40px ou tornar o
  Quadrante2x2 archetype não-dependente do ConceptCard — fazer
  layout próprio ali. Decidi não fazer agora pra manter
  consistência visual com outros archetypes que usam ConceptCard.

### Issue #2 — Axis labels do quadrante-2x2 caem no canto exato do canvas
- **Cena**: Stat (frame 720)
- **Severidade**: minor
- **Observação**: As 4 axis labels (alta/baixa especialização +
  lento/rápido) ficam coladas nas bordas do container 1100×720.
  Em telas pequenas (preview no Studio) lê apertado. No render
  final 1920×1080 está dentro do safe area.
- **Correção sugerida** (follow-up): adicionar padding extra no
  container do Quadrante2x2 ou empurrar as labels mais para
  fora/dentro. Aceitável como está para smoke-test.

### Issue #3 — URL no closing-card não aparece muito visível
- **Cena**: CTA (frame 860)
- **Severidade**: minor
- **Observação**: Headline "Cinco arquétipos novos." + logo Luby
  bem visíveis, mas `urlText: 'luby.co/archetypes'` aparece bem
  pequeno e em cinza (mono). Comportamento esperado do
  `ClosingCardBlock`; não é bug do smoke-test.
- **Correção sugerida**: nenhuma — é o design atual do
  closing-card. Se o vídeo precisar de URL mais forte, o Diretor
  pede outro tratamento.

### Issue #4 — Sub-caption do center node do CentralSpotlight some
- **Cena**: Bullets-2 (frame 520)
- **Severidade**: minor
- **Observação**: O `center.caption: 'núcleo do modelo'` aparece
  mas em cinza muito fraco abaixo do título central. Quase
  imperceptível. Comportamento esperado (caption é gray300), só
  marcando para futuro: se quiser caption mais visível, o
  Diretor pode evitar o campo ou pedir variante.

### Nenhum issue crítico ou bloqueante encontrado.

---

## Pontos fortes

1. **Todos os 4 archetypes novos renderizaram na primeira tentativa
   sem crashes**. Zero mexida pós-render. Validação importante de
   que: (a) o schema está bem tipado, (b) os componentes estão
   corretamente conectados ao dispatch, (c) os archetypes reusam
   primitivas existentes (ConceptCard, Icon, MaskReveal) sem
   conflitos.

2. **Conectores SVG do CentralSpotlight com gradient/glow em premium
   funcionam visivelmente**. O effeito "hub-and-spoke" lê claramente.

3. **Highlight semântico do split-screen-comparison
   (`highlightSide: 'right'`)** funcionou exatamente como
   especificado: lado direito maior, accent bright, lado esquerdo
   menor, accent deep. Diferenciação visual clara.

4. **Eixos do quadrante-2x2 com axis labels mono** dão semântica
   clara à matriz — não é só "4 cards num grid 2×2", é "matriz com
   eixos nomeados". Diferenciação principal vs feature-grid.

5. **Reveal mask-up do giant-statement** entrega o impacto pedido
   pela tipografia hero. Glow sutil funciona como "lit by brand
   atmosphere", não como drop-shadow chato.

---

## Recomendação final

A máquina está **pronta pra rodar conteúdo real** com os 5 arquétipos
novos. Os 4 issues acima são polimentos cosméticos, não defeitos
estruturais. O fluxo end-to-end funciona:

1. Diretor escolhe `archetype` do catálogo em `agents/archetypes.md`.
2. Motion Designer mapeia `archetype` → `kind` (mesmo nome) → spec.
3. PremiumScene/MinimalScene despacham.
4. Renderiza limpo.

**Para o próximo vídeo de marketing real**, sugerir ao Diretor:
- Experimentar `central-spotlight-with-satellites` em algum vídeo
  sobre modelo operacional (encaixa naturalmente).
- Usar `giant-statement` como pivot dramático em vídeo curto onde
  uma palavra carrega a tese.
- `split-screen-comparison` cabe em qualquer vídeo "antes vs depois"
  ou "manual vs automatizado".
- `quadrante-2x2` é o mais nicho — só usar quando os eixos de fato
  têm semântica forte (não como "feature-grid mais bonito").

**Polimentos para v2 da Wave 3** (não bloqueiam vídeos novos):
- Issue #1: revisar proporção ConceptCard `compact` em quadrantes.
- Issue #2: empurrar axis labels do quadrante para fora do container.
- Implementar `timeline-vertical` (item 10 do catálogo, fora do
  escopo da Wave 3).
- Adicionar conectores opcionais no `concept-row` para fechar o
  arquétipo `horizontal-3-cards-connected` (status PARCIAL hoje).

---

## Próxima ação

- **Tipo**: publish (smoke-test approved)
- **Responsável**: ninguém — smoke-test não vai pro ar
- **Instruções**:
  1. Manter `<Composition id="archetypes-smoke-test-pt">` registrado
     em `Root.tsx` como **fixture de regressão** (mesmo padrão do
     HookMinimalPreview). Não remover.
  2. Próximo briefing real de marketing pode usar o catálogo expandido.
