---
step: step-08-save-to-supabase
name: Salvar no Supabase
type: agent
agent: lucas
execution: inline
---

# Step 07 — Salvar no Supabase

## Objetivo
Lucas salva os posts revisados (EN e PT-BR) na tabela `bloggers` do Supabase para cada collaborator. Os posts ficam com `submitted_content = false` ate que o workflow n8n os envie por email.

## Instrucoes para Lucas

### Input
- `{name}/humanized-post-en.md` — post EN final (pos-Pedro humanization)
- `{name}/humanized-post-pt.md` — post PT-BR final (pos-Pedro humanization)
- `{name}/image-suggestion.md` — campo `**Image URL:**` com URL pública do Supabase Storage (ou `null` se upload falhou)
- Dados do collaborator (collaborator-queue.json) — especialmente id (uuid)
- Ler supabase-config.json para URL e key

### Processo

Para cada collaborator processado:

1. **Ler o conteudo dos posts revisados** (EN e PT-BR) e o `image_url` do `image-suggestion.md`

   Localizar a linha que comeca com `**Image URL:**` e extrair a URL. Se o valor for `null` ou ausente, enviar o campo como JSON `null` no insert (a coluna e nullable).

2. **Inserir post EN na tabela bloggers**:
   ```bash
   curl -X POST "{supabase_url}/rest/v1/bloggers" \
     -H "apikey: {anon_key}" \
     -H "Authorization: Bearer {anon_key}" \
     -H "Content-Type: application/json" \
     -H "Prefer: return=representation" \
     -d '{
       "collaborator_id": "{uuid}",
       "content": "{post EN completo - escaped}",
       "image_url": "{image_url ou null}",
       "submitted_content": false
     }'
   ```

3. **Inserir post PT-BR na tabela bloggers** (mesma `image_url` — uma imagem por run, ambas as linguas compartilham):
   ```bash
   curl -X POST "{supabase_url}/rest/v1/bloggers" \
     -H "apikey: {anon_key}" \
     -H "Authorization: Bearer {anon_key}" \
     -H "Content-Type: application/json" \
     -H "Prefer: return=representation" \
     -d '{
       "collaborator_id": "{uuid}",
       "content": "{post PT-BR completo - escaped}",
       "image_url": "{image_url ou null}",
       "submitted_content": false
     }'
   ```

4. **Verificar insercoes**: O retorno com `Prefer: return=representation` deve trazer os registros criados com seus IDs.

5. **Produzir confirmacao**:
   ```markdown
   # Save Confirmation — {name}

   - Post EN: blogger_id = {id_en} | chars: {count}
   - Post PT-BR: blogger_id = {id_pt} | chars: {count}
   - image_url: {URL ou null}
   - submitted_content: false (aguardando n8n)
   - Timestamp: {ISO datetime}
   ```

### Regras
- NUNCA salvar posts que nao passaram pela review (step-05)
- Se a insercao falhar, reportar o erro e tentar novamente 1x
- Escapar corretamente o conteudo JSON (newlines, aspas)

### Output
- `{name}/save-confirmation.md` no diretorio de output do run

## Next
step-09-send-email (Lucas envia email com o post para cada collaborator)
