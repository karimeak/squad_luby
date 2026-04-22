# Squad Memory — blog-luby-auto

## Histórico de Runs

### Run 2026-04-17-120000 — COMPLETO ✅
- **Artigos publicados:** 3/3
- **Duração:** ~1h45 (12:00 → 13:45 BRT)
- **Artigo #15** — "AI Meets Agile in 2026: High Adoption, Low Trust" → [blog.nearsmarter.com](https://blog.nearsmarter.com/ai-meets-agile-in-2026-high-adoption-low-trust/) — publisher Karime Kumagai (EN, insights)
- **Artigo #24** — "Produtos AI-Native: Como Construir Software com IA no Centro da Arquitetura" → [blog.luby.com.br](https://blog.luby.com.br/produtos-ai-native-como-construir-software-com-ia-no-centro-da-arquitetura/) — publisher Rodrigo Gardin (PT-BR, technical)
- **Artigo #25** — "Agentic Coding in 2026: How AI Tools Are Reshaping the Software Engineering Workflow" → [blog.luby.co](https://blog.luby.co/agentic-coding-in-2026-how-ai-tools-are-reshaping-the-software-engineering-workflow/) — publisher Rodrigo Gardin (EN, technical)

## Lições Aprendidas

### Infraestrutura
- **Python não disponível** no ambiente Windows — usar Node.js para qualquer manipulação de JSON, API calls HTTP, e upload de imagens
- **`&&` não válido no PowerShell** do usuário — usar comandos separados ou ponto-e-vírgula
- **`/dev/stdin` não existe no Windows** — salvar output de curl em arquivo temp (`os.tmpdir()`) e ler com Node.js
- **`/tmp/` não existe no Windows** — sempre usar `os.tmpdir()` para path do diretório temporário
- **`jq` não disponível** — usar `node -e "JSON.stringify(...)"` para escaping de JSON

### WordPress REST API
- **Upload de imagem**: usar `multipart/form-data` com Node.js `https.request()`, não curl `--data-binary` (falha no Windows bash)
- **Payload de post**: `JSON.stringify()` via Node.js, salvar em arquivo temp, ler com `fs.readFileSync()`, enviar via `https.request()` — funciona 100%
- **Auth Basic**: `Buffer.from('email:app_password').toString('base64')` — preservar espaços no app_password
- **blog_luby (publisher 5)**: email `rodrigo@luby.com.br`, wp_user_id: 2, url: `https://blog.luby.com.br/`
- **blog_luby_us (publisher 10)**: email `rodrigo@luby.com.br`, wp_user_id: 4, url: `https://blog.luby.co/`
- **blog_nearsmarter (publisher 4)**: email `karime.kumagai@luby.com.br`, wp_user_id: 1, url: `https://blog.nearsmarter.com/`

### Supabase
- **Edge function** requer `zoho_user`, `zoho_pass`, e `notification_emails` (array) no body — não apenas `to_email`
- **publishers.wp_url** não existe — coluna é `url`
- **PATCH article (Ada)**: OBRIGATÓRIO incluir `content` (HTML do post), `sources` (URLs das fontes + crédito da imagem) além de `wp_url`, `published_at`, `approved` — sem esses campos, a linha fica incompleta no banco
- **Media alt_text + caption (Ada Passo 4c)**: após upload da imagem, chamar `POST /wp-json/wp/v2/media/{id}` com `alt_text` e `caption` (atribuição Unsplash) — impacta SEO, acessibilidade e compliance com licença Unsplash
- **`from_name` obrigatório no email**: sempre enviar `"from_name": "{smtp-config.from_name}"` na edge function — sem ele, o remetente aparece como `"undefined" <email>`
- **Edge function campo correto**: usar `publisher_channel` (não `channel`) — o mapeamento `BLOG_NAMES` na edge function depende exatamente desse nome; passar `channel` retorna "undefined" no email
- **`publisher_email` obrigatório na edge function**: sempre incluir `"publisher_email": "{publisher.email}"` além de `notification_emails` — a edge function une e deduplica. Garante notificação ao publisher mesmo que ele não esteja na lista do time

### Unsplash
- **API key**: `F5Y0BxjDgXs_o5pV_91sW6H-8I0AjQpYx0EWpANZqcw`
- **Registrar download**: sempre chamar `/photos/{id}/download?ixid=...` antes do upload no WP
- **Query eficaz para código/tech**: `code screen programming monitor` → resultados autênticos; evitar `artificial intelligence` (clichê)

### Categorias WP por canal
- **blog_luby**: IA=4, Desenvolvimento=5, Tech News=3
- **blog_luby_us**: Artificial Intelligence=6, Development=7
- **blog_nearsmarter**: Technology=9, Software Development=19

## Erros Registrados

| Run | Erro | Resolução |
|-----|------|-----------|
| 2026-04-17 | `curl -d @file` falha no Windows bash | Usar Node.js `fs.readFileSync()` + `https.request()` |
| 2026-04-17 | `jq: command not found` | Usar Node.js `JSON.stringify()` |
| 2026-04-17 | `/dev/stdin` ENOENT no Windows | Salvar em `os.tmpdir()`, ler com `fs.readFileSync()` |
| 2026-04-17 | Edge function: "Nenhum destinatário definido" | Usar `notification_emails` array, não `to_email` |
| 2026-04-17 | `publishers.wp_url does not exist` | Coluna é `url`, não `wp_url` |
| 2026-04-17 | Supabase `content` NULL em #24 e #25 | Incluir `"content": "{HTML}"` no PATCH da Ada (foi omitido na execução inline) |
| 2026-04-17 | Email: "publicado em undefined" para blog_luby e blog_luby_us | Usar campo `publisher_channel` na edge function, não `channel` |
| 2026-04-17 | `publisher_email` omitido nas chamadas da Ada | Nesse run não houve perda (publishers já estavam em notification_emails), mas incluir sempre |
| 2026-04-17 | Alt text + caption não definidos nas mídias (#15, #24, #25) | Corrigido via POST /wp-json/wp/v2/media/{id} após o run |
| 2026-04-17 | `sources` NULL para #24 e #25 | Corrigido via PATCH após o run; #15 já tinha sources do contexto anterior |
| 2026-04-17 | `from_name` ausente na edge function | Remetente apareceu como "undefined"; incluir sempre na chamada |
| 2026-04-17 | `post-with-image.md` não criado para #24 e #25 | Iris deve copiar post-draft.md para post-with-image.md a cada artigo; Ada deve ler de post-with-image.md |
| 2026-04-17 | Mateus de #25 rodou inline em vez de subagent | Resultado correto, mas viola a arquitetura; rodar sempre como subagent para liberar contexto |

### Run 2026-04-20-142852 — COMPLETO ✅
- **Artigos publicados:** 3/3
- **Duração:** ~1h02 (14:28 → 15:30 BRT)
- **Artigo #16** — "Building Scalable MLOps Pipelines with MLflow and Kubeflow" → [blog.nearsmarter.com](https://blog.nearsmarter.com/building-scalable-mlops-pipelines-with-mlflow-and-kubeflow/) — publisher Rodrigo Gardin (EN, technical, ~3100 words)
- **Artigo #26** — "Maturidade de IA em 2026: por que 90% das empresas não geram resultado" → [blog.luby.com.br](https://blog.luby.com.br/maturidade-de-ia-em-2026-por-que-90-das-empresas-nao-geram-resultado/) — publisher Alon Lubieniecki (PT-BR, business, ~1100 words)
- **Artigo #27** — "The AI Productivity Gap: What Enterprise Teams Actually Get in 2026" → [blog.luby.co](https://blog.luby.co/the-ai-productivity-gap-what-enterprise-teams-actually-get-in-2026/) — publisher Karime Kumagai (EN, insights, ~1150 words)

### Lições do Run 2026-04-20

#### Publishers
- **blog_luby (publisher 12 = Alon Lubieniecki)**: email `alon.lubieniecki@luby.com.br`, url: `https://blog.luby.com.br/`, WP user_id: 2 (mesmo usuário que Rodrigo)
- **blog_luby_us (publisher 12 = Karime Kumagai)**: email `karime.kumagai@luby.com.br`, url: `https://blog.luby.co/`, WP user_id: 4
- **blog_nearsmarter**: publisher 4, Rodrigo Gardin, WP user_id: 1

#### Infraestrutura
- **blog_finfy detectado** por Tobias — canais com publishers 18/19 (PT-BR) mas sem configuração em `wp-categories.json`; foi ignorado neste run
- **Pesquisa paralela confirmada**: 3 Mateus subagents simultaneamente funciona bem; arquivo de saída separado por artigo (`research-brief.md`, `research-brief-26.md`, `research-brief-27.md`) evita colisões

#### WordPress
- **post_title limite 70 chars**: artigos com título > 70 chars precisam de correção antes do review; verificar antes de criar tech-review.md
- **Gutenberg blocks**: todos os artigos desta run passaram no review técnico sem falhas de bloco; padrão `<!-- wp:paragraph -->` / `<!-- wp:heading {"level":2} -->` consolidado
- **Imagem alt_text + caption**: definidos imediatamente após upload via `POST /wp-json/wp/v2/media/{id}` — sem erros de acessibilidade neste run

## Temas Scouts Inseridos

### Run 2026-04-17
- **#15** — The Intersection of AI and Agile Methodologies (EN, blog_nearsmarter, Karime Kumagai)
- **#24** — Produtos AI-Native: Como Construir Software com IA no Centro da Arquitetura (PT-BR, blog_luby, Rodrigo Gardin)
- **#25** — Agentic Coding in 2026: How AI Tools Are Reshaping the Software Engineering Workflow (EN, blog_luby_us, Rodrigo Gardin)

### Run 2026-04-20
- **#16** — Building Scalable MLOps Pipelines with MLflow and Kubeflow (EN, blog_nearsmarter, Rodrigo Gardin)
- **#26** — Maturidade de IA em 2026: por que 90% das empresas não geram resultado (PT-BR, blog_luby, Alon Lubieniecki)
- **#27** — The AI Productivity Gap: What Enterprise Teams Actually Get in 2026 (EN, blog_luby_us, Karime Kumagai)
