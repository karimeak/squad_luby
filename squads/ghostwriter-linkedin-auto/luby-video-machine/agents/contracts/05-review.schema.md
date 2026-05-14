# Contrato 05 — Review

**Quem produz**: Revisor
**Quem consome**: Squad externo (decisão final) + Motion Designer/Diretor
(em caso de rejeição)
**Arquivo gerado**: `agents/runs/{run-id}/05-review.md`

---

## Schema

```yaml
type: object
required:
  - final_decision
  - block_a_technical
  - block_b_visual_density
  - block_c_sync
  - block_d_retention
  - strengths
  - issues
properties:
  final_decision:
    type: enum
    values: [approved, approved-with-notes, rejected]

  retry_count:
    type: integer
    description: "Quantas vezes essa run já foi devolvida"
    default: 0

  block_a_technical:
    type: object
    description: "Cada item: true (pass) | false (fail) | string (detalhes se fail)"
    properties:
      resolution_correct: boolean
      duration_correct: boolean
      fps_correct: boolean
      audio_synced: boolean | null
      text_legible: boolean
      palette_on_brand: boolean
      typography_correct: boolean
      logo_present: boolean
      lang_badge_correct: boolean
      no_visual_glitches: boolean
      clean_render: boolean

  block_b_visual_density:
    type: object
    description: "Cena a cena: contagem de elementos visuais"
    properties:
      intro: { icons: integer, cards: integer, extras: array of string, verdict: enum [pass, fail] }
      hook: { ... }
      bullets: { ... }
      stat: { ... }
      cta: { ... }
      overall_verdict: enum [pass, fail]

  block_c_sync:
    type: array of object
    items:
      keyword: string
      expected_icon: string
      delivered: boolean
      sync_frame_drift: integer  # +/- frames
      semantic_fit: enum [good, acceptable, weak]

  block_d_retention:
    type: object
    properties:
      first_3s_hook: enum [strong, ok, weak]
      rhythm_variation: enum [strong, ok, weak]
      memorable_highlight: object
        properties:
          exists: boolean
          frame: integer
          description: string
      cta_clarity: enum [strong, ok, weak]
      brand_presence: enum [balanced, too-much, too-little]

  strengths:
    type: array of string
    description: "Pontos fortes específicos, com mérito"

  issues:
    type: array of object
    description: "Lista de itens a corrigir (vazia se aprovado)"
    properties:
      scene: enum [intro, hook, bullets, stat, cta, global]
      problem: string
      severity: enum [critical, major, minor]
      suggested_fix: string
      assignee: enum [motion-designer, director]

  publication_risk:
    type: string
    description: "Se publicar como está, o que pode dar errado"

  next_action:
    type: object
    properties:
      type: enum [publish, send-back, escalate-to-human]
      assignee: string | null
      instructions: string
```

## Formato do arquivo

```markdown
# Review — {título da run}

## Decisão final
**APROVADO** | **APROVADO COM RESSALVAS** | **REJEITADO**

**Retry count**: 0 | 1 | 2

---

## Bloco A — Técnico

| Item | Status |
|------|--------|
| Resolução 1920×1080 | ✅ |
| Duração 30s ±0.5s | ✅ |
| FPS 30 | ✅ |
| Áudio sincronizado | ✅ / N/A |
| Texto legível (≥32px) | ✅ |
| Paleta on-brand | ✅ |
| Tipografia correta | ✅ |
| Logo presente | ✅ |
| Lang badge correto | ✅ |
| Sem glitches | ✅ |
| Render limpo | ✅ |

**Veredicto Bloco A**: PASSOU / FALHOU

---

## Bloco B — Densidade visual

| Cena | Ícones | Cards | Extras | Veredicto |
|------|--------|-------|--------|-----------|
| Intro | 1 | 0 | logo animado, linha decorativa | ✅ |
| Hook | 3 | 0 | sync palavra-imagem | ✅ |
| Bullets | 3 | 3 | diagrama com conectores | ✅ |
| Stat | 1 | 0 | barra animada | ✅ |
| CTA | 1 | 0 | logo + URL | ✅ |

**Veredicto Bloco B**: PASSOU

---

## Bloco C — Sincronização (sync palavra-imagem)

| Palavra | Ícone esperado | Entregue | Drift (frames) | Semântica |
|---------|----------------|----------|----------------|-----------|
| acelerar | Zap | ✅ | 0 | bom |
| IA | Sparkles | ✅ | 0 | bom |
| segurança | ShieldCheck | ✅ | +2 | bom |

**Veredicto Bloco C**: PASSOU

---

## Bloco D — Retenção

- **Primeiros 3s**: strong | ok | weak
- **Variação de ritmo**: strong | ok | weak
- **Highlight memorável**: frame 180 — pergunta completa + escudo brilhando
- **CTA clareza**: strong | ok | weak
- **Presença da marca**: equilibrada | exagerada | tímida

---

## Pontos fortes
1. {específico, com mérito}
2. {específico, com mérito}

## Pontos a corrigir
{lista vazia se aprovado, ou:}

### Issue #1
- **Cena**: hook
- **Severidade**: major
- **Problema**: O ícone Sparkles entra no frame 140 mas a palavra
  "IA" aparece no frame 132 — está 8 frames atrasado.
- **Correção sugerida**: Mover startFrame do Sparkles para 132.
- **Responsável**: Motion Designer

### Issue #2
{...}

## Risco para publicação
{se publicar como está, o que dá errado}

## Próxima ação
- **Tipo**: publish | send-back | escalate-to-human
- **Responsável**: {agente ou humano}
- **Instruções**: {o que precisa acontecer agora}
```
