---
task: create-linkedin-post
order: 2
agent: lucio
input: squads/linkedin-luby/output/selected-angle.md + tone-of-voice.md
output: LinkedIn post completo em squads/linkedin-luby/output/{run_id}/linkedin-post.md
---

## Process

1. Ler `squads/linkedin-luby/output/selected-angle.md` — extrair ângulo, hook selecionado e notícia base
2. Verificar tom selecionado em `pipeline/data/tone-of-voice.md` (confirmado no checkpoint de ângulo)
3. Diagnóstico pré-escrita:
   - Nível de consciência da audiência: problema aware (sabe que o problema existe) ou solução aware?
   - Driver psicológico dominante do ângulo selecionado
   - Framework de escrita mais adequado: PAS para alerta, BAB para oportunidade, Star-Story-Solution para educacional
4. Gerar 3 opções de hook com estruturas distintas, mesmo que o hook do ângulo já tenha sido confirmado
   (o checkpoint de ângulo confirma o ângulo, não o hook específico do post)
5. Aguardar confirmação do hook (checkpoint inline)
6. Escrever o corpo completo:
   - História/contexto: 2-3 parágrafos curtos, primeira pessoa, 1-2 frases por parágrafo
   - Insights: 3-5 bullets numerados, acionáveis e específicos
   - Takeaway: 1-2 frases de síntese
   - CTA: pergunta genuína e específica que convida resposta baseada em experiência
7. Adicionar hashtags (3-5) na última linha

## Output Format

```markdown
=== HOOK ===
[Primeiras 2 linhas — máximo ~210 caracteres. Contrário/dado/pergunta/história.]

=== BODY ===
[História/contexto — 2-3 parágrafos curtos, primeira pessoa, 1-2 frases por parágrafo]

[Transição para insights]

=== INSIGHTS ===
1. [Takeaway acionável — uma frase]
2. [Takeaway acionável — uma frase]
3. [Takeaway acionável — uma frase]
4. [Takeaway acionável — uma frase]
5. [Takeaway acionável — uma frase]

=== CTA ===
[Síntese em 1-2 frases]

[Pergunta genuína e específica]

=== HASHTAGS ===
#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5
```

## Output Example

```markdown
=== HOOK ===
Todo mundo fala que GPT-5 vai substituir devs.

Os dados dizem que o problema é completamente diferente.

=== BODY ===
Trabalhamos com 300+ engenheiros em projetos enterprise globais nos últimos 12 meses.

O que vemos no campo é bem diferente do que está dominando o feed do LinkedIn.

As empresas não estão cortando times de desenvolvimento.
Estão sem saber como integrar IA nos times que já têm.

O gargalo não é quantidade de dev.
É qualidade de processo.

=== INSIGHTS ===
1. Definir quais tarefas são para IA e quais são para o engenheiro — antes de comprar qualquer ferramenta
2. Treinar o time em prompt engineering antes de dar acesso às ferramentas
3. Construir pipelines de revisão humana — IA gera, dev revisa, nunca o contrário
4. Medir output real (features entregues, bugs corrigidos), não "horas economizadas"
5. Começar com 1 agente em 1 fluxo antes de escalar para toda a operação

=== CTA ===
O dev que gerencia IA produz 3x mais. O que ainda não usa vai perder para o que usa.

Qual o maior obstáculo que você está vendo na adoção de IA no seu time de engenharia?

=== HASHTAGS ===
#ia #engenharia #softwareenterprise #staffaugmentation #techlideranca
```

## Quality Criteria

- [ ] Hook ≤ 210 chars e passa no scroll-stop test
- [ ] Corpo em primeira pessoa ("trabalhamos", "vimos", "aprendemos")
- [ ] 3-5 insights numerados e acionáveis (não genéricos)
- [ ] Zero links no corpo do post
- [ ] CTA é uma pergunta específica, não retórica
- [ ] 3-5 hashtags na última linha, separadas do corpo
- [ ] Total ≤ 3.000 chars

## Veto Conditions

- Hook com mais de 210 chars → encurtar antes de continuar
- Qualquer link no corpo → remover e colocar "Link nos comentários" se necessário
- Insights genéricos ("ser mais estratégico", "focar em qualidade") → reescrever com especificidade
