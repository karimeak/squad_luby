---
task: "Send Email to Collaborator"
order: 3
input: |
  - humanized_article_en: {name}/humanized-article-en.md
  - humanized_article_pt: {name}/humanized-article-pt.md
  - image_metadata: {name}/image-prompt.md (linha `**Image URL:**`)
  - save_confirmation: {name}/save-confirmation.md
  - collaborator: dados do collaborator (email, name, flavor)
  - smtp_config: squads/ghostwriter-linkedin-article/pipeline/data/smtp-config.json
  - supabase_config: squads/ghostwriter-linkedin-article/pipeline/data/supabase-config.json
output: |
  - email_confirmation: {name}/email-confirmation.md
---

# Send Email to Collaborator

Envia email para o collaborator com os artigos EN e PT-BR (humanizados) + a capa real do artigo (URL pública do Supabase Storage), com instruções claras de publicação manual no LinkedIn.

> A capa do email é a MESMA imagem que o collaborator deve publicar como cover do artigo LinkedIn. Não há mais imagem decorativa separada.

## Process

1. **Ler todos os inputs**: smtp-config.json, supabase-config.json, artigos humanizados, image-prompt.md, save-confirmation.md.

2. **Extrair `image_url`** do arquivo `image-prompt.md`:
   - Localizar a linha que começa com `**Image URL:**`
   - Extrair a URL completa
   - Se o valor for `null` ou vazio (upload falhou no step-06), enviar `image_url` como string vazia no payload — a edge function deve omitir a tag `<img>` no template do email

3. **Preparar payload do email**:
   ```json
   {
     "mode": "linkedin-article",
     "zoho_user": "{smtp-config.zoho_user}",
     "zoho_pass": "{smtp-config.zoho_pass}",
     "from_name": "{smtp-config.from_name}",
     "collaborator_email": "{collaborator.email}",
     "collaborator_name": "{collaborator.name}",
     "flavor": "{collaborator.flavor}",
     "article_en": "{conteúdo humanized-article-en.md — escapado}",
     "article_pt": "{conteúdo humanized-article-pt.md — escapado}",
     "image_url": "{URL extraída de image-prompt.md ou string vazia}",
     "blogger_id_en": "{id EN de save-confirmation.md}",
     "blogger_id_pt": "{id PT de save-confirmation.md}",
     "run_date": "{YYYY-MM-DD}"
   }
   ```

4. **Chamar a Edge Function**:
   ```bash
   curl -s -X POST "{edge_function_url}" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer {SUPABASE_ANON_KEY}" \
     -d '{payload JSON}'
   ```

5. **Verificar resposta**:
   - 200/201 → Email enviado com sucesso
   - 4xx/5xx → Logar erro, tentar 1x. Se falhar: registrar `email_failed` e continuar

6. **Atualizar submitted_content no Supabase**:
   ```bash
   curl -s -X PATCH "{SUPABASE_URL}/rest/v1/bloggers?id=eq.{blogger_id_en}" \
     -H "apikey: {SUPABASE_ANON_KEY}" \
     -H "Authorization: Bearer {SUPABASE_ANON_KEY}" \
     -H "Content-Type: application/json" \
     -H "Prefer: return=minimal" \
     -d '{"submitted_content": true}'
   ```
   Repetir para `blogger_id_pt`.

7. **Produzir email-confirmation.md**.

## Output Format

```markdown
# Email Delivery — {name}

- Collaborator: {email} — {✓ enviado | ✗ falhou}
- Article EN: ✓ incluído
- Article PT-BR: ✓ incluído
- Image URL: {URL pública | ✗ sem URL}
- submitted_content EN: true ✓
- submitted_content PT: true ✓
- Timestamp: {ISO datetime}
```

## Quality Criteria

- [ ] Email enviado com artigos EN + PT-BR + image_url
- [ ] image_url propagado no payload (ou string vazia se geração falhou)
- [ ] submitted_content atualizado para true após envio
- [ ] Erros registrados sem bloquear o pipeline

## Veto Conditions

Reject and redo if ANY are true:
1. submitted_content não atualizado após envio bem-sucedido — inconsistência de estado
