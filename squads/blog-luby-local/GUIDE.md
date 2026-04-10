# Blog Writer Auto — Luby

Pipeline **100% automático** de geração de blog posts. Sem checkpoints.
A única interação humana é o clique no email de aprovação.

## Fluxo resumido

```
[CRON] /opensquad run blog-luby-auto
    ↓
Tobias verifica fila → insere até 2 temas se necessário → seleciona artigo mais antigo
    ↓
Mateus pesquisa o tema (background)
    ↓
Lara escreve HTML (idioma + flavor do publisher)
    ↓
Pedro revisa técnica + SEO (auto-retry 2x)
    ↓
Iris busca imagem no Unsplash (fallback automático se necessário)
    ↓
Ada salva draft no Supabase → envia email com botões Aprovar / Nova Versão
    ↓
[EMAIL] Você clica "Aprovar" → Edge Function seta approved = true
         Você clica "Nova Versão" → Edge Function limpa content → próximo ciclo regenera
```

## Setup necessário (uma vez só)

### 1. Configurar mailgun-config.json

Editar `pipeline/data/mailgun-config.json`:
```json
{
  "mailgun_api_key": "key-...",
  "mailgun_domain": "seu-dominio.com",
  "from_name": "Blog Luby",
  "from_email": "blog@seu-dominio.com",
  "approval_email": "seu@email.com",
  "edge_function_url": "https://pbvjsixlqnuzcnqahbxu.supabase.co/functions/v1/approve-article"
}
```

### 2. Deploy da Edge Function

```bash
# Na raiz do projeto Supabase
cp squads/blog-luby-auto/edge-functions/approve-article.ts supabase/functions/approve-article/index.ts
supabase functions deploy approve-article
```

A função usa `SUPABASE_SERVICE_ROLE_KEY` — já disponível automaticamente no ambiente Edge Function.

### 3. Tabela articles (já configurada)

```sql
-- Campos usados pelo squad:
-- id, publisher(FK), title, instructions, max_words
-- content       → HTML gerado (salvo pelo Ada, null = pendente)
-- approved      → false = aguardando aprovação, true = publicado
-- approval_token→ UUID gerado automaticamente pelo Supabase
-- sources       → fontes da pesquisa + crédito da imagem
-- generated     → data de publicação (setada pela Edge Function)
-- cost          → estimativa de custo de geração
```

### 4. Agendar execução (opcional)

Via `/schedule` do Opensquad ou Supabase cron:
```
/schedule create "blog-auto" "0 9 * * 1" "/opensquad run blog-luby-auto"
```
(Executa toda segunda-feira às 9h)

## Comportamento automático

| Situação | O que acontece |
|----------|---------------|
| Fila < 3 artigos | Tobias insere 2 temas novos antes de gerar |
| Fila ≥ 3 artigos | Tobias só seleciona o mais antigo, sem inserir |
| Pedro veta o texto | Lara corrige automaticamente (max 2x) |
| Iris não acha imagem | Usa fallback genérico do Unsplash |
| Email falha | Draft salvo no Supabase; erro logado em squad memory |
| Você clica "Aprovar" | Edge Function seta `approved = true` |
| Você clica "Nova Versão" | Edge Function limpa `content = null` → regenera no próximo ciclo |

## Agentes

| | Agente | Função |
|--|--------|--------|
| 🔎 | Tobias | Scout (2 temas) + auto-seleção de artigo |
| 🔍 | Mateus | Pesquisa profunda (background) |
| ✍️ | Lara | Redação HTML adaptada ao publisher |
| 🔬 | Pedro | Revisão técnica + SEO (auto-retry 2x) |
| 📸 | Iris | Imagem do Unsplash + embed no HTML |
| 📧 | Ada | Salva no Supabase + envia email Mailgun |
