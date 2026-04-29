---
execution: inline
agent: lucas
inputFile: squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-en.md
outputFile: squads/ghostwriter-linkedin-article/output/{name}/save-confirmation.md
model_tier: powerful
---

# Step 07 — Salvar no Supabase

## Context Loading

- `squads/ghostwriter-linkedin-article/pipeline/data/supabase-config.json` — URL e anon key
- `squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-en.md` — artigo EN revisado
- `squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-pt.md` — artigo PT-BR revisado
- `squads/ghostwriter-linkedin-article/output/collaborator-queue.json` — id do collaborator
- `squads/ghostwriter-linkedin-article/agents/lucas/tasks/save-to-supabase.md` — instruções detalhadas

## Instructions

### Process

1. Ler supabase-config.json, artigos revisados e collaborator-queue.json
2. Inserir artigo EN na tabela bloggers (submitted_content=false)
3. Inserir artigo PT-BR na tabela bloggers (submitted_content=false)
4. Verificar inserções — extrair e salvar os IDs retornados
5. Produzir save-confirmation.md com blogger_id_en e blogger_id_pt

## Output Format

```markdown
# Save Confirmation — {name}

- blogger_id_en: {uuid}
- blogger_id_pt: {uuid}
- collaborator_id: {uuid}
- submitted_content: false
- Timestamp: {ISO datetime}
```

## Veto Conditions

Reject and redo if ANY are true:
1. Supabase retornou erro na inserção
2. IDs não foram retornados pelo Supabase

## Quality Criteria

- [ ] 2 registros inseridos (EN + PT-BR)
- [ ] IDs salvos em save-confirmation.md
- [ ] submitted_content=false confirmado
