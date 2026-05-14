# Catálogo de arquétipos visuais

**Quem usa**: Diretor Criativo (escolhe arquétipo por cena), Motion
Designer (sabe qual componente em `src/renderer/archetypes/` ou
`src/renderer/blocks/` realiza cada arquétipo).

**Princípio**: uma cena = um arquétipo. O arquétipo é o nome
canônico da composição visual; o `archetype` declarado no contrato
03 deve ser SEMPRE um destes 10. Se um briefing pedir composição
genuinamente nova, propor adição ao catálogo via Notes para o Motion
Designer (não improvisar).

**Status**:
- **EXISTE**: arquétipo está completo via block(s) ou archetype
  component prontos.
- **PARCIAL**: peças existem mas precisam ser ajustadas / agregadas
  para virar arquétipo formal.
- **NOVO**: precisa ser implementado do zero em
  `src/renderer/archetypes/` na Fase 2.

---

## 1. `horizontal-3-cards-connected`

**Status**: PARCIAL (cards existem via `concept-row`; conectores
visuais entre cards não estão implementados — Diretor pode declarar
conectores nas notes e Motion adiciona se for o caso, ou o arquétipo
fica em sua versão atual sem conectores).

**Descrição visual**: 3 (até 5) cards horizontalmente alinhados,
cada um com ícone + título + caption. Um card pode ser marcado como
`highlight` — vira maior, em accent bright e entra por último para
carregar peso retórico. Heading opcional acima do row.

**Quando usar**:
- Hot-take com framing "A, B, mas existe C" (highlight = a virada).
- Comparação de 3 opções equivalentes.
- Sequência de fases curtas (sem flecha forte entre elas).
- Beats Hook ou Bullets onde a tese cabe em 3 conceitos.

**Quando NÃO usar**:
- Quando você quer 4+ itens equal-weight (use `grid-2x2`).
- Quando a relação é A × B = C (use `equation-visual`).
- Quando há flecha clara entre passos (use `pipeline` no
  `horizontal-3-cards-connected` quando os conectores forem
  semânticos, ou suba para `vertical-stack` se passos forem mais
  de 4).

**Blocks que compõem**: `concept-row` (já existe). Para versão com
conectores fortes entre cards: `pipeline` (start → stages → end).

**Variáveis de entrada (schema)**:
```ts
{
  archetype: 'horizontal-3-cards-connected',
  // o block real é concept-row ou pipeline
  block: ConceptRowBlock | PipelineBlock,
}
```

**Exemplo conceitual**: Beat Hook do vídeo "pergunta-errada-
outsourcing" — `[In-house] [Outsourcing] [Outro ângulo★]`, onde o
terceiro card é highlight e carrega a tese.

---

## 2. `split-screen-comparison`

**Status**: NOVO (Fase 2 prioridade 1).

**Descrição visual**: Quadro dividido em duas metades verticais
(50/50 ou 60/40 com hierarquia). Cada lado tem ícone hero + título +
caption. No centro, um símbolo de tensão (`vs`, `×`, `→`, `≠`) faz
ponte. Lados podem ter accents diferentes (deep vs bright) para
sinalizar protagonista. Mode-aware: premium tem glow no símbolo
central, minimal tem linha vertical sutil.

**Quando usar**:
- Antes vs depois (sem barras numéricas — só visual).
- Com IA vs sem IA, manual vs automatizado.
- Caminho A vs caminho B (decisão binária).
- Beat Bullets quando o vídeo é uma comparação tese-antítese.

**Quando NÃO usar**:
- Quando há 3+ opções (use `horizontal-3-cards-connected` ou
  `quadrante-2x2`).
- Quando a comparação precisa de números relativos (use
  `stat-with-comparison-bars`).
- Quando os dois lados são equivalentes sem tensão (use
  `vertical-stack` ou `feature-grid`).

**Blocks que compõem**: archetype novo monta dois blocks `concept`
internos lado a lado + símbolo central tipográfico.

**Variáveis de entrada (schema)**:
```ts
{
  kind: 'split-screen-comparison',
  left:  { icon: IconKey, title: string, caption?: string, accent?: 'primary'|'bright'|'deep' },
  right: { icon: IconKey, title: string, caption?: string, accent?: 'primary'|'bright'|'deep' },
  centerSymbol?: string,   // default 'vs'
  heading?: string,
  highlightSide?: 'left' | 'right' | 'none',
}
```

**Exemplo conceitual**: Beat Hook de um vídeo "manual ou agêntico?"
— `[Manual]  vs  [Agêntico★]`, ícones `Hand` e `Bot`, lado direito
com accent bright sinalizando virada.

---

## 3. `vertical-stack`

**Status**: NOVO (Fase 2 prioridade 2).

**Descrição visual**: Lista vertical de 3-6 itens. Cada item é uma
linha tipograficamente densa: ícone à esquerda (médio, ~48-64px) +
título grande + caption discreta. Stagger de entrada de cima para
baixo. Sem cards ao redor — texto puro com ícones, alinhamento à
esquerda. Densidade tipográfica é o ponto.

**Quando usar**:
- Lista de princípios, pilares, valores, capacidades.
- Beat Bullets quando o conteúdo é "N coisas que fazemos / sabemos /
  acreditamos".
- Quando 4+ itens não cabem em row horizontal sem ficar minúsculos.
- Quando o tom é declarativo / manifesto (não comparativo).

**Quando NÃO usar**:
- Quando os itens são paralelos sem hierarquia (use `feature-grid` ou
  `quadrante-2x2`).
- Para 2-3 itens (subaproveita o quadro vertical — prefere
  `horizontal-3-cards-connected`).
- Para sequência temporal (use `timeline-vertical`).

**Blocks que compõem**: archetype novo. Reutiliza `Icon` primitive +
tipografia de tokens. Não wrappa em ConceptCard (o ponto é texto
puro, não card).

**Variáveis de entrada (schema)**:
```ts
{
  kind: 'vertical-stack',
  items: Array<{
    icon: IconKey,
    title: string,
    caption?: string,
  }>,                       // 3-6 items
  heading?: string,
  align?: 'left' | 'center', // default 'left'
}
```

**Exemplo conceitual**: Beat Bullets de um vídeo "5 princípios da
nossa engenharia" — lista vertical com `Shield` Governança, `Eye`
Observabilidade, `Zap` Velocidade, `Brain` Contexto, `CheckCircle`
Compliance.

---

## 4. `quadrante-2x2`

**Status**: NOVO (Fase 2 prioridade 5).

**Descrição visual**: Matriz 2×2 com eixos NOMEADOS. Cada quadrante
tem ícone + título curto + caption. Eixo X tem 2 labels (extremos),
eixo Y tem 2 labels. Um quadrante pode ser highlight (o "ideal" /
"o nosso" / "o futuro"). Diferencia de `feature-grid` 2×2 porque os
eixos têm SEMÂNTICA (não é só layout estético).

**Quando usar**:
- Matriz tipo Eisenhower (urgente×importante).
- Mapa de posicionamento competitivo.
- Beat Bullets quando o conteúdo é "categorize as opções e veja
  onde nós estamos".
- Quando a tese exige eixos explícitos (sem eixos, perde sentido).

**Quando NÃO usar**:
- Quando os 4 itens são equal-weight sem eixo semântico (use
  `feature-grid`).
- Para 3 ou 5+ itens (use outro arquétipo).
- Quando a comparação é binária 1 vs 1 (use `split-screen-comparison`).

**Blocks que compõem**: archetype novo. Reutiliza `Icon` + ConceptCard
nos quadrantes; eixos são linhas + labels tipográficas.

**Variáveis de entrada (schema)**:
```ts
{
  kind: 'quadrante-2x2',
  axisX: { lowLabel: string, highLabel: string },   // "Lento" → "Rápido"
  axisY: { lowLabel: string, highLabel: string },   // "Caro" → "Barato"
  quadrants: {
    topLeft:     QuadrantSpec,
    topRight:    QuadrantSpec,
    bottomLeft:  QuadrantSpec,
    bottomRight: QuadrantSpec,
  },
  // QuadrantSpec: { icon: IconKey, title: string, caption?: string, highlight?: boolean }
  heading?: string,
}
```

**Exemplo conceitual**: Beat Bullets de um vídeo "onde estamos no
mercado?" — eixos "Especialização" × "Velocidade", 4 categorias de
players, quadrante superior-direito (alta especialização + alta
velocidade) é highlight.

---

## 5. `central-spotlight-with-satellites`

**Status**: NOVO (Fase 2 prioridade 3).

**Descrição visual**: Conceito-âncora no centro do quadro
(tipografia grande + ícone hero), com 3-5 satélites orbitando ao
redor (ícones menores + label curto). Satélites entram com stagger
radial (não linear). O centro é o protagonista; os satélites são
consequência / contexto / componentes. Pode ter linhas finas
conectando centro a cada satélite.

**Quando usar**:
- Beat Bullets quando há um conceito-mãe e várias derivações.
- Hub-and-spoke: plataforma central + integrações.
- Capacidade central + benefícios em volta.
- Pivô conceitual (algo no meio do qual tudo orbita).

**Quando NÃO usar**:
- Quando há hierarquia linear (use `vertical-stack` ou `pipeline`).
- Quando os satélites são equal-weight sem centro (use `quadrante-2x2`
  ou `feature-grid`).
- Em vídeos minimalistas onde radial polui (prefira `vertical-stack`).

**Blocks que compõem**: archetype novo. Centro: ConceptCard size
'feature' ou typografia hero. Satélites: ícones + labels tipográficos
em layout radial (cálculo de posições por ângulo).

**Variáveis de entrada (schema)**:
```ts
{
  kind: 'central-spotlight-with-satellites',
  center: { icon: IconKey, title: string, caption?: string },
  satellites: Array<{
    icon: IconKey,
    label: string,
  }>,                       // 3-5 satellites
  heading?: string,
  showConnectors?: boolean, // default true
}
```

**Exemplo conceitual**: Beat Bullets de um vídeo sobre o modelo
operacional Luby — centro `Brain` "AI-augmented engineering"; satélites
`Shield` Governança, `FileCheck` Compliance, `Zap` Velocidade,
`Users` Contexto.

---

## 6. `giant-statement`

**Status**: NOVO (Fase 2 prioridade 4).

**Descrição visual**: Uma palavra ou frase curta (até ~6 palavras)
ocupando praticamente toda a tela. Tipografia gigantesca (≥160px),
peso bold/semibold, alinhamento centralizado. Motion mínimo:
mask-reveal por palavra OU letterspacing settle. Sem ícone, sem card,
sem decoração. O peso visual É a mensagem.

**Quando usar**:
- Beat Hook quando a tese cabe em uma palavra forte ("Obsoleto.").
- Beat Stat quando o número não é o ponto, a frase é.
- Pivot dramático no meio do vídeo.
- "Soco no estômago" tipográfico.

**Quando NÃO usar**:
- Quando há mais de uma ideia (cabe só UMA frase).
- Quando o vídeo tem tom calmo/expositivo (statement gigante é
  declarativo — não casa com explicação).
- Como cena longa (>4s — vai cansar).

**Blocks que compõem**: archetype novo. Reutiliza tipografia de
tokens + MaskReveal.

**Variáveis de entrada (schema)**:
```ts
{
  kind: 'giant-statement',
  text: string,                       // 1-6 palavras
  size?: number,                      // default 200
  weight?: 'semibold' | 'bold' | 'black',
  reveal?: 'word-by-word' | 'mask-up' | 'letterspacing-settle',
  accent?: 'white' | 'bright' | 'deep',
}
```

**Exemplo conceitual**: Beat Hook curto de um vídeo "Outsourcing
está obsoleto" — tela inteira diz `Obsoleto.` em ~240px, palavra
revelada via mask-up, fica 2.5s, exit.

---

## 7. `equation-visual`

**Status**: EXISTE (`multiplication-equation`).

**Descrição visual**: Equação visual com 3 slots: A op1 B op2 C. Cada
slot pode ser ícone+label OU número grande. Operadores (`×`, `=`,
`→`) são tipograficamente oversized (~140px). Eyebrow opcional acima.
Cards de slot têm tamanho 'feature' (default do projeto).

**Quando usar**:
- "Humans × AI = output".
- "Velocidade × Contexto = Diferencial".
- Beat Bullets quando a tese é a multiplicação de fatores.
- Quando o resultado é o protagonista (slot direito = highlight).

**Quando NÃO usar**:
- Quando os fatores não se multiplicam (são apenas listados).
- Quando o resultado é binário (use `split-screen-comparison`).
- Quando há mais de 2 fatores (não cabe — máx A × B = C).

**Blocks que compõem**: `multiplication-equation` (já existe).

**Variáveis de entrada (schema)**:
```ts
// Já existe no schema atual:
{
  kind: 'multiplication-equation',
  left:   EquationSlot,    // icon-label ou number
  right:  EquationSlot,
  result: EquationSlot,
  op1?: string, op2?: string, eyebrow?: string,
}
```

**Exemplo conceitual**: Beat Bullets do vídeo "time-220-claude-code"
— `[Users 220] × [Bot agents] = [3-5×★]`.

---

## 8. `sentence-with-syncs`

**Status**: EXISTE (`sentence-with-syncs`).

**Descrição visual**: Frase tokenizada palavra a palavra, entrando
com stagger temporal (6f minimal, 8f premium). Palavras-chave
designadas recebem ícone Lucide acima/abaixo/inline e cor accent
brand. Não-keywords ficam em white. Centralizado por padrão.

**Quando usar**:
- Beat Hook quando a frase é a star + ícones reforçam keywords.
- Pergunta provocativa visualizada.
- Statement com sync palavra-imagem em 2-4 keywords.
- Funciona muito bem em luby-minimal (uso original do block).

**Quando NÃO usar**:
- Frases longas (>15 palavras) — vira leitura cansativa.
- Quando os ícones competem com a frase (>4 keywords sincronizadas).
- Quando a frase tem palavras-chave PT que confundem auto-resolver
  (ex: "time" → Clock em vez de Users) — sempre explicitar `icon`,
  nunca `autoResolveIcons: true`.

**Blocks que compõem**: `sentence-with-syncs` (já existe).

**Variáveis de entrada (schema)**:
```ts
// Já existe:
{
  kind: 'sentence-with-syncs',
  text: string,
  syncs?: Array<{ word: string, icon: IconKey | 'none', placement?: 'above'|'below'|'inline-right' }>,
  size?: number,
  align?: 'center' | 'left',
  wordStaggerFrames?: number,
}
```

**Exemplo conceitual**: Beat Hook hipotético — `"Como **acelerar**
com **IA** sem perder **segurança**?"` com `Zap` / `Sparkles` /
`ShieldCheck` em sync.

---

## 9. `stat-with-comparison-bars`

**Status**: EXISTE (`big-stat` variante `comparison-bars`).

**Descrição visual**: Número grande à esquerda (~320px) + duas barras
horizontais à direita: baseline (cinza, pré-preenchida) e target
(brand blue, anima 0 → ratio). Caption abaixo do número, source em
mono pequeno. Variantes irmãs no mesmo block: `donut` (radial), e
`typographic` (sem decoração).

**Quando usar**:
- Beat Stat quando o número precisa de prova relativa (não absoluta).
- "3-5× mais rápido que sprints tradicionais".
- "60% menos vulnerabilidades".
- Variante `donut`: para porcentagens isoladas com peso visual.
- Variante `typographic`: quando o número é tão forte que não precisa
  decoração.

**Quando NÃO usar**:
- Quando há 2+ números (use `metric-grid`).
- Quando o número é descritivo, não comparativo (use
  `typographic`).
- Quando a comparação é categórica, não quantitativa (use
  `split-screen-comparison`).

**Blocks que compõem**: `big-stat` com variantes (já existe).

**Variáveis de entrada (schema)**:
```ts
// Já existe:
{
  kind: 'big-stat',
  value: string,        // "3-5×", "60%"
  caption: string,
  source?: string,
  style?: 'comparison-bars' | 'donut' | 'typographic',
  comparisonBars?: { baseline: {label, ratio}, target: {label, ratio} },
}
```

**Exemplo conceitual**: Beat Stat do vídeo "time-220-claude-code" —
`3-5×` + caption + barras 1× (sprints tradicionais) vs 4× (Modelo
Luby).

---

## 10. `timeline-vertical`

**Status**: NOVO (mas FORA do escopo da Fase 2 — fica para próxima
iteração, conforme briefing). Documentado aqui para o catálogo ficar
completo e o Diretor poder propor essa composição em Notes para
Motion Designer caso pertinente.

**Descrição visual**: Eixo vertical descendo a tela, com markers
(círculos preenchidos) em pontos cronológicos. Cada marker tem
timestamp à esquerda (mono pequeno) + ícone (médio) + label (médio)
+ caption (pequena, opcional) à direita. Stagger de cima para baixo.
Um event pode ser highlight (marker maior + brand accent).

**Quando usar**:
- Histórico / evolução (3-6 marcos).
- Roadmap (passado → presente → futuro).
- Beat dedicado a contar trajetória.
- Quando timeline-horizontal não cabe (5+ events, ou textos longos).

**Quando NÃO usar**:
- Quando há ≤4 events curtos (use `timeline` horizontal existente).
- Para sequência de processo (use `pipeline` horizontal).
- Para hierarquia atemporal (use `vertical-stack`).

**Blocks que compõem**: a implementar em iteração futura. Reutilizaria
linha vertical SVG + `Icon` + tipografia de tokens.

**Variáveis de entrada (schema futuro)**:
```ts
{
  kind: 'timeline-vertical',
  events: Array<{
    when: string,
    what: string,
    caption?: string,
    icon?: IconKey,
    highlight?: boolean,
  }>,
  heading?: string,
}
```

**Exemplo conceitual**: Beat Bullets de um vídeo "20 anos de Luby" —
2005 fundada, 2014 primeiro Fortune 500, 2020 1000+ projetos, 2024
220+ engenheiros, 2026★ AI-augmented engineering.

---

---

## 11. `logo-with-bloom` (auxiliar — Intro / CTA)

**Status**: EXISTE (composição implícita das cenas Intro e CTA premium).

**Descrição visual**: Logo Luby centralizado com halo respirando +
eyebrow técnico acima + tagline declarativa abaixo + accent-line
decorativa fechando o bloco. É a composição-padrão para cenas de
ASSINATURA (Intro abre o vídeo, CTA fecha).

**Quando usar**:
- Beat Intro de qualquer vídeo corporate.
- Beat CTA quando substituído por `closing-card` que carrega URL.

**Quando NÃO usar**:
- No miolo do vídeo (não é arquétipo de conteúdo).

**Blocks que compõem**: `logo-mark` + `eyebrow` + `tagline` +
`accent-line` (Intro), ou `closing-card` (CTA).

**Variáveis de entrada**: textos do eyebrow/tagline/headline; URL
opcional no closing-card.

---

## Resumo de status

| # | Arquétipo | Status |
|---|---|---|
| 1 | `horizontal-3-cards-connected` | PARCIAL (concept-row sem conectores) |
| 2 | `split-screen-comparison` | EXISTE (Wave 3) |
| 3 | `vertical-stack` | EXISTE (Wave 3) |
| 4 | `quadrante-2x2` | EXISTE (Wave 3) |
| 5 | `central-spotlight-with-satellites` | EXISTE (Wave 3) |
| 6 | `giant-statement` | EXISTE (Wave 3) |
| 7 | `equation-visual` | EXISTE |
| 8 | `sentence-with-syncs` | EXISTE |
| 9 | `stat-with-comparison-bars` | EXISTE |
| 10 | `timeline-vertical` | NOVO — fora do escopo Wave 3 |
| 11 | `logo-with-bloom` | EXISTE (auxiliar Intro/CTA) |

**Wave 3 implementou**: 5 arquétipos novos em
`src/renderer/archetypes/` — `SplitScreenComparison`,
`VerticalStack`, `CentralSpotlight`, `GiantStatement`,
`Quadrante2x2`. Atalho rápido: cada um corresponde a um `kind` na
union `Block` e é despachado por `PremiumScene`/`MinimalScene`.
