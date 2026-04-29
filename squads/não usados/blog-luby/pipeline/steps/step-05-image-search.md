---
type: agent
agent: iris
execution: inline
model_tier: powerful
---

# Busca de Imagem — Unsplash

A Iris Imagens vai analisar o conteúdo do post, identificar os conceitos visuais centrais, buscar no Unsplash a imagem mais adequada e embutir o bloco `<figure>` com atribuição no HTML final.

**Input:** `squads/blog-luby/output/article-brief.md` + `squads/blog-luby/output/post-draft.md`
**Output:**
- `squads/blog-luby/output/image-selection.md` — metadados da imagem + justificativa
- `squads/blog-luby/output/post-with-image.md` — HTML completo com `<figure>` inserido

## Instruções para a Iris

### Fase 1 — Analisar o post

1. Ler `squads/blog-luby/output/article-brief.md` — title, publisher.channel, publisher.language, publisher.flavor
2. Ler `squads/blog-luby/output/post-draft.md` — extrair do HTML:
   - Tema central (do H1)
   - Conceitos visuais presentes (substantivos concretos do texto)
   - Tom do post (técnico, estratégico, acessível, negócios, etc.)

### Fase 2 — Gerar queries para o Unsplash

Com base na análise, gerar 3 queries do mais específico ao mais genérico.
Sempre em **inglês**, independente do idioma do post.

Exemplos de boas queries por tipo de tema:
- IA / Machine Learning → `machine learning developer`, `artificial intelligence data`, `neural network code`
- Cloud / DevOps → `cloud computing server`, `devops engineer terminal`, `kubernetes deployment`
- Produto / SaaS → `software product team`, `startup office laptop`, `UX design wireframe`
- Negócios / Liderança → `tech leadership meeting`, `business strategy board`, `executive technology`
- Segurança → `cybersecurity network`, `data protection lock`, `security analyst monitor`

### Fase 3 — Buscar no Unsplash via Playwright

1. Navegar para `https://unsplash.com/s/photos/{query-1-url-encoded}`
2. Fazer `browser_take_screenshot` para visualizar os resultados
3. Usar `browser_snapshot` para extrair links das fotos (`/photos/{id}`)
4. Avaliar relevância e qualidade visual dos primeiros resultados
5. Se necessário, refinar com Query 2 ou Query 3

### Fase 4 — Acessar e extrair dados da foto selecionada

1. Navegar para `https://unsplash.com/photos/{id}`
2. Usar `browser_snapshot` para extrair:
   - URL da imagem (`https://images.unsplash.com/photo-{id}...`)
   - Nome do fotógrafo
   - URL do perfil do fotógrafo (`https://unsplash.com/@{username}`)
3. Fazer `browser_take_screenshot` para confirmar que é a imagem certa

### Fase 5 — Montar HTML com atribuição

Criar o bloco `<figure>` com:
- URL de embed otimizada: `https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=1200&q=80`
- Alt text descritivo e acessível (não o título do post)
- Atribuição ao fotógrafo com links UTM (`utm_source=blog_luby&utm_medium=referral`)

Inserir o `<figure>` dentro do `<article>`, logo após o `<h1>`.

### Fase 6 — Apresentar ao usuário

Antes de salvar, mostrar:
1. Screenshot da imagem selecionada (via `browser_take_screenshot` na página da foto)
2. Justificativa da escolha (2-3 linhas)
3. Preview do bloco HTML gerado
4. Opções via AskUserQuestion:
   - **"Aprovar esta imagem"** — prosseguir com ela
   - **"Buscar outra imagem"** — Iris faz nova busca com query diferente
   - **"Inserir URL manualmente"** — usuário fornece URL de imagem no campo "Other"

### Fase 7 — Salvar outputs

Após aprovação:
1. Salvar `squads/blog-luby/output/image-selection.md` com metadados completos
2. Salvar `squads/blog-luby/output/post-with-image.md` com o HTML atualizado

## Veto Conditions

- Nenhuma imagem válida encontrada em 3 queries → apresentar ao usuário e oferecer URL manual
- URL de imagem não é do domínio `images.unsplash.com` → buscar novamente
- Fotógrafo não identificado → não usar a imagem (atribuição é obrigatória)
