---
type: checkpoint
outputFile: squads/blog-luby/output/article-brief.md
---

# Seleção de Artigo — Supabase

Este step busca artigos pendentes (sem conteúdo gerado) no Supabase e apresenta ao usuário para seleção.

## Conexão Supabase

```
URL: https://pbvjsixlqnuzcnqahbxu.supabase.co
Anon Key: (ler de pipeline/data/supabase-config.json)
```

## Fluxo

### Passo 1 — Buscar artigos pendentes

Buscar artigos sem conteúdo gerado (content IS NULL) com JOIN no publisher:

```bash
curl -s \
  "${SUPABASE_URL}/rest/v1/articles?content=is.null&select=id,title,instructions,max_words,publisher:publishers(id,channel,name,language,flavor,url)&order=created_at.asc" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"
```

Se a query retornar vazio, tentar também artigos com content como string vazia:

```bash
curl -s \
  "${SUPABASE_URL}/rest/v1/articles?content=eq.&select=id,title,instructions,max_words,publisher:publishers(id,channel,name,language,flavor,url)&order=created_at.asc" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"
```

### Passo 2 — Apresentar lista ao usuário

Para cada artigo retornado, formatar como opção:
```
#{id} — "{title}" | {publisher.channel} | {publisher.language} | {publisher.name}
```

Apresentar via AskUserQuestion (max 4 por pergunta — paginar se houver mais).

Se nenhum artigo pendente for encontrado → informar: "Não há artigos pendentes na tabela 'articles' (content IS NULL). Adicione um artigo no Supabase com content = null para iniciar."

### Passo 3 — Carregar dados completos do artigo selecionado

Após o usuário selecionar, buscar o artigo completo:

```bash
curl -s \
  "${SUPABASE_URL}/rest/v1/articles?id=eq.${SELECTED_ID}&select=id,title,instructions,max_words,publisher:publishers(id,channel,name,language,flavor,url)" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"
```

### Passo 4 — Exibir resumo e confirmar

Apresentar ao usuário:

```
📄 Artigo selecionado: #{id}
   Título: {title}
   Canal: {publisher.channel}
   Publisher: {publisher.name}
   Idioma: {publisher.language}
   Flavor: {publisher.flavor}
   URL destino: {publisher.url}
   Max palavras: {max_words}
   Instruções: {instructions ou "nenhuma"}
```

Perguntar via AskUserQuestion: "Confirmar este artigo para geração?"
- Opção A: "Confirmar — iniciar geração"
- Opção B: "Escolher outro artigo"

### Passo 5 — Salvar article-brief

Salvar em `squads/blog-luby/output/article-brief.md`:

```markdown
# Article Brief

**Article ID:** {id}
**Title:** {title}
**Instructions:** {instructions ou "N/A"}
**Max Words:** {max_words ou "não definido"}

## Publisher

- **ID:** {publisher.id}
- **Channel:** {publisher.channel}
- **Name:** {publisher.name}
- **Language:** {publisher.language}
- **Flavor:** {publisher.flavor}
- **URL:** {publisher.url}

**Date:** {YYYY-MM-DD}
```

Os steps seguintes usam este arquivo como fonte de truth para título, idioma, flavor e channel.
