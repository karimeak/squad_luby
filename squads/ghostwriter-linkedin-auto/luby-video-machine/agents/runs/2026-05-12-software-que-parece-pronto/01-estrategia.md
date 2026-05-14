# Estratégia — Software que parece pronto mas não está

## Interpretação do briefing
O briefing pede um vídeo de **reconhecimento, não de venda**. A tese
não é "a Luby é melhor"; é "essa coisa que te queimou? a gente sabe
o que é, e leva a sério". A diferença é tonal mas decisiva: o CTO
sênior reconhece a verdade no primeiro segundo e pensa "finalmente
alguém disse" — não "alguém quer me vender algo".

A oportunidade real é diferenciação por **vocabulário compartilhado**:
quem fala fluentemente sobre "o que aparece pronto vs o que está
pronto" demonstra que vive o problema, não só vende a solução. Isso
tem alto signal-to-noise pra audiência alvo (CTO Fortune 500 com
cicatriz operacional).

## Mensagem única
A definição de "pronto" muda quando você é responsável pelo que
acontece **depois** da review.

## Audiência alvo
**Primária**: CTOs e VPs Eng de Fortune 500 / mid-market grande
(500–10.000 engenheiros) com **cicatriz operacional recente** —
pessoa que nos últimos 6-18 meses se queimou com fornecedor que
"entregou pronto" e deixou problema explodir 3-6 meses depois em
produção. Pessoa que aprendeu a desconfiar de demo bonita.

**Sinais comportamentais**:
- Faz code review pessoalmente em decisões arquiteturais críticas
  mesmo quando "não precisaria"
- Prefere fornecedor que faz mais perguntas no kickoff que promessas
- Já implementou processo interno de "definition of done" rigoroso
- Lê post-mortems publicamente, segue Charity Majors / Camille
  Fournier / Will Larson
- Tem o termo "production-ready" no vocabulário e não trata como
  sinônimo de "feature-complete"

## Formato
**Nome**: hot-take

**Justificativa**: as runs anteriores variaram entre market-insight,
capability-spotlight e hot-take (cliente-ve-time-entrega foi
hot-take). Este também é hot-take — repetição de formato é OK aqui
porque o formato serve à tese (afirmação provocativa intencional).
A variação acontece em **metáfora visual**, não em formato (ver
Variação intencional abaixo).

## Modo
**Escolha**: corporate

**Justificativa**: a tese é institucional ("nossa definição de
pronto inclui essa segunda camada desde o dia um"). Pessoa física
diria como opinião. A Luby diz como compromisso operacional —
respaldado por 220+ engenheiros e 1.350+ projetos.

## Call to action
- **Ação**: Ver como definimos "pronto"
- **URL**: `luby.co/definition-of-done` (placeholder — confirmar com
  marketing; alternativas: `luby.co/production-ready`,
  `luby.co/engineering-rigor`)

CTA suave por design. Vídeo de posicionamento, não conversão direta.

## KPI esperado
- **Métrica primária**: brand-recall + engagement qualificado
- **Target**: save/share ratio > 3% em 45 dias; 15+ comentários de
  reconhecimento ("exatamente isso", "passei por isso")

Este vídeo performa diferente: viraliza menos, prende quem está no
momento certo. Comentário de reconhecimento de CTO sênior vale 10x
clicks anônimos.

## Ganchos visuais sugeridos
1. **Tela dividida**: "o que parece pronto" (botão verde, check, demo
   feliz) vs "o que está pronto" (lista densa de coisas invisíveis)
2. **Camadas progressivamente reveladas**: começa com 1 elemento
   visível, descasca até revelar a base oculta de tratamento de
   erro / segurança / observabilidade
3. **Antes-depois temporal**: review verde no dia 1 → produção
   explodindo no dia 90. A passagem do tempo é o argumento
4. **Lista densa de "o que NÃO aparece"**: tipográfica, sem
   decoração. A densidade silenciosa é a mensagem
5. **CTA com callback**: closing-card simples, sem gritar

## Conceitos-chave
- **dualidade** (parece pronto vs está pronto)
- **profundidade** (camada visível vs camada que sustenta)
- **transformação temporal** (review pronto → produção quebrada)

Mapeamento para `agents/metaforas.md`:
- Seção A (Comparação) — `dualidade-split-screen`,
  `antes-e-depois-temporal`
- Seção F (Profundidade) — `iceberg`, `camadas-de-cebola`,
  `vista-explodida`
- Seção C (Transformação) — `caos-vira-ordem` (review limpa →
  caos em produção, inversão)

## Riscos
- **Risco**: soar arrogante ("nós vemos o que outros não")
  - **Mitigação**: tom desconfortável-cumplíce, NÃO superior. O
    Copywriter calibra isso. Frases declarativas curtas. Sem "você
    deveria saber que..."
- **Risco**: o vídeo virar lista chata de "10 coisas pra checar
  antes de aprovar"
  - **Mitigação**: o Diretor escolhe metáfora visual com punch
    (não vertical-stack tipográfico). A lista vai ENVELOPADA em
    metáfora, não exposta como bullet point.
- **Risco**: repetir iceberg do `cliente-ve-time-entrega`
  - **Mitigação**: o Diretor está EXPLICITAMENTE alertado abaixo.
    Iceberg está descartado por memória entre runs. Outros caminhos
    visuais mapeados acima.

## Variação intencional (memória entre runs)

Runs anteriores reais:
- `time-220-claude-code` (market-insight, "terceiro caminho",
  Hook=concept-row, Bullets=equation, Stat=bars)
- `pergunta-errada-outsourcing` (market-insight, "acima do debate",
  Hook=concept-row, Bullets-1=concept-row + 2=feature-grid,
  Stat=metric-grid)
- `cliente-ve-time-entrega` (hot-take, "iceberg", Hook+Bullets=iceberg,
  Stat=donut)

**Eixo variado nesta run**:
- **Metáfora**: Iceberg está PROIBIDO (foi a metáfora-âncora do
  cliente-ve-time-entrega, mesmo briefing visual). Forçar caminho
  alternativo: `camadas-de-cebola` (descascamento progressivo),
  `vista-explodida` (explosão de componentes), ou `antes-e-depois-
  temporal` (review verde → produção quebrada).
- **Hook**: NÃO repetir concept-row highlight (3 das 4 runs usaram).
  Forçar `dualidade-split-screen` (já existe, e a Wave 4 a
  redesenhou full-bleed — boa hora de explorar).
- **Stat**: variar do que já foi feito. Donut (cliente-ve), bars
  (time-220), metric-grid (pergunta-errada × how-we-apply). Restam
  `typographic` (luby-demo) ou número grande sem comparação.

**Justificativa**: este briefing visual é primo do
`cliente-ve-time-entrega`. Sem disciplina deliberada, o Diretor cai
de novo em iceberg + concept-row e o vídeo vira reciclagem. A regra
"varia em pelo menos um eixo" exige aqui variar em DOIS eixos
(metáfora + arquétipo) porque o tema-base é tão próximo.
