# Contrato 02 — Roteiro

**Quem produz**: Roteirista
**Quem consome**: Diretor Criativo (principal), Motion Designer (para
strings PT/EN)
**Arquivo gerado**: `agents/runs/{run-id}/02-roteiro.md`

---

## Schema

```yaml
type: object
required:
  - has_narration
  - total_words_pt
  - total_words_en
  - beats
properties:
  has_narration:
    type: boolean
    description: "Se haverá narração ou só texto on-screen"

  narration_voice:
    type: object | null
    properties:
      tone: enum [authoritative, conversational, energetic, calm]
      gender_preference: enum [masculine, feminine, no-preference]
      provider_hint: string
    description: "Apenas se has_narration=true"

  total_words_pt: integer
  total_words_en: integer

  beats:
    type: array
    length: 5
    items: BeatObject

BeatObject:
  type: object
  required: [name, duration_seconds, text_pt, text_en, sync_keywords]
  properties:
    name:
      type: enum
      values: [intro, hook, bullets, stat, cta]
    duration_seconds:
      type: number
      description: "Tempo sugerido para esse beat. Soma dos 5 deve ser ~30"
    text_pt:
      type: string
      description: |
        Texto em português. Palavras-chave marcadas com **asterisco duplo**.
    text_en:
      type: string
      description: "Texto em inglês, com palavras-chave também marcadas"
    sync_keywords:
      type: array of object
      items:
        pt: string
        en: string
      description: |
        Lista de palavras-chave a sincronizar visualmente.
        Use forma canônica (sem pontuação): "segurança", não "segurança?"
    notes_for_director:
      type: string
      description: "Dicas de tom, ritmo, intenção"
      optional: true

  observations:
    type: string
    description: "Observações gerais para o Diretor"
    optional: true

  rejected_messages:
    type: array of string
    description: |
      Outras mensagens que estavam no briefing mas foram descartadas.
      Servem como pista para outros vídeos.
    optional: true
```

## Formato do arquivo

```markdown
# Roteiro — {título da run}

## Metadata
- **Narração**: sim | não
- **Voz**: {tone, gender} (se sim)
- **Total de palavras PT**: {n}
- **Total de palavras EN**: {n}

## Beat 1 — Intro ({X}s)

**PT**: {texto com **palavras-chave** marcadas}

**EN**: {texto with **keywords** marked}

**Palavras-chave para sync**:
- {pt} / {en}
- {pt} / {en}

**Notas para o Diretor**: {opcional}

---

## Beat 2 — Hook ({X}s)

{idem}

---

## Beat 3 — Bullets ({X}s)

{idem}

---

## Beat 4 — Stat ({X}s)

{idem}

---

## Beat 5 — CTA ({X}s)

{idem}

---

## Observações gerais
{opcional — qualquer dica geral pro Diretor}

## Mensagens descartadas
- {mensagem 1 que ficou de fora — pode virar outro vídeo}
- {mensagem 2}
```

## Validações pelo Diretor

O Diretor pode pedir refinamento se:
- Alguma palavra-chave não tem representação visual óbvia
- Total de palavras incompatível com duração (texto denso demais)
- Beat de bullets tem mais de 4 pontos
- CTA não tem ação específica
