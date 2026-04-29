---
task: "Research Flavor for Article"
order: 1
input: |
  - flavor: Tema/flavor selecionado para o collaborator (do collaborator-queue.json)
  - collaborator_name: Nome do collaborator
  - sources_file: squads/ghostwriter-linkedin-article/pipeline/data/sources.json
output: |
  - research_brief: Arquivo research-brief.md com findings, frameworks, case studies, angles e gaps
---

# Research Flavor for Article

Pesquisa profunda sobre o flavor para sustentar um artigo LinkedIn de 1.500-2.000 words com 3-5 seções de substância real.

## Process

1. **Ler sources.json** e identificar as fontes prioritárias EN, PT-BR, communities e research.

2. **Varrer fontes prioritárias** para o flavor:
   - Para cada fonte EN e research: `"{flavor}" site:{fonte}`
   - Para fontes de research (HBR, McKinsey, Gartner): buscar por frameworks, reports e data
   - Registrar quantas fontes produziram resultado substancial

3. **Buscas por profundidade** (artigos exigem mais que posts):
   - `"{flavor}" framework methodology 2024 2025 2026`
   - `"{flavor}" case study enterprise results`
   - `"{flavor}" research report statistics data`
   - `"{flavor}" mistakes pitfalls avoid`
   - `"{flavor}" best practices guide`
   - `"{flavor}" future trends predictions`

4. **Extrair dados concretos** de cada fonte:
   - Números, percentuais, valores monetários verificados
   - Nomes de empresas reais com resultados documentados
   - Frameworks e metodologias com nome próprio
   - Citações diretas de especialistas identificados
   - Datas e contextos temporais

5. **Identificar ângulos editoriais** com material suficiente para artigo:
   - **Autoritativo**: O collaborator tem perspectiva baseada em experiência que contradiz algo?
   - **Educacional**: Há um conceito que merece explicação em profundidade?
   - **Narrativo**: Há uma história ou caso que ilustra uma lição universal?
   - **Analítico**: Há dados que, analisados juntos, revelam algo não óbvio?
   - **Provocativo**: Há uma crença comum que os dados contradizem?
   - **Prático**: Há um processo ou framework que pode ser ensinado passo a passo?

6. **Montar research-brief.md** no formato padronizado.

## Output Format

```markdown
# Research Brief — {flavor}
**Collaborator:** {name}
**Idioma:** EN
**Data:** {YYYY-MM-DD}

---

## Key Findings

1. {Finding com dados concretos}
   - Confidence: HIGH/MEDIUM/LOW
   - Source: Nome — URL
   - Data da publicação: {data}

2. {Finding}
   ...

(mínimo 5 findings para artigo)

---

## Frameworks & Methodologies

- **{Nome do framework}**: {descrição em 2-3 frases} — Source: URL

---

## Case Studies

- **{Empresa/Projeto}**: {o que fizeram e qual resultado} — Source: URL

---

## Trending Angles

- **Autoritativo**: {descrição do ângulo + dados disponíveis}
- **Educacional**: {descrição + material disponível}
- **Analítico**: {descrição + dados disponíveis}
- **Provocativo**: {descrição + evidências}

---

## Material por Seção (sugestões)

- **Seção 1 — {tema sugerido}**: {dados e exemplos disponíveis}
- **Seção 2 — {tema sugerido}**: {dados disponíveis}
- **Seção 3 — {tema sugerido}**: {dados disponíveis}

---

## Sources

| # | Fonte | URL | Data | Relevância |
|---|-------|-----|------|-----------|

---

## Gaps

- {O que não foi encontrado ou tem cobertura insuficiente para uma seção}
```

## Output Example

```markdown
# Research Brief — AI Agents in Enterprise Software Development
**Collaborator:** Rodrigo
**Idioma:** EN
**Data:** 2026-04-29

---

## Key Findings

1. GitHub Copilot users complete tasks 55% faster on average for well-defined coding tasks
   - Confidence: HIGH
   - Source: GitHub Research Blog — https://github.blog/2022-09-07-research-quantifying-github-copilots-impact-on-developer-productivity/
   - Data da publicação: 2022-09-07

2. McKinsey (2024) estimates AI coding tools could automate 30-45% of software engineering tasks by 2030
   - Confidence: MEDIUM
   - Source: McKinsey Technology Report — https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/
   - Data da publicação: 2024-06-12

3. Gartner predicts that by 2027, 80% of enterprise software engineers will use AI assistants daily
   - Confidence: HIGH
   - Source: Gartner Research — https://www.gartner.com/en/newsroom/
   - Data da publicação: 2025-01-15

4. Teams using AI agents for code review report 40% reduction in critical bugs reaching production
   - Confidence: MEDIUM
   - Source: InfoQ Survey — https://www.infoq.com/articles/ai-code-review-survey-2025/
   - Data da publicação: 2025-03-02

5. The top 3 failure modes for AI agent adoption: context hallucination (67%), over-reliance without review (51%), security policy gaps (43%)
   - Confidence: HIGH
   - Source: OWASP AI Security Report 2025 — https://owasp.org/
   - Data da publicação: 2025-02-10

---

## Frameworks & Methodologies

- **"Human-in-the-Loop" AI Development**: Framework where AI agents handle generation/repetition while humans own architecture and review — Source: martinfowler.com/articles/ai-development-patterns.html
- **"AI-Augmented Sprint"**: Agile adaptation with dedicated AI tooling ceremonies — Source: InfoQ

---

## Case Studies

- **Luby internal (Rodrigo pode referenciar)**: Projetos com Copilot em produção desde 2024
- **Shopify Engineering**: Reduziu time-to-PR em 30% com AI pair programming — Source: Shopify Engineering Blog

---

## Trending Angles

- **Autoritativo**: "AI agents don't replace engineers — they expose which engineers were already doing shallow work." Dados: McKinsey 30-45% automation, mas aumento de demanda por arquitetos.
- **Educacional**: "How to integrate AI agents without creating a 'yes machine' that ships broken code" — Framework Human-in-the-Loop + dados OWASP.
- **Analítico**: "The GitHub Copilot 55% productivity gain sounds great until you look at what tasks it speeds up (and which it ignores)" — dados GitHub Research + InfoQ.
- **Provocativo**: "Everyone is adding AI to their dev process. Nobody is measuring if it actually works." — dados escassos de ROI verificado.

---

## Material por Seção (sugestões)

- **Seção 1 — O que os dados realmente dizem sobre produtividade**: GitHub 55%, McKinsey 2030, Gartner 2027
- **Seção 2 — Os 3 modos de falha mais comuns**: OWASP report com dados
- **Seção 3 — Framework Human-in-the-Loop na prática**: martinfowler + caso Shopify
- **Seção 4 — Como medir o que importa**: InfoQ survey + critérios sugeridos

---

## Sources

| # | Fonte | URL | Data | Relevância |
|---|-------|-----|------|-----------|
| 1 | GitHub Research | https://github.blog/... | 2022-09-07 | Alta |
| 2 | McKinsey | https://mckinsey.com/... | 2024-06-12 | Alta |
| 3 | Gartner | https://gartner.com/... | 2025-01-15 | Alta |
| 4 | InfoQ | https://infoq.com/... | 2025-03-02 | Média |
| 5 | OWASP | https://owasp.org/... | 2025-02-10 | Alta |

---

## Gaps

- ROI financeiro verificado de AI agents em times enterprise: dados escassos (maioria é vendor-driven)
- Dados de mercado brasileiro específicos: poucos estudos locais disponíveis
```

## Quality Criteria

- [ ] Mínimo 5 findings com fonte e confidence level
- [ ] Pelo menos 1 framework ou metodologia identificado
- [ ] Pelo menos 1 case study real
- [ ] Pelo menos 3 ângulos distintos com material suficiente para artigo
- [ ] Sugestões de material por seção (mínimo 3)
- [ ] Tabela Sources completa
- [ ] Seção Gaps preenchida

## Veto Conditions

Reject and redo if ANY are true:
1. Menos de 3 findings com fontes verificadas — insuficiente para artigo de substância
2. Nenhum framework ou case study encontrado — artigo ficará abstrato e genérico
