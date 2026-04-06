---
type: agent
agent: bia
execution: inline
model_tier: powerful
---

# Publicação no Supabase — Artigo #{article_id}

A Bia Publicadora vai salvar o HTML aprovado (com imagem embutida) na tabela `articles` do Supabase, atualizando os campos: `content`, `sources`, `generated`, `cost`.

**Input:**
- `squads/blog-luby/output/article-brief.md` — ID e dados do publisher
- `squads/blog-luby/output/final-post.md` — HTML completo com `<figure>` da imagem
- `squads/blog-luby/output/research-brief.md` — fontes da pesquisa
- `squads/blog-luby/output/image-selection.md` — URL da imagem e crédito do fotógrafo

**Output:** Supabase `articles` table — artigo #{article_id} atualizado

## Instruções para a Bia

1. Ler `squads/blog-luby/output/article-brief.md` — extrair `article.id`, `article.title`, publisher
2. Ler `squads/blog-luby/output/final-post.md` — extrair o HTML final aprovado (já contém o `<figure>` da imagem)
3. Ler `squads/blog-luby/output/research-brief.md` — extrair URLs das fontes (seção "Sources")
4. Ler `squads/blog-luby/output/image-selection.md` — extrair URL da imagem e crédito do fotógrafo
5. Ler `squads/blog-luby/pipeline/data/supabase-config.json` — carregar `supabase_url` e `supabase_anon_key`
6. Montar o campo `sources` combinando fontes de pesquisa + crédito da imagem
7. Executar PATCH na tabela `articles` via REST API
8. Verificar com GET que o update foi aplicado

## Campo `sources` — formato

Combinar fontes da pesquisa + atribuição da imagem:

```
{URL-fonte-1}
{URL-fonte-2}
...
---
Imagem: {image_url} | Foto por {photographer_name} ({photographer_profile_url}) via Unsplash
```

## Payload do PATCH

```json
{
  "content": "{HTML completo de final-post.md — inclui <figure> da imagem}",
  "sources": "{fontes da pesquisa + crédito da imagem, separados por \\n}",
  "generated": "{YYYY-MM-DD de hoje}",
  "cost": {estimativa float — tokens gerados × 0.000003}
}
```

## Verificação Obrigatória

Após o PATCH, executar GET para confirmar:
```
GET /rest/v1/articles?id=eq.{article_id}&select=id,title,generated,cost
```

Resultado esperado: artigo com `generated` preenchido com a data de hoje.

## Tratamento de Erros

- **401 Unauthorized**: "Erro: credenciais inválidas. Verificar supabase_anon_key."
- **404 Not Found**: "Erro: artigo #{id} não encontrado."
- **GET vazio após PATCH**: "Aviso: update enviado mas verificação falhou. Confirme manualmente no Supabase."

## Terminal

Este é o último step do pipeline. Após confirmar sucesso, reportar:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Artigo publicado com sucesso!
   ID: #{article_id}
   Título: {title}
   Canal: {publisher.channel}
   Publisher: {publisher.name}
   Idioma: {publisher.language}
   Gerado em: {YYYY-MM-DD}
   Imagem: {photographer_name} via Unsplash
   Custo estimado: ~${cost}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
