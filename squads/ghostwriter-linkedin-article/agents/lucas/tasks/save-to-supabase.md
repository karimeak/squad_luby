---
task: "Save Articles to Supabase"
order: 2
input: |
  - humanized_article_en: {name}/humanized-article-en.md
  - humanized_article_pt: {name}/humanized-article-pt.md
  - image_metadata: {name}/image-prompt.md (linha `**Image URL:**`)
  - collaborator: dados do collaborator (id, name)
  - supabase_config: squads/ghostwriter-linkedin-article/pipeline/data/supabase-config.json
output: |
  - save_confirmation: {name}/save-confirmation.md
---

# Save Articles to Supabase

Insere os artigos EN e PT-BR (humanizados) na tabela bloggers do Supabase, populando `image_url` com a URL pública da capa gerada pela Diana. `submitted_content=false` (aguardando publicação manual pelo collaborator).

## Process

1. **Ler supabase-config.json**: Extrair URL e anon key.

2. **Ler humanized-article-en.md** e **humanized-article-pt.md**: Conteúdo completo de cada artigo.

3. **Ler image-prompt.md** e extrair `image_url`:
   - Localizar a linha que começa com `**Image URL:**`
   - Extrair a URL completa (ou `null` se a geração falhou)
   - Ambos os artigos (EN e PT) compartilham a MESMA `image_url` (uma capa por collaborator/dia/flavor)

4. **Inserir artigo EN na tabela bloggers**:
   ```bash
   curl -s -X POST "{supabase_url}/rest/v1/bloggers" \
     -H "apikey: {anon_key}" \
     -H "Authorization: Bearer {anon_key}" \
     -H "Content-Type: application/json" \
     -H "Prefer: return=representation" \
     -d '{
       "collaborator_id": "{uuid}",
       "content": "{artigo EN completo — escapado}",
       "image_url": "{URL pública ou null}",
       "submitted_content": false
     }'
   ```
   Extrair e salvar o `id` retornado como `blogger_id_en`.

5. **Inserir artigo PT-BR na tabela bloggers**:
   - Mesmo processo, com conteúdo PT-BR e MESMA `image_url`
   - Salvar `id` como `blogger_id_pt`

6. **Verificar inserções**:
   ```bash
   curl -s "{supabase_url}/rest/v1/bloggers?collaborator_id=eq.{uuid}&submitted_content=eq.false&order=created_at.desc&limit=2" \
     -H "apikey: {anon_key}" \
     -H "Authorization: Bearer {anon_key}"
   ```

7. **Produzir save-confirmation.md**.

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

## Quality Criteria

- [ ] 2 registros inseridos (EN + PT-BR)
- [ ] image_url populado em ambos com a mesma URL (ou null se geração falhou)
- [ ] IDs retornados pelo Supabase salvos
- [ ] Verificação de inserção feita
- [ ] submitted_content=false em ambos

## Veto Conditions

Reject and redo if ANY are true:
1. Supabase retornou erro na inserção — registrar e não avançar
2. IDs não foram retornados — não é possível atualizar submitted_content depois

**Não veta** se `image_url` for `null` — campo é nullable.
