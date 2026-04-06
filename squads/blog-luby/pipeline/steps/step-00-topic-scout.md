---
type: agent
agent: tobias
execution: inline
model_tier: powerful
outputFile: squads/blog-luby/output/scout-brief.md
---

# Scout de Temas em Alta

O Tobias Scout vai vasculhar as fontes tech curadas, identificar temas relevantes e em alta, cruzar com os publishers ativos e apresentar sugestões de pauta para você decidir.

**Output:** `squads/blog-luby/output/scout-brief.md`

## Instruções para o Tobias

### Fase 1 — Coletar contexto

1. Ler `squads/blog-luby/pipeline/data/sources.json`
2. Ler `squads/blog-luby/pipeline/data/supabase-config.json`
3. Buscar publishers ativos no Supabase
4. Buscar títulos de artigos já existentes (evitar duplicatas)

### Fase 2 — Pesquisar tendências

Varrer as fontes curadas por idioma (PT-BR e EN) buscando:
- Headlines recentes das últimas 4 semanas
- Temas que aparecem em 2+ fontes diferentes
- Assuntos com dados frescos, debates em curso ou lançamentos relevantes

Focos de busca por idioma:
- **PT-BR**: tecnologia no Brasil, startups, IA, cloud, dev tools, mercado tech nacional
- **EN**: global tech trends, enterprise software, AI/ML, developer tools, cybersecurity, product launches

### Fase 3 — Selecionar e cruzar com publishers

Para cada tema identificado:
- Verificar se não existe artigo com título similar já criado
- Identificar qual publisher (channel + language + flavor) é mais adequado
- Definir um ângulo editorial específico (não apenas o assunto genérico)

Selecionar os **5 a 8 melhores temas** — qualidade sobre quantidade.

### Fase 4 — Apresentar sugestões ao usuário

Apresentar cada sugestão com:
- Título proposto para o artigo
- Publisher recomendado (channel + name + idioma)
- Ângulo editorial (por que este ângulo agora)
- Por que está em alta (fontes que cobriram)

Usar **AskUserQuestion com multiSelect: true** para que o usuário possa:
- Selecionar múltiplas sugestões (max 4 por pergunta — paginar se necessário)
- Indicar no campo "Other" se quer adicionar um tema personalizado

### Fase 5 — Tema personalizado (se houver)

Se o usuário digitou um tema personalizado:
1. Confirmar qual publisher deve usar via AskUserQuestion
2. Adicionar à lista de temas aprovados

### Fase 6 — Confirmar salvamento no Supabase

Apresentar a lista final de temas aprovados e perguntar via AskUserQuestion:

- **"Salvar todos como artigos futuros no Supabase"** — INSERT em `articles` com `content = NULL`
- **"Salvar apenas os que selecionei"** — INSERT só dos temas escolhidos
- **"Não salvar — apenas visualizar sugestões"** — prosseguir sem INSERT

Se autorizado a salvar:
- Fazer INSERT para cada tema aprovado: `{ "publisher": {id}, "title": "{tema}", "content": null }`
- Confirmar cada inserção com o ID retornado
- Exibir resumo: "N temas salvos com sucesso: #{id1}, #{id2}..."

### Fase 7 — Decidir próximo passo

Perguntar via AskUserQuestion:
- **"Gerar agora um dos temas salvos"** — prosseguir para step-01-article-picker
- **"Só queria salvar os temas por agora"** — encerrar o pipeline (temas ficam para futuras execuções)

### Salvar scout-brief

Salvar `squads/blog-luby/output/scout-brief.md` com:
- Lista de temas pesquisados e selecionados
- Publishers associados
- Status de salvamento no Supabase (ID de cada artigo criado)
- Decisão do usuário (gerar agora ou não)

## Veto Conditions

- Se nenhum publisher ativo for encontrado no Supabase → "Nenhum publisher encontrado. Cadastre publishers na tabela 'publishers' antes de usar o scout."
- Se menos de 3 temas válidos forem encontrados → expandir busca com queries alternativas antes de apresentar
