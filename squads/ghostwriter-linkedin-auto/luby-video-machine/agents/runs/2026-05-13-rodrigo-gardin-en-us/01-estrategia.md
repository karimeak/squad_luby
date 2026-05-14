# Estratégia — The Bottleneck Isn't the Model (Rodrigo, EN-Personal)

## Interpretação do briefing
Briefing pede vídeo de **autoridade técnica contrarian** para audiência staff/architect-level que ja deployou IA e vive a frustração da realidade no codebase grande. Não é "use AI" nem "don't use AI" — é "pare de medir o modelo, comece a medir o substrato". A oportunidade é Rodrigo se posicionar como o CTO que SABE a verdade técnica que vendor não conta — alinhado com o canal "Já revisei centenas de codebases" que define a voz dele.

## Mensagem única
A maioria dos engenheiros perde isso: o gargalo dos AI agents não é o modelo. É a infraestrutura determinística embaixo dele.

## Audiência alvo
**Primária**: CTOs, Staff Engineers, Tech Leads, Software Architects (US + BR) com **codebase grande próprio** (>500k LOC) que já deployaram pelo menos 1 ferramenta de IA em 2025.

**Sinais comportamentais**:
- Lê DORA report
- Já abriu PR de Copilot/Cursor/Claude Code agent e debugou 30+ min
- Segue Will Larson, Charity Majors, Camille Fournier, Kelsey Hightower
- Tem opinião forte sobre platform engineering
- Conhece reverse-engineering de Claude Code (Hacker News thread)

## Formato
**Nome**: contrarian-stat (hot-take ancorado em estatística verificável)

**Justificativa**: METR 2025 é peer-reviewed randomized — defensível contra qualquer reply guy "but my team ships faster". Vrungta reverse-engineering de Claude Code é artefato concreto. Hot-take precisa de dados duros pra audiência staff/architect levar a sério.

## Modo
**Escolha**: personal

**Justificativa**: vai pro perfil pessoal do Rodrigo. Speaker badge top-left mantido (Rodrigo / Técnico / CTO @ Luby). Logo Luby auto-suprimido em logo-mark e closing-card. A tese ganha credibilidade quando vem de um CTO específico ("já revisei centenas de codebases") — não como a Luby falando.

## Call to action
- **Ação**: O que sua camada de plataforma faz pelo agente? Golden paths, deterministic guardrails, agent-readable infra — ou só acceptance rate?
- **URL**: nenhuma URL no closing-card (regra fixa global #1). CTA verbal vira pergunta nos comentários.

## KPI esperado
- **Métrica primária**: comentários técnicos detalhados de Staff/Architect ("we have this exact problem with our platform layer", "yes — agents fail at the substrate, not the model")
- **Target**: 6-10 comentários qualificados nos primeiros 7 dias; save/share ratio > 5% (audiência tech tende a salvar mais que comentar)

## Ganchos visuais sugeridos
1. **Stat shock simples**: "19% slower" como giant statement gigante na tela — força o cérebro a reler
2. **Equação de composição**: 1.6% AI logic × 98.4% deterministic infra = working agent
3. **Decomposição por componente**: lista das 4 partes do substrato (permission gates, context management, tool routing, recovery loops) — vocabulário técnico nomeado
4. **Stat com baseline contra-narrativa**: 242.7% incidents per PR vs 1× baseline (com a barra de incidentes gigante)
5. **Closing-card sereno**: pergunta técnica sem URL

## Conceitos-chave
- **paradoxo** (devs sentem 20% mais rápidos / são 19% mais lentos)
- **composição** (AI × deterministic infra = working agent)
- **profundidade** (visible model vs invisible substrate)

Mapeamento para `agents/metaforas.md`:
- Seção H (Reviravolta) — paradoxo perfeito pra hook
- Seção B (Composição) — equação multiplicativa pro Bullets
- Seção F (Profundidade) — substrato que sustenta visible AI

## Riscos
- **Risco**: soar academic demais (METR = jargão)
  - **Mitigação**: pareciar com fonte "(METR randomized study, 2025)" mas usar linguagem direta no resto. Bruno fez isso bem.
- **Risco**: parecer reciclagem do vídeo da Karime (também contrarian-stat hybrid)
  - **Mitigação**: Diretor escolhe archetypes DIFERENTES (não split-screen, não vertical-stack). Audiência diferente (Architects, não RevOps Leaders), tema diferente (substrate, não data architecture pra RevOps). Variação real.
- **Risco**: confundir pessoas com a notação 1.6% / 98.4% (parece dado, é arquitetura interna)
  - **Mitigação**: contexto "Reverse-engineering analyses show..." deixa claro que é decomposição da arquitetura, não market share

## Variação intencional (memória entre runs)
Runs anteriores reais:
- `time-220-claude-code` (market-insight, Hook=concept-row, Bullets=equation, Stat=bars)
- `pergunta-errada-outsourcing` (market-insight, Hook=concept-row)
- `cliente-ve-time-entrega` (hot-take, "iceberg")
- `software-que-parece-pronto` (hot-take, "camadas-cebola")
- `karime-kumagai-revops-en` (hot-take, Hook=split-screen, Bullets=vertical-stack, Stat=typographic)

**Eixo variado nesta run vs Karime (run anterior mais recente)**:
- **Hook**: NÃO usar split-screen-comparison (Karime acabou de usar). Sugiro `giant-statement` puro — "19% slower." (variação pura, não usado em runs reais novas)
- **Bullets**: NÃO usar vertical-stack (Karime acabou de usar). Sugiro `multiplication-equation` — perfeito pro tema (1.6% × 98.4% = working agent). Equation usado em time-220 mas faz sentido conceitual aqui.
- **Stat**: variar de typographic da Karime. Sugiro `comparison-bars` — 242.7% incidents per PR é literalmente comparison-bar (baseline 1× vs 3.4× incidents).
- **Tema**: techncial deep (Architects) — primeiro vídeo desse perfil. Karime era RevOps (revenue side). Variação de audiência total.
- **Lingua**: en-us mantido (Karime tambem en-us, mas Rodrigo bilingue — escolha default de rotacao).
