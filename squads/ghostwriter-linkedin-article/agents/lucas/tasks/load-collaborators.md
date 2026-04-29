---
task: "Load Collaborators from Supabase"
order: 1
input: |
  - supabase_config: squads/ghostwriter-linkedin-article/pipeline/data/supabase-config.json
  - test_filter: nomes dos collaborators a processar (opcional — para runs de teste)
output: |
  - collaborator_queue: collaborator-queue.json no diretório de output do run
---

# Load Collaborators from Supabase

Carrega collaborators do Supabase, faz match de flavor por tópicos e produz collaborator-queue.json. Suporta filtro por nome para runs de teste.

## Process

1. **Ler supabase-config.json**: Extrair `supabase_url` e `supabase_anon_key`.

2. **Fetch collaborators**:
   ```bash
   curl -s "{supabase_url}/rest/v1/collaborators?select=*" \
     -H "apikey: {anon_key}" \
     -H "Authorization: Bearer {anon_key}"
   ```

3. **Aplicar filtro de teste** (se fornecido):
   - Se o run especifica `test_collaborators: ["Rodrigo", "Karime"]`, filtrar a lista para incluir apenas esses nomes
   - Registrar: "Test mode: processing {N} collaborators: {names}"

4. **Fetch related_searchs**:
   ```bash
   curl -s "{supabase_url}/rest/v1/related_searchs?select=query,related_search" \
     -H "apikey: {anon_key}" \
     -H "Authorization: Bearer {anon_key}"
   ```

5. **Match flavor por collaborator**:
   - Para cada collaborator, pegar seu array `topics`
   - Para cada topic, buscar match em related_searchs.query (case-insensitive, partial match)
   - Do conjunto de matches, selecionar 1 related_search como flavor
   - Priorizar flavors não usados recentemente

6. **Produzir collaborator-queue.json** e salvar no diretório de output do run.

## Output Format

```json
[
  {
    "id": "uuid",
    "name": "Rodrigo",
    "role": "...",
    "audience_en": "...",
    "audience_pt": "...",
    "objective_en": "...",
    "objective_pt": "...",
    "tone_en": "...",
    "tone_pt": "...",
    "voice_markers_en": ["..."],
    "voice_markers_pt": ["..."],
    "topics": ["..."],
    "avoid": ["..."],
    "linkedin_url": "...",
    "email": "...",
    "flavor": "selected flavor text"
  }
]
```

## Quality Criteria

- [ ] Collaborators carregados do Supabase com resposta verificada
- [ ] Filtro de teste aplicado se fornecido
- [ ] Flavor matched por topics para cada collaborator
- [ ] collaborator-queue.json salvo no diretório de output

## Veto Conditions

Reject and redo if ANY are true:
1. Supabase retornou erro — verificar URL e anon key
2. collaborator-queue.json vazio — nenhum collaborator encontrado
