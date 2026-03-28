# Task: Escrita do Copy Completo

## Descrição
Escrever o copy completo de cada seção da landing page, baseado na estrutura
aprovada pelo usuário. Foco em copy de conversão B2B com prova específica
e linguagem centrada no cliente.

## Input
`squads/landing-page-luby/output/lp-structure.md` (wireframe aprovado com headline selecionada)

## Processo

### Pré-escrita (diagnóstico obrigatório antes de qualquer linha)

1. **Identificar a headline aprovada** e o driver psicológico ativado
2. **Confirmar framework de copy** (PAS / AIDA / BAB / 4Ps) da estratégia
3. **Confirmar driver dominante** — ancorar todo o copy neste driver
4. **Listar provas disponíveis** por seção (dados, cases, depoimentos)

### Escrita por Seção

**HERO**
- Headline: usar exatamente a aprovada (ou variação confirmada)
- Subtítulo (1-2 frases, ≤ 30 palavras): especifica O QUÊ + PARA QUEM + EM QUANTO TEMPO
- Social proof strip (1 linha): 3 dados numéricos da Luby mais relevantes para esta audiência
- CTA acima do fold: verbo de ação + benefício ("Falar com um especialista", "Ver como funciona")
- Regra: hero não começa com "A Luby é" ou "Somos". Começa com a realidade do cliente.

**PROBLEM STATEMENT**
- Usar linguagem espelho: as palavras que a audiência usa para descrever a dor
- Estrutura PAS: Problem → Agitate → (ponte para Solution)
- Agitar: custo de inação — o que acontece SE o problema não for resolvido
- Parágrafo de transição (1-2 linhas) conectando o problema à solução
- Regra: nenhum parágrafo > 3 linhas. Usar quebras de linha agressivamente.

**SOLUÇÃO / MECANISMO**
- Iniciar com O QUE a Luby entrega (resultado, não serviço)
- Detalhar O COMO em formato de processo (3-5 passos, se aplicável)
  Ex: "Nosso processo: (1) Briefing → (2) Matching em 5 dias → (3) Onboarding → (4) Entrega"
- Diferenciação: 1 parágrafo comparando com a alternativa mais comum (freelancer, contratação direta)
- Regra: sem jargão genérico. Cada afirmação é específica ou tem prova.

**PROVA SOCIAL**
- Dado quantitativo de resultado (primeiro, antes do depoimento)
  Ex: "X% dos projetos entregues no prazo acordado. Y clientes ativos."
- Depoimento: nome completo + cargo + empresa (setor alinhado com audiência)
  Formato: citação direta com o resultado específico que obtiveram
- Case rápido (opcional): [Empresa] tinha [problema]. Resultado: [resultado mensurável].
- Logos de clientes: listar 5-8 empresas por nome se não tiver visual

**BENEFÍCIOS**
- Organizar por stakeholder se múltiplos decisores:
  Para o CTO: [resultado operacional]
  Para o CFO: [resultado financeiro]
  Para o Head de Produto: [resultado de velocidade]
- Cada benefício: resultado concreto + como a Luby garante (prova ou mecanismo)
- Evitar lista de features: "Java e Python" → "stack alinhado ao seu projeto sem curva de aprendizado"

**OBJEÇÃO PRINCIPAL**
- Nomear a objeção diretamente (não contornar)
  Ex: "E se o projeto precisar de mais tempo do que o estimado?"
- Resposta com prova concreta (não com promessa vaga)
- Transição curta para CTA (1-2 linhas)

**CTA FINAL**
- Headline de fechamento (reflete a promessa principal da hero em formato diferente)
  Ex: Hero: "Seu roadmap não pode esperar 6 meses" → CTA Final: "Seu próximo sprint começa em 2 semanas."
- Microcopy de suporte (2-3 linhas, reduz fricção máxima):
  Ex: "Sem contrato longo. Sem overhead de RH. Proposta em 48 horas."
- Botão principal com verbo de ação
- Secondary CTA (opcional, menor hierarquia): alternativa para quem não está pronto

## Output Format

```markdown
# Landing Page — [Nome da LP]
**Versão:** Rascunho 1
**Framework:** [PAS / AIDA / BAB / 4Ps]
**Driver dominante:** [driver]

---

## [HERO]

**Headline:**
[Headline aprovada]

**Subtítulo:**
[Subtítulo — 1-2 frases]

**Social Proof Strip:**
[Dado 1] | [Dado 2] | [Dado 3]

**CTA:**
[Botão primário] — [Botão secundário se aplicável]

---

## [PROBLEM STATEMENT]

[Copy completo da seção]

---

## [SOLUÇÃO / MECANISMO]

[Copy completo da seção]

---

## [PROVA SOCIAL]

[Copy completo da seção]

---

## [BENEFÍCIOS]

[Copy completo da seção]

---

## [OBJEÇÃO: Nome]

[Copy completo da seção]

---

## [CTA FINAL]

**Headline:**
[Headline de fechamento]

[Microcopy de suporte]

**[Texto do botão principal]**
*[Texto do botão secundário se aplicável]*

---

## Notas de Design
[Sugestões de hierarquia visual, elementos gráficos, destaques em negrito]
```

## Critérios de Qualidade

- [ ] Hero não começa com nome da empresa ou "somos"
- [ ] Headline da hero é exatamente a aprovada (ou variação confirmada)
- [ ] Subtítulo ≤ 30 palavras, especifica mecanismo + audiência + prazo
- [ ] Nenhum parágrafo > 3 linhas (mobile-first)
- [ ] Toda promessa tem prova correspondente
- [ ] Objeção nomeada explicitamente (não contornada)
- [ ] CTA com verbo de ação (não "Saiba mais" ou "Clique aqui")
- [ ] Microcopy do CTA final reduz pelo menos 2 objeções de fricção
- [ ] Copy centrado no cliente (não na Luby) — ratio "você/seu" > "nós/nossa"

## Condições de Veto

- Hero começa com o nome da empresa
- CTA principal é genérico ("Saiba mais", "Clique aqui", "Entre em contato")
- Nenhuma seção de prova social com dado ou depoimento específico
- Objeção principal ignorada completamente
