# Task: Score de Conversão

## Descrição
Avaliar a landing page completa com scorecard estruturado por critério de conversão.
Verificar hard triggers antes de qualquer score.

## Input
`squads/landing-page-luby/output/{run_id}/landing-page.md`

## Processo

1. **Verificar Hard Rejection Triggers** (REJECT automático se qualquer um for verdadeiro):
   - [ ] Hero começa com nome da empresa, "Somos", "A Luby é" ou similar
   - [ ] CTA principal é "Saiba mais", "Clique aqui", "Entre em contato" ou variante genérica
   - [ ] Nenhum dado quantitativo ou depoimento com nome real na página
   - [ ] Nenhuma objeção endereçada explicitamente em nenhuma seção
   - [ ] Copy poderia ser publicado por concorrente sem alteração (anti-commodity falhou)

   Se qualquer trigger for verdadeiro → REJECT automático, listar quais foram ativados.

2. **Aplicar Scorecard** (1-10 por critério):

   **HERO (peso 30%)**

   *Headline (10pts):*
   - 9-10: Scroll-stop test passou, driver claro, específica (não genérica), ≤ 12 palavras
   - 7-8: Funcional mas pode ser mais específica ou driver mais forte
   - 5-6: Genérica, não diferencia da concorrência
   - 1-4: Começa com empresa, "somos", ou não tem benefício claro

   *Subtítulo (10pts):*
   - 9-10: Especifica mecanismo + audiência + prazo em ≤ 2 frases
   - 7-8: Claro mas falta especificidade de prazo ou mecanismo
   - 5-6: Vago ou muito longo
   - 1-4: Repete a headline ou não acrescenta nada

   *CTA Above Fold (10pts):*
   - 9-10: Verbo de ação + benefício específico, baixa fricção
   - 7-8: Ação clara mas sem benefício explícito
   - 5-6: Genérico mas tem verbo
   - 1-4: "Saiba mais", "Clique aqui" ou ausente

   *Social Proof Strip (10pts):*
   - 9-10: 3+ dados numéricos específicos, relevantes para audiência
   - 7-8: 2 dados ou dados menos relevantes
   - 5-6: Dados muito genéricos ("mais de 20 anos")
   - 1-4: Ausente ou apenas texto sem números

   **Score HERO:** média dos 4 critérios

   ---

   **PROBLEM STATEMENT (peso 15%)**

   *Linguagem espelho (10pts):*
   - 9-10: Usa exatamente as palavras que a audiência usa para a dor
   - 7-8: Próximo mas algum vocabulário corporativo
   - 5-6: Fala do problema mas na linguagem da empresa
   - 1-4: Não há seção de problema ou é genérica

   *Agitação (10pts):*
   - 9-10: Custo de inação específico e visceral
   - 7-8: Menciona consequência mas de forma vaga
   - 5-6: Apenas descreve o problema, não agita
   - 1-4: Ausente

   *Transição (10pts):*
   - 9-10: Fluente, prepara naturalmente para a solução
   - 7-8: Funcional mas abrupta
   - 5-6: Confusa ou muito longa
   - 1-4: Não há transição, seções desconexas

   **Score PROBLEMA:** média dos 3 critérios

   ---

   **SOLUÇÃO / MECANISMO (peso 15%)**

   *Especificidade do mecanismo (10pts):*
   - 9-10: Explica O COMO em passos concretos, nomeados
   - 7-8: Menciona o processo mas vago em detalhes
   - 5-6: Apenas descreve O QUÊ, não O COMO
   - 1-4: Genérico ("entregamos qualidade")

   *Diferenciação (10pts):*
   - 9-10: Contraste claro vs alternativa mais comum, com argumento específico
   - 7-8: Diferenciação presente mas poderia ser mais específica
   - 5-6: Menciona diferencial mas de forma genérica
   - 1-4: Poderia ser texto de qualquer concorrente

   *Ausência de jargão (10pts):*
   - 9-10: Zero jargão corporativo, linguagem humana e específica
   - 7-8: 1-2 termos que poderiam ser mais específicos
   - 5-6: Vários termos genéricos presentes
   - 1-4: Dominado por jargão

   **Score SOLUÇÃO:** média dos 3 critérios

   ---

   **PROVA SOCIAL (peso 20%)**

   *Especificidade (10pts):*
   - 9-10: Nome + cargo + empresa + resultado mensurável no depoimento
   - 7-8: Nome e cargo mas sem empresa ou resultado específico
   - 5-6: Depoimento genérico ou anônimo
   - 1-4: Ausente

   *Relevância para audiência (10pts):*
   - 9-10: Case/depoimento no mesmo setor ou perfil da audiência
   - 7-8: Setor adjacente ou relevante
   - 5-6: Setor neutro
   - 1-4: Setor irrelevante para esta audiência

   *Quantidade e diversidade de prova (10pts):*
   - 9-10: 2+ formas de prova (dado + depoimento + logo/case)
   - 7-8: 2 formas mas pouco variadas
   - 5-6: Apenas 1 forma de prova
   - 1-4: Sem prova concreta

   **Score PROVA SOCIAL:** média dos 3 critérios

   ---

   **CTA FINAL (peso 20%)**

   *Headline de fechamento (10pts):*
   - 9-10: Reforça a promessa principal com ângulo novo, específica
   - 7-8: Funcional mas não reforça a promessa central
   - 5-6: Genérica
   - 1-4: Ausente ou repete a headline do hero

   *Microcopy (10pts):*
   - 9-10: Reduz 2+ objeções de fricção específicas
   - 7-8: Reduz 1 objeção
   - 5-6: Presente mas genérico ("sem compromisso")
   - 1-4: Ausente

   *Intensidade correta para o funil (10pts):*
   - 9-10: Alinhada ao nível de consciência e funil definido na estratégia
   - 7-8: Ligeiramente alto ou baixo demais
   - 5-6: Desalinhado ao funil
   - 1-4: Pede casamento na primeira data (CTA de alto compromisso em top-of-funnel)

   **Score CTA:** média dos 3 critérios

3. **Calcular Score Médio Ponderado**:
   `(HERO × 0.30) + (PROBLEMA × 0.15) + (SOLUÇÃO × 0.15) + (PROVA × 0.20) + (CTA × 0.20)`

## Output Format

```markdown
# Scorecard de Conversão — [Nome da LP]
**Data:** [data]
**Versão avaliada:** [versão do copy]

## Hard Rejection Triggers
- Hero começa com empresa: [Sim / Não] ✓/✗
- CTA genérico: [Sim / Não] ✓/✗
- Sem prova concreta: [Sim / Não] ✓/✗
- Nenhuma objeção endereçada: [Sim / Não] ✓/✗
- Anti-commodity falhou: [Sim / Não] ✓/✗

**Resultado:** [Nenhum trigger ativado ✓ / REJECT automático — triggers: lista]

---

## Scores por Critério

### HERO (peso 30%)
| Critério | Score | Justificativa |
|----------|-------|---------------|
| Headline | X/10 | [justificativa específica] |
| Subtítulo | X/10 | [justificativa específica] |
| CTA Above Fold | X/10 | [justificativa específica] |
| Social Proof Strip | X/10 | [justificativa específica] |
**Score HERO:** X.X/10

### PROBLEM STATEMENT (peso 15%)
[mesmo formato]

### SOLUÇÃO / MECANISMO (peso 15%)
[mesmo formato]

### PROVA SOCIAL (peso 20%)
[mesmo formato]

### CTA FINAL (peso 20%)
[mesmo formato]

---

**SCORE MÉDIO PONDERADO: X.X/10**
```

## Critérios de Qualidade

- [ ] Hard triggers verificados antes de qualquer score
- [ ] Score numérico com justificativa específica em cada critério
- [ ] Score médio ponderado calculado corretamente
- [ ] Scorecard salvo em squads/landing-page-luby/output/{run_id}/review-scorecard.md

## Condições de Veto

- Hard trigger ativado e não reportado como REJECT automático
- Score sem justificativa específica (apenas número)
- Cálculo de score ponderado incorreto
