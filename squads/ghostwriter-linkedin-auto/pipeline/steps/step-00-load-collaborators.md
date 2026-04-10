---
step: step-00-load-collaborators
name: Carga de Colaboradores e Match de Flavors
type: agent
agent: lucas
execution: inline
---

# Step 00 — Carga de Colaboradores e Match de Flavors

## Objetivo
Carregar todos os colaboradores da tabela `collaborators` do Supabase e fazer match automatico de flavor (tema) para cada um baseado nos seus topicos de expertise.

## Instrucoes para Lucas

### 1. Ler configuracao Supabase
Ler `squads/ghostwriter-linkedin-auto/pipeline/data/supabase-config.json` para obter URL e anon key.

### 2. Fetch collaborators
```bash
curl -s "{supabase_url}/rest/v1/collaborators?select=*" \
  -H "apikey: {anon_key}" \
  -H "Authorization: Bearer {anon_key}"
```

### 3. Fetch related_searchs (tabela de flavors)
```bash
curl -s "{supabase_url}/rest/v1/related_searchs?select=query,related_search" \
  -H "apikey: {anon_key}" \
  -H "Authorization: Bearer {anon_key}"
```

### 4. Match flavor por collaborator
Para cada collaborator:
- Pegar o array `topics` do collaborator
- Para cada topic, buscar match parcial (case-insensitive) em `related_searchs.query`
- Do conjunto de matches encontrados, selecionar 1 `related_search` como flavor
- Se existir `post-history.json`, evitar flavors usados recentemente pelo mesmo collaborator
- Se nenhum match encontrado: usar o primeiro related_search disponivel

### 5. Produzir output
Salvar `collaborator-queue.json` no diretorio de output do run com a lista completa de collaborators + flavor selecionado.

Formato:
```json
[
  {
    "id": "uuid",
    "name": "Wagner",
    "role": "Comercial / Gestao de contas",
    "audience_en": "...",
    "audience_pt": "...",
    "objective_en": "...",
    "objective_pt": "...",
    "topics": ["..."],
    "tone_en": "...",
    "tone_pt": "...",
    "voice_markers_en": ["..."],
    "voice_markers_pt": ["..."],
    "avoid": ["..."],
    "linkedin_url": "...",
    "email": "...",
    "flavor": "selected related_search text"
  }
]
```

## Output
- `collaborator-queue.json` — lista de todos os collaborators com flavor atribuido

## Next
step-01-research (Marco pesquisa o flavor de cada collaborator)
