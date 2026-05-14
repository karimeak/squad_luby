---
step: step-05-review
name: Revisao Combinada (Tech + Engajamento)
type: agent
agent: helena
execution: inline
max_retries: 2
---

# Step 05 — Revisao Combinada (Tech + Engajamento) — language-aware

## Objetivo
Helena revisa os posts **apenas nas linguas-alvo do collaborator** (campo `languages` em `collaborator-queue.json`). Em modo automatico, Helena auto-corrige problemas em vez de rejeitar (ate 2 tentativas).

> **Humanizacao (remocao de tells de IA) e responsabilidade do Pedro no step-05b.** Helena NAO mexe em em-dash, vocabulario inflado, paralelismos ou outras categorias humanizer. Foco unico: tech + engagement.
>
> **Language-aware:**
> - Se `"en-us"` em languages → revisa `post-en.md` e gera `reviewed-post-en.md`
> - Se `"pt-br"` em languages → revisa `post-pt.md` e gera `reviewed-post-pt.md`
> - Se apenas uma lingua, **so revisa essa**. O `post-en.md` rascunho interno (quando `languages=["pt-br"]`) NAO precisa ser revisado.

## Instrucoes para Helena

### Input
- Ler `.agents/skills/linkedin-content/SKILL.md`
- Ler `squads/ghostwriter-linkedin-auto/pipeline/data/quality-criteria.md`
- Ler `squads/ghostwriter-linkedin-auto/pipeline/data/tone-of-voice.md`
- Ler `{name}/research-brief.md`
- Ler `{name}/persona-brief.md`
- Ler `{name}/post-en.md` (se `"en-us"` em languages — caso contrario, ignorar)
- Ler `{name}/post-pt.md` (se `"pt-br"` em languages — caso contrario, nao existe)
- Ler `collaborator-queue.json` para extrair `languages`

### Processo (para cada idioma)

#### Tech Review
1. Identificar todos os claims factuais (percentuais, empresas, afirmacoes)
2. Verificar cada um contra research-brief
3. Auto-fix: dado nao verificado -> soften para linguagem qualitativa
4. Auto-fix: empresa sem verificacao -> remover ou generalizar
5. Auto-fix: promessa da Luby -> remover

#### Engagement Review (scoring 1-10)
1. Hook strength — scroll-stop test
2. Voice authenticity — voice markers presentes?
3. LinkedIn formatting — paragrafos curtos, line breaks
4. CTA quality — pergunta especifica e genuina
5. Hashtag relevance — 3-5, ultima linha, mix
6. Content value — insight real, algo salvavel

#### Auto-Fix Decision
- **APPROVE** (media engagement >= 7, nenhum criterio < 4, zero tech issues): Aceitar
- **AUTO-FIX** (qualquer issue): Corrigir e re-avaliar
  - Tentativa 1: fixes pontuais (hook, CTA, dados, formatting)
  - Tentativa 2: correcoes mais agressivas
  - Apos 2 tentativas: aceitar com `<!-- REVIEW_WARNING -->` no post

### Auto-Fix Rules

**Tech:**
- Dado nao verificado como fato -> soften ("significantly" em vez de "40%")
- Empresa sem verificacao -> remover nome
- Promessa falsa -> remover

**Engajamento:**
- Hook fraco (< 7) -> reescrever com Hook Formulas da skill
- CTA generica -> reescrever para o publico especifico
- Muro de texto -> quebrar paragrafos
- Voice markers ausentes -> incorporar 1-2
- Hashtags erradas -> substituir

> **NAO incluir** em-dash, vocabulario inflado, paralelismos, atribuicoes vagas etc. Esses tells sao tratados pelo Pedro no step-05b.

### Output (apenas para linguas-alvo)
- `{name}/reviewed-post-en.md` — **se `"en-us"` em languages** — post EN final
- `{name}/reviewed-post-pt.md` — **se `"pt-br"` em languages** — post PT-BR final
- `{name}/review-report.md` — scoring tables (tech + engagement) + auto-fixes aplicados (cobre apenas as linguas-alvo)

## Next
step-05b-humanize (Pedro humaniza os reviewed-post-*.md antes da Diana gerar a imagem)
