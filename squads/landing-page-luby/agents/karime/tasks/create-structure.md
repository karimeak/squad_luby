# Task: Criação de Estrutura da Landing Page

## Descrição
Criar o wireframe textual da landing page: definir o conteúdo de cada seção
e apresentar 3 opções de headline para a hero section. Aguardar aprovação
antes de escrever o copy completo.

## Input
`squads/landing-page-luby/output/strategy.md`

## Processo

1. **Ler a estratégia completa** — Big Idea, framework, seções, provas

2. **Para cada seção**, definir:
   - O que entra (conteúdo, não copy ainda)
   - Elementos obrigatórios (dados, depoimentos, CTAs)
   - Notas para o design (hierarquia visual, destaque)

3. **Gerar 3 opções de headline** para a hero section:
   - Cada opção usa driver psicológico DIFERENTE
   - Cada opção usa estrutura DIFERENTE:
     Opções: claim de benefício, pergunta, contrário, dado/estatística, história, urgência
   - Para cada opção: headline (≤ 12 palavras) + 1 linha de rationale
     (driver ativado + por que funciona para esta audiência)
   - **Aguardar seleção da headline antes de prosseguir para write-copy.md**

4. **Apresentar wireframe completo** seção por seção com marcações claras

## Output Format

```markdown
# Wireframe — [Nome da LP]

---

## SEÇÃO 1: HERO

**Conteúdo:**
- Headline: [3 opções abaixo]
- Subtítulo: [O que entra: mecanismo + audiência + prazo]
- CTA primário: [Texto sugerido do botão]
- CTA secundário (opcional): [Texto sugerido]
- Social proof strip: [Dados da Luby aplicáveis]
- Elemento visual sugerido: [Foto de time, dashboard, ícones — descrição]

**Opções de Headline:**

Opção A — [tipo estrutural]:
[Headline ≤ 12 palavras]
Rationale: [Driver ativado] — [por que funciona para esta audiência]

Opção B — [tipo estrutural]:
[Headline ≤ 12 palavras]
Rationale: [Driver ativado] — [por que funciona para esta audiência]

Opção C — [tipo estrutural]:
[Headline ≤ 12 palavras]
Rationale: [Driver ativado] — [por que funciona para esta audiência]

→ Aguardando seleção da headline antes de prosseguir.

---

## SEÇÃO 2: PROBLEM STATEMENT

**Conteúdo:**
- [Dor 1 em linguagem espelho]
- [Dor 2]
- [Custo de inação — o que acontece se não resolver]
- [Transição suave para a solução]

---

## SEÇÃO 3: SOLUÇÃO / MECANISMO

**Conteúdo:**
- O que a Luby faz (específico para este serviço)
- O COMO em [N] passos (se aplicável)
- Diferenciação vs alternativas mencionadas no benchmark
- Notas: [Aqui cabe infográfico de processo ou ícones por passo]

---

## SEÇÃO 4: PROVA SOCIAL

**Conteúdo:**
- [Dado quantitativo de resultado — ex: X% de projetos no prazo]
- [Depoimento 1: nome, cargo, empresa, segmento]
- [Logos de clientes: quais setores representar]
- [Case rápido: cliente + problema + resultado em 2 linhas]

---

## SEÇÃO 5: BENEFÍCIOS

**Conteúdo:**
- [Benefício por stakeholder — ex: CTO, CFO, Head de Produto]
- Formato: resultado concreto + prova de que é real
- Notas: [Cards ou lista com ícones por stakeholder]

---

## SEÇÃO 6: OBJEÇÃO PRINCIPAL — [Nome da objeção]

**Conteúdo:**
- Nomear a objeção explicitamente
- Resposta com prova concreta
- Transição para CTA

---

## SEÇÃO 7: CTA FINAL

**Conteúdo:**
- Headline de fechamento (reforça promessa principal)
- Microcopy de suporte (reduz fricção)
- Botão principal: [texto]
- Botão secundário (opcional): [texto]
- Notas: [Garantia visual se aplicável]
```

## Critérios de Qualidade

- [ ] Wireframe completo para todas as seções da estratégia
- [ ] 3 opções de headline com driver diferente e estrutura diferente cada
- [ ] Rationale de cada headline inclui driver + motivo para esta audiência
- [ ] Elementos obrigatórios definidos por seção (dados, depoimentos, CTAs)
- [ ] Wireframe salvo em squads/landing-page-luby/output/lp-structure.md

## Condições de Veto

- Menos de 3 opções de headline
- Duas headlines com o mesmo driver psicológico
- Wireframe sem elementos de prova definidos nas seções Hero e Prova Social
