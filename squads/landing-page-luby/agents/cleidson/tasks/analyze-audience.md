# Task: Análise de Audiência

## Descrição
Analisar o briefing da landing page para construir um perfil detalhado da audiência,
mapeando nível de consciência, drivers de decisão, objeções e benchmarks de concorrentes.

## Input
`squads/landing-page-luby/output/briefing.md`

## Processo

1. **Ler o briefing completo** — produto/serviço, objetivo da LP, público-alvo descrito,
   concorrentes mencionados

2. **Construir perfil da audiência primária**:
   - Cargo e responsabilidades típicas
   - Empresa (tamanho, setor, maturidade digital)
   - Contexto de decisão: quem decide, quem influencia, quem veta
   - Métricas de sucesso que importam para essa persona

3. **Mapear dores primárias** (mínimo 4):
   - Usar linguagem da audiência, não da empresa
   - Ordenar por intensidade (qual dói mais?)
   - Identificar qual dor a LP desta sessão está endereçando

4. **Mapear objeções de compra** (mínimo 4):
   - Preço / ROI incerto
   - Prazo de onboarding
   - Qualidade / senioridade dos profissionais
   - Risco de dependência do fornecedor
   - Experiência no setor/stack específico
   Identificar qual é a objeção MAIS crítica para esta audiência

5. **Identificar nível de consciência** (Eugene Schwartz):
   - Unaware / Problem Aware / Solution Aware / Product Aware / Most Aware
   - Justificar com base no comportamento esperado do visitante

6. **Identificar sofisticação de mercado** (Stage 1-5):
   - Pesquisar (web_search) o que os principais concorrentes estão prometendo
   - Identificar qual promessa domina o mercado
   - Definir em qual estágio de sofisticação está a audiência

7. **Pesquisar landing pages de concorrentes** (web_fetch nas URLs relevantes):
   - Ver estrutura, headline, CTA, prova social
   - Identificar o que fazem bem e onde há gaps

8. **Definir driver dominante** (apenas um):
   - Medo de perda / Desejo de status / Segurança / Controle / Achievement / Liberdade / Pertencimento
   - Justificar com base no perfil da audiência e no contexto de decisão

## Output Format

```markdown
# Relatório de Audiência — [Nome da LP]

## Perfil da Audiência Primária
- **Cargo principal:** [cargo]
- **Empresa-alvo:** [tamanho, setor]
- **Decisão:** [quem decide, quem influencia]
- **Métricas que importam:** [KPIs da persona]

## Dores Primárias (ordenadas por intensidade)
1. [Dor mais intensa — em linguagem da audiência]
2. [Segunda dor]
3. [Terceira dor]
4. [Quarta dor]

## Objeção Mais Crítica
**[Nome da objeção]:** [Descrição da objeção como o visitante pensa]

## Nível de Consciência: [Nível]
**Justificativa:** [Por que este nível, baseado no comportamento esperado]

## Sofisticação de Mercado: Stage [N]
**Promessa dominante no mercado:** [O que todo mundo está dizendo]
**Implicação para a LP:** [O que a Luby precisa fazer diferente]

## Benchmarks de Concorrentes
| Concorrente | Promessa principal | Ponto forte | Gap |
|------------|-------------------|-------------|-----|
| [concorrente] | [promessa] | [ponto forte] | [gap] |

## Driver Dominante: [Driver]
**Justificativa:** [Por que este driver para esta audiência]
```

## Critérios de Qualidade

- [ ] Perfil de audiência específico para o briefing (não genérico)
- [ ] Mínimo 4 dores em linguagem da audiência
- [ ] Objeção mais crítica identificada e justificada
- [ ] Nível de consciência com justificativa clara
- [ ] Pesquisa de concorrentes com evidências (URLs visitadas)
- [ ] Driver dominante único com raciocínio
- [ ] Output salvo em squads/landing-page-luby/output/audience-report.md

## Condições de Veto

- Nível de consciência não identificado (bloqueia toda a estratégia)
- Nenhuma pesquisa de concorrentes realizada
- Driver dominante é múltiplo ou ausente
