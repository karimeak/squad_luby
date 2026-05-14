# Contrato 01 — Estratégia

**Quem produz**: Estrategista
**Quem consome**: Roteirista (principal), Diretor (referência)
**Arquivo gerado**: `agents/runs/{run-id}/01-estrategia.md`

---

## Schema

```yaml
type: object
required:
  - briefing_interpretation
  - single_message
  - audience
  - format
  - mode
  - cta
  - kpi
  - visual_hooks
properties:
  briefing_interpretation:
    type: string
    description: "Como o Estrategista leu o briefing. 1-2 parágrafos."

  single_message:
    type: string
    description: |
      A ÚNICA mensagem do vídeo. Uma frase curta. Tudo no vídeo deve
      servir a ela.

  audience:
    type: object
    required: [primary, signals]
    properties:
      primary:
        type: string
        description: "Descrição específica (não 'devs', mas 'tech leads de fintechs Series B+')"
      signals:
        type: array of string
        description: "Sinais comportamentais — o que essa pessoa busca/sente/faz"

  format:
    type: object
    required: [name, justification]
    properties:
      name:
        type: enum
        values: [case-study, dev-insight, hot-take, hiring, recap, capability-spotlight, milestone, market-insight, tutorial, behind-the-scenes]
      justification:
        type: string

  mode:
    type: enum
    values: [corporate, personal]
    description: "Confirma ou contradiz o briefing, com justificativa"

  mode_justification:
    type: string

  cta:
    type: object
    required: [action, url]
    properties:
      action:
        type: string
        description: "Ação específica. 'Agende', 'Acesse', 'Compartilhe'."
      url:
        type: string
        description: "URL específica, não 'luby.co'. Ex: 'luby.co/diagnostico-ai-security'"

  kpi:
    type: object
    required: [primary_metric, target]
    properties:
      primary_metric:
        type: enum
        values: [reach, engagement, clicks, leads, applications, brand-recall]
      target:
        type: string
        description: "Valor concreto. Ex: 'CTR > 2%', '50+ leads em 30 dias'"

  visual_hooks:
    type: array of string
    description: |
      3-5 ângulos que o vídeo pode explorar visualmente.
      Cada hook é uma direção visual — não detalhe técnico.
      Ex: "Diagrama dois polos (velocidade vs segurança) com tensão"
    min_items: 3
    max_items: 5

  core_concepts:
    type: array of string
    description: |
      Lista curta (2-4) de conceitos-chave que a estratégia
      pinpoint para guiar o raciocínio metafórico do Diretor
      Criativo. Exemplos: "dualidade", "composição",
      "transformação", "foco", "crescimento", "reviravolta",
      "conexão", "profundidade".

      Esse campo é uma DICA EXPLÍCITA pro Diretor Criativo
      consultar a seção correspondente em agents/metaforas.md
      (Seção A = Comparação/Contraste, Seção B = Composição,
      Seção C = Transformação, etc).

      Opcional. Estrategista só preenche quando enxerga
      conceitos claros e estáveis no briefing — não inventa
      conceitos só para preencher campo.
    optional: true
    min_items: 2
    max_items: 4

  risks:
    type: array of object
    properties:
      risk: string
      mitigation: string
    description: "O que pode dar errado e como mitigar"

  rejection:
    type: object | null
    properties:
      reason: string
      questions_to_clarify: array of string
    description: "Apenas se o Estrategista rejeitou o briefing"
```

## Formato do arquivo

```markdown
# Estratégia — {título da run}

## Interpretação do briefing
{1-2 parágrafos}

## Mensagem única
{uma frase}

## Audiência alvo
**Primária**: {descrição específica}

**Sinais**:
- {sinal 1}
- {sinal 2}
- {sinal 3}

## Formato
**Nome**: {case-study | dev-insight | etc.}
**Justificativa**: {por quê esse formato}

## Modo
**Escolha**: corporate | personal
**Justificativa**: {por quê esse modo}

## Call to action
- **Ação**: {verbo + complemento}
- **URL**: {URL específica}

## KPI esperado
- **Métrica primária**: {tipo}
- **Target**: {valor concreto}

## Ganchos visuais sugeridos
1. {hook 1}
2. {hook 2}
3. {hook 3}

## Conceitos-chave (opcional)
- {conceito 1: dualidade | composição | transformação | foco | etc}
- {conceito 2}

> Esse bloco é uma dica para o Diretor Criativo abrir
> `agents/metaforas.md` na seção temática correspondente. Só
> preencha quando o briefing apresentar conceitos claros e
> estáveis — não invente para preencher campo.

## Riscos
- **{risco 1}**: {mitigação}
- **{risco 2}**: {mitigação}
```

## Se for rejeição

```markdown
# Estratégia — REJEITADO

## Motivo
{por que o briefing precisa de refinamento antes}

## Perguntas para clarificar
1. {pergunta específica}
2. {pergunta específica}
3. {pergunta específica}

## Próximo passo
Operador deve atualizar o briefing respondendo as perguntas acima e
reacionar o Estrategista.
```
