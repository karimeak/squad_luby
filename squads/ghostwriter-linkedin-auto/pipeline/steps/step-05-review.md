---
step: step-05-review
name: Revisao Combinada (Tech + Engajamento + Humanizacao)
type: agent
agent: helena
execution: inline
max_retries: 2
---

# Step 05 — Revisao Combinada (Tech + Engajamento + Humanizacao)

## Objetivo
Helena revisa ambos os posts (EN e PT-BR) em um unico passo, combinando fact-checking tecnico, avaliacao de engajamento LinkedIn e humanizacao (remocao de tells de escrita IA). Em modo automatico, Helena auto-corrige problemas em vez de rejeitar (ate 2 tentativas).

## Instrucoes para Helena

### Input
- Ler `.agents/skills/linkedin-content/SKILL.md`
- Ler `.agents/skills/humanizer/SKILL.md`
- Ler `squads/ghostwriter-linkedin-auto/pipeline/data/quality-criteria.md`
- Ler `squads/ghostwriter-linkedin-auto/pipeline/data/tone-of-voice.md`
- Ler `{name}/research-brief.md`
- Ler `{name}/persona-brief.md`
- Ler `{name}/post-en.md`
- Ler `{name}/post-pt.md`

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

#### Humanization Review (scoring 1-10)
Aplicar a skill `humanizer`. Varrer o post atras de tells IA:
1. Em dash em excesso (mais de 2 no post)
2. Rule of three repetitivo
3. Vocabulario inflado (delve, leverage, robust, seamless, foster, navigate, alavancar, mergulhar profundamente, robusto, fluido)
4. Atribuicoes vagas ("many experts say", "muitos especialistas dizem", "studies show")
5. Paralelismos negativos repetidos ("not just X, it's Y" / "nao apenas X, mas Y")
6. Conjuncoes formais ("Moreover", "Furthermore", "Alem disso", "Adicionalmente", "In conclusion")
7. Analise -ing superficial ("highlighting the importance of", "showcasing how")
8. Promocional ("groundbreaking", "revolutionary", "game-changing", "transformador")
9. Inflated symbolism ("stands as a testament", "serve como um lembrete")

Score = 10 menos penalidade por tells encontradas.

**Atencao especial em PT-BR:** traducao infla — "delve" vira "mergulhar profundamente", "leverage" vira "alavancar", "moreover" vira "alem disso". Caçar essas tells na versao traduzida tambem.

#### Auto-Fix Decision
- **APPROVE** (media >= 7, nenhum criterio < 4, zero tech issues, humanization >= 7): Aceitar
- **AUTO-FIX** (qualquer issue): Corrigir e re-avaliar
  - Tentativa 1: fixes pontuais (hook, CTA, dados, formatting, AI tells obvias)
  - Tentativa 2: correcoes mais agressivas (incluindo reescrita de paragrafos com muitas tells)
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

**Humanization:**
- Em dash em excesso -> substituir por virgula/ponto/parentese
- Rule of three repetitivo -> reescrever com 2 itens ou variar estrutura
- Vocabulario inflado -> trocar por palavra simples
- Atribuicao vaga -> remover ou tornar concreto
- Paralelismo negativo -> variar
- Conjuncao formal -> transicao natural ou cortar
- Analise -ing superficial -> verbo direto
- Promocional -> descricao especifica
- Inflated symbolism -> cortar

### Output
- `{name}/reviewed-post-en.md` — post EN final (corrigido se necessario)
- `{name}/reviewed-post-pt.md` — post PT-BR final (corrigido se necessario)
- `{name}/review-report.md` — scoring tables + auto-fixes aplicados

## Next
step-06-image-suggestion (Bruno gera sugestão de imagem para o post)
