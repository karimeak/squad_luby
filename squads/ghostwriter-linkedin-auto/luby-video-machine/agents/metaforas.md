# Catálogo de metáforas visuais

**Quem usa**: Diretor Criativo (escolhe metáfora ANTES de arquétipo),
Motion Designer (sabe que recursos da máquina realizam cada metáfora).

**Princípio**: o Diretor pensa primeiro em **metáfora conceitual**
(qual imagem visual traduz o conceito do roteiro?), só depois mapeia
para arquétipo/layout concreto. O catálogo de arquétipos
(`agents/archetypes.md`) é a camada **abaixo** desta — ele responde
"como rendero?", esta responde "o que mostro?".

**Organização**: 8 seções temáticas, 38 metáforas. Cada metáfora é
catalogada mesmo se já existe na máquina (status registrado em
"Implementação aproximada"). Algumas pedem componente novo —
documentamos o que precisaria existir.

**Como ler cada entrada**:
- **Conceito no roteiro**: palavras-gatilho que disparam essa metáfora
- **Imagem mental**: a metáfora visual em si (não a tela)
- **Solução visual concreta**: como vira tela (layout/cores/motion/texto+ícone)
- **Quando usar / Quando NÃO usar**: critérios de pertinência
- **Implementação aproximada**: existe hoje? Se sim, com que recursos? Se não, o que precisaria criar?
- **Exemplo concreto**: cena hipotética curta

---

## Seção A — Comparação e Contraste

### A1. `dualidade-split-screen`

**Conceito no roteiro**: "X vs Y", "com vs sem", "manual vs
automatizado", "isolado vs conectado", "antes vs depois (sem ênfase
temporal)".

**Imagem mental**: tela cortada ao meio. Cada metade representa um
mundo / regime / opção. O corte É o conceito.

**Solução visual concreta**:
- **Layout**: 50/50 vertical, símbolo central oversized (vs / × / ≠).
- **Cores**: lado A com accent `deep` (sóbrio, "menos brilhante"),
  lado B com accent `bright` (protagonismo); ou ambos neutros se
  for equivalência genuína.
- **Motion**: lado não-highlight entra primeiro, símbolo central
  entra em seguida, lado highlight entra por último com escala
  maior para carregar peso retórico.
- **Texto e ícones**: cada lado tem icon hero (ConceptCard feature
  ou standard) + título + caption curta.

**Quando usar**: Hook ou Bullets de vídeo que ATAQUE uma falsa
dicotomia, ou contraste dois paradigmas equivalentes em peso mas
diferentes em natureza.

**Quando NÃO usar**: comparações com 3+ opções (vira `concept-row`),
comparações puramente numéricas (vira `stat-with-comparison-bars`),
comparações onde os dois lados são EQUIVALENTES sem tensão (vira
`feature-grid`).

**Implementação aproximada**: EXISTE — `split-screen-comparison`
archetype (Wave 3) com `highlightSide`, `centerSymbol`.

**Exemplo concreto**: Bullets de vídeo "IA solo vs IA com método":
lado esquerdo `Bot` "IA solo" deep, vs central, lado direito
`Brain + Users` "IA + método" bright em `feature`.

---

### A2. `antes-e-depois-temporal`

**Conceito no roteiro**: "antes da Wave 3 nós...", "no passado era
X, hoje é Y", "vimos de X chegamos em Y", "evolução clara".

**Imagem mental**: linha do tempo curtíssima, com 2 marcos: um
"antes" apagado/cinza/pequeno, um "depois" colorido/bright/maior. A
seta entre eles É a passagem de tempo.

**Solução visual concreta**:
- **Layout**: timeline horizontal mínima com 2 markers (não 5+).
  Setim curta apontando ANTES → DEPOIS. Espaço narrativo entre
  eles para a seta respirar.
- **Cores**: "antes" em `gray400` ou `blueDeep` apagado; "depois" em
  `blueBright`. Acent contraste forte.
- **Motion**: "antes" aparece primeiro estático, a seta DESENHA-SE,
  "depois" entra com pop + bloom.
- **Texto e ícones**: cada marker tem when (data/era curto), what
  (label) e ícone se ajudar a leitura. NÃO precisa caption longa —
  o ponto é a passagem.

**Quando usar**: hot-take "vimos de cá", milestone curto, beats
narrativos sobre evolução conceitual ou histórica.

**Quando NÃO usar**: para comparação SEM eixo temporal (vira
`dualidade-split-screen`). Para 3+ marcos (vira `timeline-vertical`
ou `pipeline-temporal`).

**Implementação aproximada**: PARCIAL — usar `timeline` block com
events.length === 2 + highlight no segundo. Falta a seta de
transição explícita; pode ser improvisada com SVG ou pedir extensão
ao TimelineBlock para variant "before-after".

**Exemplo concreto**: Hook de vídeo sobre Wave 3 do projeto: marker
"2026-04 — 3 cards sempre" (gray) → seta → marker "2026-05 — 11
arquétipos" (bright). 4s.

---

### A3. `nos-vs-eles`

**Conceito no roteiro**: "o jeito antigo vs o nosso", "concorrente X
faz Y, nós fazemos Z", "padrão da indústria vs padrão Luby", "modelo
genérico vs modelo nosso".

**Imagem mental**: split-screen, mas o lado "eles" tem mais elementos
(genérico/poluído) e o lado "nós" tem menos elementos com mais peso
(focado/refinado). A diferença de densidade É o argumento.

**Solução visual concreta**:
- **Layout**: 60/40 (eles maior, mas apagado; nós menor, mas
  destacado). Ou 50/50 com diferença de densidade interna.
- **Cores**: "eles" em paleta mono cinza, "nós" em accent
  `bright`. Texto "eles" em gray400, texto "nós" em white pleno.
- **Motion**: "eles" entra primeiro com vários itens em stagger
  rápido (sensação de "muita coisa"); "nós" entra depois com
  poucos itens com mask reveal lento (sensação de "deliberado").
- **Texto e ícones**: "eles" pode ter 4-5 mini-ícones genéricos;
  "nós" tem 1-2 ícones brand com bloom.

**Quando usar**: posicionamento competitivo direto, vídeo de tese
sobre diferenciação categorial.

**Quando NÃO usar**: quando o vídeo está "acima do debate" (não
quer comparar mesmo — usar `metafora-da-categoria-nova`). Quando o
comparativo precisa ser numérico (usar `stat-with-comparison-bars`).

**Implementação aproximada**: NOVA — não tem componente direto.
Combinação de `concept-row` (lado "eles" denso) + `concept-row` lado
único (lado "nós") em split-layout. Precisaria archetype novo ou
composição manual.

**Exemplo concreto**: Bullets de vídeo de posicionamento — "eles"
com 5 logos cinza pequenos + label "métodos genéricos"; "nós"
com 1 ícone bright + label "método operacional".

---

### A4. `certo-vs-errado-visual`

**Conceito no roteiro**: "pratique isso, não aquilo", "✓ vs ✗",
"correto vs comum", "boa prática vs anti-padrão", "do-and-don't".

**Imagem mental**: lista paralela vertical com check verde de um
lado e X vermelho do outro (ou semantic equivalent: brand-blue
check vs muted X).

**Solução visual concreta**:
- **Layout**: duas colunas verticais lado a lado, top-aligned.
  Coluna esquerda "✗" com 3-4 itens, coluna direita "✓" com 3-4
  itens. Headers acima ("EVITE" / "PREFIRA" ou equivalente).
- **Cores**: marcador X em `gray500` (não vermelho — fora da
  paleta), marcador ✓ em `blueBright`. Textos pareados em white,
  mas opacidade reduzida no lado errado.
- **Motion**: itens entram pareados (✗1 + ✓1 juntos, depois ✗2 +
  ✓2). Stagger entre pares, não dentro do par.
- **Texto e ícones**: ícone semântico opcional em cada item
  ("automacao" no errado se for "automação cega" vs "automacao"
  no certo se for "automação com guardrails").

**Quando usar**: vídeo educativo / tutorial / dev-insight sobre
boas práticas. Beat de Bullets com regras pareadas.

**Quando NÃO usar**: comparações que não são "errado vs certo"
genuíno (vira `dualidade-split-screen` ou `nos-vs-eles`). Quando
a paleta de erro precisa ser vermelha (fora da paleta Luby).

**Implementação aproximada**: NOVA — `vertical-stack` em duas
colunas com headers + markers ✓/✗. Pode ser archetype
`paired-do-dont` ou composição manual com 2 vertical-stacks
side-by-side.

**Exemplo concreto**: Bullets de tutorial "code review com IA": ✗
"aceita sugestão cega" / ✓ "valida com testes"; ✗ "rebase sem ler"
/ ✓ "rebase com diff de conflito"; ✗ "merge sem CI" / ✓ "merge
após CI verde".

---

### A5. `competicao-de-fileira`

**Conceito no roteiro**: "todos os concorrentes fazem X, só nós
fazemos Y", "n opções no mercado, 1 se destaca", "n cards
equivalentes + 1 highlight".

**Imagem mental**: linha horizontal de N+1 cards equidistantes. Os
N primeiros têm tonalidade apagada uniforme, parecem
intercambiáveis; o último (ou um marcado) tem cor viva, escala
maior, halo. A diferença visual É o argumento.

**Solução visual concreta**:
- **Layout**: row horizontal de 3-5 cards. Cards normais em
  `compact` ou `standard`. Card highlight em `feature` (uma
  granularidade acima). Gap consistente.
- **Cores**: cards normais com accent `deep`, card highlight com
  accent `bright`. Halo opcional atrás do card highlight.
- **Motion**: normais entram em stagger rápido (commodity ritmo),
  highlight entra POR ÚLTIMO com hold-off de ~14f e mask-up mais
  lento (peso retórico).
- **Texto e ícones**: cada card com ícone + título curto. Card
  highlight pode ter caption explicando "porque é diferente"; os
  outros ficam só com ícone + título.

**Quando usar**: Hook ou Bullets onde a tese é diferenciação
categorial. Beat de "todos vs nós". Quando o argumento é
visual (vê com o olho que um deles é diferente).

**Quando NÃO usar**: quando os 3 opções são GENUINAMENTE
equivalentes (sem highlight, vira `feature-grid`). Quando a
comparação é binária (vira `dualidade-split-screen`).

**Implementação aproximada**: EXISTE — `concept-row` com
`highlight: true` em um concept (já usado no time-220-claude-code
e no pergunta-errada-outsourcing).

**Exemplo concreto**: Hook de vídeo "in-house vs outsourcing vs
parceria operacional" — 3 cards: in-house deep, outsourcing deep,
parceria-operacional bright highlight feature.

---

### A6. `categoria-nova`

**Conceito no roteiro**: "todos discutem X ou Y, mas isso é a
pergunta errada — a categoria certa é Z". Vídeo NÃO compara, sobe
para meta-nível.

**Imagem mental**: dois polos antigos visualmente "apagados" /
"riscados", e uma terceira opção emerge em outro plano (acima,
atrás, fora do eixo) destacada. A separação vertical/dimensional É
o argumento.

**Solução visual concreta**:
- **Layout**: 2 cards inferiores em row (eixo antigo), 1 card
  superior centralizado e maior (a nova categoria). Pode ter linha
  horizontal sutil separando o "plano antigo" do "plano novo".
- **Cores**: dois inferiores em gray700/blueDeep apagados,
  superior em white + accent bright com bloom.
- **Motion**: 2 inferiores entram juntos rápido, "riscam-se"
  sutilmente (overlay de linha horizontal cruzando), depois o
  card superior emerge com scale + bloom.
- **Texto e ícones**: 2 inferiores com label só (ex: "In-house",
  "Outsourcing"). Superior com label + caption ("Outro plano —
  parceria operacional").

**Quando usar**: market-insight / hot-take que reframe categoria.
Vídeos "acima do debate".

**Quando NÃO usar**: quando o vídeo ESTÁ no debate, comparando
opções dentro da mesma categoria.

**Implementação aproximada**: NOVA — combinação de
`split-screen-comparison` no plano inferior + 1 card highlight
flutuante no superior. Pode ser composto manual ou archetype novo
`paradigm-elevation`.

**Exemplo concreto**: Hook do vídeo "pergunta-errada-outsourcing":
in-house e outsourcing apagados na base, "parceria operacional"
emergindo acima com halo.

---

## Seção B — Composição e Soma

### B1. `equacao-visual`

**Conceito no roteiro**: "A × B = C", "humans + AI = output", "X +
Y produz Z", relação multiplicativa entre fatores.

**Imagem mental**: equação matemática visualizada com cards/ícones
nos slots e operadores tipograficamente oversized entre eles. A
equação É lida.

**Solução visual concreta**:
- **Layout**: 3 slots horizontais com operadores entre. Slot
  esquerdo (fator 1), slot meio (fator 2), slot direito (resultado).
  Operadores grandes (~140px) entre os slots.
- **Cores**: slots em paleta brand; resultado em accent bright para
  protagonismo. Operadores em white com glow sutil.
- **Motion**: slot 1 entra, operador 1 desenha, slot 2 entra,
  operador 2 desenha, slot 3 entra com pop. Mostra a ordem da
  leitura matemática.
- **Texto e ícones**: cada slot pode ser icon-label (Users 220 +
  caption) ou number (3-5×). Resultado costuma ser número grande.

**Quando usar**: tese de multiplicação (220 × IA = 3-5×, humanos ×
método = output). Bullets quando o argumento É a fórmula.

**Quando NÃO usar**: quando os fatores não se multiplicam (são
listados, não compostos). Mais de 2 fatores (não cabe). Quando o
resultado não é o protagonista (a equação foca o output).

**Implementação aproximada**: EXISTE —
`multiplication-equation` block com slots typed (icon-label /
number) e operadores customizáveis.

**Exemplo concreto**: Bullets do time-220-claude-code: `[Users
220] × [Bot agents] = [3-5×]`.

---

### B2. `fusao-de-elementos`

**Conceito no roteiro**: "duas coisas se juntando viram uma
terceira", "merge", "alquimia", "humanos + IA fundem em
agentes". Sentido de UNIÃO, não soma.

**Imagem mental**: dois elementos vindo de lados opostos, se
aproximando, se mesclando no centro em algo NOVO. O motion de
convergência É o conceito.

**Solução visual concreta**:
- **Layout**: 3 momentos em um beat. Momento 1: dois ícones nos
  lados (extremos). Momento 2: ícones se aproximam, fundem.
  Momento 3: novo ícone (resultado) emerge no centro com label.
- **Cores**: ícones iniciais em accent `primary` e `bright`.
  Ícone resultado em accent `bright` com bloom.
- **Motion**: ícones com `enter` lateral (translateX simétrico),
  scale + opacity decrease quando se sobrepõem, ícone resultado
  faz pop ao centro com bloom estourado.
- **Texto e ícones**: 2 ícones iniciais com label minúsculo
  abaixo, ícone resultado com label médio.

**Quando usar**: beat sobre integração, parceria, união de
forças. Stat ou Bullets onde a tese é fusão produzindo emergência.

**Quando NÃO usar**: quando os elementos PERMANECEM separados
trabalhando juntos (vira `equacao-visual` ou
`rede-com-no-central`). Quando a relação é hierárquica
(usar `orbita-de-satelites`).

**Implementação aproximada**: NOVA — sem componente. Precisaria
archetype `merge-fusion` com 3 keyframes: separados → sobrepostos
→ resultado. Pode ser feito hoje com `multiplication-equation` mas
sem o efeito de fusão real (3 slots estáticos).

**Exemplo concreto**: Bullets de vídeo "agente de código nasce da
fusão" — `Brain` (humano) à esquerda + `Bot` (IA) à direita →
fundem → `Sparkles` "agente operacional" no centro.

---

### B3. `ingredientes-em-receita`

**Conceito no roteiro**: "5 ingredientes pra um sistema funcionar",
"nossa receita", "o que compõe o modelo". Vários elementos
distintos juntos compondo um todo.

**Imagem mental**: vários ícones aparecendo um a um como
ingredientes sendo despejados num recipiente central, e ao final o
recipiente "ferve" / aceita todos visualmente. Sentido de
COMPOSIÇÃO, não fusão.

**Solução visual concreta**:
- **Layout**: container central (poderia ser um card grande,
  círculo grande, ou área visual delimitada) + ingredientes (3-5
  ícones) entrando em volta com setas curtas apontando pro
  centro.
- **Cores**: ingredientes em accent `primary`, container em accent
  `bright` que pulsa quando todos chegam.
- **Motion**: ingredientes entram em stagger rápido com translate
  do exterior para perto do centro. Container começa apagado e
  ganha brilho/pulse a cada ingrediente que chega.
- **Texto e ícones**: cada ingrediente com label curto + ícone.
  Container com label central tipo "Modelo" ou "Sistema".

**Quando usar**: Bullets que lista componentes que JUNTOS produzem
um todo. Vídeos explicativos sobre arquitetura ou método.

**Quando NÃO usar**: quando os ingredientes são listados sem
agregação (vira `vertical-stack` ou `feature-grid`). Quando o todo
não é parte da mensagem (só os componentes importam).

**Implementação aproximada**: PARCIAL — pode usar
`central-spotlight-with-satellites` invertendo a leitura (centro
recebe os satélites em vez de irradiar). Sem motion de
"despejar" — visual estático. Para motion real precisaria
archetype `recipe-pour`.

**Exemplo concreto**: Bullets do modelo operacional Luby — centro
"Modelo" + ingredientes "Governança", "Compliance", "Velocidade",
"Contexto" entrando em órbita.

---

### B4. `camadas-empilhadas`

**Conceito no roteiro**: "camada sobre camada", "stack", "tudo
construído em cima de uma base", arquitetura em layers.

**Imagem mental**: cards/painéis empilhados verticalmente, base no
fundo, topo bem visível. Cada camada nomeada. Sentido de
construção/foundation.

**Solução visual concreta**:
- **Layout**: stack vertical de 3-5 painéis horizontais largos
  (ex: 1100px wide × 100px tall cada). Layer base no fundo, topo
  na parte de cima. Espaço pequeno entre layers para separação
  visual.
- **Cores**: gradiente de blueDeep (base) para blueBright (topo);
  ou todos navy com border bright. Texto em white em cada layer.
- **Motion**: layers entram da base pra cima em sequência (base
  primeiro, topo por último). Cada layer faz pequeno mask-up.
- **Texto e ícones**: cada layer com label horizontal centralizado
  (Compute → Data → API → UX, ou Foundation → Process → Output).
  Ícone pequeno opcional à esquerda do label.

**Quando usar**: explicações de arquitetura técnica em camadas,
beat sobre stack tecnológica, narrativas de "fundação para
escalada".

**Quando NÃO usar**: quando as camadas não têm ordem (são
paralelas — vira `feature-grid`). Quando é mais de 5 camadas
(visualmente confuso).

**Implementação aproximada**: NOVA — `vertical-stack` chega perto
mas tem ícones inline-left, não layers full-width. Precisaria
archetype `layered-stack` com painéis largos, ou variant do
existing.

**Exemplo concreto**: Bullets de vídeo sobre Claude — base
"Infraestrutura compute", layer "Modelos Foundation", layer "API",
topo "Aplicações". Stack vertical com glow incremental.

---

### B5. `soma-de-cards`

**Conceito no roteiro**: "+1, +2, +3 ...", "esses 3 juntos formam",
"adição progressiva". Sentido de ACUMULAÇÃO.

**Imagem mental**: cards entrando em row com sinal "+" visível
entre cada um. Ao final, somatório visualizado.

**Solução visual concreta**:
- **Layout**: row horizontal de cards (3-4) com símbolos "+" entre
  eles. Linha igual à equação mas a operação é soma e o resultado
  é "todos juntos".
- **Cores**: cards em accent `primary` uniforme (não há highlight
  — todos contribuem).
- **Motion**: card 1 entra, "+" desenha, card 2 entra, "+" desenha,
  card 3 entra. Final: pode ter destaque pulsante em todos para
  marcar "soma completa".
- **Texto e ícones**: cada card com ícone + label.

**Quando usar**: beat de "tudo junto" sem hierarquia, listing com
narrativa cumulativa.

**Quando NÃO usar**: relação multiplicativa (vira `equacao-visual`).
Lista sem somatório (vira `feature-grid` ou `concept-row`).

**Implementação aproximada**: PARCIAL — `multiplication-equation`
com operador "+" customizado e resultado implícito. Sem suporte
direto para "soma sem produto explícito"; ajustável.

**Exemplo concreto**: Stat de vídeo "o que muda no modelo":
`Users + Bot + Method` somando em uma única "operação completa".

---

## Seção C — Transformação e Mudança

### C1. `caos-vira-ordem`

**Conceito no roteiro**: "antes era caótico, hoje é organizado",
"de bagunça para método", "do emaranhado para linha clara".

**Imagem mental**: campo visual cheio de elementos aleatórios
(linhas torcidas, ícones espalhados, ângulos quebrados) que se
reorganizam em uma estrutura limpa (linha reta, grid, fluxograma).
O motion de organização É o conceito.

**Solução visual concreta**:
- **Layout**: 2 estados visualmente distintos. Estado 1: elementos
  espalhados em posições aleatórias com rotações variadas, baixa
  opacidade brand. Estado 2: mesmos elementos alinhados (row, grid,
  ou linha) com posicionamento limpo e accent bright.
- **Cores**: estado 1 em paleta muted (gray400 ou blueDeep
  apagado). Estado 2 em white + accent bright.
- **Motion**: motion principal É a transição entre estados — cada
  elemento faz `easings.smooth` interpolando de pos1+rot1 para
  pos2+rot0. Stagger orgânico (não uniforme) reforça a
  organização emergente.
- **Texto e ícones**: ícones genéricos no estado caos, mesmos
  ícones no estado ordem com label tipográfico aparecendo.

**Quando usar**: vídeos sobre metodologia, processo, modelo
operacional, "como tira do caos". Beat de transformação narrativa.

**Quando NÃO usar**: quando o "antes" não foi caos genuíno (é só
estado anterior — vira `antes-e-depois-temporal`). Quando o motion
de transformação não cabe no tempo (precisa de ~3-4s).

**Implementação aproximada**: NOVA — sem componente. Precisaria
archetype `chaos-to-order` que aceita N elementos e dois layouts
(scattered random + organized grid/row). Complexidade média no
Motion Designer.

**Exemplo concreto**: Hook de vídeo "metodologia de engineering":
ícones de PR, Deploy, Code Review, Bug espalhados torcidos no
fundo escuro → reorganizam em pipeline limpo Code Review → Vuln
Scan → Deploy.

---

### C2. `complexidade-vira-clareza`

**Conceito no roteiro**: "muito complexo? Simples assim", "n peças
viram 1 conceito", "redução de dimensionalidade visual".

**Imagem mental**: vários ícones/elementos pequenos no centro do
quadro convergem visualmente em um único elemento grande no centro
final. Sentido de DESTILAÇÃO.

**Solução visual concreta**:
- **Layout**: muitos elementos pequenos espalhados → convergem ao
  centro → emergem como UM elemento grande. Motion radial inverso.
- **Cores**: elementos pequenos em accent `deep` apagado (muitos,
  fracos). Elemento final em accent `bright` com bloom.
- **Motion**: scatter inicial (1-2s) → motion convergente
  (translate radial para o centro + scale-down + opacity drop) →
  elemento final faz pop com mask-up e bloom estourado.
- **Texto e ícones**: ícones pequenos sem label. Elemento final
  com label tipográfico grande revelando o "conceito destilado".

**Quando usar**: Hook que reduz complexidade aparente para
conceito-âncora. Stat de "n coisas viram 1 essência". Vídeos
"tudo isso pra dizer".

**Quando NÃO usar**: quando os n elementos PERMANECEM relevantes
(vira `central-spotlight-with-satellites` — eles ficam, não
desaparecem). Quando o conceito final NÃO é destilação real (é
adição — vira `ingredientes-em-receita`).

**Implementação aproximada**: NOVA — sem componente. Precisaria
archetype `complexity-distill` com fases scatter→converge→emerge.
Pesado em motion mas factível.

**Exemplo concreto**: Hook de vídeo sobre Claude — ícones de
"prompting", "context", "tools", "thinking", "memory" convergem
e viram um único ícone `Sparkles` "modelo operacional".

---

### C3. `metamorfose`

**Conceito no roteiro**: "X virou Y", "transformação completa",
"de uma coisa em outra coisa", morphing.

**Imagem mental**: um único elemento muda de forma/estado/cor sem
sair do mesmo lugar. Sentido de MUDANÇA INTRINSECA, não
substituição.

**Solução visual concreta**:
- **Layout**: posição fixa no centro. Elemento inicial e final
  ocupam mesma área. Não há "antes" ao lado de "depois" — é o
  mesmo lugar mudando.
- **Cores**: elemento inicial em accent `deep`, transformação
  passa por um momento de bloom estourado (instante de mudança),
  elemento final em accent `bright` ou outra cor brand.
- **Motion**: crossfade entre dois ícones + scale pulse no momento
  de troca. Pode ter glow estourado para marcar "agora muda".
  Label tipográfico opcional muda em sync.
- **Texto e ícones**: ícone inicial + label inicial → flash → ícone
  final + label final. Mesmo posicionamento exato.

**Quando usar**: beat sobre transformação radical de um único
sujeito ("engineer virou AI-augmented engineer"). Pivot dramático.

**Quando NÃO usar**: quando há DOIS sujeitos comparados (vira
`dualidade-split-screen`). Quando é gradual e não súbito (vira
`antes-e-depois-temporal`).

**Implementação aproximada**: NOVA — sem componente. Archetype
`metamorphosis` com crossfade timed + flash de transição. Pode
ser composto com Icon + crossfade manual.

**Exemplo concreto**: Hook de vídeo sobre AI-augmented engineering:
ícone `Code` apagado → flash → ícone `Sparkles + Code` bright. Tudo
mesma posição central.

---

### C4. `expansao-progressiva`

**Conceito no roteiro**: "1 → 2 → 4 → 8", "crescimento
exponencial", "começa pequeno, explode", "n se multiplicando".

**Imagem mental**: 1 elemento aparece, depois 2, depois 4. Cada
nova geração ocupa mais espaço, em paralelo. Sentido de
multiplicação geométrica.

**Solução visual concreta**:
- **Layout**: progressão temporal vertical ou horizontal. 4 estados
  visualmente distintos com mais elementos a cada passo. Pode ser
  layout em árvore (1 → 2 ramos → 4 ramos → 8 folhas).
- **Cores**: cada geração com mesma cor brand uniforme; última
  geração com glow estourado.
- **Motion**: stagger orgânico que ACELERA — primeiro elemento
  aparece em 30f, depois 2 em 20f, depois 4 em 10f, etc. A
  aceleração reforça o "exponencial".
- **Texto e ícones**: ícones replicáveis (Users multiplicando, ou
  Sparkles multiplicando). Labels numéricos opcionais ("1", "2",
  "4", "8").

**Quando usar**: vídeos sobre escala, viralidade, network effects,
adoção exponencial.

**Quando NÃO usar**: crescimento LINEAR (vira `grafico-ascendente`).
Apenas dois estados (vira `antes-e-depois-temporal`).

**Implementação aproximada**: NOVA — sem componente. Archetype
`exponential-expansion` que gera N gerações com stagger
acelerando. Complexidade média.

**Exemplo concreto**: Stat de vídeo sobre AI agents: "1 dev usa
Claude → 4 devs usam Claude → todo o time → toda a engenharia".
1 Sparkles → 4 Sparkles → 16 Sparkles → 64 dots/Sparkles.

---

### C5. `reset-clean-slate`

**Conceito no roteiro**: "esquece tudo", "começa do zero", "reset
mental", "limpa a mesa".

**Imagem mental**: toda a tela é "limpa" por um motion (wipe, fade
to black, glitch). Depois emerge UMA coisa nova numa tela vazia.
O ato de limpar É parte do significado.

**Solução visual concreta**:
- **Layout**: dois estados. Estado 1: conteúdo denso (vários
  elementos). Estado 2: tela quase vazia com um elemento central.
  Entre os dois, um wipe ou fade dramático.
- **Cores**: estado 1 em paleta normal; estado 2 com background
  ligeiramente mais escuro (surface0) para reforçar "limpou".
- **Motion**: wipe horizontal ou vertical rápido (~6f), ou
  flash-to-black + retorno. Estado novo emerge devagar com
  mask-up.
- **Texto e ícones**: estado 1 com vários textos; estado 2 com 1
  frase ou palavra que carrega "o novo começo".

**Quando usar**: pivot narrativo dramático em vídeo de tese,
transição de "vamos esquecer X" → "agora pense Y".

**Quando NÃO usar**: transição comum entre cenas (já tem
TransitionFlash para isso). Vídeos calmos sem pivot.

**Implementação aproximada**: PARCIAL — TransitionFlash já dá o
wipe entre cenas; falta o motion do conteúdo CARREGAR a metáfora
(estado 1 visivelmente denso → wipe → estado 2 vazio com
elemento novo). Composição manual com 2 cenas + TransitionFlash
forte entre elas.

**Exemplo concreto**: Pivot em vídeo de tese: cena 1 cheia de
ícones e cards do "modelo antigo" → flash forte → cena 2 com só
"Outro caminho." em giant-statement.

---

## Seção D — Conexão e Sistema

### D1. `rede-com-no-central`

**Conceito no roteiro**: "tudo passa por nós", "hub central",
"orquestrador", "plataforma que conecta todos".

**Imagem mental**: nó central grande conectado por linhas a vários
nós periféricos. Sentido de POSIÇÃO ESTRATÉGICA do centro.

**Solução visual concreta**:
- **Layout**: 1 nó central destacado + 4-6 nós periféricos em
  layout radial. Linhas conectoras do centro para cada periférico.
- **Cores**: nó central com bloom e accent `bright`. Periféricos
  com accent `primary`. Linhas em white com glow leve em premium.
- **Motion**: nó central entra primeiro, periféricos entram em
  stagger, linhas desenham-se do centro pra fora em sync com cada
  periférico.
- **Texto e ícones**: nó central com ícone grande + label médio.
  Periféricos com ícone pequeno + label curto.

**Quando usar**: arquitetura hub-and-spoke, plataforma central,
modelo de orquestração.

**Quando NÃO usar**: quando os periféricos têm relação ENTRE eles
(vira `ecossistema-distribuido`). Quando o centro NÃO é
protagonista (vira `quadrante-2x2` ou `feature-grid`).

**Implementação aproximada**: EXISTE —
`central-spotlight-with-satellites` archetype com conectores
opcionais.

**Exemplo concreto**: Bullets sobre modelo operacional Luby —
centro "AI-augmented engineering" + satélites Governança,
Compliance, Velocidade, Contexto.

---

### D2. `pipeline-temporal`

**Conceito no roteiro**: "fluxo", "do PR ao deploy", "etapas
sequenciais", "start → stages → end".

**Imagem mental**: sequência horizontal de stages com flecha entre
cada. Cada stage tem ícone + label. Sentido de PROGRESSÃO LINEAR
através de fases.

**Solução visual concreta**:
- **Layout**: row horizontal com label de start à esquerda,
  3-5 stages no meio, label de end à direita. Setas (ou linhas
  com flow dots) entre stages.
- **Cores**: stages em accent `primary` uniformes; start/end em
  white. Setas em white com glow leve.
- **Motion**: start label aparece, stage 1 entra, seta desenha,
  stage 2 entra, etc. Fluxo dots opcional animando ao longo das
  linhas após todas as stages estarem na tela.
- **Texto e ícones**: cada stage com ícone + título + caption
  pequena opcional.

**Quando usar**: processos sequenciais com ordem definida (CI/CD,
funil, workflow).

**Quando NÃO usar**: quando os elementos são paralelos (vira
`feature-grid`). Quando há ramificações (vira diagrama, fora do
catálogo).

**Implementação aproximada**: EXISTE — `pipeline` block com
startLabel/endLabel/stages e ícones por stage.

**Exemplo concreto**: Bullets do luby-demo — "PR → Code Review →
Vuln Scan → Audit Trail → Deploy".

---

### D3. `orbita-de-satelites`

**Conceito no roteiro**: "rodeado por", "orbitando", "constelação
de funcionalidades".

**Imagem mental**: núcleo central com satélites visualmente
"orbitando" — não estáticos. Sentido de DINAMISMO em volta de um
âncora. Diferente de `rede-com-no-central` pelo motion contínuo
(órbita real).

**Solução visual concreta**:
- **Layout**: centro fixo + satélites em posições circulares.
  Satélites podem ter idle motion (drift em arco lento).
- **Cores**: idem rede-com-no-central, mas satélites podem ter
  variação de tom para sugerir profundidade (alguns mais perto,
  outros mais longe).
- **Motion**: satélites entram em stagger radial, depois fazem
  drift contínuo lento (`breathe` em ângulo). Centro pulsa
  levemente.
- **Texto e ícones**: similar ao central-spotlight; ênfase no
  motion idle distintivo.

**Quando usar**: vídeos sobre ecossistema ativo, plataforma com
módulos vivos, sensação de "sistema em funcionamento contínuo".

**Quando NÃO usar**: quando você quer foco estático (vira
`central-spotlight-with-satellites` sem orbita). Quando precisa
de leitura rápida (orbit motion distrai em vídeos <5s).

**Implementação aproximada**: PARCIAL — usar
`central-spotlight-with-satellites` e adicionar `idleBreathe` em
cada satélite com phases diferentes para sugerir orbit. Sem
orbit real (sem rotação angular).

**Exemplo concreto**: Bullets sobre ecossistema de produto —
centro "Plataforma" + satélites "API", "SDK", "Docs", "Community"
em drift contínuo.

---

### D4. `ecossistema-distribuido`

**Conceito no roteiro**: "todos conectados", "rede peer-to-peer",
"sem hierarquia", "mesh".

**Imagem mental**: vários nós espalhados pelo quadro, conectados
entre si por linhas múltiplas (não passa por um centro). Sentido
de HORIZONTALIDADE.

**Solução visual concreta**:
- **Layout**: 4-6 nós em posições não-radiais (alguns no canto,
  outros no meio, sem hub). Linhas conectando pares de nós em
  rede irregular.
- **Cores**: nós uniformes em accent `primary`; linhas finas em
  white com baixa opacidade.
- **Motion**: nós entram em stagger não-uniforme (sensação de
  rede emergindo). Linhas desenham-se depois, par a par.
- **Texto e ícones**: cada nó com ícone + label curto.

**Quando usar**: vídeos sobre redes descentralizadas, comunidades,
peer-to-peer.

**Quando NÃO usar**: quando há centro semântico (vira
`rede-com-no-central`). Quando a relação é sequencial (vira
`pipeline-temporal`).

**Implementação aproximada**: NOVA — sem componente. Archetype
`mesh-network` aceitando lista de nós + lista de conexões. SVG-
heavy. Não-trivial.

**Exemplo concreto**: Bullets sobre comunidade dev Luby — 6 nós
de "skills" distribuídos com conexões cruzadas, sem hub central.

---

### D5. `ramificacao-em-arvore`

**Conceito no roteiro**: "1 vira N", "fork", "uma raiz, várias
folhas", "decisão branches".

**Imagem mental**: estrutura tipo árvore deitada ou em pé, com
raiz/tronco e ramos que se abrem em folhas. Sentido de DERIVAÇÃO
ordenada.

**Solução visual concreta**:
- **Layout**: estrutura hierárquica em duas opções: (a)
  horizontal — raiz à esquerda, ramos à direita; (b) vertical —
  raiz no topo, ramos descendo. 1-2 níveis de ramificação.
- **Cores**: raiz em accent `bright` (a "fonte"); ramos em accent
  `primary`; folhas em accent `primary` mais claro.
- **Motion**: raiz entra, ramos desenham-se da raiz pra fora,
  folhas aparecem nas pontas dos ramos. Sequência fundamental.
- **Texto e ícones**: raiz com label maior; folhas com label
  curto + ícone opcional.

**Quando usar**: estruturas hierárquicas, organogramas curtos,
"a partir de X você pode chegar a Y, Z, W".

**Quando NÃO usar**: quando não há raiz comum (vira
`feature-grid`). Quando os ramos têm relação entre eles (vira
`ecossistema-distribuido`).

**Implementação aproximada**: NOVA — sem componente. Archetype
`tree-branching` com SVG para os ramos. Complexidade média.

**Exemplo concreto**: Bullets explicativo "Claude → Sonnet, Opus,
Haiku" com raiz "Claude" e 3 ramos para os modelos.

---

## Seção E — Foco e Hierarquia

### E1. `spotlight-no-escuro`

**Conceito no roteiro**: "destaque", "o que importa de verdade",
"abre o foco", "olha para isso".

**Imagem mental**: tela quase toda escura, com uma área iluminada
no centro destacando UM elemento. Vinheta forte em volta.

**Solução visual concreta**:
- **Layout**: 1 elemento centralizado (texto, ícone ou card).
  Background com vinheta radial forte saindo do centro
  (transparente no centro → preto nas bordas).
- **Cores**: elemento central em white + accent bright. Background
  vinheta surface0 escurecendo agressivamente nas bordas.
- **Motion**: vinheta aparece junto com o elemento. Elemento
  mask-up. Glow do elemento respira.
- **Texto e ícones**: elemento único + label curto ou frase muito
  curta.

**Quando usar**: pivot dramático onde UMA coisa precisa ser
absorvida sozinha. Stat de "olha só esse número".

**Quando NÃO usar**: quando há mais de 1 elemento importante
(vinheta competiria). Cenas longas (claustrofobia visual).

**Implementação aproximada**: PARCIAL — combinação de elemento
existente (ícone, big-stat) + AbsoluteFill com gradiente radial
forte. Pode virar archetype `spotlight-vignette` se virar
recorrente.

**Exemplo concreto**: Stat de vídeo "60% menos vulnerabilidades":
"60%" gigante no centro com vinheta agressiva, resto da tela
quase preto.

---

### E2. `statement-tipografico-gigante`

**Conceito no roteiro**: "uma palavra carrega tudo", "tese em uma
frase", "soco verbal".

**Imagem mental**: tela inteira é uma palavra/frase curta. Sem
ícone, sem decoração. Tipografia É a mensagem.

**Solução visual concreta**:
- **Layout**: texto centralizado horizontal e vertical. Ocupa
  praticamente toda a tela útil.
- **Cores**: texto white com glow brand sutil ("lit by
  atmosphere"). Background normal premium.
- **Motion**: 3 variantes — mask-up, word-by-word stagger,
  letterspacing-settle.
- **Texto e ícones**: SOMENTE texto, 1-6 palavras.

**Quando usar**: Hook curto de tese, pivot, statement final
declarativo.

**Quando NÃO usar**: vídeos calmos / expositivos (statement
gigante é declarativo). Frases longas.

**Implementação aproximada**: EXISTE — `giant-statement` archetype
(Wave 3) com 3 reveal variants.

**Exemplo concreto**: Hook do smoke-test: "Variação." em 240px.

---

### E3. `zoom-progressivo`

**Conceito no roteiro**: "do macro para o detalhe", "vista geral →
foco", "zoom-in semântico".

**Imagem mental**: começa com visão ampla (muitos elementos
pequenos, paisagem), termina em close-up de UM elemento (um detalhe
ocupando a tela). Motion É escala.

**Solução visual concreta**:
- **Layout**: 2-3 estados de escala. Estado 1: visão ampla com 10+
  elementos minúsculos. Estado 2: subset visível maior. Estado 3:
  1 elemento grande.
- **Cores**: estado 1 todos em paleta mono; estado 3 com accent
  bright + bloom.
- **Motion**: motion contínuo de scale-up (pode ser de 0.3 → 1.0).
  Outros elementos com opacity-down conforme zoom avança. O
  elemento central mantém-se firme enquanto o resto sai.
- **Texto e ícones**: estado 1 ícones genéricos; estado 3 ícone
  protagonista + label.

**Quando usar**: vídeos explanatórios que partem do "todo" para
"específico". Beat narrativo "agora vamos olhar de perto".

**Quando NÃO usar**: vídeos curtos (zoom precisa de tempo).
Quando o elemento final NÃO veio do estado amplo (descontínuo).

**Implementação aproximada**: NOVA — sem componente. Archetype
`progressive-zoom` aceitando lista de elementos e índice do
"foco". Complexidade alta no Motion.

**Exemplo concreto**: Hook "de toda a indústria de software, olha
para um detalhe que mudou tudo": estado 1 com 30 logos pequenos →
zoom-in em "AI agents" → close-up de ícone Sparkles + label.

---

### E4. `destaque-em-meio-aos-outros`

**Conceito no roteiro**: "o nosso brilha", "1 vibrante + N
apagados", "a exceção no padrão".

**Imagem mental**: row ou grid de elementos uniformes EXCETO um
que é maior, mais brilhante, mais vivo. Sentido de DISTINÇÃO
imediata.

**Solução visual concreta**:
- **Layout**: row horizontal de N cards (5-7), todos `compact`, 1
  deles em `feature` size. Mesma posição visual mas o destaque é
  maior e mais brilhante.
- **Cores**: cards normais em accent `deep` apagado, card
  destaque em accent `bright` com bloom.
- **Motion**: todos os cards entram em stagger uniforme; o
  destaque pulsa idleBreathe após estabelecer.
- **Texto e ícones**: cards normais com ícone minúsculo + label
  curto; destaque com ícone grande + label + caption.

**Quando usar**: posicionamento "somos a exceção", competitive
landscape onde a Luby brilha entre genéricos.

**Quando NÃO usar**: comparativo binário (vira
`dualidade-split-screen`). Quando os "outros" não são relevantes
(vira `giant-statement`).

**Implementação aproximada**: EXISTE — variante de
`concept-row` com `highlight` em 1 item + cards normais em
`size: 'compact'`. Hoje o highlight automaticamente vira 'feature',
outros viram 'standard' — pode ajustar.

**Exemplo concreto**: Stat de "n consultorias, 1 método" — row de
7 cards (6 logos genéricos cinza + 1 Luby bright maior).

---

### E5. `apagar-tudo-menos-um`

**Conceito no roteiro**: "esquece tudo menos isso", "tudo desbota,
só X importa".

**Imagem mental**: cena começa com vários elementos visíveis em
paleta normal. Em algum momento, todos os elementos perdem cor /
brilho / opacidade EXCETO UM, que ganha protagonismo absoluto.

**Solução visual concreta**:
- **Layout**: layout multi-elementos normal (row, grid, etc).
  Mid-scene, todos exceto um aplicam filtro grayscale +
  opacity-down. O escolhido ganha bloom.
- **Cores**: estado 1 paleta normal; estado 2 apagados em gray500
  + protagonista em accent bright com glow.
- **Motion**: motion principal é o desbote progressivo dos outros
  + reforço do escolhido. Pode ser sequencial (desbota um por
  um) ou simultâneo.
- **Texto e ícones**: labels dos apagados ficam visíveis mas
  fracos; label do protagonista pode ganhar caption nova.

**Quando usar**: pivot narrativo onde "tudo isso importa, mas se
você lembrar de UMA coisa, é essa". Beat de simplificação.

**Quando NÃO usar**: quando todos os elementos PERMANECEM
relevantes (vira `central-spotlight`). Quando o destaque é
inicial (vira `destaque-em-meio-aos-outros`).

**Implementação aproximada**: NOVA — sem componente. Archetype
`fade-all-but-one` com timeline de desbote + pulse-up do
protagonista.

**Exemplo concreto**: Bullets de vídeo "5 capacidades, mas se você
lembrar de uma": 5 ícones → 4 apagam → "Contexto de domínio"
permanece bright.

---

## Seção F — Profundidade e Camadas

### F1. `iceberg`

**Conceito no roteiro**: "o que se vê vs o que sustenta", "a ponta
do iceberg", "superfície vs profundidade", "trabalho invisível".

**Imagem mental**: linha horizontal divide o quadro em duas zonas
(acima da água, abaixo da água). Pequena porção acima visível,
porção muito maior abaixo "submersa". A proporção É o argumento.

**Solução visual concreta**:
- **Layout**: linha horizontal aproximadamente em 30% da altura.
  Acima da linha: 1-2 elementos visíveis (a parte exposta).
  Abaixo da linha: 3-5 elementos "submersos" em tom mais escuro.
- **Cores**: linha em white com glow leve (representa o "nível da
  água"). Acima: paleta normal. Abaixo: paleta atenuada
  (`whiteA40` em vez de white pleno; `blueDeep` em vez de blue).
- **Motion**: elementos acima entram primeiro (o "visível"
  conhecido), depois a linha desenha-se, depois os submersos
  aparecem com leve fade (revela "o que está embaixo").
- **Texto e ícones**: acima com labels normais; abaixo com labels
  + ícones pequenos.

**Quando usar**: vídeos sobre trabalho invisível, complexidade
oculta de processos, "o que parece simples mas requer".

**Quando NÃO usar**: quando não há relação de "expor" entre os
dois conjuntos (vira `dualidade-split-screen`). Quando a parte
visível é igual à invisível (não há iceberg).

**Implementação aproximada**: NOVA — sem componente. Archetype
`iceberg-revelation` com layout 30/70 + linha horizontal +
elementos em cada zona. Não-trivial mas factível.

**Exemplo concreto**: Bullets "o que você vê no produto vs o que
está por trás": acima "App rápido"; abaixo "Cache strategy",
"DB indexing", "CDN edge", "Connection pooling".

---

### F2. `camadas-de-cebola`

**Conceito no roteiro**: "vamos descascar", "camada por camada",
"o que está por baixo", "abre essa caixa-preta".

**Imagem mental**: círculos concêntricos (ou caixas concêntricas)
sendo removidas uma a uma, revelando o núcleo. Sentido de
DESVELAMENTO progressivo.

**Solução visual concreta**:
- **Layout**: estados sucessivos. Estado 1: círculo grande
  (camada externa). Estado 2: camada externa some, revela
  segunda camada. Estado N: núcleo central.
- **Cores**: cada camada tem cor brand ligeiramente diferente
  (blueDeep → blue → blueBright → núcleo bright). Ou inverso
  (camadas externas neutras, núcleo brand).
- **Motion**: camadas mais externas saem com scale-down + opacity
  drop, revelando a próxima. Cada camada tem ~2s de hold antes
  da próxima ser revelada.
- **Texto e ícones**: cada camada com label próprio descrevendo o
  que é. Núcleo com label diferenciado (a "verdade central").

**Quando usar**: vídeos didáticos / dev-insight que vão de
fenômeno superficial até causa raiz. Beats sobre análise em
profundidade.

**Quando NÃO usar**: quando o conceito não tem profundidade
genuína (vira `vertical-stack` ou `feature-grid`). Vídeos curtos
(2 camadas só talvez).

**Implementação aproximada**: NOVA — sem componente. Archetype
`onion-peel` com N camadas e timing fade. Não-trivial.

**Exemplo concreto**: Bullets "por que o deploy é lento" — Camada
1 "Build slow", Camada 2 "Tests slow", Camada 3 "DB migration",
Camada 4 (núcleo) "Schema sem index".

---

### F3. `vista-explodida`

**Conceito no roteiro**: "vamos abrir a caixa", "componentes que
montam isso", "anatomia do nosso sistema".

**Imagem mental**: produto/sistema visto inteiro inicialmente,
depois seus componentes "separam-se" no espaço (como diagrama
explodido de engenharia), cada componente flutuando com label
apontando.

**Solução visual concreta**:
- **Layout**: estado 1: 1 elemento composto centralizado. Estado
  2: componentes "voam" para fora em diferentes direções,
  mantendo conexão visual (linhas tracejadas) ao centro de
  origem.
- **Cores**: composto inicial em accent `bright`. Componentes
  pós-explosão em accent `primary`.
- **Motion**: composto entra, "explode" com cada componente
  movendo-se rapidamente para uma posição final ao redor.
  Linhas tracejadas desenham-se do centro pra cada componente.
- **Texto e ícones**: cada componente com label que aparece após
  chegar à posição final.

**Quando usar**: vídeos sobre arquitetura técnica, anatomia de
sistemas, "vamos abrir a caixa-preta".

**Quando NÃO usar**: quando não há relação composta entre os
elementos (vira `central-spotlight`). Quando o todo composto
não é relevante (só os componentes — vira `feature-grid`).

**Implementação aproximada**: NOVA — sem componente. Archetype
`exploded-view` com motion radial + linhas tracejadas. Não-trivial.

**Exemplo concreto**: Bullets sobre stack do produto — começa
com "App" no centro → explode em "Frontend", "API", "Database",
"Cache", "Queue" com linhas tracejadas conectando.

---

### F4. `transparencia-camadas-vidro`

**Conceito no roteiro**: "uma coisa em cima da outra", "sobreposição
de funcionalidades", "stack visível com transparência".

**Imagem mental**: 3-4 painéis de "vidro" empilhados com offset
diagonal pequeno, semi-transparentes, deixando ver o que está
embaixo através. Cada vidro contém um conceito.

**Solução visual concreta**:
- **Layout**: 3-4 cards transparentes (rgba whiteA10) com offset
  diagonal pequeno (10px X + 10px Y entre eles). Topo na frente.
- **Cores**: cards com border whiteA20 + backdrop-blur. Cada card
  com tom levemente diferente para legibilidade.
- **Motion**: cards entram do fundo pra cima em sequência. Idle
  breath sutil no topo.
- **Texto e ícones**: cada card com ícone + label + sublabel.
  Sublabel pode aparecer só no topo (legível).

**Quando usar**: arquitetura em layers que você quer mostrar
sobreposta (não vertical-stack tradicional). Estética glass-morphism.

**Quando NÃO usar**: quando precisa de leitura precisa de cada
camada (transparência atrapalha). Layouts simples.

**Implementação aproximada**: NOVA — pode ser feito hoje com
ConceptCard com `absolute` positioning + offset diagonal calculado.
Sem componente formal. Visualmente "premium" mas marginal em
clareza.

**Exemplo concreto**: Bullets sobre tech stack — vidros empilhados
"UI / API / Data / Infra" em offset, semi-transparentes.

---

## Seção G — Crescimento e Escala

### G1. `count-up-com-barra`

**Conceito no roteiro**: "x% menos", "5× mais", "número grande com
contexto", "comparação numérica visual".

**Imagem mental**: número grande animando count-up + barra
horizontal crescendo até proporção final. O par "número + barra" É
o conceito.

**Solução visual concreta**:
- **Layout**: número grande à esquerda (~50% do quadro), barras
  comparativas à direita (~40%). Caption abaixo do número.
- **Cores**: número em white com gradient brand. Barras: baseline
  em gray500 (1×), target em blueBright (Nx).
- **Motion**: número faz count-up de 0 ao valor final em ~30f.
  Barra target cresce em paralelo de 0% até ratio final.
- **Texto e ícones**: número + caption ("mais rápido", "menos
  bugs") + source line minúscula em mono.

**Quando usar**: Stat com comparação relativa, "3-5× mais rápido",
"60% menos".

**Quando NÃO usar**: número absoluto sem comparação (vira
`statement-tipografico-gigante` se for impactante, ou
`big-stat-typographic`).

**Implementação aproximada**: EXISTE — `big-stat` variante
`comparison-bars`.

**Exemplo concreto**: Stat do time-220-claude-code: "3-5×" + barras
1× (Sprints tradicionais) vs 4× (Modelo Luby).

---

### G2. `replicacao-progressiva`

**Conceito no roteiro**: "vira muitos", "se espalha", "todo mundo
agora usa", "viraliza".

**Imagem mental**: 1 ícone aparece, vira 2, vira 4, vira 16. A
replicação progressiva É o ponto. Diferente de
`expansao-progressiva` por focar no MESMO ícone replicando, não
crescimento exponencial abstrato.

**Solução visual concreta**:
- **Layout**: começa com 1 ícone centralizado, ícones replicados
  preenchem o quadro em layout grid ordenado.
- **Cores**: todos os ícones na mesma cor brand. Primeira geração
  pode ter glow para destacar a "fonte".
- **Motion**: 1 ícone entra com pop, depois replicas aparecem em
  stagger acelerando. Final pode ter pulse coletivo.
- **Texto e ícones**: ícones idênticos (Users multiplicando, ou
  Code multiplicando, ou Sparkles). Label numérico opcional
  ("1 → 220") ou caption abaixo.

**Quando usar**: adoção, escala, "todo mundo virou".

**Quando NÃO usar**: quando os elementos não são idênticos (vira
`expansao-progressiva` ou `feature-grid`).

**Implementação aproximada**: NOVA — sem componente. Archetype
`progressive-replication` com lista de gerações + stagger
acelerando. Não-trivial mas factível.

**Exemplo concreto**: Stat "1 dev usa Claude → 220 engenheiros
usam Claude": 1 Sparkles → 4 → 16 → 64 → 220 em grid expandindo.

---

### G3. `grafico-ascendente`

**Conceito no roteiro**: "crescimento ao longo do tempo", "linha
subindo", "trajetória positiva".

**Imagem mental**: gráfico de linha (line chart) clássico
desenhando-se da esquerda inferior para direita superior. Sentido
de TRAJETÓRIA temporal.

**Solução visual concreta**:
- **Layout**: gráfico ocupa centro do quadro. Eixo X com 3-5 marcos
  temporais embaixo, eixo Y opcional com 1-2 marcos. Linha
  ascendente entre os pontos.
- **Cores**: linha em blueBright com glow brand. Pontos em white.
  Eixos em white opacity 20%.
- **Motion**: linha desenha-se da esquerda pra direita
  progressivamente. Pontos pulsam ao serem alcançados.
- **Texto e ícones**: marcos temporais em mono pequeno; ponto
  final pode ter label de destaque.

**Quando usar**: stat sobre crescimento, ROI, evolução temporal.

**Quando NÃO usar**: dados sem dimensão temporal (vira `metric-grid`
ou `big-stat`). Dados não-monotônicos (vai subir e descer).

**Implementação aproximada**: NOVA — sem componente.
TimelineBlock chega perto mas é horizontal com markers, não
gráfico de linha real. Precisaria SVG com path animado.

**Exemplo concreto**: Stat "de 2020 a 2026": gráfico subindo de
"30 engineers" a "220 engineers" com pontos em 2020/2022/2024/2026.

---

### G4. `grade-que-se-expande`

**Conceito no roteiro**: "começamos com x produtos / clientes /
mercados, hoje temos muito mais", "expansão por preenchimento".

**Imagem mental**: grade pequena (2x2) aparece, depois células
adicionais preenchem ao redor formando grade maior (4x4, 6x6).
Sentido de OCUPAÇÃO de espaço.

**Solução visual concreta**:
- **Layout**: grid central. Começa com 4 cells iluminadas, depois
  cells em volta acendem progressivamente.
- **Cores**: cells em accent brand uniforme. Cells "originais"
  podem ter bloom mais forte; novas com bloom decrescente para
  sugerir profundidade.
- **Motion**: 4 cells entram com pop. Depois cells em volta
  acendem em rings concêntricos (segundo ring, terceiro ring).
- **Texto e ícones**: cells podem ser ícones genéricos ou apenas
  blocos de cor. Label tipográfico no canto.

**Quando usar**: stat sobre alcance, expansão de mercado, cobertura.

**Quando NÃO usar**: quando os elementos têm identidade
individual (vira `metric-grid` ou `feature-grid`).

**Implementação aproximada**: NOVA — sem componente. Archetype
`grid-expansion` com lista de cells + ordem de iluminação. Médio.

**Exemplo concreto**: Stat "expansão geográfica": grade 6x6 com
celulas representando estados/países acendendo progressivamente.

---

## Seção H — Reviravolta e Quebra

### H1. `ruptura-do-padrao`

**Conceito no roteiro**: "tudo seguia X, MAS aí vem Y", "padrão
estabelecido é quebrado", "reviravolta".

**Imagem mental**: cena estabelece visual A com ritmo previsível
por alguns segundos, então um elemento DIFERENTE entra rompendo o
padrão estabelecido. A ruptura É o conceito.

**Solução visual concreta**:
- **Layout**: cena 1 com elementos uniformes (row, grid) em ritmo
  estabelecido. Em algum frame, novo elemento entra fora do
  layout (centro grande, atravessando, vindo de outro plano).
- **Cores**: elementos do padrão em accent `primary` uniforme;
  elemento disruptor em accent `bright` ou outra cor contrastante
  (sempre dentro da paleta brand).
- **Motion**: padrão estabelecido tem motion uniforme calmo;
  disruptor entra com motion VIOLENTO (escala 0→1.3→1, ou
  translate explosivo) que quebra o ritmo.
- **Texto e ícones**: padrão pode ser quase sem texto (visual);
  disruptor traz label/frase forte.

**Quando usar**: pivot dramático onde a TESE quebra o senso
comum. Beats narrativos de "mas espera...".

**Quando NÃO usar**: vídeos sem ruptura (vira variantes de
comparação). Vídeos curtos onde não há tempo de estabelecer
padrão (2-3s para padrão + 1-2s para ruptura).

**Implementação aproximada**: NOVA — sem componente direto.
Composição manual: 2 cenas justapostas, segunda quebrando ritmo
da primeira. Pode ser feito hoje com Transição abrupta entre
2 SceneSpecs.

**Exemplo concreto**: Hook de vídeo "n consultorias fazem X" — 3s
mostrando row apagado de logos genéricos, súbito flash + scale
explosivo do logo Luby entrando do canto sobreposto.

---

### H2. `glitch-narrativo`

**Conceito no roteiro**: "espera, isso não está certo", "interrupção
súbita", "tudo para".

**Imagem mental**: cena tem motion fluido, súbito glitch visual
(flash, shake, distortion frame) interrompe; após o glitch a cena
muda completamente.

**Solução visual concreta**:
- **Layout**: igual ao `reset-clean-slate` mas com efeito GLITCH
  no momento de transição (chromatic aberration, frame stutter,
  flash branco quebrado).
- **Cores**: cena 1 paleta normal. Glitch: flash branco / ciano
  rapido. Cena 2 paleta nova.
- **Motion**: glitch tem duração curtíssima (3-6 frames).
  Sensação de "sistema travou e reiniciou".
- **Texto e ícones**: cena 1 pode ter texto que "sai pelo
  glitch"; cena 2 entra com texto novo limpo.

**Quando usar**: pivot narrativo PROVOCATIVO ("aí vem o twist").
Vídeos com tom mais agressivo / ousado.

**Quando NÃO usar**: vídeos institucionais calmos. Premium
uniforme — glitch pode ler como "vídeo bugou".

**Implementação aproximada**: PARCIAL — TransitionFlash pode ser
customizado com cor mais alta, mas sem chromatic aberration
verdadeiro. Componente novo `GlitchTransition` poderia ser
adicionado se a estética encaixar.

**Exemplo concreto**: Hook de vídeo provocativo — cena calma com
"todos fazem o mesmo" → glitch súbito → cena nova "menos nós."

---

### H3. `inversao-de-eixo`

**Conceito no roteiro**: "o que estava em cima vai pra baixo", "o
prioritário virou secundário", "papéis invertidos".

**Imagem mental**: elementos posicionados em eixo (esquerda ↔
direita, ou topo ↔ base), e em algum momento eles TROCAM de
posição visivelmente, mantendo identidade. Sentido de INVERSÃO de
hierarquia.

**Solução visual concreta**:
- **Layout**: 2 estados com layout espelhado. Estado 1: elemento
  A à esquerda (proeminente), B à direita. Estado 2: B à
  esquerda, A à direita.
- **Cores**: elementos mantêm cor própria. O que ganha "centro do
  palco" recebe boost de brilho.
- **Motion**: motion de SWAP — ambos os elementos translateX em
  sentidos opostos, passando um pelo outro. Pode ter pequeno
  glow no cruzamento.
- **Texto e ícones**: labels acompanham movimento. Pode haver
  label novo emergindo após o swap ("estes papéis se inverteram").

**Quando usar**: vídeos sobre mudança de paradigma onde os
elementos antigos persistem mas em nova hierarquia.

**Quando NÃO usar**: quando um elemento DESAPARECE (vira
`metamorfose` ou `reset-clean-slate`). Quando não há eixo
hierárquico (vira outros).

**Implementação aproximada**: NOVA — sem componente. Archetype
`axis-inversion` com 2 estados + motion de swap. Médio.

**Exemplo concreto**: Hook "produtividade individual era o
diferencial; agora é operação": cards "Produtividade Individual"
no centro + "Operação" na borda → swap → "Operação" no centro +
"Produtividade Individual" na borda.

---

### H4. `quebra-da-quarta-parede`

**Conceito no roteiro**: "vamos falar reto com você", "estamos
nesse vídeo juntos", "olha pra mim".

**Imagem mental**: elemento (geralmente texto/avatar) vira-se
diretamente para a câmera/espectador, quebrando o "ele dentro do
vídeo" para "ele conversando com você".

**Solução visual concreta**:
- **Layout**: pode ser um ícone (Eye), avatar, ou texto que
  emerge centralizado encarando o espectador.
- **Cores**: elemento em accent `bright` com glow forte para
  reforçar "agora atenção plena".
- **Motion**: elemento entra com pop ou mask-up. Idle breath
  marcando "está parado, olhando".
- **Texto e ícones**: frase declarativa direta ("Vamos ser
  honestos:"). Pode acompanhar ícone Eye.

**Quando usar**: vídeos personal mode (Cleidson ou colaborador
falando direto), pivots em vídeo corporate com confissão
deliberada de tom.

**Quando NÃO usar**: vídeos institucionais frios. Vídeos sem
tom de confidência.

**Implementação aproximada**: PARCIAL — `giant-statement` com
acompanhamento de Icon `eye` em layout específico. Sem
componente formal.

**Exemplo concreto**: Hook de vídeo personal — `Eye` icon + "Vamos
falar reto:" + transição para o conteúdo.

---

### H5. `loop-fechado-na-narrativa`

**Conceito no roteiro**: "voltamos pro começo", "círculo se fecha",
"a tese inicia e termina no mesmo lugar".

**Imagem mental**: visual da Intro reaparece no CTA mas
transformado (agora "completo", "iluminado", "resolvido"). Repete
elemento de abertura como gancho de fechamento.

**Solução visual concreta**:
- **Layout**: idêntico ao da Intro, MAS com elementos adicionais
  ou tratamento visual reforçado.
- **Cores**: paleta da Intro + boost de brilho/saturação.
- **Motion**: re-entrada lenta do mesmo visual; idle breath mais
  forte.
- **Texto e ícones**: mesma tagline da Intro, agora com caption
  ou underline.

**Quando usar**: vídeos com arco fechado, CTA que faz callback à
Intro para coesão narrativa.

**Quando NÃO usar**: vídeos onde Intro e CTA têm conceitos
diferentes (caso normal).

**Implementação aproximada**: EXISTE — composição manual no
spec: CTA repete blocks da Intro com pequenas variações
(closing-card no lugar de tagline).

**Exemplo concreto**: Vídeo time-220-claude-code — Intro abre
"O modelo operacional Luby"; CTA fecha "Conheça o modelo Luby".
Mesma palavra-âncora.

---

## Resumo por seção

| Seção | Metáforas | Existem hoje | Parciais | Novas |
|---|---|---|---|---|
| A — Comparação e Contraste | 6 | 2 | 1 | 3 |
| B — Composição e Soma | 5 | 1 | 1 | 3 |
| C — Transformação e Mudança | 5 | 0 | 1 | 4 |
| D — Conexão e Sistema | 5 | 2 | 1 | 2 |
| E — Foco e Hierarquia | 5 | 1 | 1 | 3 |
| F — Profundidade e Camadas | 4 | 0 | 0 | 4 |
| G — Crescimento e Escala | 4 | 1 | 0 | 3 |
| H — Reviravolta e Quebra | 5 | 1 | 2 | 2 |
| **TOTAL** | **39** | **8** | **7** | **24** |

39 metáforas. 8 existem com componente direto, 7 são parciais
(precisam de polimento ou composição manual), 24 são propostas
novas (requerem archetype/componente novo no futuro).

---

## Como o Diretor Criativo usa este catálogo

1. **Lê o roteiro e estratégia**. Identifica conceitos-chave por
   cena (dualidade, composição, transformação, foco, etc).

2. **Abre a seção correspondente**. Lê 2-3 metáforas candidatas
   nessa seção.

3. **Compara**: qual delas casa melhor com este roteiro
   específico? Considera tom, audiência, vídeos anteriores
   (memória entre runs).

4. **Escolhe UMA**. Documenta no storyboard:
   - `chosen`: nome canônico da metáfora
   - `alternatives_considered`: as outras 1-2 que ele pesou
   - `reasoning`: por que essa serve melhor

5. **Aterriza em arquétipo**. Só agora pensa em qual `archetype`
   do `agents/archetypes.md` realiza essa metáfora. Em alguns
   casos a metáfora pede archetype novo (documentar em Notes para
   Motion Designer).
