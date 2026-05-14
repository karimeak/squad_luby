---
step: step-05d-video-generation
name: Geracao de Video Remotion (luby-video-machine, modo personal)
type: agent
agent: cleidim
execution: inline
model_tier: powerful
skills:
  - remotion-best-practices
---

# Step 05d — Geracao de Video Remotion (Cleidim + luby-video-machine)

## Objetivo

Cleidim itera sobre os collaborators em `video-queue.json` (selecionados pelo step-05c), monta um briefing por collaborator a partir do `humanized-post-{lang}.md`, aciona internamente os 5 sub-agentes do `luby-video-machine` (Estrategista > Roteirista > Diretor > Motion Designer > Revisor), renderiza um MP4 30s 1920x1080 modo `personal` na lingua escolhida, e faz upload para o bucket `linkedin-ghostwriter-videos`.

> **Falha em 1 collaborator NAO bloqueia o pipeline.** Marca `video_rotation_linkedin.status='failed'` e segue para o proximo. Os demais collaborators (nao selecionados) seguem o fluxo padrao sem video.

## Inputs

- `video-queue.json` (output do step-05c) — N collaborators a processar
- Para cada collaborator selecionado:
  - `{name}/humanized-post-{lang}.md` — conteudo base do briefing (lingua = a escolhida pela rotacao)
  - `{name}/research-brief.md` — contexto factual
  - `{name}/persona-brief.md` — voice markers, audience
- `pipeline/data/video-config.json` — paths, render flags, modo
- `pipeline/data/supabase-config.json` — URL e anon_key
- `squads/ghostwriter-linkedin-auto/luby-video-machine/` — projeto Remotion (NAO editar src/)

## Processo

### Pre-flight (1x antes do loop)

1. Verificar `node_modules/` em `luby-video-machine/`. Se ausente, rodar `npm install` (~1-2 min).
2. Confirmar Node.js 18+ disponivel (`node --version`).
3. Criar pasta `luby-video-machine/agents/runs/` se nao existir.

### Loop por collaborator

**Para cada item em `video-queue.json`:**

#### Etapa 1 — Slug + paths

```bash
COLLAB_NAME="<collaborator.name>"
COLLAB_UUID="<collaborator.id>"
LANG_CODE="<pt-br|en-us>"      # ex: pt-br
LANG_SHORT="<pt|en>"           # mapeamento: pt-br->pt, en-us->en
FLAVOR_SLUG=$(node -e "console.log(process.argv[1].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''))" "<flavor>")
NAME_SLUG=$(node -e "console.log(process.argv[1].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''))" "${COLLAB_NAME}")
RUN_DATE="<YYYY-MM-DD>"
RUN_SLUG="${RUN_DATE}-${NAME_SLUG}-${LANG_CODE}"
LVM_RUN_DIR="luby-video-machine/agents/runs/${RUN_SLUG}"
ROW_ID="<rotation_row_id do video-queue.json>"
```

#### Etapa 2 — Montar briefing

Criar `${LVM_RUN_DIR}/00-briefing.md` (ver formato em `cleidim.agent.md` Etapa 1).

Criar tambem `${LVM_RUN_DIR}/00-content-source.md` linkando o post-fonte:
```markdown
# Content source
- File: {run_output}/{name}/humanized-post-{lang}.md
- Persona: {run_output}/{name}/persona-brief.md
- Research: {run_output}/{name}/research-brief.md
```

#### Etapa 3 — Acionar os 5 sub-agentes do luby-video-machine

Sequencialmente (cada um le a persona e produz seu artefato em `${LVM_RUN_DIR}/`):

| # | Persona file | Output |
|---|---|---|
| 1 | `luby-video-machine/agents/personas/01-estrategista.md` | `01-estrategia.md` |
| 2 | `luby-video-machine/agents/personas/02-roteirista.md` | `02-roteiro.md` |
| 3 | `luby-video-machine/agents/personas/03-diretor-criativo.md` | `03-storyboard.md` |
| 4 | `luby-video-machine/agents/personas/04-motion-designer.md` | `04-implementation-notes.md` + spec em `luby-video-machine/src/schema/examples/${NAME_SLUG}-${LANG_CODE}.ts` |
| 5 | `luby-video-machine/agents/personas/05-revisor.md` | `05-review.md` (spec-only review) |

**Gates auto-aprovados (Cleidim NAO pergunta ao usuario):**

- **Gate 1 (Motion Designer Passo 2.5 — archetype novo)**: auto-aprovar opcao `(a)` (implementar archetype novo). Registrar em `04-implementation-notes.md`:
  ```yaml
  gate_decisions:
    gate1: auto-approved-implement
    gate1_warning: "Archetype novo introduzido sem revisao humana. Componente fica permanente em luby-video-machine/src/renderer/archetypes/."
  ```

- **Gate 2 (Motion Designer Passo 4 — smoke-still)**: pular geracao de stills, ir direto pro render full. Registrar:
  ```yaml
  gate_decisions:
    gate2: auto-approved-skip-stills
    gate2_warning: "Render full sem revisao de stills. Risco de descobrir problema visual so no MP4."
  ```

#### Etapa 4 — Render via Remotion

```bash
OUT_FILE="${LVM_RUN_DIR}/out/video-personal.mp4"
mkdir -p "$(dirname "${OUT_FILE}")"

cd squads/ghostwriter-linkedin-auto/luby-video-machine

# Composition: tenta usar a registrada por lingua (DemoVideo-PT-Personal ou DemoVideo-EN-Personal)
# Props injetadas: lang, mode, speaker, e specSlug se a composition aceitar
COMPOSITION="DemoVideo-${LANG_SHORT^^}-Personal"  # PT ou EN

PROPS_JSON=$(cat <<EOF
{"lang":"${LANG_SHORT}","mode":"personal","speaker":{"name":"${COLLAB_NAME}","role":"${COLLAB_ROLE}"}}
EOF
)

timeout 480 npx remotion render "${COMPOSITION}" "${OUT_FILE}" \
  --props="${PROPS_JSON}"

RENDER_EXIT=$?
cd -
```

Se `RENDER_EXIT != 0` ou timeout (480s = 8 min): pular pra **Etapa 7 (failed)**.

Se MP4 < 100KB: tratar como falha (render produziu arquivo corrompido).

#### Etapa 5 — Upload pro Supabase Storage

```bash
SUPABASE_URL="<supabase_url>"
ANON_KEY="<supabase_anon_key>"
BUCKET="linkedin-ghostwriter-videos"
PATH_IN_BUCKET="${COLLAB_UUID}/${RUN_DATE}-${FLAVOR_SLUG}-${LANG_CODE}.mp4"

UPLOAD_HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "${SUPABASE_URL}/storage/v1/object/${BUCKET}/${PATH_IN_BUCKET}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: video/mp4" \
  -H "x-upsert: true" \
  --data-binary "@${OUT_FILE}")

if [[ "${UPLOAD_HTTP}" != "200" && "${UPLOAD_HTTP}" != "201" ]]; then
  # Retry 1x
  sleep 5
  UPLOAD_HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X POST ... )
  [[ "${UPLOAD_HTTP}" != "200" && "${UPLOAD_HTTP}" != "201" ]] && goto FAILED
fi

PUBLIC_URL="${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${PATH_IN_BUCKET}"
```

#### Etapa 6 — PATCH video_rotation_linkedin (sucesso)

```bash
curl -s -X PATCH \
  "${SUPABASE_URL}/rest/v1/video_rotation_linkedin?id=eq.${ROW_ID}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "{\"status\":\"uploaded\",\"video_url\":\"${PUBLIC_URL}\"}"
```

#### Etapa 7 — PATCH video_rotation_linkedin (falha)

Se qualquer etapa anterior falhou:

```bash
curl -s -X PATCH \
  "${SUPABASE_URL}/rest/v1/video_rotation_linkedin?id=eq.${ROW_ID}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"status":"failed"}'
```

#### Etapa 8 — Salvar video-confirmation.md

Salvar em `{run_output}/{COLLAB_NAME}/video-confirmation.md`:

```markdown
# Video Confirmation — {name}

- Language: {pt-br|en-us}
- Status: {uploaded|failed}
- Local MP4: luby-video-machine/agents/runs/{run_slug}/out/video-personal.mp4
- Public URL: {url ou "n/a — failed"}
- Storage path: linkedin-ghostwriter-videos/{collab_uuid}/{date}-{flavor-slug}-{lang}.mp4
- Render duration: {seconds}s
- File size: {bytes}
- Composition used: {DemoVideo-PT-Personal|DemoVideo-EN-Personal}
- video_rotation_linkedin row_id: {row_id}
- Gates: gate1=auto-approved-implement, gate2=auto-approved-skip-stills
- Failure reason: {se status=failed, descrever: render_timeout | render_error | upload_4xx | corrupt_mp4}
- Timestamp: {ISO}
```

> O step-08 e step-09 leem este arquivo para saber se incluem `video_url`. Sempre salvar — mesmo em caso de falha (com `Status: failed` e `Public URL: n/a`).

## Regras
- 1 video por collaborator selecionado, 1 lingua, modo `personal` SEMPRE
- Falha em 1 collaborator NUNCA bloqueia o resto do step nem o pipeline
- Cada collaborator NAO selecionado pelo step-05c **NAO entra neste step** (sem `video-confirmation.md` gerado para eles)
- Sub-agentes do `luby-video-machine` rodam inline (Cleidim assume cada persona em sequencia)
- Gates 1 e 2 auto-aprovados com warning registrado no `04-implementation-notes.md`

## Verificacao (por collaborator)

- [ ] Briefing montado em `${LVM_RUN_DIR}/00-briefing.md`
- [ ] 5 sub-agentes acionados em ordem (artefatos 01-05 em `${LVM_RUN_DIR}/`)
- [ ] Gates 1 e 2 com decisao registrada
- [ ] MP4 gerado em `${LVM_RUN_DIR}/out/video-personal.mp4` (>100KB)
- [ ] Upload Supabase HTTP 200/201 (ou status='failed' apos 1 retry)
- [ ] Row em `video_rotation_linkedin` com status final (uploaded ou failed)
- [ ] `video-confirmation.md` produzido

## Output
- N pastas em `luby-video-machine/agents/runs/{date}-{slug}-{lang}/` (1 por collaborator selecionado)
- N MP4s em `linkedin-ghostwriter-videos` bucket (apenas os que tiveram upload OK)
- N rows finalizadas em `video_rotation_linkedin` (status uploaded ou failed)
- N arquivos `{name}/video-confirmation.md` (1 por collaborator selecionado)

## Next
step-06-image-suggestion (Diana gera 1 imagem por lingua-alvo de CADA collaborator — independente de ter video ou nao)
