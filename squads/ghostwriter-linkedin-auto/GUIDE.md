# Ghostwriter LinkedIn Auto — Luby

## O que e
Squad automatizado que gera posts LinkedIn Text Medium (700-1500 chars) para todos os colaboradores da Luby, sem interacao humana. Posts sao gerados em EN e traduzidos para PT-BR, revisados automaticamente, e salvos no Supabase para envio via n8n.

## Execucao
```
/opensquad run ghostwriter-linkedin-auto
```

## Pipeline (9 steps, 0 checkpoints)

| Step | Agente | O que faz |
|------|--------|-----------|
| 00 | Lucas 🔗 | Carrega collaborators do Supabase + match flavor por topics |
| 01 | Marco 🔍 | Pesquisa web sobre o flavor (subagent) |
| 02 | Sofia 🎭 | Carrega persona, cruza com research, seleciona angulo |
| 03 | Bruno ✍️ | Escreve 1 post EN (Text Medium) |
| 04 | Bruno ✍️ | Traduz EN > PT-BR com adaptacoes culturais |
| 05 | Helena 🔬 | Review combinada (tech + engajamento) com auto-fix |
| 06 | Lucas 🔗 | Analisa perfil LinkedIn e gera sugestoes de melhoria |
| 07 | Lucas 🔗 | Salva posts EN + PT-BR na tabela bloggers (Supabase) |
| 08 | Bruno ✍️ | Entrega final: salva output, atualiza historico |

Steps 01-07 executam em loop para cada collaborator.

## Agentes (5)

| Agente | Papel | Execucao |
|--------|-------|----------|
| Marco Pesquisa 🔍 | Pesquisador web B2B tech | Subagent |
| Sofia Persona 🎭 | Analista de persona e POV | Inline |
| Bruno Ghostwriter ✍️ | Writer + tradutor EN>PT-BR | Inline |
| Helena Revisora 🔬 | Review combinada com auto-fix | Inline |
| Lucas Integrador 🔗 | Supabase + LinkedIn optimizer | Inline |

## Supabase

### Tabelas usadas
- **collaborators** — perfis dos colaboradores (leitura + update linkedin_improvement)
- **bloggers** — posts gerados (insert, submitted_content=false)
- **related_searchs** — flavors para match com topics

### Fluxo de dados
```
collaborators → squad gera posts → bloggers (submitted=false)
                                → collaborators.linkedin_improvement (update)
n8n lê bloggers + collaborators → envia email → marca submitted=true
```

## n8n Workflow

Arquivo: `n8n/linkedin-send-emails.json`

### Nos
1. **Manual Trigger** (ou Schedule)
2. **Query Bloggers** — WHERE submitted_content=false AND content IS NOT NULL
3. **Query Collaborators** — getAll
4. **Build Email** — agrupa posts por collaborator, monta HTML com:
   - Post EN (area de copia)
   - Post PT-BR (area de copia)
   - Sugestoes de melhoria LinkedIn
5. **Send Email** — Zoho SMTP para collaborator.email
6. **Split Blogger IDs** — prepara IDs para update
7. **Mark as Submitted** — UPDATE bloggers SET submitted_content=true

### Setup no n8n
1. Importar o JSON no n8n
2. Configurar credencial Supabase (URL + anon key)
3. Configurar credencial Zoho SMTP (ja existente)
4. Executar manualmente ou agendar via Schedule Trigger

## Regras de qualidade

- **Formato:** Text Post Medium (700-1500 chars)
- **Idioma:** EN (original) + PT-BR (traducao cultural)
- **Review:** Auto-fix ate 2 tentativas. Se nao resolver, aceita com warning.
- **Dados:** Toda statistic deve ter fonte entre parenteses
- **Voz:** Cada post soa como o colaborador especifico

## Skills

- `web_search` / `web_fetch` — pesquisa de conteudo
- `linkedin-content` — regras de LinkedIn (hooks, formatting, CTAs)
- `linkedin-profile-optimizer` — analise e sugestoes de perfil

## Estrutura de arquivos

```
squads/ghostwriter-linkedin-auto/
├── squad.yaml                          # Config principal
├── squad-party.csv                     # Roster de agentes
├── GUIDE.md                            # Este arquivo
├── pipeline/
│   ├── pipeline.yaml                   # Definicao do pipeline
│   ├── steps/                          # 9 step files
│   │   ├── step-00-load-collaborators.md
│   │   ├── step-01-research.md
│   │   ├── step-02-persona.md
│   │   ├── step-03-write.md
│   │   ├── step-04-translate.md
│   │   ├── step-05-review.md
│   │   ├── step-06-linkedin-optimizer.md
│   │   ├── step-07-save-to-supabase.md
│   │   └── step-08-delivery.md
│   └── data/
│       ├── supabase-config.json        # URL + key + tabelas
│       ├── sources.json                # Fontes de pesquisa
│       ├── tone-of-voice.md            # Regras de tom
│       └── quality-criteria.md         # Criterios de review
├── agents/
│   ├── marco.agent.md                  # Pesquisador
│   ├── sofia.agent.md                  # Persona
│   ├── bruno.agent.md                  # Writer + tradutor
│   ├── helena.agent.md                 # Revisora combinada
│   └── lucas.agent.md                  # Integrador Supabase
├── n8n/
│   └── linkedin-send-emails.json       # Workflow n8n
├── output/                             # Posts gerados
│   └── .gitkeep
└── _memory/
    └── memories.md                     # Learnings do squad
```

## Como editar

### Adicionar collaborator
Inserir novo registro na tabela `collaborators` do Supabase com todos os campos preenchidos.

### Mudar fontes de pesquisa
Editar `pipeline/data/sources.json`.

### Mudar criterios de review
Editar `pipeline/data/quality-criteria.md`.

### Mudar tom de voz
Editar `pipeline/data/tone-of-voice.md`.

### Mudar agentes
Editar os arquivos `.agent.md` em `agents/`.
