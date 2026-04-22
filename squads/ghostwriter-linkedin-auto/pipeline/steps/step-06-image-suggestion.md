---
step: step-06-image-suggestion
name: Geração de Imagem para o Post
type: agent
agent: bruno
execution: inline
model_tier: powerful
---

# Step 06 — Geração de Imagem para o Post

## Objetivo
Bruno analisa o post revisado (EN), classifica o tipo visual ideal, gera o conteúdo visual (código Mermaid ou prompt de IA) e produz uma URL de imagem pronta para ser incorporada no email — sem necessidade de ferramentas externas manuais.

## Instruções para Bruno

### Input
- Ler `{name}/reviewed-post-en.md` — post final EN
- Ler `{name}/research-brief.md` — contexto e dados usados

### Processo

#### 1. Identificar o tipo visual ideal

Analisar o post e classificar:

| Tipo de conteúdo | Visual |
|---|---|
| Processo com etapas sequenciais | Flowchart (Mermaid → mermaid.ink) |
| Framework, modelo ou metodologia | Diagrama de blocos (Mermaid → mermaid.ink) |
| Conceito abstrato, liderança, carreira | AI Image (prompt → pollinations.ai) |
| Dado/stat central + narrativa | AI Image (prompt → pollinations.ai) |
| História pessoal / reflexão | AI Image (prompt → pollinations.ai) |

#### 2. Gerar o conteúdo visual

**Para Flowchart / Diagrama (Mermaid):**
- Escrever o código Mermaid completo
- Usar `flowchart TD` (top-down) ou `flowchart LR` (left-right)
- Textos curtos nos nós (máx 5 palavras)
- Gerar a URL via Node.js:

```bash
node -e "
const code = \`COLE_O_CÓDIGO_MERMAID_AQUI\`;
const encoded = Buffer.from(code).toString('base64');
console.log('https://mermaid.ink/img/' + encoded);
"
```

Copiar a URL retornada como `image_url`.

**Para AI Image (Pollinations.ai):**
- Escrever um prompt em inglês, visual, profissional, sem referências a pessoas reais
- Estilo: `flat design, professional, dark blue and white, minimalist, LinkedIn post`
- Gerar a URL:

```bash
node -e "
const prompt = 'SEU_PROMPT_AQUI';
const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=1200&height=630&nologo=true';
console.log(url);
"
```

Copiar a URL retornada como `image_url`.

#### 3. Regras
- Fluxogramas apenas quando o post tem 3-8 etapas sequenciais claras
- Prompts de IA: sempre em inglês, nunca mencionar pessoas reais pelo nome
- Nunca deixar `image_url` vazio — se houver erro na geração, usar pollinations.ai com prompt genérico do tema

### Output

Salvar `{name}/image-suggestion.md` no diretório de output do run:

```markdown
# Image Suggestion — {name}

**Post flavor:** {flavor}
**Visual type:** {Flowchart | AI Image}
**Image URL:** {URL completa gerada — mermaid.ink ou pollinations.ai}

---

## Source

{código Mermaid completo OU prompt de IA usado}
```

## Next
step-07-linkedin-optimizer (Lucas analisa o perfil LinkedIn do collaborator)
