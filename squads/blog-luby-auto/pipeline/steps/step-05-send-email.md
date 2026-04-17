---
type: agent
agent: ada
execution: inline
model_tier: powerful
inputFile: squads/blog-luby-auto/output/post-with-image.md
---

# Publicação WordPress + Notificação ao Time

A Ada Publisher vai publicar o artigo diretamente no WordPress do publisher e notificar o time.

**Sem interação com o usuário — totalmente automático.**

## Contexto a Carregar

- `squads/blog-luby-auto/output/article-brief.md` — article.id, publisher.id, publisher.channel
- `squads/blog-luby-auto/output/post-with-image.md` — post_title + HTML de conteúdo
- `squads/blog-luby-auto/output/image-selection.md` — image_url, photographer_name, photographer_profile_url
- `squads/blog-luby-auto/output/research-brief.md` — URLs das fontes
- `squads/blog-luby-auto/output/post-draft.md` — checar REVIEW_WARNING
- `squads/blog-luby-auto/pipeline/data/supabase-config.json` — credenciais Supabase
- `squads/blog-luby-auto/pipeline/data/smtp-config.json` — notification_emails, edge_function_url, zoho credentials

## Instruções

### Passo 1 — Carregar dados
Carregar todos os arquivos listados acima. Extrair `post_title` (linha antes do `---` em `post-with-image.md`) e o HTML de conteúdo (após o `---`).

### Passo 2 — Buscar credenciais WP do publisher no Supabase

```bash
curl -s "${SUPABASE_URL}/rest/v1/publishers?id=eq.{publisher_id}&select=id,channel,name,email,password,wp_user_id,url,language" \
  -H "apikey: {SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer {SUPABASE_ANON_KEY}"
```

Extrair: `url` (WP base URL), `email`, `password` (Application Password), `wp_user_id`, `name`.

### Passo 3 — Buscar category_id no WordPress (se aplicável)

```bash
ENCODED_AUTH=$(echo -n "{email}:{password}" | base64)
curl -s "{wp_url}/wp-json/wp/v2/categories?search={categoria}&per_page=5" \
  -H "Authorization: Basic ${ENCODED_AUTH}"
```

- Inferir categoria do campo `instructions` do artigo ou do `publisher.channel`
- Se não encontrar: usar `[]` (Uncategorized)
- **Manter espaços no Application Password antes do base64**

### Passo 4 — Upload da imagem como Featured Media

**4a — Baixar imagem:**
```bash
curl -sL "{image_url de image-selection.md}" -o /tmp/post-featured.jpg
```

**4b — Upload para WP Media Library:**
```bash
curl -s -X POST "{wp_url}/wp-json/wp/v2/media" \
  -H "Authorization: Basic ${ENCODED_AUTH}" \
  -H "Content-Type: image/jpeg" \
  -H "Content-Disposition: attachment; filename=\"featured.jpg\"" \
  --data-binary @/tmp/post-featured.jpg
```
Extrair `id` da resposta → `{media_id}`.

**4c — Definir alt text e caption (atribuição Unsplash):**
```bash
curl -s -X POST "{wp_url}/wp-json/wp/v2/media/{media_id}" \
  -H "Authorization: Basic ${ENCODED_AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "alt_text": "{image_alt}",
    "caption": "{caption_html da image-selection.md}"
  }'
```

Se upload falhar → publicar sem `featured_media`, logar erro.

### Passo 5 — Publicar no WordPress

```bash
curl -s -X POST "{wp_url}/wp-json/wp/v2/posts" \
  -H "Authorization: Basic ${ENCODED_AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "{post_title}",
    "content": "{HTML Gutenberg de post-with-image.md}",
    "status": "publish",
    "author": {wp_user_id},
    "categories": [{category_id}],
    "featured_media": {media_id}
  }'
```

Verificar response:
- **201** → extrair `id` e `link` (URL do post publicado)
- **401/403/500** → logar erro, não prosseguir

### Passo 5 — Atualizar Supabase

```bash
curl -s -X PATCH \
  "{SUPABASE_URL}/rest/v1/articles?id=eq.{article_id}" \
  -H "apikey: {SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer {SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "content": "{HTML}",
    "sources": "{fontes + crédito da imagem}",
    "approved": true,
    "wp_url": "{link retornado pelo WordPress}",
    "published_at": "{timestamp ISO agora}"
  }'
```

### Passo 6 — Notificar time + publisher via Edge Function

Inclui o `email` do publisher (obtido no Passo 2) como `publisher_email`.

```bash
curl -s -X POST "{EDGE_FUNCTION_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {SUPABASE_ANON_KEY}" \
  -d '{
    "mode": "notification",
    "zoho_user": "{smtp-config.zoho_user}",
    "zoho_pass": "{smtp-config.zoho_pass}",
    "from_name": "{smtp-config.from_name}",
    "notification_emails": {smtp-config.notification_emails},
    "publisher_email": "{publisher.email}",
    "article_id": {id},
    "title": "{post_title}",
    "publisher_name": "{publisher.name}",
    "publisher_channel": "{publisher.channel}",
    "wp_url": "{link}",
    "has_review_warning": {true|false}
  }'
```

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Publicação concluída!
   Artigo: #{article_id} — "{post_title}"
   Canal: {channel}
   WordPress: {wp_url}
   Supabase atualizado: ✓
   Notificação enviada: ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Output Example

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Publicação concluída!
   Artigo: #42 — "How AI is Reshaping Nearshore Development in 2026"
   Canal: blog_nearsmarter
   Publisher: Sarah Smithson
   WordPress: https://blog.nearsmarter.com/how-ai-reshaping-nearshore-2026/ ✓
   Supabase atualizado: approved=true ✓
   Notificação enviada para: estela, karime, rodrigo ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Veto Conditions

1. WP retornou 401 ou 403 → logar "Auth falhou: verificar credenciais do publisher no Supabase" e encerrar sem update no Supabase
2. WP retornou 500 → logar "Erro interno WP" e encerrar sem update no Supabase

## Quality Criteria

- [ ] Post publicado com status 201 e `link` retornado
- [ ] Supabase atualizado com `approved: true`
- [ ] Email de notificação enviado para todos os `notification_emails`
- [ ] `post_title` usado no campo `title` da API (não no HTML)
