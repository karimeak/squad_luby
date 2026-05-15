---
task: rank-stories
order: 2
agent: cleo
input: Lista de candidatos de find-news.md
output: squads/linkedin-luby/output/news-report.md (top 5 ranqueadas)
---

## Process

1. Aplicar matriz de pontuação a cada candidata:
   - Urgência: publicada < 24h = 3pts | < 48h = 2pts | < 7 dias = 1pt | evergreen = 0
   - Relevância para Luby: CTOs/CIOs/decisores = 3pts | gerentes tech = 2pts | geral = 1pt
   - Potencial de ângulos: 3+ ângulos possíveis = 3pts | 2 = 2pts | 1 = 1pt
   - Dados disponíveis: dados proprietários/pesquisa = 3pts | dados de mercado = 2pts | sem dados = 0
2. Ordenar pelo score total (máximo 12 pontos)
3. Selecionar top 5
4. Para cada top 5: ler a história completa via web_fetch para escrever análise rica
5. Gerar `news-report.md` com tabela de ranking + análise completa de cada história

## Output Format

```markdown
# Relatório de Pesquisa — {data}

**Foco:** {tema do research-focus.md}
**Período:** {período definido pelo usuário}
**Fontes varridas:** {lista de fontes consultadas}

---

## Top 5 Histórias — Ranking

| # | Título | Fonte | Data | Score |
|---|---|---|---|---|
| 1 | {título} | {fonte} | {data} | {X}/12 |
...

---

## Análise por História

### #1 — {título}
**Fonte:** {nome} — {url}
**Resumo:** {2-3 frases sobre o conteúdo real da história}
**Por que importa para a Luby:** {como conecta ao negócio/audiência da Luby}
**Ângulos potenciais:** {lista de ângulos possíveis: Alerta, Oportunidade, Educacional, etc.}
**Urgência:** {Alta / Média / Evergreen — com justificativa}

[repetir para #2 a #5]
```

## Output Example

```markdown
# Relatório de Pesquisa — 2026-03-26

**Foco:** Adoção de IA em times de engenharia enterprise
**Período:** Últimas 48 horas
**Fontes varridas:** TechCrunch, VentureBeat, HN, ProductHunt, ZDNet

---

## Top 5 Histórias — Ranking

| # | Título | Fonte | Data | Score |
|---|---|---|---|---|
| 1 | OpenAI lança GPT-5 com coding autônomo (85% acurácia) | VentureBeat | 2026-03-25 | 11/12 |
| 2 | 73% das migrações enterprise falham por dívida técnica | TechCrunch | 2026-03-24 | 10/12 |
| 3 | Cursor AI atinge 1M de devs pagantes | HN | 2026-03-25 | 9/12 |
| 4 | Nearshore cresce 40% em LATAM com demanda de IA | ZDNet | 2026-03-23 | 8/12 |
| 5 | Devin 2.0 — agente de engenharia autônoma | ProductHunt | 2026-03-25 | 7/12 |

---

## Análise por História

### #1 — OpenAI lança GPT-5 com coding autônomo
**Fonte:** VentureBeat — https://venturebeat.com/ai/openai-gpt5-coding/
**Resumo:** GPT-5 demonstra 85% de acurácia no HumanEval benchmark, superando GPT-4
em 23 pontos percentuais. Primeiros contratos enterprise com Goldman Sachs e Microsoft
anunciados. Capacidade de escrever, testar e debugar código de forma autônoma em projetos
de até 5.000 linhas.
**Por que importa para a Luby:** Impacto direto na proposta de valor de staff augmentation.
CTOs vão perguntar: "Por que contratar engenheiro se GPT-5 programa sozinho?" A Luby tem
uma resposta poderosa: somos especialistas em integrar IA em times — não competimos com ela.
**Ângulos potenciais:** Alerta, Oportunidade, Contrário, Educacional
**Urgência:** Alta — publicado ontem; pico de discussão nas próximas 24-48h
```

## Quality Criteria

- [ ] Exatamente 5 histórias no relatório
- [ ] Score calculado com todos os 4 critérios para cada história
- [ ] Análise de cada história lida via web_fetch (não apenas título)
- [ ] "Por que importa para a Luby" presente e específico em cada análise
- [ ] Arquivo salvo em `squads/linkedin-luby/output/news-report.md`

## Veto Conditions

- Score máximo entre as candidatas < 6/12 → ampliar pesquisa e buscar mais histórias
- "Por que importa para a Luby" genérico ou vazio → reescrever antes de finalizar
