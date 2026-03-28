# Task: Auditoria SEO do Copy

## Descrição
Auditar o copy aprovado da landing page contra critérios de SEO on-page,
pesquisar keywords relevantes e mapear oportunidades de schema.

## Input
- `squads/landing-page-luby/output/{run_id}/landing-page.md`
- `squads/landing-page-luby/output/briefing.md`

## Processo

1. **Ler copy e briefing** completos

2. **Pesquisar keywords** (web_search):
   - Query: "[serviço da LP] site:semrush.com" ou similar para volume
   - Query: "[keyword candidata] empresa brasil" para ver intent dos resultados
   - Query: "site:luby.co [serviço]" para ver o que a Luby já ranqueia
   - Listar 5-10 keyword candidatas com análise de intent

3. **Selecionar keyword primária**: a keyword com melhor balanço de:
   - Volume de busca (não nulo)
   - Intent comercial/transacional (não informacional puro)
   - Competição manejável para um domínio enterprise B2B

4. **Auditar elementos on-page** do copy atual:

   | Elemento | Estado Atual | Comprimento | Keyword Presente? | Gap |
   |----------|-------------|-------------|-------------------|-----|
   | Title Tag | [texto atual ou ausente] | [chars] | Sim/Não | [gap] |
   | H1 | [texto] | - | Sim/Não | [gap] |
   | Meta Description | [texto ou ausente] | [chars] | Sim/Não | [gap] |
   | Primeiros 100 palavras | [trecho] | - | Sim/Não | [gap] |
   | H2s | [lista] | - | Keywords sec.? | [gap] |

5. **Mapear FAQ candidates**: listar perguntas que o copy já responde
   implicitamente e que poderiam virar FAQ schema explícito

6. **Verificar E-E-A-T signals** no copy:
   - Experience: dados reais, casos concretos, "já fizemos"
   - Expertise: terminologia técnica usada corretamente
   - Authoritativeness: dados de mercado, anos de experiência
   - Trustworthiness: garantias, processo transparente, sem claims vagos

## Output Format

```markdown
# Relatório de Auditoria SEO — [Nome da LP]

## Keyword Research

**Candidatas avaliadas:**
1. [keyword] — [intent] — [justificativa]
2. [keyword] — [intent] — [justificativa]
...

**Keyword Primária Selecionada:** [keyword]
**Keywords Secundárias:** [lista de 3-5]
**Long-tail Opportunities:** [lista de 2-3]

## Auditoria On-Page

| Elemento | Estado Atual | Gap | Impacto |
|----------|-------------|-----|---------|
| Title Tag | [atual] | [gap] | Alto/Médio/Baixo |
| H1 | [atual] | [gap] | Alto |
| Meta Description | [atual] | [gap] | Médio |
| Primeiros 100 palavras | [keyword presente?] | [gap] | Alto |
| H2 — Seção Problema | [atual] | [gap] | Médio |
| H2 — Seção Solução | [atual] | [gap] | Médio |
| H2 — Seção Prova | [atual] | [gap] | Médio |

## FAQ Candidates para Schema
1. [Pergunta] → [Resposta já presente no copy]
2. [Pergunta] → [Resposta]

## E-E-A-T Assessment
- Experience: [Presente/Ausente — o quê encontrado ou faltando]
- Expertise: [Presente/Ausente]
- Authoritativeness: [Presente/Ausente]
- Trustworthiness: [Presente/Ausente]

## Prioridades de Otimização
P1 (Alto impacto, fácil): [lista]
P2 (Alto impacto, médio esforço): [lista]
P3 (Nice to have): [lista]
```

## Critérios de Qualidade

- [ ] Mínimo 5 keywords avaliadas antes de selecionar a primária
- [ ] Keyword primária com justificativa de intent e competição
- [ ] Tabela de auditoria on-page completa para todos elementos
- [ ] FAQ candidates listados (mínimo 2, ou "nenhum identificado" se não há)
- [ ] E-E-A-T assessment com evidências específicas do copy

## Condições de Veto

- Keyword primária selecionada sem pesquisa (só "intuição")
- Nenhum elemento on-page auditado
- E-E-A-T assessment ausente
