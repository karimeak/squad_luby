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

Cleidim itera sobre os collaborators em `video-queue.json` (selecionados pelo step-05c), monta um briefing por collaborator a partir do `humanized-post-{lang}.md`, aciona internamente os 5 sub-agentes do `luby-video-machine` (Estrategista > Roteirista > Diretor > Motion Designer > Revisor), e renderiza um MP4 30s 1920x1080 modo `personal` na lingua escolhida usando uma Composition **custom criada pelo Motion Designer neste run** (NUNCA `DemoVideo*` pre-existente). Faz upload para o bucket `linkedin-ghostwriter-videos`.

> **Falha em 1 collaborator NAO bloqueia o pipeline.** Marca `video_rotation_linkedin.status='failed'` e segue para o proximo. Os demais collaborators (nao selecionados) seguem o fluxo padrao sem video.
>
> **NAO existe atalho.** Se o Motion Designer pipeline (etapas 1-5 abaixo) nao produziu artefatos completos (briefing + 5 outputs + spec novo + Composition registrada), marcar `status='failed'` e pular esse collaborator. **NUNCA cair em `DemoVideo`, `DemoVideo-PT`, `DemoVideo-EN`, `DemoVideo-PT-Personal` ou `DemoVideo-EN-Personal`** — essas Compositions carregam `lubyDemoSpec` (luby-demo.ts) que e o pitch Luby AI-seguranca hardcoded, vai produzir MP4 com speaker badge correto mas conteudo (visuais + narracao + BGM) alheio ao post do collaborator.
>
> **Audio defaults sao obrigatorios:** ler `pipeline/data/video-config.json` campo `audio_defaults` antes do render. Spec gerado pelo Motion Designer DEVE ter `audio.narrationEnabled: false` e `audio.bgmId` setado (default: `corporate-tech-uplifting-1`). Narracao SEMPRE off — os assets em `public/audio/manifest.json` sao o pitch Luby hardcoded, nao o post do collaborator.

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
| 4 | `luby-video-machine/agents/personas/04-motion-designer.md` | `04-implementation-notes.md` + spec em `luby-video-machine/src/schema/examples/${COMPOSITION}.ts` + nova `<Composition id="${COMPOSITION}">` em `luby-video-machine/src/Root.tsx` |
| 5 | `luby-video-machine/agents/personas/05-revisor.md` | `05-review.md` (spec-only review) |

> Convencao do `${COMPOSITION}`: `{name-slug}-{flavor-slug-or-topic-key}-{lang-short}`. Exemplos das runs 2026-05-13: `karime-kumagai-revops-en`, `rodrigo-gardin-substrate-en`. O Motion Designer DEVE criar o arquivo spec novo E adicionar uma `<Composition>` nova em `Root.tsx` com esse `id` — sem essas duas edicoes, Cleidim nao consegue renderizar e marca `failed`.
>
> **Audio defaults obrigatorios** no spec gerado pelo Motion Designer (lidos de `pipeline/data/video-config.json` campo `audio_defaults`):
> ```ts
> audio: {
>   bgmId: 'corporate-tech-uplifting-1',
>   bgmVolume: 0.12,
>   bgmVolumeDucked: 0.05,
>   narrationEnabled: false,
>   narrationVolume: 0,
> }
> ```

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

#### Etapa 4 — Pre-render gates + Render via Remotion

**Pre-render gates** — TODOS sao bloqueantes. Qualquer falha → marcar `failed` (Etapa 7) sem renderizar.

```bash
cd squads/ghostwriter-linkedin-auto/luby-video-machine

# Composition id = nome do spec gerado pelo Motion Designer (passo 4 dos sub-agentes)
# Convencao: {name-slug}-{flavor-slug-or-topic-key}-{lang-short}
# Exemplo: karime-kumagai-revops-en, rodrigo-gardin-substrate-en
COMPOSITION="${NAME_SLUG}-${FLAVOR_SLUG_OR_TOPIC}-${LANG_SHORT}"
SPEC_PATH="src/schema/examples/${COMPOSITION}.ts"

# Gate 1: spec gerado pelo Motion Designer existe?
[ -f "${SPEC_PATH}" ] || { echo "GATE FAIL: spec missing — motion designer pulou step 4"; goto FAILED; }

# Gate 2: implementation notes (artefato do Motion Designer) existe?
[ -f "${LVM_RUN_DIR}/04-implementation-notes.md" ] || { echo "GATE FAIL: motion designer skipped"; goto FAILED; }

# Gate 3: Composition foi registrada em Root.tsx?
grep -q "id=\"${COMPOSITION}\"" src/Root.tsx || { echo "GATE FAIL: composition not registered in Root.tsx"; goto FAILED; }

# Gate 4: spec usa audio defaults do squad?
grep -q "narrationEnabled: false" "${SPEC_PATH}" || { echo "GATE FAIL: narration must be disabled"; goto FAILED; }
grep -q "bgmId:" "${SPEC_PATH}" || { echo "GATE FAIL: bgmId must be set"; goto FAILED; }

# Gate 5: composition id nao e uma das proibidas
case "${COMPOSITION}" in
  DemoVideo|DemoVideo-PT|DemoVideo-EN|DemoVideo-PT-Personal|DemoVideo-EN-Personal)
    echo "CRITICAL: forbidden composition id ${COMPOSITION} — abort"
    exit 1
    ;;
esac

OUT_FILE="${LVM_RUN_DIR}/out/video-personal.mp4"
mkdir -p "$(dirname "${OUT_FILE}")"

PROPS_JSON=$(cat <<EOF
{"lang":"${LANG_SHORT}","mode":"personal","speaker":{"name":"${COLLAB_NAME}","role":"${COLLAB_ROLE}"}}
EOF
)

# Render a Composition CUSTOM criada pelo Motion Designer DESTE run
timeout 480 npx remotion render "${COMPOSITION}" "${OUT_FILE}" \
  --props="${PROPS_JSON}"

RENDER_EXIT=$?
cd -
```

Se `RENDER_EXIT != 0` ou timeout (480s = 8 min): pular pra **Etapa 7 (failed)**.

Se MP4 < 100KB: tratar como falha (render produziu arquivo corrompido).

> **PROIBIDO em qualquer hipotese:** `npx remotion render DemoVideo`, `DemoVideo-PT`, `DemoVideo-EN`, `DemoVideo-PT-Personal`, `DemoVideo-EN-Personal`. Essas Compositions carregam `lubyDemoSpec` (pitch Luby AI+seguranca hardcoded). Renderizar isso vai produzir um MP4 com nome/role do speaker certo mas visuais + narracao + BGM completamente alheios ao post do collaborator. Aconteceu em 2026-05-18 com Alon e Bianca — 2 MP4s alheios subiram pro bucket com `status='uploaded'`.
>
> **Sem atalho de tempo.** Se "rodar 5 sub-agentes inline parece caro", isso e o custo do step. Pular sub-agentes nao e fail-safe — e producao de conteudo errado.

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
- Composition used: {id da composition custom criada pelo Motion Designer neste run — ex: karime-kumagai-revops-en. NUNCA pode ser DemoVideo*}
- Spec path: luby-video-machine/src/schema/examples/{composition_id}.ts
- Audio: bgm={bgm_id} narrationEnabled=false
- video_rotation_linkedin row_id: {row_id}
- Gates: gate1=auto-approved-implement, gate2=auto-approved-skip-stills
- Pre-render gates: spec_exists=ok, motion_notes_exists=ok, root_registered=ok, audio_defaults=ok, not_forbidden_id=ok
- Failure reason: {se status=failed, descrever: motion_designer_skipped | spec_missing | composition_not_registered | audio_defaults_violated | forbidden_composition_id | render_timeout | render_error | upload_4xx | corrupt_mp4}
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
- [ ] Spec novo gerado em `luby-video-machine/src/schema/examples/${COMPOSITION}.ts` com `audio.narrationEnabled: false` e `audio.bgmId` setado
- [ ] Composition nova registrada em `luby-video-machine/src/Root.tsx` com `id="${COMPOSITION}"`
- [ ] Gates 1 e 2 com decisao registrada
- [ ] Pre-render gates (5) passados: spec_exists, motion_notes_exists, root_registered, audio_defaults, not_forbidden_id
- [ ] Composition usada no `npx remotion render` NAO comeca com `DemoVideo`
- [ ] MP4 gerado em `${LVM_RUN_DIR}/out/video-personal.mp4` (>100KB)
- [ ] Upload Supabase HTTP 200/201 (ou status='failed' apos 1 retry)
- [ ] Row em `video_rotation_linkedin` com status final (uploaded ou failed)
- [ ] `video-confirmation.md` produzido com campo `Composition used` correto

## Output
- N pastas em `luby-video-machine/agents/runs/{date}-{slug}-{lang}/` (1 por collaborator selecionado)
- N MP4s em `linkedin-ghostwriter-videos` bucket (apenas os que tiveram upload OK)
- N rows finalizadas em `video_rotation_linkedin` (status uploaded ou failed)
- N arquivos `{name}/video-confirmation.md` (1 por collaborator selecionado)

## Next
step-06-image-suggestion (Diana gera 1 imagem por lingua-alvo de CADA collaborator — independente de ter video ou nao)
