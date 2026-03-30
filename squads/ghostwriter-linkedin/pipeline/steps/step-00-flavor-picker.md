---
type: checkpoint
outputFile: squads/ghostwriter-linkedin/output/selected-flavor.md
---

# Seleção de Flavor — Supabase

Este step busca os flavors disponíveis no Supabase e apresenta ao usuário como menu interativo.

## Conexão Supabase

```
URL: https://pbvjsixlqnuzcnqahbxu.supabase.co
Table: public.related_searchs
Anon Key: (ler de pipeline/data/supabase-config.json)
```

## Fluxo

### Passo 1 — Buscar categorias (queries distintas)

Fazer request HTTP ao Supabase REST API:

```bash
curl -s "${SUPABASE_URL}/rest/v1/related_searchs?select=query&order=query.asc" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"
```

Extrair valores únicos de `query` e apresentar ao usuário como menu numerado via AskUserQuestion:
- Listar todas as categorias disponíveis (max 4 por pergunta — se houver mais, paginar)
- O usuário seleciona uma categoria

### Passo 2 — Buscar related_searchs da categoria selecionada

```bash
curl -s "${SUPABASE_URL}/rest/v1/related_searchs?select=related_search&query=eq.${SELECTED_QUERY}&order=related_search.asc" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"
```

Apresentar os related_searchs como sub-menu via AskUserQuestion:
- Listar os sub-temas disponíveis dentro da categoria (max 4 por pergunta — paginar se necessário)
- O usuário seleciona o flavor final

### Passo 3 — Pedir perfil, idioma e formato

Depois de selecionar o flavor, perguntar:

1. **Perfil do colaborador**: Apresentar os 6 colaboradores como menu
   - Wagner (Comercial — público US)
   - Maise (Comercial — público US)
   - Samuel (Comercial — público BR)
   - Marine (Estratégia/Produto — público US+BR)
   - Paulo (Liderança — público US+BR)
   - Gardin (Técnico/CTO — público US+BR)

2. **Idioma**: EN ou PT-BR

3. **Formato do conteúdo**: Apresentar os 4 formatos com explicação clara via AskUserQuestion:

   - **Text Post** — Post de texto clássico no feed do LinkedIn. Ideal para opinião, storytelling e thought leadership. Aparece direto no feed, o formato com maior alcance orgânico. Limite de 3.000 caracteres.
   - **Carousel** — Documento em PDF com slides que o leitor desliza. Ideal para listas, frameworks, passo-a-passo e dados visuais. Gera 2-3x mais alcance que texto puro por aumentar o tempo de permanência (dwell time). 10-15 slides recomendados.
   - **Poll** — Enquete interativa com até 4 opções de resposta + texto de contexto. Ideal para gerar engajamento rápido, coletar opiniões e iniciar debates. O algoritmo impulsiona polls por gerar interações diretas. Duração de 1-2 semanas.
   - **Article** — Artigo longo publicado no LinkedIn (como um blog post). Ideal para deep dives, análises detalhadas e conteúdo evergreen com valor de SEO. Aparece indexado no Google. 1.500-2.000 palavras recomendadas.

4. **Tamanho** (apenas se formato = Text ou Poll): Low, Medium ou Large
   - **Low** (até 700 chars) — Post curto e direto. Sem seção de insights numerados. Hook + corpo breve + CTA.
   - **Medium** (700–1500 chars) — Post padrão de alto engajamento. Estrutura completa: hook + corpo + insights + CTA. **(Recomendado)**
   - **Large** (1500–3000 chars) — Long-form / thought leadership. Estrutura completa com mais profundidade nos insights.

   **Nota:** Se formato = Carousel, o tamanho é definido pelo número de slides (10-15). Se formato = Article, o tamanho é definido pela contagem de palavras (1.500-2.000).

   **⚠️ Aviso de engajamento (apenas Text/Poll):** Se o usuário escolher **Low** ou **Large**, exibir um aviso antes de confirmar:
   - **Low**: "Posts curtos (< 700 chars) podem ter menos alcance no LinkedIn B2B, pois oferecem menos substância para o algoritmo promover. O formato Medium (700–1500 chars) é o sweet spot para engajamento. Deseja continuar com Low mesmo assim?"
   - **Large**: "Posts longos (> 1500 chars) exigem hooks muito fortes para manter a atenção. A taxa de leitura completa cai significativamente após 1500 chars. O formato Medium (700–1500 chars) é o sweet spot para engajamento. Deseja continuar com Large mesmo assim?"
   - Oferecer opções: "Sim, manter {tamanho}" ou "Mudar para Medium (Recomendado)"

### Passo 4 — Salvar seleção

Salvar em `squads/ghostwriter-linkedin/output/selected-flavor.md`:

```markdown
# Flavor Selecionado

- **Categoria (query):** {query selecionada}
- **Flavor (related_search):** {related_search selecionado}
- **Perfil:** {colaborador selecionado}
- **Idioma:** {idioma selecionado}
- **Formato:** {formato selecionado} (Text | Carousel | Poll | Article)
- **Tamanho:** {tamanho selecionado} ({faixa de caracteres}) — apenas para Text/Poll; N/A para Carousel/Article

**Fonte:** Supabase table `related_searchs`
**Data:** {YYYY-MM-DD}
```

Os steps seguintes usam `{flavor}` = o campo `related_search` selecionado.
