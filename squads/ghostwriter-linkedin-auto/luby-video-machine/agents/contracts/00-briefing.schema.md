# Contrato 00 — Briefing

**Quem produz**: humano (operador da máquina) ou squad externo via API
**Quem consome**: Estrategista
**Arquivo gerado**: `agents/runs/{run-id}/00-briefing.md`

---

## Schema

```yaml
type: object
required:
  - title
  - source
  - content
  - language
  - mode
properties:
  title:
    type: string
    description: "Título curto da run, usado para identificação"

  source:
    type: enum
    values: [url, text, topic]
    description: "Origem do briefing"

  content:
    type: string
    description: |
      Se source=url: URL completa
      Se source=text: texto cru com a ideia
      Se source=topic: tema amplo (1-2 linhas)

  language:
    type: enum
    values: [pt, en]
    description: "Idioma principal do vídeo"

  mode:
    type: enum
    values: [corporate, personal]
    description: "Conta da Luby ou conta de colaborador"

  speaker:
    type: object | null
    properties:
      name: string
      role: string
    description: "Apenas se mode=personal"

  constraints:
    type: object
    properties:
      deadline: ISO date string
      priority: enum [normal, urgent]
      avoid_topics: array of string
    optional: true

  references:
    type: array of string
    description: |
      Links de inspiração visual ou de conteúdo
    optional: true

  notes:
    type: string
    description: |
      Observações livres do solicitante
    optional: true
```

## Formato do arquivo (markdown estruturado)

```markdown
# Briefing — {title}

## Metadata
- **Source**: url | text | topic
- **Language**: pt | en
- **Mode**: corporate | personal
- **Speaker**: {name, role} (se mode=personal)
- **Priority**: normal | urgent
- **Deadline**: YYYY-MM-DD (opcional)

## Content
{conteúdo conforme source — link, texto ou tema}

## References (opcional)
- link 1
- link 2

## Constraints (opcional)
- Evitar: tópico X, tópico Y
- Outras restrições

## Notes (opcional)
{observações livres}
```

## Exemplo mínimo válido

```markdown
# Briefing — Acelerar com IA sem perder segurança

## Metadata
- **Source**: text
- **Language**: pt
- **Mode**: corporate

## Content
Queremos um vídeo que comunique nosso diferencial: usamos IA para acelerar
3-5x o desenvolvimento, MAS com toda a rigorosidade de segurança e
compliance que clientes Fortune 500 exigem. Não é "AI hype" — é
engenharia disciplinada potencializada por IA.

Público-alvo: CTOs e VPs de Engineering preocupados com risco de
adoção de IA em código.
```

## Validações pelo Estrategista

O Estrategista pode rejeitar / pedir refinamento se:
- Faltam campos obrigatórios
- Content é raso demais (menos de 2 frases sem contexto)
- Constraints contradizem objetivo (ex: deadline urgent + priority normal)
- Mode personal sem speaker definido
