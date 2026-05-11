---
execution: inline
agent: lucas
inputFile: squads/ghostwriter-linkedin-article/output/{name}/humanized-article-en.md
outputFile: squads/ghostwriter-linkedin-article/output/{name}/save-confirmation.md
model_tier: powerful
---

# Step 07 — Salvar no Supabase

## Context Loading

- `squads/ghostwriter-linkedin-article/pipeline/data/supabase-config.json` — URL e anon key
- `squads/ghostwriter-linkedin-article/output/{name}/humanized-article-en.md` — artigo EN revisado + humanizado
- `squads/ghostwriter-linkedin-article/output/{name}/humanized-article-pt.md` — artigo PT-BR revisado + humanizado
- `squads/ghostwriter-linkedin-article/output/{name}/image-prompt.md` — contém linha `**Image URL:**` (Supabase Storage public URL ou `null` se geração falhou)
- `squads/ghostwriter-linkedin-article/output/collaborator-queue.json` — id do collaborator
- `squads/ghostwriter-linkedin-article/agents/lucas/tasks/save-to-supabase.md` — instruções detalhadas

## Instructions

### Process

1. Ler supabase-config.json, artigos humanizados (EN e PT-BR), image-prompt.md e collaborator-queue.json
2. Extrair `image_url` da linha `**Image URL:**` em `image-prompt.md` (pode ser URL pública do Supabase Storage ou `null`)
3. Inserir artigo EN na tabela bloggers com `image_url` populado e `submitted_content=false`
4. Inserir artigo PT-BR na tabela bloggers com o MESMO `image_url` (ambos os idiomas compartilham a mesma capa) e `submitted_content=false`
5. Verificar inserções — extrair e salvar os IDs retornados
6. Produzir save-confirmation.md com blogger_id_en, blogger_id_pt e image_url

## Output Format

```markdown
# Save Confirmation — {name}

- blogger_id_en: {uuid}
- blogger_id_pt: {uuid}
- collaborator_id: {uuid}
- image_url: {URL pública ou null}
- submitted_content: false
- Timestamp: {ISO datetime}
```

## Veto Conditions

Reject and redo if ANY are true:
1. Supabase retornou erro na inserção
2. IDs não foram retornados pelo Supabase

**Não veta** se `image_url` for `null` — campo é nullable na tabela `bloggers`; step-08 omite a tag `<img>` no email quando null.

## Quality Criteria

- [ ] 2 registros inseridos (EN + PT-BR)
- [ ] IDs salvos em save-confirmation.md
- [ ] image_url populado em ambos (ou null se geração falhou)
- [ ] submitted_content=false confirmado
