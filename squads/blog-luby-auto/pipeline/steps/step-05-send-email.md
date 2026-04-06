---
type: agent
agent: ada
execution: inline
model_tier: powerful
---

# Envio de Email de Aprovação — Mailgun

A Ada Email vai salvar o HTML no Supabase e enviar o email de aprovação via Mailgun.

**Input:** `article-brief.md` + `post-with-image.md` + `image-selection.md` + `research-brief.md` + configs
**Output:** Draft salvo no Supabase + email enviado

## Instruções

1. Carregar todos os arquivos de input e configs
2. Salvar HTML em `articles.content` via PATCH no Supabase (com `approved = false`)
3. Verificar com GET que o PATCH foi aplicado
4. Construir URLs de aprovação usando `approval_token` do `article-brief.md`:
   - `{edge_function_url}?token={approval_token}&action=approve`
   - `{edge_function_url}?token={approval_token}&action=reject`
5. Montar email HTML com: imagem, preview do post, dois botões de ação
6. Verificar se `post-draft.md` contém `REVIEW_WARNING` — se sim, adicionar aviso no email:
   > "⚠️ Atenção: a revisão técnica automatizada identificou problemas. Verifique o conteúdo antes de aprovar."
7. Enviar via Mailgun API
8. Reportar resultado

## Formato do campo sources (Supabase)

```
{URL-fonte-1}
{URL-fonte-2}
...
---
Imagem: {image_url} | Foto por {photographer_name} ({photographer_profile_url}) via Unsplash
```

## Tratamento de erros

- **PATCH Supabase falhou** → tentar 1 vez mais; se falhar novamente, logar e encerrar
- **Email Mailgun falhou** → logar no squad memory; o draft já está no Supabase, não é bloqueante
- **approval_token não encontrado** → buscar via GET `articles?id=eq.{id}&select=approval_token`
