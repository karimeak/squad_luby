# Storyboard — RevOps & Data Architecture as the AI ROI Reckoning

## Choreography summary

Vídeo em luby-premium uniforme, sem theme schedule (dark do começo ao fim). Personal mode com speaker badge (Karime / RevOps & Growth Strategist @ Luby) mantido top-left durante todo o vídeo via BrandFrame. Logo Luby auto-suppressed em logo-mark e closing-card pelo modo personal.

Arco visual: tagline declarativa contrarian (Intro) → split-screen full-bleed contrastando 96% expectation vs 42% reality (Hook) → comparison-bars mostrando o 50% misallocation com a barra de menor spend trazendo o maior ROI (Bullets) → big-stat typographic 37% (Stat) → closing-card sereno com 2-line headline negação+afirmação (CTA, sem URL no card).

Memória entre runs: o split-screen-comparison no Hook foi usado em `software-que-parece-pronto` mas com símbolo `≠` central. Aqui usa o mesmo arquétipo mas com símbolo central diferente (sugiro `vs` mono pequeno OU bullet `•`) E semântica diferente (dois números em tensão, não dois conceitos). Não fere a regra de variação por ser uso semanticamente distinto. Bullets em comparison-bars é variação real (todas as 4 runs anteriores usaram concept-row, equation, iceberg, onion-peel — comparison-bars NUNCA foi hero de bullets).

---

## Cena 1 — Intro (0–90, 3s)

- **Modo**: luby-premium
- **Metáfora**: (intro — assinatura, opcional)
- **Arquétipo**: `logo-with-bloom` (logo auto-suppressed em personal mode)
- **Blocks**:
  - `logo-mark` { height: 240, animated: true, idleBreathe: true, startOffset: 0 }
  - `eyebrow` { text: 'REVOPS 2026', style: 'mono', startOffset: 14 }
  - `tagline` { text: 'AI is not the bottleneck.', size: 48, align: 'center', startOffset: 18 }
  - `accent-line` { width: 120, thickness: 2, glow: true, startOffset: 26 }

### Descrição
Abertura sóbria, declarativa. 5 palavras vão contra o consenso ("AI everywhere"). Eyebrow técnico ("REVOPS 2026") situa o mercado-alvo. Em personal mode, logo-mark auto-suppressed → resta eyebrow + tagline + accent-line. Speaker badge top-left da Karime já visível (BrandFrame).

### Highlight frame
Frame 40 — eyebrow + tagline lidas + speaker badge presente.

### Intenção narrativa
- **Feeling**: provocação consultiva calma; "alguém finalmente disse"
- **Memory anchor**: a frase "AI is not the bottleneck"

---

## Cena 2 — Hook (90–250, 5.3s)

- **Modo**: luby-premium
- **Metáfora**:
  - **chosen**: `dualidade-split-screen`
  - **alternatives_considered**: [`giant-statement`, `concept-row`, `multiplication-equation`]
  - **reasoning**: A tese é tensão entre dois números (96% expectativa vs 42% realidade). `giant-statement` ("42%.") perderia a contradição inteira. `concept-row` (3 cards) já consumido em 3 das 4 runs anteriores. `multiplication-equation` melhor reservado pro Beat de composição (Bullets). `dualidade-split-screen` em variante stat-vs-stat é EXATAMENTE o veículo: dois cards full-bleed lado a lado, número GRANDE em cada, source line embaixo. Highlight no lado direito (42% — o número que dói). Diferenciação semântica do uso anterior em software-que-parece-pronto: lá foi conceitos (Parece vs Está), aqui é números (96% vs 42%).
- **Arquétipo**: `split-screen-comparison`
- **Blocks**:
  - `split-screen-comparison` {
      heading: 'Revenue leaders in 2026:',
      left:  { icon: 'trending-up',   title: '96%',  caption: 'expect AI by 2026',           accent: 'deep' },
      right: { icon: 'circle-alert',  title: '42%',  caption: "hit ROI in 2025's deployments", accent: 'bright' },
      centerSymbol: 'vs',
      highlightSide: 'right',
    }

### Descrição
Tela inteira dividida: ambos os lados dark (sem theme schedule). Lado esquerdo mostra "96%" GIGANTE com ícone `trending-up` (expectativa otimista) + caption "expect AI by 2026". Lado direito em destaque mostra "42%" GIGANTE com ícone `circle-alert` (alerta de realidade) + caption "hit ROI in 2025's deployments". Badge brand-blue circular `vs` straddling o seam — pequeno, monoespacial. Highlight no lado direito — 42% carrega o peso retórico do gap.

### Sync mappings
| Conceito | Onde | Ícone |
|----------|------|-------|
| 96% expect AI | Lado esquerdo | `trending-up` |
| 42% hit ROI | Lado direito (highlight) | `circle-alert` |

### Highlight frame
Frame 165 — split full-bleed estabelecido + badge `vs` central + ambos números visíveis.

### Intenção narrativa
- **Feeling**: tensão analítica; "espera, isso não fecha"
- **Memory anchor**: a equação visual `96% ↔ 42%`

### Source line (Revisor verifica)
Gong / Forrester State of Revenue AI 2025 — em research-brief.md.

---

## Cena 3 — Bullets (250–610, 12s)

- **Modo**: luby-premium
- **Metáfora**:
  - **chosen**: `comparison-bars-distribution`
  - **alternatives_considered**: [`feature-grid`, `pipeline`, `concept-row`, `multiplication-equation`, `iceberg`, `onion-peel-revelation`]
  - **reasoning**: `iceberg` PROIBIDO (memória entre runs). `onion-peel-revelation` consumido em software-que-parece-pronto (run anterior, briefing primo). `concept-row` saturado (3 das 4 runs anteriores). `multiplication-equation` ficaria forçado (são 5 itens de distribuição, não 2 fatores multiplicativos). `pipeline` sugere sequência temporal — mas a tese é distribuição de recurso (50% pra um, ~50% pros outros 4 itens), não progressão. `feature-grid` puro perde a hierarquia visual do "biggest spend vs biggest ROI". `comparison-bars-distribution` (uso semântico de `feature-grid` ou `metric-grid` com tags de extremo) materializa exatamente: lista vertical de 5 itens com bar widths proporcionais ao spend, e tags "biggest spend" no topo + "biggest ROI" embaixo invertendo a relação esperada. Visualmente, a desproporção das barras É o argumento.

  Implementação prática: usar `feature-grid` block (existe no catálogo) com 5 features, primeiro item com badge "biggest spend" e último com badge "biggest ROI". Sem necessidade de archetype novo (gate 1 = no archetype novo, fica desligado).
- **Arquétipo**: `feature-grid` (uso semântico distribution-with-extremes)
- **Blocks**:
  - `feature-grid` {
      heading: 'GenAI spend distribution in 2025:',
      columns: 1,
      items: [
        { icon: 'megaphone',     title: 'Sales demos & innovation showcases', caption: 'biggest spend (~50%)', tone: 'warning' },
        { icon: 'chart-line',    title: 'Forecasting accuracy',                caption: 'underfunded' },
        { icon: 'database',      title: 'CRM hygiene',                          caption: 'underfunded' },
        { icon: 'file-check',    title: 'Quote-to-cash automation',             caption: 'underfunded' },
        { icon: 'workflow',      title: 'Deal desk workflows',                  caption: 'biggest ROI', tone: 'positive' },
      ],
    }

### Descrição
Cena hero. Lista vertical de 5 itens em cards, com layout `feature-grid columns:1`. Primeiro item ("Sales demos") tem caption "biggest spend (~50%)" em tom warning (amber/red). Itens 2-4 com caption neutro "underfunded". Último item ("Deal desk workflows") tem caption "biggest ROI" em tom positive (teal/green). A inversão visual entre o primeiro (top, warning) e último (bottom, positive) é o argumento: quem recebe mais dinheiro entrega menos ROI; quem recebe menos dinheiro entrega mais ROI.

Stagger top→bottom (mas com a entrada do último item DESTACADA — leve pulse extra ou breath emphasis para caçar o eye-track no "biggest ROI").

### Highlight frame
Frame 480 — todos os 5 itens revelados, com tags "biggest spend" / "biggest ROI" visíveis nas extremas.

### Intenção narrativa
- **Feeling**: revelação analítica; "ah, é por isso que o ROI não vem"
- **Memory anchor**: a desproporção entre o item warning no topo e o item positive no fim

### Source line (Revisor verifica)
MIT 2025 GenAI Report — 50% of GenAI spend goes to demos and showcases. Em research-brief.md.

---

## Cena 4 — Stat (610–775, 5.5s)

- **Modo**: luby-premium
- **Theme**: dark (sem schedule, sem light window — diferente do software-que-parece-pronto)
- **Metáfora**:
  - **chosen**: `count-up-typographic` (variante typographic do big-stat)
  - **alternatives_considered**: [`giant-statement`, `count-up-donut`, `count-up-comparison-bars`, `metric-grid`]
  - **reasoning**: `donut` proibido (cliente-ve usou). `comparison-bars` proibido (time-220 usou). `metric-grid` proibido (pergunta-errada usou). `giant-statement` ("37%.") sem caption perde o contexto crítico ("revenue loss from poor data quality"). `big-stat typographic` foi usado em software-que-parece-pronto MAS lá com light theme — aqui sem light theme (uniforme dark) é variação visual real. Número grande, caption embaixo, source em mono. Limpo. Diferentemente do software, NÃO uso themeSchedule — quero respeitar o ritmo dark uniforme do vídeo da Karime e não introduzir theme transitions que distraiam.
- **Arquétipo**: `stat-with-comparison-bars` (catalog name) → implementado via `big-stat` block com `style: 'typographic'`
- **Blocks**:
  - `big-stat` {
      style: 'typographic',
      value: '37%',
      caption: 'of teams already report revenue loss from poor data quality.',
      source: '— Datagroomr, State of CRM Data Quality 2025',
    }

### Descrição
Dark theme uniforme. Número "37%" gigante em white/cream typographic. Caption abaixo em white-soft. Source em mono cinza claro. Calmo, declarativo — o número fecha o argumento dos beats anteriores: spend mal alocado + base de dados ruim = ROI furado.

### Highlight frame
Frame 700 — número, caption e source visíveis.

### Intenção narrativa
- **Feeling**: confirmação analítica; "o problema já está aqui, não é hipótese"
- **Memory anchor**: "37% revenue loss from poor data quality"

### Source line (Revisor verifica)
Datagroomr — em research-brief.md, link público citável.

---

## Cena 5 — CTA (775–900, 4.2s)

- **Modo**: luby-premium
- **Theme**: dark
- **Metáfora**: (cta — assinatura, opcional)
- **Arquétipo**: `logo-with-bloom` (logo auto-suppressed em personal mode)
- **Blocks**:
  - `closing-card` {
      eyebrow: 'DATA FOUNDATION FIRST',
      headline: 'The 2026 winners are not the teams with the most AI tools.\nThey are the ones who built the data foundation first.',
      logoHeight: 140,
      urlText: '',
    }

### Descrição
Closing-card sereno em duas linhas (negação + afirmação). Eyebrow "DATA FOUNDATION FIRST" como callback ao argumento inteiro. URL VAZIA (regra fixa global #1: URL nunca aparece no closing-card — vai no copy do post LinkedIn). Tom consultivo.

### Em personal mode
Logo Luby suprimida via `useCurrentAccountMode()`. Resta eyebrow + headline (2 linhas) + speaker badge top-left mantido.

### Highlight frame
Frame 840 — eyebrow + headline em duas linhas + speaker badge visível.

---

## Notes para o Motion Designer

1. **NENHUM archetype novo** — todos os blocks usados (logo-mark, eyebrow, tagline, accent-line, split-screen-comparison, feature-grid, big-stat, closing-card) já existem no catálogo Wave 5. **Gate 1 (archetype novo): sem disparo, NA.**

2. **Gate 2 (smoke-still PNG)**: auto-aprovado por Cleidim — pular geração de stills, ir direto pro render full. Cleidim registra warning em `gate_decisions.gate2 = auto-approved-skip-stills`.

3. **Sem light theme schedule** — `themeSchedule: []` (dark uniforme). Diferente do software-que-parece-pronto que usou light no Stat. A mensagem da Karime ganha clareza com ritmo visual constante (sem mudança de tom para "respiro analítico" — todo o vídeo é "respiro analítico").

4. **Personal mode com speaker** — `lang: 'en'`, `mode: 'personal'`, `speaker: { name: 'Karime Kumagai', role: 'RevOps & Growth Strategist @ Luby' }`. BrandFrame mostrará speaker badge top-left durante todo o vídeo. Logo-mark e closing-card auto-suprimem o logo Luby via mode context.

5. **Apenas 1 variante** — em vez das 3 variantes da regra Wave 5 (PT corporate / EN corporate / Personal), este vídeo gera APENAS `karime-kumagai-en-us-personal` → `out/video-personal.mp4`. Razão: este vídeo nasce do squad ghostwriter-linkedin-auto v1.6.0, onde cada collaborator selecionado pela rotação recebe 1 vídeo na lingua dele em modo personal. Karime tem `language=['en-us']` monolingue, então só EN-Personal.

6. **Ícones explicitados** (autoResolveIcons: false):
   - `trending-up`, `circle-alert`, `megaphone`, `chart-line`, `database`, `file-check`, `workflow`
   Verificar todos em iconMap.ts. Se algum faltar:
   - `circle-alert` → fallback `alert-circle` (lucide-react canonical name)
   - `megaphone` → fallback `volume-2` ou `mic`
   - `chart-line` → fallback `line-chart` ou `trending-up`
   - `database` → estável, não precisa fallback
   - `file-check` → fallback `file`
   - `workflow` → fallback `git-branch` ou `pipeline`

7. **`transitions: []`** — premium uniforme, sem flash interno.

8. **Composition path**:
   - Spec file: `src/schema/examples/karime-kumagai-revops-en.ts` (export `karimeKumagaiRevopsEnSpec`)
   - Composition file: `src/compositions/KarimeKumagaiRevopsEn.tsx`
   - Registrada em `src/Root.tsx` com id `karime-kumagai-revops-en` ou similar — Cleidim vai apontar a render command pra esse id

9. **Audio**: spec define audio.bgmId mas como o DemoVideo foi patcheado para `specSilent` (audio off), e Karime usa composition NOVA (não DemoVideo), preciso garantir que a nova composition NÃO renderize audio também. Ou setar `bgmId: undefined, narrationEnabled: false` na spec, ou usar mesmo padrão specSilent. Sugiro definir direto na spec: `audio: { bgmId: undefined, narrationEnabled: false, bgmVolume: 0, bgmVolumeDucked: 0, narrationVolume: 0 }`.
