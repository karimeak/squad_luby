# Luby Video Machine — Equipe de Agentes

Esta pasta define a **equipe de produção** da máquina de vídeos: 5 agentes
especializados que transformam um briefing bruto em um MP4 renderizado e
revisado.

## A equipe

```
[BRIEFING]
   │
   ▼
[01] Estrategista         Define audiência, mensagem única, formato, CTA, KPI
   │ (estratégia)
   ▼
[02] Roteirista           Escreve roteiro de 30s com palavras-chave marcadas
   │ (roteiro)
   ▼
[03] Diretor Criativo     Cria storyboard cena a cena com decisões visuais
   │ (storyboard)
   ▼
[04] Motion Designer      Implementa cenas em código Remotion
   │ (código + MP4)
   ▼
[05] Revisor              Valida técnica + retenção, devolve para correção se necessário
   │ (review)
   ▼
[ENTREGA: MP4 + metadados]
```

Cada agente:
- Tem **persona detalhada** em `personas/`
- Recebe input em formato definido em `contracts/`
- Devolve output em formato definido em `contracts/`
- Tem **exemplo preenchido** end-to-end em `templates/`

## Princípio diretor: MUITO VISUAL

Os vídeos da Luby para LinkedIn não são "texto bonito" — são **densamente
visuais**: diagramas, infográficos, ícones em sync com palavras-chave, cards,
fluxogramas, gráficos animados.

**Critério de aprovação do Revisor**: cada cena deve ter **no mínimo um elemento
visual além do texto puro** (ícone, card, diagrama, gráfico, linha, conector).
Cenas só-texto são rejeitadas.

## Princípio: VARIAÇÃO INTENCIONAL entre runs

Cada vídeo nasce sabendo o que os anteriores fizeram. Estrategista
e Diretor Criativo leem as runs mais recentes antes de produzir, e
devem variar conscientemente em pelo menos um eixo (formato, tom,
audiência, arquétipo visual, ritmo). Repetição só é aceitável quando
o briefing pede explicitamente.

Detalhes nas personas 01 e 03.

## Gates de qualidade no fluxo do Motion Designer

Dois pontos de aprovação humana foram introduzidos no fluxo do
Motion Designer para evitar degradação silenciosa de qualidade
quando o pipeline roda múltiplos vídeos. Os dois são leves
(custam minutos do humano, não horas) e ficam exatamente nos pontos
onde decisões caras se materializam:

### Gate 1 — Archetype novo (Passo 2.5 da persona 04)

Quando o Motion Designer identifica que o storyboard pede metáfora
cuja implementação exige archetype novo (não existe em
`src/renderer/archetypes/` nem `src/renderer/blocks/`), ele **PARA**
antes de implementar e abre uma pergunta de 3 opções:

- **(a)** Implementar archetype novo, com interface proposta e custo
- **(b)** Fallback para archetype existente, com perda visual descrita
- **(c)** Voltar ao Diretor (a metáfora foi forçada)

Custo: ~30s do operador. Garante que componentes novos entram no
codebase com aprovação consciente da interface (eles ficam
permanentes e afetam todos os vídeos futuros via memória entre runs).

### Gate 2 — Smoke-still antes do render full (Passo 4 da persona 04)

Antes de gastar ~2 min em render full + revisão de MP4 inteiro,
o Motion Designer renderiza **5 PNG stills** nos highlight frames
de cada cena (frame do screenshot memorável do storyboard) e **PARA**.

Operador abre os 5 stills (~3 min), confirma:

- **(a)** Ok, renderiza full
- **(b)** Ajustar antes — descreve problema, Motion corrige spec,
  regera stills, gate novamente
- **(c)** Refazer storyboard — algo conceitual errado, devolver ao
  Diretor

Custo: ~3 min do operador. Economiza tempo médio porque erros
descobertos em stills custam ajuste de spec + 1 still novo (~2 min),
versus erros descobertos no MP4 que custam ajuste + render full +
revisão (10+ min).

Ambos os gates são **registrados no implementation-notes** (contrato
04, campo `gate_decisions`) para servir de histórico calibrando
heurísticas futuras.

## Cérebro metafórico

O Diretor Criativo da máquina não escolhe layout direto a partir do
roteiro. Ele PENSA EM METÁFORA primeiro: que imagem visual traduz o
conceito do roteiro?

O catálogo de metáforas vive em `agents/metaforas.md`. Lá estão
documentadas 39 metáforas conceituais com suas soluções visuais
concretas, organizadas em 8 seções por tipo de conceito (Comparação,
Composição, Transformação, Conexão, Foco, Profundidade, Crescimento,
Reviravolta).

Para cenas-chave (Hook, Bullets, Stat), o storyboard DEVE declarar a
metáfora escolhida com justificativa (campo `metaphor` com `chosen`,
`alternatives_considered`, `reasoning`). Isso garante variação
visual entre vídeos e força raciocínio criativo no pipeline em vez
de queda mecânica em "vamos botar 3 cards".

**Fluxo de raciocínio do Diretor Criativo**:

1. **Metáfora** primeiro (`agents/metaforas.md`) — qual imagem visual
   traduz o conceito do roteiro?
2. **Arquétipo** depois (`agents/archetypes.md`) — como a metáfora
   vira tela?
3. **Blocks** por último (`src/schema/types.ts`) — peças concretas
   do arquétipo.

O Estrategista contribui com o campo opcional `core_concepts` na
estratégia (lista de 2-4 conceitos-chave) que aponta para a seção
correta do catálogo de metáforas — dica explícita pro Diretor.

## Catálogo de arquétipos visuais

A camada de "arquétipo" é como o Diretor Criativo escolhe a forma
visual de cada cena, antes de pensar nos blocks individuais. O
catálogo canônico fica em [archetypes.md](archetypes.md) (11
arquétipos: split-screen, vertical-stack, quadrante 2×2, central
spotlight, giant statement, equation, sentence-with-syncs,
comparison bars, timeline, logo-with-bloom, etc).

**Princípio "uma cena = um arquétipo"**: cada `SceneSpec` declara um
campo `archetype`. Misturar dois arquétipos numa mesma cena costuma
virar visual confuso — splitar em duas cenas (ambas premium, sem
flash entre elas) é melhor.

Implementação dos arquétipos novos (Wave 3 — 2026-05) vive em
`src/renderer/archetypes/`. Os arquétipos já existentes via blocks
(equation-visual, sentence-with-syncs, stat-with-comparison-bars,
horizontal-3-cards-connected, logo-with-bloom) continuam em
`src/renderer/blocks/` mas são referenciados pelo mesmo nome
canônico no contrato 03.

## Os 5 papéis em uma frase

| # | Papel | Entrega |
|---|-------|---------|
| 01 | Estrategista | Define POR QUÊ e PARA QUEM |
| 02 | Roteirista | Define O QUE (palavras na tela) |
| 03 | Diretor Criativo | Define COMO (visuais, motion, layout) |
| 04 | Motion Designer | Implementa COMO em código |
| 05 | Revisor | Garante que tudo está PRONTO PRA PUBLICAR |

O Motion Designer usa a skill oficial `remotion-best-practices` para
padrões técnicos do framework. Detalhes e regra de prioridade na
persona 04.

## Regras fixas globais (post-mortem 2026-05)

Regras que pegam **todos** os vídeos a partir desta data, fixadas
após o post-mortem do `software-que-parece-pronto`. Os agentes
01–05 e o renderer já as enforce:

1. **URL nunca aparece no closing-card**, em nenhuma variante. URL
   vai no copy do post LinkedIn, não na tela. O renderer ignora
   `urlText` mesmo se o spec antigo trouxer. — ver persona 04
   "Armadilhas técnicas".
2. **Stat sempre com fonte pública citável**. CISQ, DORA, NIST,
   Stripe research, Octoverse, papers acadêmicos com referência.
   Estimativas e "70% segundo o setor" são reprovadas. — ver
   persona 02 "Estatística da cena Stat".
3. **Bullets com vocabulário técnico nomeado**, não genérico.
   Idempotência, Circuit breakers, Observabilidade, SLOs, error
   budgets — não "tratamento de erro / performance / segurança".
   — ver persona 02 "Conteúdo das Bullets".
4. **Transição dark→light sem vazamento**: o `themeSchedule.from`
   precisa estar ≥ `cenaAnterior.exit.at + exit.duration + 6`,
   senão o LightOverlay cross-faz por cima de conteúdo ainda
   visível. — ver persona 04 "Armadilhas técnicas".
5. **Personal NUNCA carrega chrome Luby**: nem logo, nem "made @
   Luby", nem lang badge no top-right. Só o speaker badge
   top-left. — ver persona 04 "Regra de entrega: 3 variantes".
6. **Valores financeiros em notação universal abreviada** ($2.4T,
   não "US$ 2,41 tri"). Tabular-nums + cifrão + vírgula quebra
   glyph rendering em Aspekta. Contexto numérico vai pra caption.
   — ver persona 04 "Armadilhas técnicas".

## Regra de entrega: 3 variantes por vídeo

Toda run produz **3 MP4s obrigatórios** (regra fixa desde 2026-05):

1. `out/video-pt.mp4` — PT-BR, modo corporate (LinkedIn Luby Brasil)
2. `out/video-en.mp4` — EN-US, modo corporate (LinkedIn Luby global)
3. `out/video-personal.mp4` — PT-BR, modo personal (colaborador
   posta no perfil próprio, SEM branding Luby)

A versão Personal suprime toda branding Luby do vídeo (logo do
Intro, logo do CTA, "made @ Luby" no rodapé). Mantém o speaker
badge no top-left (avatar/nome/cargo do colaborador) e todo o
conteúdo do vídeo. A tradução PT→EN é responsabilidade do Motion
Designer e exige cuidado idiomático — não usar Google Translate.

Detalhes e implementação na persona 04.

## Como usar (fluxo manual atual)

Para cada novo vídeo:

### 1. Crie uma "run"

```
agents/runs/2026-05-12-acelerar-com-ia/
```

Convenção: `YYYY-MM-DD-slug-curto/`

### 2. Coloque o briefing

Crie `agents/runs/2026-05-12-acelerar-com-ia/00-briefing.md` seguindo o
formato em `contracts/00-briefing.schema.md`. Pode ser:
- Um link (artigo, post, documentação)
- Um texto cru (ideia em algumas frases)
- Um tema (tópico amplo a explorar)

### 3. Execute os agentes em sequência

No Cursor, peça ao Claude para acionar cada agente em ordem:

```
Acione o agente Estrategista para o briefing em
agents/runs/2026-05-12-acelerar-com-ia/00-briefing.md.
Leia agents/personas/01-estrategista.md, processe e salve o resultado
em 01-estrategia.md na mesma pasta.
```

Repita para cada agente subsequente. Cada um:
- Lê sua persona em `personas/`
- Lê o output do agente anterior (na mesma pasta `runs/`)
- Devolve seu artefato na pasta da run

### 4. Motion Designer escreve código

Diferente dos outros, o Motion Designer **não devolve só markdown** — ele
edita arquivos em `src/scenes/` e `src/compositions/`. Sua entrega na
pasta da run é um `04-implementation-notes.md` documentando o que foi
implementado.

### 5. Render e revisão

Após implementação, rode `npm run render:pt` (ou variantes), e acione o
Revisor com o MP4 + storyboard.

### 6. Loop de correção (se necessário)

Se o Revisor reprovar, ele especifica correções precisas. Volta pro Motion
Designer (raramente Diretor) para ajustes, novo render, nova revisão.

## Cada run vira histórico versionado

```
agents/runs/2026-05-12-acelerar-com-ia/
├── 00-briefing.md
├── 01-estrategia.md
├── 02-roteiro.md
├── 03-storyboard.md
├── 04-implementation-notes.md
├── 05-review.md
└── out/                          (MP4 final + assets gerados)
    └── video-pt.mp4
```

Tudo versionado no Git. Permite:
- Auditar decisões depois
- Reusar peças (estratégia de um vídeo pode inspirar outro)
- Treinar/calibrar agentes vendo runs antigas

## Migração futura para Claude Agent SDK

Esta estrutura foi desenhada para migrar **sem retrabalho conceitual** para
o Claude Agent SDK. Veja `architecture.md` para o mapeamento completo:

- `personas/*.md` → `agent.systemPrompt`
- `contracts/*.schema.md` → schemas Zod / JSON Schema
- `runs/` → persistência em banco
- Fluxo manual → pipeline orquestrado

A automação será adicionada quando o conceito estiver validado por
~5-10 vídeos rodados manualmente.
