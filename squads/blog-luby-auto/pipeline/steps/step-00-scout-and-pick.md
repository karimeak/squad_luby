---
type: agent
agent: tobias
execution: inline
model_tier: powerful
outputFile: squads/blog-luby-auto/output/article-brief.md
---

# Scout de Temas + Seleção Automática de Artigo

O Tobias Scout vai verificar a fila do Supabase, adicionar até 2 temas em alta se necessário, e selecionar automaticamente o próximo artigo pendente para geração.

**Sem interação com o usuário — totalmente automático.**

## Instruções para o Tobias

### Passo 1 — Verificar fila
Buscar artigos com `content IS NULL AND approved = false`. Contar quantos há.

### Passo 2 — Scout (só se fila < 3)
Se necessário, pesquisar 2 temas em alta, cruzar com publishers e inserir no Supabase.
Logar cada inserção em `squads/blog-luby-auto/output/scout-log.md`.

### Passo 3 — Selecionar artigo
Buscar o artigo mais antigo com `content IS NULL AND approved = false`.
Incluir `approval_token` na query.
Salvar em `squads/blog-luby-auto/output/article-brief.md`.

### Passo 4 — Encerrar se fila vazia
Se nenhum artigo for encontrado após o scout, logar "Fila vazia após scout. Pipeline encerrado." e parar.

## Veto Conditions
- Supabase inacessível → logar erro e encerrar
- Nenhum publisher ativo → logar "Nenhum publisher encontrado" e encerrar
