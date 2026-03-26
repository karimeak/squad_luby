# Task: Definição de Estratégia de Conversão

## Descrição
Com base no relatório de audiência, definir a estratégia completa da landing page:
Big Idea, framework de copy, estrutura de seções e elementos de prova por seção.

## Input
`squads/landing-page-luby/output/audience-report.md`

## Processo

1. **Ler o relatório de audiência** completo

2. **Definir a Big Idea da LP** (a âncora de toda a argumentação):
   - **Enemy**: qual crença, status quo ou alternativa a LP vai desafiar
     Ex: "freelancers vs integração real", "contratação lenta vs velocidade de mercado"
   - **New Mechanism**: qual processo único da Luby é o diferencial real — não a promessa,
     mas o COMO. O mecanismo que torna a promessa crível.
     Ex: "matching em 5 dias com 3 candidatos validados no stack" vs "bons profissionais"
   - **Unique Promise**: qual transformação específica a LP entrega, em linguagem mensurável
     Ex: "De briefing a time operando em 2 semanas" vs "soluções de qualidade"

3. **Selecionar framework de copy** baseado no funil e no nível de consciência:
   - Unaware / Problem Aware → AIDA ou Star-Story-Solution
   - Solution Aware → PAS ou BAB
   - Product Aware / Most Aware → 4Ps ou PAS direto

4. **Definir estrutura de seções** com função e driver por seção:
   | Seção | Função | Driver ativado | Elemento de prova |
   |-------|--------|----------------|-------------------|

   Estrutura padrão (adaptar conforme framework):
   - **Hero**: Parar o scroll, comunicar benefício central e audiência
   - **Problem Statement**: Validar a dor, criar identificação
   - **Solução/Mecanismo**: Explicar O COMO, diferenciar
   - **Prova Social**: Comprometer com evidência, reduzir risco percebido
   - **Benefícios**: Traduzir features em resultados por stakeholder
   - **Objeção Principal**: Endereçar o maior bloqueio de conversão
   - **CTA Final**: Fechar com baixa fricção e próximo passo claro

5. **Mapear provas disponíveis da Luby** por seção:
   - Dados corporativos: 300+ engenheiros, 1.300+ projetos, 23 anos, 540+ clientes, ~$54M receita
   - Setores atendidos: fintech, healthtech, saúde, educação, SaaS, IoT
   - Presença: Brasil, EUA, Europa
   - Serviços: software customizado, IA, staff augmentation, nearshore, modernização, MVP
   Identificar quais desses dados são mais relevantes para a audiência desta LP

6. **Definir intensidade do CTA** (CTA Intensity Ladder):
   - Nível 1 — Micro-commitment (salvar, seguir)
   - Nível 2 — Engajamento (comentar, compartilhar)
   - Nível 3 — Captura de lead (baixar guia, registrar)
   - Nível 4 — Compra/solicitação (solicitar proposta, contratar)
   - Nível 5 — Alto comprometimento (aplicar, agendar reunião estratégica)

7. **Compilar estratégia completa** em formato estruturado

## Output Format

```markdown
# Estratégia de Conversão — [Nome da LP]

## Big Idea

**Enemy:** [O que a LP vai desafiar/substituir]
**New Mechanism:** [O processo único da Luby que torna a promessa crível]
**Unique Promise:** [Transformação específica e mensurável]

## Framework Selecionado: [AIDA / PAS / BAB / 4Ps / Star-Story-Solution]
**Justificativa:** [Por que este framework para este funil/audiência]

## Estrutura de Seções

### 1. Hero
- **Função:** Parar o scroll e comunicar proposta de valor central
- **Driver ativo:** [driver]
- **Elementos obrigatórios:** Headline (≤12 palavras), subtítulo, CTA, social proof imediato
- **Provas disponíveis:** [dados da Luby aplicáveis]

### 2. Problem Statement
- **Função:** Validar a dor, criar identificação com o visitante
- **Driver ativo:** [driver]
- **Elementos:** [dores em linguagem espelho, custo de inação]
- **Provas disponíveis:** [dados ou contexto de mercado aplicáveis]

### 3. Solução/Mecanismo
- **Função:** Explicar O COMO, diferenciar da concorrência
- **Driver ativo:** [driver]
- **Elementos:** [processo específico, diferenciadores]
- **Provas disponíveis:** [dados de processo, certificações, stack]

### 4. Prova Social
- **Função:** Comprometer com evidência, eliminar risco percebido
- **Driver ativo:** [driver]
- **Elementos:** [depoimentos, dados de resultado, logos, cases]
- **Provas disponíveis:** [o que a Luby tem disponível]

### 5. Benefícios
- **Função:** Traduzir features em resultados por stakeholder
- **Driver ativo:** [driver]
- **Elementos:** [resultado + prova por persona]
- **Provas disponíveis:** [dados aplicáveis]

### 6. Objeção Principal: [nome da objeção]
- **Função:** Endereçar o maior bloqueio de conversão
- **Driver ativo:** Segurança / Controle
- **Elementos:** [nome explícito da objeção + resposta com prova]
- **Provas disponíveis:** [dados, garantias, processos]

### 7. CTA Final
- **Função:** Fechar com baixa fricção
- **Intensidade:** Nível [N] — [tipo de CTA]
- **Elementos:** [headline de fechamento, microcopy, texto do botão]

## Notas de Posicionamento
[Qualquer observação sobre diferenciação vs concorrentes benchmarkados]
```

## Critérios de Qualidade

- [ ] Big Idea completa: enemy + new mechanism + unique promise definidos
- [ ] Framework selecionado com justificativa alinhada ao funil
- [ ] Estrutura de seções completa com função e driver por seção
- [ ] Provas da Luby mapeadas por seção
- [ ] Intensidade de CTA definida (Nível 1-5)
- [ ] Output salvo em squads/landing-page-luby/output/strategy.md

## Condições de Veto

- Big Idea incompleta (falta enemy, mechanism ou promise)
- Framework não justificado ou inadequado para o nível de consciência
- Estrutura sem driver definido por seção
