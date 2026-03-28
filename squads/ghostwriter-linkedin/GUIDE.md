# Ghostwriter LinkedIn — Luby | Guia Completo

## O que é

Um squad de 5 agentes de IA que gera posts de LinkedIn prontos para publicação, personalizados por colaborador da Luby. Cada post passa por pesquisa, personalização de persona, escrita criativa, revisão técnica e revisão de engajamento antes da entrega.

---

## Os 5 Agentes

| Agente | Papel | Execução |
|--------|-------|----------|
| **Marco** (Pesquisa) | Varre a web buscando dados, stats e ângulos editoriais sobre o tema | Subagent (background) |
| **Sofia** (Persona) | Carrega o perfil do colaborador e cruza com o research para definir tom, voz e ângulo | Inline |
| **Bruno** (Ghostwriter) | Escreve 2 variantes A/B do post com hooks diferentes + faz a entrega final | Inline |
| **Helena** (Técnica) | Verifica precisão factual — nenhum dado inventado, nenhum claim sem fonte | Inline |
| **Victor** (Engajamento) | Avalia hook, formatação, CTA, voz e adequação ao tamanho com scoring 1-10 | Inline |

---

## O Pipeline (9 steps)

```
STEP 00 ─ Flavor Picker (checkpoint)
│  Busca temas no Supabase → usuário escolhe:
│  categoria → sub-tema → colaborador → idioma → tamanho
│  ⚠️ Avisa se Low/Large não é ideal para engajamento
│
STEP 01 ─ Pesquisa Web (Marco, subagent)
│  Lê sources.json → varre fontes prioritárias por idioma
│  → buscas genéricas complementares → research-brief.md
│
STEP 02 ─ Carga de Persona (Sofia, inline)
│  Lê collaborators.json + research-brief
│  → cruza findings com perfil → persona-brief.md
│
STEP 03 ─ Escrita de Variantes (Bruno, inline)
│  Lê research + persona + tone-of-voice + skill linkedin-content
│  → escreve 2 variantes A/B respeitando {tamanho}
│  → post-variants.md
│
STEP 04 ─ Seleção de Variante (checkpoint)
│  Usuário escolhe A ou B (ou pede reescrita)
│  → selected-variant.md
│
STEP 05 ─ Revisão Técnica (Helena, inline)
│  Verifica cada claim contra research-brief
│  → APPROVE / CONDITIONAL / REJECT → tech-review.md
│
STEP 06 ─ Revisão de Engajamento (Victor, inline)
│  Scoring: hook, voz, formatação, CTA, hashtags, valor, tamanho
│  → APPROVE / CONDITIONAL / REJECT → engagement-review.md
│
STEP 07 ─ Aprovação Final (checkpoint)
│  Apresenta post + reviews → usuário aprova ou pede ajuste
│  → final-post.md
│
STEP 08 ─ Entrega (Bruno, inline)
│  Salva arquivo final nomeado + atualiza post-history.json
│  → {perfil}-{slug}-{idioma}-{date}.md
```

Se Helena ou Victor rejeitam → volta ao Step 03 (Bruno reescreve).

---

## Os 4 Inputs

| Input | Opções | Onde é pedido |
|-------|--------|---------------|
| **Flavor** | Vem do Supabase (tabela `related_searchs`) | Step 00 |
| **Perfil** | Wagner, Maise, Samuel, Marine, Paulo, Gardin | Step 00 |
| **Idioma** | EN, PT-BR | Step 00 |
| **Tamanho** | Low (<=700 chars), Medium (700-1500), Large (1500-3000) | Step 00 |

---

## Estrutura de Arquivos

```
squads/ghostwriter-linkedin/
├── squad.yaml                    ← Config principal do squad
├── squad-party.csv               ← Lista de agentes
├── GUIDE.md                      ← Este guia
├── agents/
│   ├── marco.agent.md            ← Pesquisador
│   ├── sofia.agent.md            ← Persona
│   ├── bruno.agent.md            ← Ghostwriter
│   ├── helena.agent.md           ← Revisora técnica
│   └── victor.agent.md           ← Revisor de engajamento
├── pipeline/
│   ├── pipeline.yaml             ← Definição dos 9 steps
│   ├── steps/
│   │   ├── step-00-flavor-picker.md
│   │   ├── step-01-research.md
│   │   ├── step-02-persona.md
│   │   ├── step-03-write.md
│   │   ├── step-04-variant-selection.md
│   │   ├── step-05-tech-review.md
│   │   ├── step-06-engagement-review.md
│   │   ├── step-07-final-approval.md
│   │   └── step-08-delivery.md
│   └── data/
│       ├── collaborators.json    ← Perfis dos colaboradores
│       ├── sources.json          ← Fontes de pesquisa por idioma
│       ├── supabase-config.json  ← Conexão Supabase
│       ├── tone-of-voice.md      ← Regras universais de tom
│       └── quality-criteria.md   ← Critérios de aprovação/rejeição
├── output/
│   ├── post-history.json         ← Índice de todos os posts gerados
│   └── {run-id}/                 ← Pasta de cada execução
│       ├── selected-flavor.md
│       ├── research-brief.md
│       ├── persona-brief.md
│       ├── post-variants.md
│       ├── selected-variant.md
│       ├── tech-review.md
│       ├── engagement-review.md
│       ├── final-post.md
│       └── {perfil}-{slug}-{idioma}-{date}.md
└── _memory/
    └── memories.md               ← Aprendizados acumulados entre runs
```

---

## Como Editar Cada Coisa

### Adicionar um novo colaborador

Editar `pipeline/data/collaborators.json` — adicionar um novo objeto seguindo o padrão:

```json
"NomeNovo": {
  "name": "NomeNovo",
  "role": "Papel / Área",
  "audience": { "EN": "...", "PT-BR": "..." },
  "objective": { "EN": "...", "PT-BR": "..." },
  "topics": ["...", "..."],
  "tone": { "EN": "...", "PT-BR": "..." },
  "voice_markers": { "EN": ["...", "..."], "PT-BR": ["...", "..."] },
  "avoid": ["...", "..."]
}
```

Depois, atualizar:
- `squad.yaml` → campo `inputs[perfil].options` — adicionar o nome
- `pipeline/data/quality-criteria.md` → tabela "Critérios de Autenticidade de Persona" — adicionar linha
- `pipeline/steps/step-00-flavor-picker.md` → lista de colaboradores no Passo 3

### Adicionar/remover fontes de pesquisa

Editar `pipeline/data/sources.json` — adicionar ou remover sites nos arrays:
- `sources.pt-br.sites` → fontes brasileiras
- `sources.en.sites` → fontes US/global
- `sources.communities.sites` → comunidades (ambos idiomas)

Nenhum outro arquivo precisa ser alterado.

### Adicionar novos temas (flavors) no Supabase

Inserir registros na tabela `related_searchs` no Supabase:
- `query` = categoria (ex: "IA aplicada")
- `related_search` = sub-tema específico (ex: "Claude Code para dev")

O step-00 busca automaticamente da tabela via API REST.

### Mudar o tom de voz geral

Editar `pipeline/data/tone-of-voice.md` — regras universais que se aplicam a todos os colaboradores (hooks permitidos, formatação obrigatória, idioma/mercado, palavras proibidas).

### Mudar critérios de aprovação/rejeição

Editar `pipeline/data/quality-criteria.md`:
- Seção "Revisão Técnica" → critérios da Helena
- Seção "Revisão de Engajamento" → scoring do Victor
- Regras de aprovação: média >= 7/10, nenhum critério < 4/10

### Alterar o comportamento de um agente

Editar o `.agent.md` correspondente na pasta `agents/`:
- `marco.agent.md` — como pesquisa, quais buscas faz
- `sofia.agent.md` — como cruza persona × research
- `bruno.agent.md` — como escreve (estrutura por tamanho, hooks, voice)
- `helena.agent.md` — como revisa fatos
- `victor.agent.md` — como avalia engajamento

### Alterar o fluxo do pipeline

Editar `pipeline/pipeline.yaml` — adicionar, remover ou reordenar steps. Cada step referencia um arquivo em `steps/` e um agente.

### Adicionar um novo idioma

1. Adicionar em `squad.yaml` → `inputs[idioma].options`
2. Adicionar seção no `sources.json` (ex: `sources.es`)
3. Adicionar traduções em `collaborators.json` (audience, objective, tone, voice_markers)
4. Atualizar `tone-of-voice.md` com referências do novo mercado
5. Atualizar `step-00-flavor-picker.md`

### Ver histórico de posts gerados

Ler `output/post-history.json` — índice com data, perfil, flavor, idioma, tamanho e caminho do arquivo. Atualizado automaticamente a cada entrega (step-08).

---

## Execução

Para rodar: `/opensquad run ghostwriter-linkedin`

O pipeline executa todos os 9 steps em sequência, pausando nos 3 checkpoints (steps 00, 04, 07) para input do usuário.
