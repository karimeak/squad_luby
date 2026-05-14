# Arquitetura — Equipe de Agentes

Documento técnico que descreve a arquitetura atual (manual) e o caminho de
migração para automação via **Claude Agent SDK**.

## Atualização 2026-05 — Pipeline schema-driven

A máquina deixou de ser "uma cena React por vídeo" e virou
**schema-driven**: cada vídeo é um `VideoSpec` em
`src/schema/examples/{slug}.ts`, e os renderers genéricos
(`src/renderer/PremiumScene.tsx` + `MinimalScene.tsx`) montam o vídeo
a partir de **block kinds** (catálogo em `src/schema/types.ts`).

Implicações para os agentes:
- Diretor Criativo escolhe `kind` do catálogo (não inventa componente).
- Motion Designer **escreve spec**, raramente escreve React novo.
- Revisor avalia se o spec está bem composto (não só "tá bonito").

### Catálogo de blocks (16 — 2026-05)

Premium-friendly: `logo-mark`, `eyebrow`, `tagline`, `accent-line`,
`closing-card`.

Conteúdo / explicação: `sentence-with-syncs`, `concept-row`, `pipeline`,
`multiplication-equation`, `big-stat` (variantes typographic / donut /
comparison-bars).

Wave 2 (B2B): `metric-grid`, `feature-grid`, `quote`, `logo-row`,
`timeline`.

Stub (não implementado): `concept-pair`.

### Standards aplicados (defaults — não pedir o contrário sem razão narrativa)

1. **Sem BrandFrame** — vídeos `mode: 'corporate'` não têm logo
   top-left nem lang badge top-right. Só `mode: 'personal'` mantém.
2. **Sem progress bar** — removida do BrandFrame.
3. **Cards grandes** — `ConceptRowBlock` default `size: 'standard'`;
   `MultiplicationEquationBlock` default `size: 'feature'`.
4. **autoResolveIcons opt-in** — default `false`. Specs explicitam
   `icon: 'NomeLucide'` por bloco. Evita footguns tipo PT "time" →
   `Clock`.
5. **Modes em paridade de craft** — minimal não é flat-flat. Tem
   surface0 + micro-textura + halos sutis. Premium tem orbs/mesh/blooms.

### LightOverlay per video

`LightOverlay` aceita `schedule` por spec (não mais global). Vídeos
podem definir `themeSchedule` no `VideoSpec` para janelas de cor.
Sem schedule, comporta-se como dark uniforme.

---

## Stack alvo

**Claude Agent SDK** (Anthropic, oficial). Razões:
- Modelo de "agent loop" nativo, com tool use built-in
- Suporta sub-agentes (cada papel da equipe = um agente especializado)
- Roda como serviço (acionável por webhook/API)
- Permite human-in-the-loop quando necessário
- Mantém o projeto inteiro num só lugar (não fragmenta com tools externas
  tipo n8n)

Docs de referência: <https://docs.claude.com/en/api/agent-sdk/overview>

## Princípios da arquitetura

1. **Stateless agents, stateful artifacts**
   Cada agente é puro: recebe input, devolve output. O estado mora nos
   artefatos da pasta `runs/`, não nos agentes.

2. **Contratos explícitos entre agentes**
   Cada agente declara em `contracts/` o formato do seu input e do seu
   output. Mudança de formato = mudança do contrato = atualização explícita.

3. **Personas como código**
   Os arquivos `.md` em `personas/` são fonte da verdade do "system prompt"
   de cada agente. Versionados no Git, evoluem com o produto.

4. **Loop de correção limitado**
   Revisor pode rejeitar e devolver para Motion Designer (ou Diretor) no
   máximo 2 vezes por run. Mais que isso, escala para humano. Evita loops
   infinitos.

5. **Idempotência por run**
   Re-acionar um agente em uma run existente sobrescreve seu artefato (não
   adiciona). Permite re-executar segmentos do pipeline sem refazer tudo.

## Mapeamento manual → Agent SDK

| Conceito atual (manual)             | Equivalente em Agent SDK            |
|--------------------------------------|--------------------------------------|
| `personas/01-estrategista.md`        | `Agent.systemPrompt`                |
| `contracts/02-estrategia.schema.md`  | Schema Zod do output do agente      |
| `templates/estrategia.example.md`    | Few-shot example no prompt          |
| `runs/2026-05-12-x/01-estrategia.md` | Registro persistido em DB           |
| Acionar agente no Cursor             | `agent.run({ input })` no código    |
| Loop de correção manual              | Orchestrator + retry policy         |
| Trigger humano                       | Webhook / API endpoint              |

## Pipeline em código (target)

Esquema do que vai virar:

```ts
import { Agent } from '@anthropic-ai/agent-sdk';
import { strategistPrompt, copywriterPrompt /* ... */ } from './prompts';
import { strategySchema, scriptSchema /* ... */ } from './schemas';

const strategist = new Agent({
  systemPrompt: strategistPrompt,
  outputSchema: strategySchema,
});

const copywriter = new Agent({
  systemPrompt: copywriterPrompt,
  outputSchema: scriptSchema,
});

// ... (3, 4, 5)

export async function runPipeline(briefing: Briefing): Promise<DeliveryResult> {
  const strategy   = await strategist.run({ input: briefing });
  const script     = await copywriter.run({ input: { briefing, strategy } });
  const storyboard = await director.run({ input: { strategy, script } });
  const code       = await motionDesigner.run({ input: { storyboard } });
  const mp4        = await renderMP4(code);
  const review     = await reviewer.run({ input: { storyboard, mp4 } });

  if (review.status === 'rejected' && review.retryCount < 2) {
    return runCorrectionLoop(review, /* ... */);
  }

  return { mp4, metadata: { strategy, script, storyboard, review } };
}
```

## Trigger externo (squad)

A "máquina" será acionada por um sistema externo da Luby (o "open squad" do
fluxo de criação de conteúdo). Interface esperada:

```
POST /api/video/generate
{
  "briefing": {
    "type": "url" | "text" | "topic",
    "content": "...",
    "language": "pt" | "en",
    "mode": "corporate" | "personal",
    "speaker": { "name": "...", "role": "..." } | null
  },
  "constraints": {
    "deadline": "2026-05-12T18:00Z",
    "priority": "normal" | "urgent"
  },
  "callback_url": "https://..."
}

→ Response: { "run_id": "abc123", "status": "processing" }

Callback (when ready):
POST {callback_url}
{
  "run_id": "abc123",
  "status": "completed" | "failed",
  "mp4_url": "https://...",
  "metadata": { ... },
  "review_summary": "..."
}
```

## Estado atual vs estado alvo

| Aspecto              | Atual (manual)                | Alvo (Agent SDK)              |
|----------------------|-------------------------------|-------------------------------|
| Trigger              | Humano no Cursor              | Webhook / API                 |
| Orquestração         | Humano coordena               | Pipeline em código            |
| Persistência         | Arquivos `.md` na pasta       | DB (Postgres) + S3 para MP4   |
| Retry                | Manual                        | Política automática           |
| Observabilidade      | Inspeção manual de arquivos   | Logs estruturados + traces    |
| Custo                | Tempo do operador             | Tokens de API                 |
| Cadência             | 1 vídeo por sessão            | Paralelizável                 |

## Critérios para migrar

Não migrar antes de:
- 5 a 10 vídeos rodados manualmente sem reabertura conceitual
- Personas estáveis (sem alterações nos últimos 3 vídeos)
- Contratos estáveis (sem mudanças de formato nos últimos 3 vídeos)
- Confiança no Revisor (taxa de "aprovado direto" > 70%)

## O que vai mudar quando migrar

**Não muda:**
- Personas (texto idêntico vira system prompt)
- Contratos (vira schema)
- Templates (vira few-shot example)
- Princípio diretor "MUITO VISUAL"

**Muda:**
- Acionamento (Cursor → API call)
- Persistência (arquivos → DB)
- Loop de correção (manual → automático com policy)
- Monitoramento (visual → logs)
