# Storyboard — Software que parece pronto mas não está

## Choreography summary

Vídeo em premium uniforme com momento light theme breve durante o
Stat — primeiro vídeo real a usar `themeSchedule` desde o luby-demo
legacy. Decisão deliberada: o Stat (70%) vai ler como "respiro
analítico" — fundo light por 5.5s, voltando pra dark no CTA.

Arco visual: signature sóbria (Intro) → split-screen full-bleed
contrastando "parece pronto" vs "está pronto" (Hook) → descascamento
de camadas mostrando o que NÃO aparece (Bullets — HERO, archetype
novo) → número grande sereno em fundo light (Stat) → CTA premium
dark sereno.

Esse é o vídeo onde a memória entre runs força mais variação:
três das quatro runs anteriores caíram em concept-row no Hook;
duas das quatro caíram em iceberg ou metric-grid. Aqui zero
repetição.

---

## Cena 1 — Intro (0–90, 3s)
- **Modo**: luby-premium
- **Metáfora**: (intro — assinatura, opcional)
- **Arquétipo**: `logo-with-bloom`
- **Blocks**:
  - `logo-mark` { height: 240, animated, idleBreathe, startOffset: 0 }
  - `eyebrow` { text: 'DEFINITION OF DONE', style: 'mono', startOffset: 14 }
  - `tagline` { text: 'A definição de "pronto" mente.', size: 48, align: 'center', startOffset: 18 }
  - `accent-line` { width: 120, thickness: 2, glow: true, startOffset: 26 }

### Descrição
Abertura sóbria, declarativa. Eyebrow técnico em inglês ("DEFINITION
OF DONE" — termo que o CTO sênior conhece). Tagline em PT direta,
desconfortável. Logo respira sem ostentação.

### Highlight frame
Frame 40 — logo + eyebrow + tagline lidas.

### Intenção narrativa
- **Feeling**: reconhecimento desconfortável; "vou te dizer uma
  coisa que você já sabe"
- **Memory anchor**: a frase "A definição de pronto mente"

---

## Cena 2 — Hook (90–250, 5.3s)
- **Modo**: luby-premium
- **Metáfora**:
  - **chosen**: `dualidade-split-screen`
  - **alternatives_considered**: [`nos-vs-eles`, `giant-statement`]
  - **reasoning**: A tese é contraste binário entre dois "prontos"
    — não competitivo (descartado `nos-vs-eles`, que daria mais peso
    a um lado como "errado"). `giant-statement` ("Mente.") perderia
    a frase relacional inteira ("o que parece pronto não é o que
    está pronto"). `dualidade-split-screen` redesenhada na Wave 4
    (full-bleed dark/light, badge `≠` central) é o veículo perfeito
    do contraste categorial: lado esquerdo dark = "parece pronto"
    (escondido, ilusório), lado direito light = "está pronto" (claro,
    real). Bônus de variação: 3 das 4 runs anteriores usaram
    concept-row no Hook; split-screen full-bleed nunca apareceu em
    vídeo real (só smoke-test).
- **Arquétipo**: `split-screen-comparison`
- **Blocks**:
  - `split-screen-comparison` {
      heading: 'O que parece pronto ≠ o que está pronto.',
      left: { icon: 'eye', title: 'Parece pronto', caption: 'na review', accent: 'deep' },
      right: { icon: 'shield-check', title: 'Está pronto', caption: 'em produção', accent: 'bright' },
      centerSymbol: '≠',
      highlightSide: 'right',
    }

### Descrição
Tela inteira dividida: dark à esquerda + light à direita. Lado
esquerdo "Parece pronto" com ícone `eye` (o que se vê), lado direito
em destaque "Está pronto" com `shield-check` (o que sustenta). Badge
brand-blue circular `≠` straddling o seam. Highlight no lado direito
— o "está pronto" carrega o peso retórico.

### Sync mappings
| Conceito | Onde | Ícone |
|----------|------|-------|
| Parece pronto | Lado esquerdo | `eye` |
| Está pronto | Lado direito (highlight) | `shield-check` |

### Highlight frame
Frame 165 — split full-bleed estabelecido + badge `≠` central.

### Intenção narrativa
- **Feeling**: precisão analítica + reconhecimento ("ah, é isso
  que me morde")
- **Memory anchor**: a equação visual `parece ≠ está`

---

## Cena 3 — Bullets (250–610, 12s)
- **Modo**: luby-premium
- **Metáfora**:
  - **chosen**: `camadas-de-cebola`
  - **alternatives_considered**: [`vista-explodida`, `iceberg`]
  - **reasoning**: A tese aqui é DESVELAMENTO progressivo — começa
    com 1 item visível ("a feature funciona") e revela 7 camadas
    abaixo. `iceberg` PROIBIDO por memória entre runs (cliente-ve-
    time-entrega já usou como hero, mesmo briefing visual primo).
    `vista-explodida` (componentes separando) sugere "anatomia
    técnica" — perde o tom desconfortável-cumplíce. `camadas-de-
    cebola` é a metáfora exata do roteiro: "olha quanta camada
    abaixo do que você vê", revelada em descascamento sequencial.
    Status NOVO em metaforas.md (Seção F nunca tocada além de
    iceberg) — vai disparar gate de archetype novo no Motion Designer.

    Se o Motion não conseguir implementar archetype novo dentro
    da janela do teste (briefing diz "no checkpoints"), fallback
    aprovado: `vertical-stack` redesenhada (cards numerados, sem
    setas, da Wave 3) — perde a metáfora mas preserva legibilidade.
- **Arquétipo**: `onion-peel-revelation` (NOVO — proposta detalhada
  em Notes para Motion Designer abaixo)
- **Blocks**:
  - `onion-peel-revelation` {
      heading: 'O que sustenta o software:',
      visible: { icon: 'eye', label: 'A feature funciona' },
      layers: [
        { icon: 'shield-alert', label: 'Tratamento de erro completo' },
        { icon: 'gauge', label: 'Performance sob carga real' },
        { icon: 'shield-check', label: 'Segurança contra payload malicioso' },
        { icon: 'activity', label: 'Observabilidade pra debugar' },
        { icon: 'check', label: 'Testes de borda' },
        { icon: 'repeat', label: 'Migração sem perda' },
        { icon: 'circle-dashed', label: 'Rollback se quebrar' },
      ],
    }

### Descrição
Cena hero. Visualmente: 1 item visível no centro top com ícone (a
feature visível), e 7 camadas concentricas/empilhadas se revelando
ABAIXO em sequência. Cada camada tem ícone + label, entrando uma
por vez em stagger top→bottom. A desproporção 1 visível vs 7
invisíveis É o argumento.

### Highlight frame
Frame 480 — todas as 8 entidades reveladas (1 visível no topo + 7
camadas abaixo).

### Intenção narrativa
- **Feeling**: revelação cumulativa; "ah, é tudo isso que ele tá
  cuidando enquanto eu só vejo a tela"
- **Memory anchor**: a desproporção visual entre 1 visível e 7
  invisíveis (tipo iceberg, mas SEM iceberg)

---

## Cena 4 — Stat (610–775, 5.5s)
- **Modo**: luby-premium
- **Theme**: **light** (primeiro real video desde luby-demo a usar
  light theme schedule)
- **Metáfora**:
  - **chosen**: `count-up-com-barra` (variante typographic — sem
    barras)
  - **alternatives_considered**: [`giant-statement`, `count-up-donut`,
    `count-up-comparison-bars`]
  - **reasoning**: 70% é número intuitivo, não comparativo, não
    relativo a baseline. `comparison-bars` (time-220) e `donut`
    (cliente-ve) já foram usados em runs anteriores. `metric-grid`
    (pergunta-errada + how-we-apply) também. Donut especificamente
    seria proibido pela memória entre runs aqui. `giant-statement`
    puro (só "70%" em 240px) é tentador mas perde a caption
    explicativa. `count-up-com-barra` na variante typographic
    (que existe no `big-stat`) é a única não usada em vídeo real
    novo desde luby-demo: número grande, count-up animado, caption
    embaixo, source em mono. Limpo. Light theme reforça o "respiro
    analítico" depois da densidade do Bullets.
- **Arquétipo**: `stat-with-comparison-bars` (catalog name) →
  implementado via `big-stat` block com `style: 'typographic'`
- **Blocks**:
  - `big-stat` {
      style: 'typographic',
      value: '70%',
      caption: 'do trabalho que sustenta o software acontece DEPOIS da feature funcionar',
      source: '— Estimativa intuitiva, não auditada',
    }

### Descrição
Light theme: fundo off-white. Número "70%" gigante em navyDeep
(typographic do big-stat já lida com light theme). Caption abaixo
em navy. Source em mono cinza claro. Calmo, analítico — o respiro
do vídeo.

### Highlight frame
Frame 700 — número, caption e source visíveis.

### Intenção narrativa
- **Feeling**: respiro analítico; "vou te dar um número, sem dramatizar"
- **Memory anchor**: "70% do trabalho acontece DEPOIS"

---

## Cena 5 — CTA (775–900, 4.2s)
- **Modo**: luby-premium
- **Theme**: dark (volta ao normal — light era só a Stat)
- **Metáfora**: (cta — assinatura, opcional)
- **Arquétipo**: `logo-with-bloom`
- **Blocks**:
  - `closing-card` { eyebrow: 'ENGENHARIA HONESTA', headline: 'Veja como definimos "pronto".', logoHeight: 140, urlText: 'luby.co/definition-of-done' }

### Descrição
Closing-card sereno. Eyebrow "ENGENHARIA HONESTA" (callback à
postura desconfortável da Intro). Headline declarativa. URL.

### Em personal mode
A logo Luby do closing-card é automaticamente suprimida via
`useCurrentAccountMode()` — fica eyebrow + headline + URL. Comportamento
implementado na Wave 5 (regra das 3 variantes).

---

## Notes para o Motion Designer

1. **NOVO ARCHETYPE `onion-peel-revelation`** — disparar gate
   archetype-new (auto-aprovado pelo briefing "no checkpoints").

   **Proposta de interface**:
   ```ts
   interface OnionPeelRevelationBlock extends BlockBase {
     kind: 'onion-peel-revelation';
     heading?: string;
     visible: { icon: IconKey; label: string };
     layers: Array<{ icon: IconKey; label: string }>;  // 3-7
   }
   ```

   **Comportamento visual**:
   - Visible item no topo, com ícone hero + label grande
   - Layers EMPILHADAS verticalmente abaixo, cada uma como uma
     "camada" horizontal: ícone + label + linha sutil separadora
   - Stagger top→bottom: visible primeiro, layer 1 depois, layer 2,
     etc.
   - Cada camada entra com mask-reveal lateral (como descascar)
   - Fundo de cada camada com tom progressivamente mais escuro/profundo
     (sugere "mais fundo" conforme desce)
   - Sem cards 3D ou ilustração de cebola literal — é metáfora
     conceitual, materializada via stack vertical com peeling motion

   **Reuso**: Icon + MaskReveal (já existem). Layers usam
   theme tokens (não hardcode cor). Mode-aware via ThemeContext.

   **Complexidade estimada**: ~75 min (similar à iceberg-revelation
   da Wave 4).

   Se o tempo apertar e for melhor reutilizar archetype existente,
   fallback aprovado: `vertical-stack` redesenhada da Wave 3 (cards
   numerados sem setas). Perde a metáfora "descascamento" mas
   preserva a tese da desproporção.

2. **Light theme schedule** no Stat — primeira run real a usar
   `themeSchedule` em produção desde o luby-demo. Window: frames
   610-775 (cena Stat inteira).

3. **`transitions: []`** — premium uniforme, sem flash interno.
   O cross-fade do `LightOverlay` cuida da transição visual da
   Stat (THEME_FADE_FRAMES já implementa).

4. **Ícones explicitados** (autoResolveIcons: false):
   - `eye`, `shield-check`, `shield-alert`, `gauge`, `activity`,
     `check`, `repeat`, `circle-dashed`
   Verificar todos em iconMap.ts. `shield-alert` pode não existir
   — se não existir, fallback para `shield`.

5. **3 variantes obrigatórias** (regra Wave 5):
   - PT corporate → `software-que-parece-pronto-pt` → `out/video-pt.mp4`
   - EN corporate → `software-que-parece-pronto-en` → `out/video-en.mp4`
   - Personal (PT, sem speaker, sem branding Luby) →
     `software-que-parece-pronto-personal` → `out/video-personal.mp4`

   Tradução EN do roteiro está em `02-roteiro.md` — Motion Designer
   transcreve para o spec EN sem usar Google Translate. Decisões:
   - "Pronto" / "Done" — paralelismo com aspas em ambos os idiomas
   - "Parece pronto" → "Looks done" (verbo simples)
   - "Está pronto" → "Actually done" (advérbio sugere ênfase)
   - "Software que sustenta" → "Software that sustains" (literal funciona)

6. **Highlight frames priorizados (smoke-still gate)**:
   1. **Frame 480** (Bullets — onion-peel revelado, HERO + archetype novo)
   2. Frame 165 (Hook — split full-bleed estabelecido)
   3. Frame 700 (Stat — light theme)
   4. Frame 40 (Intro)
   5. Frame 860 (CTA)

---

## Variação visual intencional

**Arquétipos das 3 runs anteriores reais nas cenas-chave**:
- `time-220-claude-code`: Hook=concept-row highlight,
  Bullets=multiplication-equation, Stat=comparison-bars
- `pergunta-errada-outsourcing`: Hook=concept-row,
  Bullets-1=concept-row + Bullets-2=feature-grid 2×2,
  Stat=metric-grid 2 cards
- `cliente-ve-time-entrega`: Hook=iceberg, Bullets=iceberg,
  Stat=donut

**Eixos variados nesta run** (DOIS eixos por defesa do tema-primo):
- **Hook archetype**: `split-screen-comparison` (Wave 4 redesign,
  full-bleed) — primeira aparição em real marketing. Quebra
  3-de-4 cadência de concept-row.
- **Bullets metáfora + archetype**: `camadas-de-cebola` + `onion-
  peel-revelation` — Seção F (profundidade) tocada antes só por
  iceberg, e o iceberg foi explicitamente descartado por proximidade
  ao cliente-ve-time-entrega. Wave 5 nasce com archetype novo
  `onion-peel-revelation`.
- **Stat archetype**: `big-stat typographic` — variante existente
  desde luby-demo legacy, **nenhum vídeo real novo usou**. Limpo,
  sem barras/donut/grid (todas as outras 3 variantes esgotadas em
  runs anteriores).
- **Theme**: light theme schedule no Stat — primeira run real
  a usar desde luby-demo. Reforça o "respiro analítico".

**Justificativa**: este briefing é primo do `cliente-ve-time-entrega`
no conceito ("visível vs sustenta"). Sem disciplina deliberada, o
Diretor cai de novo em iceberg + concept-row e o vídeo vira
reciclagem. Variação em 4 eixos (Hook archetype + Bullets metáfora +
Bullets archetype novo + Stat variante + theme) garante identidade
distinta. Briefing autorizou o Diretor a mostrar raciocínio próprio
— este storyboard é o exercício desse raciocínio.
