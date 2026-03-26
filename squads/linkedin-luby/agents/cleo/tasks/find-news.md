---
task: find-news
order: 1
agent: cleo
input: squads/linkedin-luby/output/research-focus.md
output: Lista bruta de candidatos a notícias (10-15 histórias)
---

## Process

1. Ler `squads/linkedin-luby/output/research-focus.md` — extrair tema e período temporal
2. Realizar buscas em Tier 1 (web_search):
   - `"{tema}" site:techcrunch.com`
   - `"{tema}" enterprise AI site:venturebeat.com`
   - `"{tema}" site:news.ycombinator.com`
   - `"{tema}" launch site:producthunt.com`
3. Se Tier 1 retornar menos de 8 candidatos, buscar Tier 2:
   - `"{tema}" enterprise site:zdnet.com`
   - `"{tema}" B2B site:thenextweb.com`
   - `"{tema}" site:arstechnica.com`
4. Para cada resultado: verificar URL com web_fetch para confirmar conteúdo real (não apenas título)
5. Filtrar candidatos que NÃO são: consumer tech, lifestyle, gaming, redes sociais de consumidor

## Output Format

```yaml
candidates:
  - title: ""
    source: ""
    url: ""
    date: ""
    summary: ""  # 1-2 frases
    has_data: true/false
    relevance_tags: []  # ex: [ai, enterprise, nearshore, modernization]
```

## Output Example

```yaml
candidates:
  - title: "OpenAI launches GPT-5 with autonomous coding capabilities"
    source: VentureBeat
    url: https://venturebeat.com/...
    date: "2026-03-25"
    summary: "GPT-5 demonstrates 85% accuracy on HumanEval benchmark. First enterprise contracts announced."
    has_data: true
    relevance_tags: [ai, enterprise, engineering-teams, software-development]

  - title: "73% of enterprise legacy migrations fail due to hidden technical debt"
    source: TechCrunch
    url: https://techcrunch.com/...
    date: "2026-03-24"
    summary: "Survey of 500 CIOs shows unmapped technical debt is the leading cause of budget overruns in modernization projects."
    has_data: true
    relevance_tags: [legacy-modernization, enterprise, technical-debt, migration]
```

## Quality Criteria

- [ ] Mínimo 10 candidatos encontrados (buscar Tier 2 se Tier 1 insuficiente)
- [ ] Toda candidata tem URL verificado com web_fetch
- [ ] Apenas histórias B2B enterprise — sem consumer tech, lifestyle ou gaming
- [ ] Período temporal respeitado (ou ampliado com nota se insuficiente)

## Veto Conditions

- Menos de 5 candidatos após varrer Tier 1 e Tier 2 → ampliar período e buscar novamente
- Candidata sem URL verificável → descartar
