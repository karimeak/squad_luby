---
task: "Save Articles to Supabase"
order: 2
input: |
  - reviewed_article_en: {name}/reviewed-article-en.md
  - reviewed_article_pt: {name}/reviewed-article-pt.md
  - collaborator: dados do collaborator (id, name)
  - supabase_config: squads/ghostwriter-linkedin-article/pipeline/data/supabase-config.json
output: |
  - save_confirmation: {name}/save-confirmation.md
---

# Save Articles to Supabase

Insere os artigos EN e PT-BR na tabela bloggers do Supabase com submitted_content=false (aguardando publicação manual).

## Process

1. **Ler supabase-config.json**: Extrair URL e anon key.

2. **Ler reviewed-article-en.md** e **reviewed-article-pt.md**: Conteúdo completo de cada artigo.

3. **Inserir artigo EN na tabela bloggers**:
   ```bash
   curl -s -X POST "{supabase_url}/rest/v1/bloggers" \
     -H "apikey: {anon_key}" \
     -H "Authorization: Bearer {anon_key}" \
     -H "Content-Type: application/json" \
     -H "Prefer: return=representation" \
     -d '{
       "collaborator_id": "{uuid}",
       "content": "{artigo EN completo — escapado}",
       "submitted_content": false
     }'
   ```
   Extrair e salvar o `id` retornado como `blogger_id_en`.

4. **Inserir artigo PT-BR na tabela bloggers**:
   - Mesmo processo, com conteúdo PT-BR
   - Salvar `id` como `blogger_id_pt`

5. **Verificar inserções**:
   ```bash
   curl -s "{supabase_url}/rest/v1/bloggers?collaborator_id=eq.{uuid}&submitted_content=eq.false&order=created_at.desc&limit=2" \
     -H "apikey: {anon_key}" \
     -H "Authorization: Bearer {anon_key}"
   ```

6. **Produzir save-confirmation.md**.

## Output Format

```markdown
# Save Confirmation — {name}

- blogger_id_en: {uuid}
- blogger_id_pt: {uuid}
- collaborator_id: {uuid}
- submitted_content: false
- Timestamp: {ISO datetime}
```

## Quality Criteria

- [ ] 2 registros inseridos (EN + PT-BR)
- [ ] IDs retornados pelo Supabase salvos
- [ ] Verificação de inserção feita
- [ ] submitted_content=false em ambos

## Veto Conditions

Reject and redo if ANY are true:
1. Supabase retornou erro na inserção — registrar e não avançar
2. IDs não foram retornados — não é possível atualizar submitted_content depois
