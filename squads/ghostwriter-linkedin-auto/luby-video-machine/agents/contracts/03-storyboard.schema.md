# Contrato 03 — Storyboard

**Quem produz**: Diretor Criativo
**Quem consome**: Motion Designer (instruções de execução)
**Arquivo gerado**: `agents/runs/{run-id}/03-storyboard.md`

**Atualização 2026-05**: storyboard agora declara explicitamente os
**block kinds** que cada cena vai usar, refletindo a arquitetura
schema-driven do projeto. O Motion Designer mapeia 1:1 storyboard →
spec.

---

## Schema

```yaml
type: object
required:
  - choreography_summary
  - scenes
  - notes_for_motion_designer
  - variation_intent
properties:
  choreography_summary:
    type: string
    description: |
      Overview de 1 parágrafo do "feel" do vídeo e como as cenas se conectam.

  scenes:
    type: array
    length: 5  # tipicamente, mas pode variar com briefing
    items: SceneObject

  notes_for_motion_designer:
    type: array of string
    description: |
      Decisões técnicas importantes, armadilhas, e CRUCIALMENTE:
      - blocos novos que o storyboard pede e que não existem ainda
      - ícones que precisam ser adicionados ao iconMap.ts

  variation_intent:
    type: object
    required: [previous_archetypes, varied_axis, reasoning]
    description: |
      Memória entre runs. Diretor lê os 3 storyboards mais recentes
      antes de produzir este e varia conscientemente em pelo menos
      um eixo. Veja seção "Memória visual de runs anteriores" da
      persona 03.
    properties:
      previous_archetypes:
        type: array of string
        description: "Arquétipos usados pelos últimos 3 vídeos, em cenas-chave"
      varied_axis:
        type: string
        description: "Qual eixo este storyboard variou (arquétipo X, ritmo, modo, layout)"
      reasoning:
        type: string
        description: "Por que essa variação faz sentido pra este vídeo"

SceneObject:
  type: object
  required:
    - name
    - mode
    - archetype
    - blocks
    - description
    - layout
    - choreography
    - highlight_frame
    # `metaphor` é obrigatório SOMENTE para cenas-chave do miolo:
    # name ∈ {hook, bullets, bullets-1, bullets-2, ..., stat}.
    # Para name ∈ {intro, cta} continua opcional. A validação dessa
    # regra condicional é responsabilidade do agente Diretor — o
    # contrato apenas documenta a expectativa.
  properties:
    name:
      type: enum
      values: [intro, hook, bullets, stat, cta]
      description: "Pode ter mais (e.g. bullets-2, proof) se vídeo for mais longo"

    mode:
      type: enum
      values: [luby-premium, luby-minimal]

    archetype:
      type: string
      enum:
        # Lista canônica em agents/archetypes.md. Sempre escolha um
        # destes — não invente fora do catálogo. Se precisar de
        # arquétipo novo, propor adição via Notes para Motion Designer.
        - horizontal-3-cards-connected
        - split-screen-comparison
        - vertical-stack
        - quadrante-2x2
        - central-spotlight-with-satellites
        - giant-statement
        - equation-visual
        - sentence-with-syncs
        - stat-with-comparison-bars
        - timeline-vertical
        - logo-with-bloom        # usado em Intro/CTA premium
      description: |
        Identificador do arquétipo visual desta cena. Use SEMPRE um dos
        arquétipos catalogados em agents/archetypes.md. Princípio "uma
        cena = um arquétipo": misturar dois numa mesma cena costuma
        virar visual confuso — splitar em duas cenas é melhor.

    metaphor:
      # OBRIGATÓRIO para cenas-chave do miolo (hook, bullets,
      # bullets-N, stat). Opcional para intro/cta (assinaturas de
      # marca). Documenta o RACIOCÍNIO CRIATIVO que precede a
      # escolha do arquétipo: que imagem visual conceitual traduz o
      # roteiro? Ver agents/metaforas.md e persona 03 seção
      # "Raciocínio metafórico".
      type: object
      required: [chosen, alternatives_considered, reasoning]
      properties:
        chosen:
          type: string
          description: |
            Nome canônico kebab-case de uma metáfora de
            agents/metaforas.md (ex: 'dualidade-split-screen',
            'equacao-visual', 'iceberg'). Se for proposta nova
            (não catalogada), o reasoning deve declarar isso
            explicitamente e justificar por que as 39 metáforas
            existentes não servem.
        alternatives_considered:
          type: array of string
          description: |
            Outras 1-2 metáforas catalogadas que foram pesadas e
            descartadas. Diretor NUNCA escolhe a primeira metáfora
            que viu — sempre considera alternativas e justifica
            o trade-off.
          min_items: 1
          max_items: 3
        reasoning:
          type: string
          description: |
            Por que a metáfora escolhida serve MELHOR às alternativas
            consideradas, neste roteiro específico. Considera: tom
            do roteiro, audiência, memória entre runs (qual metáfora
            os 3 vídeos anteriores usaram), fit narrativo. Não é
            burocracia — é o pensamento criativo do Diretor.

    blocks:
      type: array
      items:
        type: object
        properties:
          kind:
            type: enum
            values:
              # Premium-friendly
              - logo-mark
              - eyebrow
              - tagline
              - accent-line
              - closing-card
              # Conteúdo / explicação
              - sentence-with-syncs
              - concept-row
              - pipeline
              - multiplication-equation
              - big-stat
              # Wave 2 (B2B)
              - metric-grid
              - feature-grid
              - quote
              - logo-row
              - timeline
          essential_props:
            type: object
            description: |
              Props mínimas para o Motion Designer preencher.
              Ex (big-stat): { style: 'donut', value: '40%', caption: '...' }
              Ex (concept-row): { items: [{ icon: 'Sparkles', label: 'IA' }, ...] }
          start_offset:
            type: integer | null
            description: "Frame relativo ao enter da cena. Se null, default da cena."
          position:
            type: object | null
            description: "Se posicionado absolutamente, { x, y, centered }. Se null, flui."

    description:
      type: string
      description: "1-2 parágrafos: narrativa da cena, o que deve fazer sentir"

    layout:
      type: object
      properties:
        background: string
        primary_block_id: string
        ordering: string  # "logo top, eyebrow, tagline below"
        margins: string
      description: "Onde mora cada bloco no quadro 1920x1080"

    sync_mappings:
      type: array
      items:
        type: object
        properties:
          keyword_pt: string
          keyword_en: string
          icon_lucide: string  # nome no iconMap (validar contra src/schema/iconMap.ts)
          size_px: integer
          position: string  # "above-word", "beside-word", "replacing-word"
          enter_behavior: enum [pop, draw, slide, fade, swap]
          exit_behavior: enum [pop-out, fade-out, swap, slide-out]
      description: |
        Apenas para cenas com sentence-with-syncs.
        REGRA: nunca usar autoResolveIcons. Sempre explicitar ícone.

    choreography:
      type: array
      items:
        type: object
        properties:
          block_id: string
          enter_frame_absolute: integer | null  # ou usar startOffset
          exit_frame_absolute: integer | null
          easing_enter: enum [enter, enterSoft, enterCrisp, emphasis, swift, punch]
          easing_exit: enum [exit, exitSoft, swift]
      description: "Timing de cada bloco. Prefira offset relativo a frame absoluto."

    highlight_frame:
      type: integer
      description: |
        Frame da TIMELINE que, se pausado, vira screenshot memorável.
        Use `npx remotion still` neste frame para validar antes do render.

    narrative_intent:
      type: object
      properties:
        feeling: string  # "tensão", "alívio", "curiosidade"
        memory_anchor: string  # "o que o espectador deve lembrar"
```

## Formato do arquivo

```markdown
# Storyboard — {título da run}

## Choreography summary
{parágrafo de overview}

---

## Cena 1 — Intro
- **Modo**: luby-premium
- **Arquétipo**: `logo-with-bloom`
- **Frames**: 0–90 (3s @ 30fps)
- **Blocks**:
  - `logo-mark` { variant: 'white' }
  - `eyebrow` { text: 'Engenharia + IA' }
  - `tagline` { text: 'O que muda com 220 + Claude' }

### Descrição
{narrativa}

### Layout
- **Background**: BackgroundAtmosphere com hero=true (default do mode)
- **Ordering**: logo centro, eyebrow acima, tagline abaixo
- **Margens**: generosas, foco no centro

### Coreografia
| Block | Enter offset | Exit | Easing in | Easing out |
|-------|--------------|------|-----------|------------|
| logo-mark | 0 | 60 | enter | exit |
| eyebrow | 14 | 60 | enterSoft | exit |
| tagline | 18 | 60 | enter | exit |

### Highlight frame
Frame 35: logo plenamente revelado com halo azul respirando.

### Intenção narrativa
- **Feeling**: autoridade calma
- **Memory anchor**: associação visual com a marca Luby

---

## Cena 2 — Hook
- **Modo**: luby-premium (mistura uniforme se vídeo curto)
- **Metáfora escolhida**: `sentence-with-syncs` (catalogada em
  agents/metaforas.md — Seção E)
  - **Alternativas consideradas**: `dualidade-split-screen`,
    `giant-statement`
  - **Justificativa**: roteiro pede pergunta provocativa com
    palavras-chave que ganham peso quando sincronizadas a
    ícones. Split-screen seria contraste binário (não cabe — a
    frase tem 3 keywords). Giant-statement seria 1 palavra
    apenas (perde a tensão da frase inteira). Sentence-with-
    syncs entrega a frase intacta + cada keyword ancorada
    visualmente.
- **Arquétipo**: `sentence-with-syncs`
- **Frames**: 90–250
- **Blocks**:
  - `sentence-with-syncs` { text: 'O que muda quando seu **time** tem 220 engenheiros + **Claude Code**?' }

### Descrição
{narrativa: pergunta provocativa visualizada com sync}

### Layout
- **Ordering**: frase centralizada, ícones substituindo keywords inline

### Sync mappings (palavra → ícone)
| Palavra PT | Palavra EN | Ícone (iconMap) | Tamanho | Posição | Enter | Exit |
|------------|------------|-----------------|---------|---------|-------|------|
| time | team | `Users` | 80 | replacing-word | pop | swap |
| Claude Code | Claude Code | `Code2` | 80 | replacing-word | pop | (none) |

### Coreografia
{tabela de timing}

### Highlight frame
Frame 180: pergunta completa visível + Users e Code2 nos dois pontos.

### Intenção narrativa
- **Feeling**: curiosidade, tensão produtiva
- **Memory anchor**: pergunta que fica martelando

---

## Cenas 3, 4, 5
{idem}

---

## Notes para o Motion Designer

1. {decisão técnica 1}
2. {ícone novo a adicionar no iconMap, se houver}
3. {bloco novo pedido, se houver — separadamente, NÃO embutido em cena}
4. {armadilha conhecida a evitar}

---

## Variação visual intencional

> **Obrigatório.** Esta seção fecha o storyboard documentando a
> memória entre runs. Ver "Memória visual de runs anteriores" da
> persona 03.

- **Arquétipos das 3 runs anteriores nas cenas-chave**:
  - {run anterior 1 — slug}: Hook=`...`, Bullets=`...`, Stat=`...`
  - {run anterior 2 — slug}: Hook=`...`, Bullets=`...`, Stat=`...`
  - {run anterior 3 — slug}: Hook=`...`, Bullets=`...`, Stat=`...`
- **Eixo variado nesta run**: {qual arquétipo / ritmo / modo / layout
  está diferente das anteriores}
- **Justificativa**: {por que essa variação faz sentido pra este
  vídeo específico — narrativa, audiência, briefing}
```

## Validações pelo Motion Designer

O Motion Designer pode pedir refinamento ao Diretor se:
- Bloco pedido não existe no catálogo (e não está flagged em notes)
- Timing impossível dentro da janela da cena
- Ícone Lucide especificado não existe no iconMap
- Inconsistência interna (ex: bloco com exit antes do enter)
- Pedido reintroduz BrandFrame / progress bar / cards compact sem
  razão narrativa explícita
