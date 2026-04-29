# Blog Writer — Luby

Squad de geração automática de blog posts em HTML para os blogs da Luby.

## O que este squad faz

1. **Scout de tendências**: pesquisa temas em alta nas fontes tech, cruza com publishers, sugere pautas
2. Você seleciona os temas que quer (sugestões ou personalizado) e pode salvá-los no Supabase como artigos futuros
3. Você escolhe qual artigo pendente (`content IS NULL`) gerar agora
4. Pesquisa profunda do tema (fontes curadas + buscas abertas)
5. Escreve o post em HTML, adaptado ao publisher (idioma, flavor, canal)
6. Revisa tecnicamente: precisão, fontes, SEO, estrutura HTML
7. Você aprova o conteúdo antes de publicar
8. Salva o HTML no Supabase (`articles.content`, `.sources`, `.generated`, `.cost`)

## Como usar

```
/opensquad run blog-luby
```

## Pré-requisitos no Supabase

### Tabela `articles`
- `id` — PK
- `publisher` — FK para `publishers.id`
- `title` — título/tema do artigo (obrigatório para iniciar)
- `instructions` — diretrizes específicas (opcional)
- `max_words` — limite de palavras (opcional)
- `content` — HTML gerado (preenchido pelo squad)
- `sources` — URLs das fontes (preenchido pelo squad)
- `generated` — data de geração (preenchido pelo squad)
- `cost` — custo estimado (preenchido pelo squad)

### Tabela `publishers`
- `id` — PK
- `channel` — nome do blog (ex: "luby.co", "medium", "dev.to")
- `name` — nome da persona que vai postar
- `language` — EN ou PT-BR
- `flavor` — estilo editorial (ex: "técnico/profundo", "acessível/didático")
- `url` — URL destino do blog

## Fontes de pesquisa

PT-BR: tecnoblog.net, canaltech.com.br, tecmundo.com.br, startupi.com.br, macmagazine.com.br

EN: techcrunch.com, theverge.com, arstechnica.com, wired.com, engadget.com, cnet.com, tomshardware.com, thenextweb.com, venturebeat.com, zdnet.com, 9to5mac.com, techradar.com, producthunt.com, reddit.com, news.ycombinator.com, lobste.rs, slashdot.org, gizmodo.com

## Agentes

| Agente | Papel | Modo |
|--------|-------|------|
| Tobias 🔎 | Scout de temas em alta — pesquisa tendências e sugere pautas | Inline |
| Mateus 🔍 | Pesquisa profunda do tema escolhido — fontes curadas + buscas abertas | Subagent (background) |
| Lara ✍️ | Redação do post em HTML semântico | Inline |
| Pedro 🔬 | Revisão técnica + SEO on-page | Inline |
| Bia 📤 | Publicação no Supabase via REST API | Inline |

## Outputs gerados por run

```
squads/blog-luby/output/{run_id}/
├── v1/scout-brief.md      — temas pesquisados, selecionados e salvos no Supabase
├── v1/article-brief.md    — artigo selecionado + dados do publisher
├── v1/research-brief.md   — pesquisa web com fontes verificadas
├── v1/post-draft.md       — HTML gerado pela Lara
├── v1/tech-review.md      — revisão do Pedro com score
└── v1/final-post.md       — HTML aprovado (salvo no Supabase)
```
