# Contrato 04 — Implementation Notes

**Quem produz**: Motion Designer
**Quem consome**: Revisor (validação) + histórico
**Arquivo gerado**: `agents/runs/{run-id}/04-implementation-notes.md`

---

## Schema

```yaml
type: object
required:
  - files_modified
  - files_created
  - render_output
  - decisions
properties:
  files_modified:
    type: array of object
    properties:
      path: string
      summary: string

  files_created:
    type: array of object
    properties:
      path: string
      purpose: string

  primitives_reused:
    type: array of string
    description: "Componentes/helpers do design system reaproveitados"

  primitives_created:
    type: array of object
    description: "Novas primitivas adicionadas ao sistema"
    properties:
      path: string
      reason: string

  render_output:
    type: object
    description: |
      OBRIGATÓRIO 3 variantes a partir de 2026-05 (regra de entrega
      do Cleidson). Cada vídeo precisa render PT-corporate +
      EN-corporate + Personal (PT, sem branding Luby). Ver persona
      04 seção "Regra de entrega: 3 variantes por vídeo".

      Regras fixas globais (post-mortem 2026-05):
      - **Sem URL no CTA**: closing-card NUNCA renderiza URL em
        nenhuma variante. URL vai no copy do post LinkedIn. O
        renderer ignora `urlText` mesmo se presente no spec.
      - **Stat com fonte citável**: toda cena Stat com número
        precisa de `statSource` apontando para fonte pública
        confiável (CISQ, DORA, NIST, Stripe research, etc).
        Estimativas e números sem fonte são reprovados.
      - **Transição dark→light limpa**: `themeSchedule[].from`
        precisa ser ≥ `cenaAnterior.exit.at + cenaAnterior.exit.duration + 6`
        para evitar vazamento de conteúdo da cena anterior no
        cross-fade do LightOverlay.
      - **Lang badge suprimido em personal**: BrandFrame não
        renderiza o "PT-BR"/"EN-US" quando `mode === 'personal'`.
        Personal não carrega chrome Luby de nenhum tipo.
      - **Bullets com vocabulário técnico nomeado**: layers
        genéricas (tratamento de erro, performance, segurança) são
        reprovadas. Use Production Engineering / SRE / DORA com
        conceitos nomeados (Idempotência, Circuit breakers, etc).
    properties:
      pt:
        type: object
        properties:
          mp4_path: string         # "agents/runs/{id}/out/video-pt.mp4"
          composition_id: string   # "{slug}-pt"
          file_size_mb: number
      en:
        type: object
        properties:
          mp4_path: string         # "agents/runs/{id}/out/video-en.mp4"
          composition_id: string   # "{slug}-en"
          file_size_mb: number
          translation_notes: string  # qualquer trade-off na tradução PT→EN
      personal:
        type: object
        properties:
          mp4_path: string         # "agents/runs/{id}/out/video-personal.mp4"
          composition_id: string   # "{slug}-personal"
          file_size_mb: number
          speaker:
            name: string
            role: string
      duration_actual: number  # segundos (mesmo pra todas as variantes)
      smoke_stills:
        type: array of object
        description: |
          Stills renderizados no Passo 4 (Smoke-still gate) antes do
          render full. Cada item documenta um highlight frame
          aprovado. Ver persona 04 seção "Smoke-still antes do render
          full". Renderizados na variante PT-corporate (a base);
          variantes EN/personal herdam aprovação se passaram aqui.
        properties:
          frame: number
          scene: string
          path: string
          approved_at: string | null    # timestamp da aprovação humana
      smoke_stills:
        type: array of object
        description: |
          Stills renderizados no Passo 4 (Smoke-still gate) antes do
          render full. Cada item documenta um highlight frame
          aprovado. Ver persona 04 seção "Smoke-still antes do render
          full".
        properties:
          frame: number
          scene: string
          path: string
          approved_at: string | null    # timestamp da aprovação humana

  gate_decisions:
    type: array of object
    description: |
      Decisões tomadas em gates explícitos (archetype novo gate +
      smoke-still gate). Registrar mesmo quando a decisão foi
      "seguir direto sem mudança" — o histórico ajuda a calibrar
      heurísticas futuras.
    properties:
      gate_type: enum [archetype-new, smoke-still]
      decision: string                  # "approved", "fallback", "back-to-director", "ajustar"
      context: string                   # o que foi pedido
      outcome: string                   # o que aconteceu na sequência

  decisions:
    type: array of string
    description: "Decisões técnicas notáveis tomadas durante a implementação"

  deviations:
    type: array of object
    description: "Onde a implementação diverge do storyboard, com justificativa"
    properties:
      storyboard_request: string
      what_was_done: string
      reason: string

  notes_for_reviewer:
    type: array of string
    description: "Pontos de atenção para o Revisor"

  open_questions:
    type: array of string
    description: "Dúvidas que ficaram em aberto"
```

## Formato do arquivo

```markdown
# Implementation Notes — {título da run}

## Arquivos alterados
- `src/scenes/HookScene.tsx` — refatorado para usar SyncWord nas palavras-chave
- `src/i18n/strings.ts` — adicionadas chaves novas para esse vídeo

## Arquivos criados
- `src/scenes/CustomBulletsScene.tsx` — variação para esse vídeo específico
  porque o layout pedia diagrama em vez de lista vertical

## Primitivas reaproveitadas
- `Icon` (de src/components/Icon.tsx)
- `SyncWord`
- `BulletList`
- `BigStat`
- `MaskReveal`

## Primitivas criadas
{lista, ou "nenhuma" se reusou tudo}

## Render — 3 variantes (OBRIGATÓRIO desde 2026-05)
| Variante | MP4 | Composition ID | Tamanho |
|----------|-----|----------------|---------|
| PT-corporate | `out/video-pt.mp4` | `{slug}-pt` | X MB |
| EN-corporate | `out/video-en.mp4` | `{slug}-en` | X MB |
| Personal (PT, sem Luby) | `out/video-personal.mp4` | `{slug}-personal` | X MB |

- **Duração real**: 29.97s (todas)
- **Speaker (personal)**: Nome do colaborador, cargo
- **Translation notes (EN)**: qualquer trade-off de tradução PT→EN
  que vale o operador humano validar antes da publicação

## Smoke-stills aprovados (Passo 4)
| Frame | Cena | Path |
|-------|------|------|
| 40 | intro | `out/preview/still-040-intro.png` |
| 165 | hook | `out/preview/still-165-hook.png` |
| 480 | bullets | `out/preview/still-480-bullets.png` |
| 700 | stat | `out/preview/still-700-stat.png` |
| 860 | cta | `out/preview/still-860-cta.png` |

## Decisões em gates
- **archetype-new gate**: `{ "decisão": "approved" | "fallback" | "back-to-director", contexto, outcome }`
- **smoke-still gate**: `{ "decisão": "approved" | "ajustar" | "refazer-storyboard", contexto, outcome }`

Se não houve gate disparado nesta run, escreva "Nenhum gate disparado".

## Decisões técnicas
1. Optei por usar Brain em vez de Sparkles para "IA" porque...
2. ...

## Desvios do storyboard
| Pedido | O que foi feito | Por quê |
|--------|-----------------|---------|
| {item 1} | {item 1} | {item 1} |

## Notas para o Revisor
- Observar especialmente o frame 180 (highlight da cena Hook)
- O ícone na cena Stat tem timing apertado (3 frames de margem)

## Perguntas em aberto
{ou "nenhuma"}
```
