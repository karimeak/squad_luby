---
step: step-09-send-email
name: Envio de Email para o Collaborator
type: agent
agent: lucas
execution: inline
model_tier: powerful
---

# Step 09 — Envio de Email para o Collaborator

## Objetivo
Lucas envia um email diretamente para o collaborator com o seu post LinkedIn gerado (EN + PT-BR), a imagem gerada e o overview de melhoria do perfil. O envio é exclusivo para o collaborator — sem notificação interna. A entrega é feita via Supabase Edge Function.

## Instruções para Lucas

### Input
- `pipeline/data/smtp-config.json` — credenciais Zoho e URL da edge function
- `pipeline/data/supabase-config.json` — URL e anon key do Supabase
- `collaborator-queue.json` — lista de collaborators (email, nome, flavor)
- Para cada collaborator:
  - `{name}/reviewed-post-en.md` — post EN final
  - `{name}/reviewed-post-pt.md` — post PT-BR final
  - `{name}/image-suggestion.md` — linha `**Image URL:**` com a URL da imagem gerada
  - `{name}/linkedin-overview.md` — overview de melhoria do perfil
  - `{name}/save-confirmation.md` — IDs Supabase

### Processo

Para cada collaborator processado:

#### 1. Ler todos os arquivos de input

Carregar smtp-config.json e supabase-config.json. Extrair `edge_function_url`, `zoho_user`, `zoho_pass`, `from_name`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

Extrair `image_url` do arquivo `image-suggestion.md`:
- Localizar a linha que começa com `**Image URL:**`
- Extrair a URL completa dessa linha

#### 2. Preparar payload do email

```json
{
  "mode": "linkedin-post",
  "zoho_user": "{smtp-config.zoho_user}",
  "zoho_pass": "{smtp-config.zoho_pass}",
  "from_name": "{smtp-config.from_name}",
  "collaborator_email": "{collaborator.email}",
  "collaborator_name": "{collaborator.name}",
  "flavor": "{collaborator.flavor}",
  "post_en": "{conteúdo de reviewed-post-en.md — escapado}",
  "post_pt": "{conteúdo de reviewed-post-pt.md — escapado}",
  "image_url": "{URL extraída de image-suggestion.md}",
  "linkedin_overview": "{conteúdo de linkedin-overview.md — escapado}",
  "blogger_id_en": "{id EN de save-confirmation.md}",
  "blogger_id_pt": "{id PT de save-confirmation.md}",
  "run_date": "{YYYY-MM-DD}"
}
```

#### 3. Chamar a Edge Function

```bash
curl -s -X POST "{edge_function_url}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {SUPABASE_ANON_KEY}" \
  -d '{payload JSON acima}'
```

Verificar resposta:
- **200/201** → Email enviado com sucesso
- **4xx/5xx** → Logar erro, tentar 1x novamente. Se falhar de novo, registrar `email_failed` e continuar (não bloquear o pipeline)

#### 4. Atualizar submitted_content no Supabase

Após envio bem-sucedido:

```bash
curl -s -X PATCH "{SUPABASE_URL}/rest/v1/bloggers?id=eq.{blogger_id_en}" \
  -H "apikey: {SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer {SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"submitted_content": true}'
```

Repetir para `blogger_id_pt`.

#### 5. Produzir confirmação

```markdown
# Email Delivery — {name}

- Collaborator: {email} — {✓ enviado | ✗ falhou}
- Imagem: {image_url} — {✓ incluída | ✗ sem URL}
- submitted_content EN: true ✓
- submitted_content PT: true ✓
- Timestamp: {ISO datetime}
```

Salvar em `{name}/email-confirmation.md`.

### Regras
- Nunca bloquear o pipeline por falha de email — registrar e continuar
- Nunca enviar para outros destinatários além do collaborator.email
- O campo `submitted_content` só deve ser `true` após confirmação de envio

### Output
- `{name}/email-confirmation.md`

## Next
step-10-delivery (Bruno consolida o resumo final)
