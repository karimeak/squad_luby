---
execution: inline
agent: lucas
outputFile: squads/ghostwriter-linkedin-article/output/collaborator-queue.json
model_tier: powerful
---

# Step 00 — Carga de Colaboradores

## Context Loading

- `squads/ghostwriter-linkedin-article/pipeline/data/supabase-config.json` — URL e anon key do Supabase
- `squads/ghostwriter-linkedin-article/agents/lucas/tasks/load-collaborators.md` — instruções detalhadas

## Instructions

### Process

1. Executar a task `load-collaborators.md` do Lucas: fetch collaborators + fetch related_searchs + match flavor
2. Se o run especifica `test_collaborators`, aplicar o filtro antes do match de flavor
3. Salvar `collaborator-queue.json` no diretório de output do run
4. Reportar: quantos collaborators carregados, quais flavors foram matched

## Output Format

```json
[
  {
    "id": "uuid",
    "name": "...",
    "role": "...",
    "flavor": "...",
    "email": "...",
    ...
  }
]
```

## Output Example

```json
[
  {
    "id": "abc-123",
    "name": "Rodrigo",
    "role": "CTO",
    "flavor": "AI agents in enterprise software development",
    "email": "rodrigo@luby.com.br",
    "topics": ["AI", "engineering", "cloud"],
    "voice_markers_en": ["In practice", "What I've seen work"],
    "voice_markers_pt": ["Na prática", "O que funciona de verdade"]
  },
  {
    "id": "def-456",
    "name": "Karime",
    "role": "Tech Lead / AI Automation",
    "flavor": "multi-agent orchestration for business automation",
    "email": "karime.kumagai@luby.com.br",
    "topics": ["AI", "automation", "agents"]
  }
]
```

## Veto Conditions

Reject and redo if ANY are true:
1. collaborator-queue.json está vazio — erro na carga do Supabase
2. Algum collaborator não tem flavor matched — verificar related_searchs

## Quality Criteria

- [ ] Todos os collaborators carregados do Supabase
- [ ] Filtro de teste aplicado (se fornecido)
- [ ] Flavor matched para cada collaborator
- [ ] collaborator-queue.json salvo no output do run
