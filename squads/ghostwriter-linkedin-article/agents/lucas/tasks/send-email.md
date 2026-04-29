---
task: "Send Email to Collaborator"
order: 3
input: |
  - reviewed_article_en: {name}/reviewed-article-en.md
  - reviewed_article_pt: {name}/reviewed-article-pt.md
  - image_prompt: {name}/image-prompt.md
  - save_confirmation: {name}/save-confirmation.md
  - collaborator: dados do collaborator (email, name, flavor)
  - smtp_config: squads/ghostwriter-linkedin-article/pipeline/data/smtp-config.json
  - supabase_config: squads/ghostwriter-linkedin-article/pipeline/data/supabase-config.json
output: |
  - email_confirmation: {name}/email-confirmation.md
---

# Send Email to Collaborator

Envia email para o collaborator com os artigos EN e PT-BR + image prompt guide, com instruções claras de publicação manual no LinkedIn.

## Process

1. **Ler todos os inputs**: smtp-config.json, supabase-config.json, artigos revisados, image-prompt.md, save-confirmation.md.

2. **Preparar payload do email**:
   ```json
   {
     "mode": "linkedin-article",
     "zoho_user": "{smtp-config.zoho_user}",
     "zoho_pass": "{smtp-config.zoho_pass}",
     "from_name": "{smtp-config.from_name}",
     "collaborator_email": "{collaborator.email}",
     "collaborator_name": "{collaborator.name}",
     "flavor": "{collaborator.flavor}",
     "article_en": "{conteúdo reviewed-article-en.md — escapado}",
     "article_pt": "{conteúdo reviewed-article-pt.md — escapado}",
     "image_prompt": "{conteúdo image-prompt.md — escapado}",
     "blogger_id_en": "{id EN de save-confirmation.md}",
     "blogger_id_pt": "{id PT de save-confirmation.md}",
     "run_date": "{YYYY-MM-DD}"
   }
   ```

3. **Chamar a Edge Function**:
   ```bash
   curl -s -X POST "{edge_function_url}" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer {SUPABASE_ANON_KEY}" \
     -d '{payload JSON}'
   ```

4. **Verificar resposta**:
   - 200/201 → Email enviado com sucesso
   - 4xx/5xx → Logar erro, tentar 1x. Se falhar: registrar `email_failed` e continuar

5. **Atualizar submitted_content no Supabase**:
   ```bash
   curl -s -X PATCH "{SUPABASE_URL}/rest/v1/bloggers?id=eq.{blogger_id_en}" \
     -H "apikey: {SUPABASE_ANON_KEY}" \
     -H "Authorization: Bearer {SUPABASE_ANON_KEY}" \
     -H "Content-Type: application/json" \
     -H "Prefer: return=minimal" \
     -d '{"submitted_content": true}'
   ```
   Repetir para `blogger_id_pt`.

6. **Produzir email-confirmation.md**.

## Output Format

```markdown
# Email Delivery — {name}

- Collaborator: {email} — {✓ enviado | ✗ falhou}
- Article EN: ✓ incluído
- Article PT-BR: ✓ incluído
- Image Prompt: ✓ incluído
- submitted_content EN: true ✓
- submitted_content PT: true ✓
- Timestamp: {ISO datetime}
```

## Quality Criteria

- [ ] Email enviado com artigos EN + PT-BR + image prompt
- [ ] submitted_content atualizado para true após envio
- [ ] Erros registrados sem bloquear o pipeline

## Veto Conditions

Reject and redo if ANY are true:
1. submitted_content não atualizado após envio bem-sucedido — inconsistência de estado
