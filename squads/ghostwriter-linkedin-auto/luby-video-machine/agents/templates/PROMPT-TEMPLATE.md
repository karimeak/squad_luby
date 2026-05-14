# Prompt template — acionar a máquina (4 renders padrão)

Use este template pra acionar a máquina pra qualquer vídeo novo.
Substitua todos os `{{CAMPOS}}` antes de colar no Cursor.

Toda run produz **4 renders padrão**:
* PT corporate
* EN corporate
* PT personal (voz técnica-expert genérica, sem speaker nomeado)
* EN personal (idem em inglês)

## Variáveis a preencher

| Variável | Como decidir |
|----------|--------------|
| `{{RUN_SLUG}}` | Slug curto kebab-case do tema. Ex: `case-fintech-x`, `software-pronto`, `vaga-tech-lead` |
| `{{TODAY_DATE}}` | Data YYYY-MM-DD em que está rodando |
| `{{TOPIC_SHORT}}` | Frase curta de 1 linha descrevendo o vídeo |
| `{{BRIEFING_CONTENT}}` | Briefing completo seguindo o template abaixo |

## Template do prompt (cola no Cursor, conversa nova)

```
Run the full 5-agent pipeline for this video. No checkpoints, no
pauses. Render FOUR outputs from the same content. Final report at
the end.

═══════════════════════════════════════════════
TOPIC
═══════════════════════════════════════════════

"{{TOPIC_SHORT}}"

Render targets (4 outputs, same content across all):
1. PT-BR corporate (institutional Luby account)
2. EN-US corporate (institutional Luby account)
3. PT-BR personal (generic technical-expert voice, no named speaker)
4. EN-US personal (generic technical-expert voice, no named speaker)

What varies between renders:
- Language: PT-BR (1, 3) and EN-US (2, 4)
- Mode: corporate (1, 2) and personal (3, 4)
- BrandFrame intensity: full in corporate, discreet in personal
  (smaller logo, no "Luby" sign-off card on the CTA)
- Narration tone: institutional in corp, first-hand expert
  observation in personal (same words on screen)

═══════════════════════════════════════════════
STEP 0 — Setup
═══════════════════════════════════════════════

1. Create `agents/runs/{{TODAY_DATE}}-{{RUN_SLUG}}/out/`

2. Create
   `agents/runs/{{TODAY_DATE}}-{{RUN_SLUG}}/00-briefing.md`
   with the content below:

---BRIEFING START---
{{BRIEFING_CONTENT}}
---BRIEFING END---

═══════════════════════════════════════════════
EXECUTION
═══════════════════════════════════════════════

Run the 5 agents in sequence, no pauses:

1. **Strategist** — reads persona + briefing → `01-estrategia.md`.
   Fill `core_concepts` if applicable. Strategy is shared across the
   4 renders — same audience, same message, same KPI. What varies
   is distribution channel and language.

2. **Copywriter** — reads persona + briefing + strategy →
   `02-roteiro.md`. Both PT-BR and EN-US texts. Produce
   personal-version narration variant note in script's
   `notes_for_director` field: same words on screen, but narration
   tone shifts from institutional to first-hand expert observation.

3. **Creative Director** — reads persona + strategy + script →
   `03-storyboard.md`. Consult `agents/metaforas.md`, choose 2-3
   metaphor candidates per key scene, justify. Fill `metaphor` field
   for each key scene.

   ADDITIONAL: in the storyboard, add a section "Personal version
   adaptations" describing the visual deltas:
   - BrandFrame intensity (smaller logo, removed sign-off)
   - CTA visual changes (neutral closing, no prominent "luby.co")
   - Anything else that differs between corp and personal visually

4. **Motion Designer** — schema-driven adaptation:
   - Create `src/schema/examples/{{RUN_SLUG}}.ts` as a parameterizable
     spec that accepts `language` ('pt' | 'en') and `frameMode`
     ('corporate' | 'personal') as inputs
   - Register FOUR `<Composition>` in `src/Root.tsx`:
     - `{{RUN_SLUG}}-pt-corp`
     - `{{RUN_SLUG}}-en-corp`
     - `{{RUN_SLUG}}-pt-personal`
     - `{{RUN_SLUG}}-en-personal`
   - Update `src/i18n/strings.ts` and `scripts/audio/narration.json`
     with PT and EN strings (and personal-tone narration variants for
     both languages if your narration system supports it; otherwise
     render personal with same narration as corp and document the
     deviation)
   - Reuse archetypes from `src/renderer/archetypes/`. Create new
     components only if genuinely missing
   - Render FOUR MP4s to:
     - `agents/runs/.../out/video-pt-corp.mp4`
     - `agents/runs/.../out/video-en-corp.mp4`
     - `agents/runs/.../out/video-pt-personal.mp4`
     - `agents/runs/.../out/video-en-personal.mp4`
   - Produce `04-implementation-notes.md` documenting all four renders

5. **Reviewer** — evaluates the FOUR outputs → `05-review.md`.
   Validate each render separately. Approve/reject per render.
   Personal versions validated specifically for: discreet BrandFrame,
   removed institutional sign-off, generic-but-expert tone.

═══════════════════════════════════════════════
RULES
═══════════════════════════════════════════════

- Don't show intermediate content during execution, just save files
- If any agent rejects, STOP and let me know
- If ANY of the 4 renders fails, STOP and let me know
- At the end, return a short report (12-16 lines):
  - Reviewer's decision per render (4 decisions)
  - Main strengths
  - Issues and severity (per render if different)
  - VISUAL VARIATION REPORT: metaphors and archetypes chosen for each
    key scene, compared to previous 3 runs in `agents/runs/*/03-storyboard.md`.
    Did this video vary intentionally?
  - Personal vs corporate visual deltas — confirmed in renders?
  - Paths to all 4 final MP4s

Go.
```

## Template do `{{BRIEFING_CONTENT}}`

```markdown
# Briefing — {{TITULO_DO_BRIEFING}}

## Metadata
- **Source**: text
- **Languages**: pt, en
- **Modes**: corporate (PT + EN renders), personal (PT + EN renders)
- **Personal speaker**: not defined. Personal versions use a generic
  technical-expert voice — first-person observation of someone who
  has seen this pattern happen many times in the field. NOT a named
  individual. NOT institutional Luby either.

## Content
{{CORPO DO BRIEFING — 2-4 parágrafos descrevendo:}}
{{- O QUE o vídeo precisa comunicar}}
{{- POR QUÊ esse vídeo precisa existir agora}}
{{- O ÂNGULO que diferencia (não basta "queremos falar sobre X")}}
{{- A AUDIÊNCIA específica (não "B2B geral")}}
{{- O TOM esperado (autoridade calma? provocativo? didático?)}}

{{Se houver narrative spine sugerida (ex: 3 fases, antes/depois),}}
{{inclua aqui MAS marque que Copywriter e Diretor podem ajustar.}}

## References
{{Liste 3-6 referências concretas:}}
{{- Posicionamento Luby aplicável}}
{{- Números reais e citáveis (220+ engineers, 1.350+ projetos, etc.)}}
{{- Clientes Fortune 500 relevantes (LexisNexis, Bridgestone, Siemens,}}
{{  Sunwest Bank — só os que fazem sentido pro tema)}}
{{- Stats reais com fonte (60% menos vulnerabilidades, 3-5x faster)}}
{{- Posts/links externos que inspiraram (opcional)}}

## Constraints
{{Liste 5-8 coisas a EVITAR. Sempre inclua:}}
{{- Avoid: "AI hype," "revolutionary," "transformative"}}
{{- Avoid: tool name dropping como mensagem}}
{{- Avoid: sales jargon ("synergy," "strategic partnership")}}
{{- Avoid: promising 100% of anything}}
{{- Avoid: AI replacing humans (model is augmentation)}}
{{- Avoid for personal versions: sentences requiring named speaker}}
{{  ("eu, fulano de tal") — keep first-person observational}}
{{- Avoid: [específico do vídeo — o que NÃO queremos parecer]}}

## Notes
{{Contexto extra livre:}}
{{- Audiência específica (perfil, momento de decisão)}}
{{- Walk-away thought esperado}}
{{- Se faz parte de série, conexão narrativa}}
{{- CTA específico esperado (URL ou ação leve)}}
{{- Pista visual forte que o Diretor deve considerar (opcional)}}

PERSONAL VERSIONS specifics:
- Same content rendered with discreet BrandFrame
- Narration tone shifts from institutional to first-hand observation
- Posted on hypothetical Luby employee's personal feed — brand
  implicit, not stamped

CONFIANÇA NO DIRETOR CRIATIVO: este tema tem conceito visual aberto.
Consultar `agents/metaforas.md` e justificar escolha.
```

## Decisões críticas que o briefing precisa responder

Antes de submeter, valida se o briefing responde:

1. **Por que esse vídeo, agora?** Sem timing claro, Estrategista
   rejeita ou produz estratégia rasa.
2. **Qual o ângulo defensável?** Não basta o tema — precisa do ângulo.
3. **Quem se importa em assistir até o fim?** Audiência específica.
4. **Qual o walk-away thought?** O que o espectador deve pensar
   depois.
5. **Qual o CTA mensurável?** Ação específica (mesmo que placeholder).

Se não responde essas 5, o briefing está raso.

## O que NÃO mudar do template

Partes fixas — não personalizar por vídeo:

* Estrutura dos 5 agentes (ordem e papéis)
* Os 4 renders padrão (PT corp, EN corp, PT personal, EN personal)
* Setup da pasta da run em `agents/runs/`
* Regra de criar spec novo em `src/schema/examples/`
* Regra de registrar 4 `<Composition>` em `src/Root.tsx`
* Regra de atualizar `i18n/strings.ts` + `narration.json` sem quebrar
  anteriores
* Formato do relatório final
* Personal version specifics (BrandFrame discreto, sign-off removido)

## Quando recalibrar o template

Se o squad usar este template 4-5 vezes e perceber:
* Algum agente rejeitando muito → calibrar persona desse agente
* Vídeos saindo com qualidade desigual → revisar este template
* Algum tipo de tema sempre dando trabalho → criar variante específica
