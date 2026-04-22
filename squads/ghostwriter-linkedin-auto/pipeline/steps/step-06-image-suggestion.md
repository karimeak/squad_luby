---
step: step-06-image-suggestion
name: Sugestão de Imagem para o Post
type: agent
agent: bruno
execution: inline
model_tier: powerful
---

# Step 06 — Sugestão de Imagem para o Post

## Objetivo
Bruno analisa o post revisado (EN) e gera uma sugestão visual adequada ao conteúdo: pode ser um fluxograma em Mermaid, uma descrição de infográfico ou um prompt para geração de imagem com IA. A sugestão é apenas uma referência — o collaborator decide se usa.

## Instruções para Bruno

### Input
- Ler `{name}/reviewed-post-en.md` — post final EN
- Ler `{name}/research-brief.md` — contexto e dados usados

### Processo

#### 1. Identificar o tipo visual ideal

Analisar o post e classificar em uma das categorias:

| Tipo de conteúdo | Visual recomendado |
|---|---|
| Processo com etapas sequenciais | Fluxograma (Mermaid) |
| Dados, percentuais, comparações | Infográfico / gráfico descritivo |
| Conceito abstrato, liderança, carreira | Imagem conceitual (prompt IA) |
| Framework, modelo ou metodologia | Diagrama de blocos (Mermaid) |
| História pessoal / reflexão | Quote card (prompt Canva/IA) |

#### 2. Gerar a sugestão visual

**Para fluxogramas e diagramas:**
- Produzir código Mermaid pronto para copiar
- Usar `flowchart TD` (top-down) ou `flowchart LR` (left-right) conforme o conteúdo
- Manter textos curtos nos nós (máx 5 palavras por nó)

**Para infográficos:**
- Descrever o layout: colunas, ícones sugeridos, dados-chave a destacar
- Indicar ferramenta recomendada: Canva, Figma ou similar

**Para imagens IA (DALL-E / Midjourney / Ideogram):**
- Escrever um prompt em inglês, detalhado, estilo profissional
- Indicar: estilo visual, paleta de cores, elementos obrigatórios

#### 3. Regras
- A sugestão deve reforçar o argumento principal do post, não ser decorativa
- Se o post for muito narrativo (história pessoal), preferir quote card
- Fluxogramas só se o processo tiver 3-8 etapas claras
- Nunca inventar dados que não estejam no post/research

### Output

Salvar `{name}/image-suggestion.md` no diretório de output do run:

```markdown
# Image Suggestion — {name}

**Post flavor:** {flavor}
**Visual type:** {Flowchart | Infographic | AI Image | Quote Card | Diagram}
**Rationale:** {1-2 linhas explicando por que este formato}

---

## Suggestion

{código Mermaid OU descrição do infográfico OU prompt de IA OU template Canva}

---

## Recommended Tools
- {ferramenta 1 com link ou instrução}
- {ferramenta 2}

## Usage Note
Esta é uma sugestão. O collaborator pode adaptar ou substituir pela imagem que preferir antes de publicar no LinkedIn.
```

## Next
step-07-linkedin-optimizer (Lucas analisa o perfil LinkedIn do collaborator)
