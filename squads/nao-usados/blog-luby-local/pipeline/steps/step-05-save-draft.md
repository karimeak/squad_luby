---
type: agent
agent: ada
execution: inline
model_tier: powerful
---

# Salvar Draft no Supabase

A Ada vai salvar o HTML gerado no Supabase. **Não envia email** — o envio é feito pelo n8n separadamente.

**Input:** `article-brief.md` (ou `article-queue.json`) + `post-with-image.md` + `image-selection.md` + `research-brief.md` + configs
**Output:** Draft salvo no Supabase

## Instruções

1. Carregar todos os arquivos de input e configs
2. Salvar HTML em `articles.content` via PATCH no Supabase (com `approved = false`)
3. Salvar `sources` com URLs das fontes + crédito da imagem
4. Verificar com GET que o PATCH foi aplicado
5. Reportar resultado

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
- **approval_token não encontrado** → buscar via GET `articles?id=eq.{id}&select=approval_token`
