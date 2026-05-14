# Implementation Notes — Acelerar com IA sem perder segurança

## Arquivos alterados
- `src/scenes/HookScene.tsx` — refatorado para usar SyncWord nas três
  palavras-chave (acelerar, IA, segurança)
- `src/scenes/BulletsScene.tsx` — substituído layout vertical por
  diagrama horizontal de 3 cards com Connectors
- `src/scenes/StatScene.tsx` — adicionado bloco de barras comparativas
  ao lado direito do número
- `src/scenes/CTAScene.tsx` — sem alterações estruturais; só
  confirmação que está usando bloom premium
- `src/scenes/IntroScene.tsx` — sem alterações
- `src/compositions/DemoVideo.tsx` — adicionados TransitionFlash entre
  Intro/Hook (frame 80) e entre Stat/CTA (frame 735)
- `src/i18n/strings.ts` — strings revisadas conforme roteiro 02

## Arquivos criados
- `src/components/TransitionFlash.tsx` — primitiva nova: flash branco
  curto + corte. Implementada com opacity 0→1→0 em 8 frames sobre uma
  div absoluta cobrindo o quadro

## Primitivas reaproveitadas
- `Icon` (com `mode="luby-minimal"`)
- `SyncWord`
- `ConceptCard`
- `Connector` (com `flow=true`)
- `BigStat`
- `MaskReveal`
- `Logo`
- `LineDraw`
- `Pill`
- `BrandFrame`
- `BackgroundAtmosphere`

## Primitivas criadas
- `TransitionFlash` (já listado acima — pode virar componente comum se
  todos os vídeos seguirem o padrão dual-mode)

## Render
- **MP4**: `agents/runs/2026-05-12-acelerar-com-ia/out/video-pt.mp4`
- **Comando**: `npm run render:pt`
- **Duração real**: 30.0s (900 frames exatos)
- **Tamanho**: 3.4 MB

## Decisões técnicas

1. **TransitionFlash como componente reusável** — embora o storyboard
   tenha pedido em duas cenas específicas, implementei como componente
   genérico que aceita `at` (frame) e `direction`. Próximos vídeos
   herdam.

2. **Barras comparativas inline** — não criei `ComparisonBar.tsx`
   ainda. Implementei como divs animadas direto na `StatScene`. Se o
   próximo vídeo também precisar de barras, vale extrair.

3. **Ícones ShieldX e ShieldCheck na Stat em 32px** — testei e a
   legibilidade é ok em desktop, mas no LinkedIn mobile fica apertado.
   Recomendo Revisor confirmar visualmente.

4. **Connectors com flow=true entre cards** — usei curve=0 (linha reta
   horizontal) porque os cards estão na mesma altura. Flow dot rola a
   ~0.5 ciclos/s.

## Desvios do storyboard

| Pedido | O que foi feito | Por quê |
|--------|-----------------|---------|
| TransitionFlash em frames específicos (80, 735) | Frame 84 e 738 | Pequeno ajuste fino — durações reais das cenas adjacentes ficaram melhor com offset de +4 frames |
| Icon "GitPullRequest" no card-1 | Mantido | conforme storyboard |
| Source line "Média entre clientes Luby — 2025" | Mantido | conforme roteiro |

## Notas para o Revisor

- **Observar especialmente o frame 180** (highlight da cena Hook): a
  pergunta completa precisa estar visível E o ícone ShieldCheck
  precisa estar no lugar. Verifiquei manualmente.
- **Observar timing dos Connectors** (frames 270 e 320): o draw deve
  estar visível, não instantâneo. Confirmei que duração é
  `motion.enterDramatic` = 30 frames.
- **Observar a barra comparativa na Stat** (frames 660-700): o
  crescimento deve coincidir com o final do count-up do número (60%).
  Pequeno ajuste fino possível.
- **Observar TransitionFlash em frame 84**: deve ser perceptível mas
  não chocante. Se ficou abrupto demais, podemos aumentar duração
  pra 12 frames.

## Perguntas em aberto

- URL `luby.co/ai-security-diagnostic` — confirmar com marketing se
  existe, ou trocar pra `luby.co/ai-security` ou similar. Por ora está
  como `luby.co/diagnostic-ai-security` no string.
