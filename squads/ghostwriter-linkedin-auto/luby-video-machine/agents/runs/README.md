# Runs

Cada vídeo gerado pela máquina vive numa subpasta aqui, contendo todos
os artefatos produzidos pelos 5 agentes.

## Convenção de nomes

```
agents/runs/YYYY-MM-DD-slug-curto/
```

Exemplos:
- `agents/runs/2026-05-12-acelerar-com-ia/`
- `agents/runs/2026-06-03-case-fintech-x/`
- `agents/runs/2026-06-10-vaga-tech-lead/`

## Estrutura de uma run completa

```
agents/runs/2026-05-12-acelerar-com-ia/
├── 00-briefing.md                  # Input cru (humano ou squad)
├── 01-estrategia.md                # Output do Estrategista
├── 02-roteiro.md                   # Output do Roteirista
├── 03-storyboard.md                # Output do Diretor Criativo
├── 04-implementation-notes.md      # Output do Motion Designer
├── 05-review.md                    # Output do Revisor
└── out/
    ├── video-pt.mp4                # Render PT-BR
    └── video-en.mp4                # Render EN-US (se aplicável)
```

## Estados intermediários

Uma run nem sempre chega completa. Possíveis estados:

- **Bloqueada na estratégia**: existe apenas `00-briefing.md`; o
  Estrategista rejeitou e está aguardando refinamento humano.
- **Bloqueada no roteiro**: até `01-estrategia.md`; o Roteirista pediu
  refinamento.
- **Em correção**: existe `05-review.md` com rejeição; volta pro
  Motion Designer ou Diretor.

## Por que versionar tudo no Git

- **Auditoria**: dá pra entender por que cada decisão foi tomada
- **Aprendizado**: runs antigas servem de exemplo pra novas
- **Iteração**: comparar duas runs do mesmo tema mostra evolução
- **Treinamento futuro**: quando virar Agent SDK, runs antigas viram
  few-shot examples

## Não comitar

A pasta `out/` pode (e provavelmente deve) ficar fora do Git via
`.gitignore`, porque MP4s são pesados. O fluxo recomendado:

- `00-briefing.md` a `05-review.md` → versionados
- `out/*.mp4` → não versionados; ficam local OU em storage externo
  (S3, Drive) com link em `04-implementation-notes.md`

Atualize `.gitignore` raiz do projeto com:

```
agents/runs/*/out/
```

## Criando uma nova run manualmente

Hoje (fluxo manual no Cursor):

```bash
# Crie a pasta
mkdir -p agents/runs/2026-05-15-meu-video/out

# Coloque o briefing
cp agents/templates/00-briefing.example.md \
   agents/runs/2026-05-15-meu-video/00-briefing.md
# Edite o briefing pra refletir o caso real
```

Depois, no Cursor, peça ao Claude para acionar cada agente em sequência
(veja `agents/README.md` seção "Como usar").

## Quando virar automático

Quando a máquina migrar pra Claude Agent SDK, a criação de runs vira
automática via API:

```
POST /api/video/generate
{ ...briefing... }
→ cria agents/runs/2026-05-15-meu-video/ automaticamente
→ executa pipeline
→ devolve resultado
```

A estrutura de pastas continua igual — só muda quem cria os arquivos
(código em vez de humano).
