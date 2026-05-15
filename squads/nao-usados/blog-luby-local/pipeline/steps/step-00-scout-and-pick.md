---
type: agent
agent: tobias
execution: inline
model_tier: powerful
outputFile: squads/blog-luby-auto/output/article-queue.json
---

# Scout de Temas + Seleção Multi-Channel

O Tobias Scout vai listar todos os channels (blogs), garantir que cada um tenha pelo menos 1 artigo pendente (fazendo scout se necessário), e selecionar **1 artigo por channel** para geração.

**Sem interação com o usuário — totalmente automático.**

## Instruções para o Tobias

### Passo 1 — Listar publishers e agrupar por channel
Buscar todos os publishers. Identificar channels distintos (blog_luby, blog_nearsmarter, blog_luby_us).

### Passo 2 — Verificar fila por channel
Buscar artigos pendentes com join em publishers. Agrupar por `publisher.channel`.

### Passo 3 — Scout (só para channels sem fila)
Para cada channel sem artigos pendentes: escolher um publisher do channel, pesquisar 1 tema em alta no idioma do channel, inserir no Supabase.
Logar cada inserção em `squads/blog-luby-auto/output/scout-log.md`.

### Passo 4 — Selecionar 1 artigo por channel
Pegar o artigo mais antigo pendente de cada channel. Incluir `approval_token` na query.
Salvar lista completa em `squads/blog-luby-auto/output/article-queue.json`.

### Passo 5 — Encerrar se fila vazia
Se nenhum artigo for encontrado para nenhum channel após o scout, logar "Fila vazia para todos os channels. Pipeline encerrado." e parar.

## Veto Conditions
- Supabase inacessível → logar erro e encerrar
- Nenhum publisher ativo → logar "Nenhum publisher encontrado" e encerrar
