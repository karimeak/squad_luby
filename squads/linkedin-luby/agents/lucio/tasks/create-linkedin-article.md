---
task: create-linkedin-article
order: 4
agent: lucio
input: Post + carrossel criados + selected-angle.md
output: Artigo LinkedIn completo em squads/linkedin-luby/output/{run_id}/article.md
---

## Process

1. Ler o ângulo selecionado e o post criado — o artigo aprofunda o mesmo tema com formato long-form
2. Criar headline SEO-first:
   - Keyword principal nos primeiros 70 chars
   - Total 60-100 chars (máximo 220)
   - Gera curiosidade sem ser clickbait
3. Escrever introdução (150-250 palavras):
   - Primeiras 2-3 frases: hook que aparece no feed (criar urgência ou curiosidade imediata)
   - Problema: qual desafio ou lacuna este artigo endereça?
   - Preview: o que o leitor vai ganhar lendo até o final?
4. Estruturar 3-5 seções (250-400 palavras cada):
   - H2 informativo e específico por seção (não criativo — o leitor deve saber o conteúdo pelo título)
   - Cada seção: narrativa/dado/exemplo + takeaway acionável ao final
5. Escrever conclusão (100-200 palavras):
   - Síntese: o único insight mais importante de todo o artigo
   - Transformação: qual mudança de perspectiva o leitor deve ter saído com
6. CTA único no final: uma pergunta que convida comentários ou um convite específico

## Output Format

```markdown
=== HEADLINE ===
[60-100 chars. Keyword nos primeiros 70. Curiosidade sem clickbait.]

=== INTRODUÇÃO ===
[Hook 2-3 frases — aparece no feed, força o clique]

[Problema — qual desafio ou lacuna este artigo endereça]

[Preview — o que o leitor vai ganhar]

=== SEÇÃO 1: [H2 Informativo] ===
[250-400 palavras: narrativa + dado/exemplo]

**Takeaway:** [Instrução acionável — o que o leitor pode implementar esta semana]

=== SEÇÃO 2: [H2 Informativo] ===
[250-400 palavras]

**Takeaway:** [Instrução acionável]

=== SEÇÃO 3: [H2 Informativo] ===
[250-400 palavras]

**Takeaway:** [Instrução acionável]

[Seções 4-5 opcionais, mesmo formato]

=== CONCLUSÃO ===
[100-200 palavras: síntese do insight mais importante + transformação esperada]

=== CTA ===
[Uma pergunta ou convite específico]
```

## Output Example

```markdown
=== HEADLINE ===
IA não vai substituir seu time de engenharia — mas vai tornar os bons 3x mais produtivos

=== INTRODUÇÃO ===
GPT-5 atingiu 85% de acurácia no HumanEval benchmark esta semana.
No LinkedIn, todo mundo concluiu a mesma coisa: os devs vão ser substituídos.
Nós vimos o que acontece na realidade depois de integrar IA em 40+ projetos enterprise.

O problema não é substituição. É que 90% das empresas não têm processo para integrar IA
em times de engenharia existentes — e estão descobrindo isso da forma mais cara possível.

Neste artigo, compartilhamos o framework de integração que emergiu de 12 meses trabalhando
com times enterprise no Brasil, EUA e Europa.

=== SEÇÃO 1: Por que o debate "IA substitui devs" está fazendo as empresas perderem tempo ===

[250-400 palavras de análise aprofundada com dados e perspectiva da Luby]

**Takeaway:** Pare de debater se IA vai substituir seu time. Comece a mapear quais tarefas
do seu backlog atual são candidatas à automação — essa análise leva 2 horas e vai mudar
seu roadmap de capacitação.

=== SEÇÃO 2: O que os times que estão acertando fazem diferente ===

[250-400 palavras com o framework de 5 práticas + exemplos reais]

**Takeaway:** Implemente uma "semana de IA" no seu próximo sprint: escolha 1 tarefa
recorrente do time, deixe o dev usar IA para completá-la e meça o tempo real vs. estimado.
Os dados vão convencer mais do que qualquer argumento teórico.

=== SEÇÃO 3: Como planejar a transição sem paralisar o delivery ===

[250-400 palavras com plano de 90 dias + métricas de acompanhamento]

**Takeaway:** Não escale IA antes de ter um pipeline de revisão funcionando.
O framework correto: IA gera → dev revisa → time valida. Qualquer variação aumenta risco.

=== CONCLUSÃO ===
A transformação real não é ferramental. É de processo e cultura.

As empresas que vão ganhar com IA não são as que compram mais ferramentas — são as que
redesenham como seus times trabalham antes de precisar.

O momento de começar não é quando a concorrência já fez. É agora, enquanto o custo
de experimentar ainda é menor do que o custo de reagir tarde.

=== CTA ===
Qual a maior mudança que você já percebeu no seu time de engenharia com IA?
Comente abaixo — estou coletando perspectivas para um benchmarking que publicarei em breve.
```

## Quality Criteria

- [ ] Headline 60-100 chars com keyword nos primeiros 70
- [ ] Introdução tem hook + problema + preview em ≤ 250 palavras
- [ ] 3-5 seções com H2 informativo (não criativo/vago)
- [ ] Cada seção tem dado/exemplo concreto + takeaway acionável
- [ ] Total 1.500-2.000 palavras (não abaixo de 1.200)
- [ ] CTA único no final (não múltiplos espalhados)
- [ ] Zero parágrafos > 4 frases

## Veto Conditions

- Artigo abaixo de 1.200 palavras → expandir seções antes de finalizar
- Seção sem takeaway acionável → adicionar antes de finalizar
- Headline acima de 220 chars → encurtar
