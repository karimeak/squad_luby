---
step: step-06-image-suggestion
name: Geração de Imagem para o Post
type: agent
agent: bruno
execution: inline
model_tier: powerful
skills:
  - playwright
---

# Step 06 — Geração de Imagem para o Post (HTML/CSS + Playwright)

## Objetivo

Bruno gera duas saídas complementares:

1. **Imagem branded (principal)** — HTML/CSS self-contained (1200×627px), renderizado via Playwright → `.png` para o collaborator usar no LinkedIn
2. **URL de preview para email** — Pollinations.ai com prompt rico e contextualizado, compatível com o step-09

## Instruções para Bruno

### Input

- `{run_output}/{name}/reviewed-post-en.md` — post final EN
- `{run_output}/{name}/research-brief.md` — contexto, dados e flavor

---

## PARTE 1 — Imagem Branded (HTML/CSS + Playwright)

### 1. Analisar o post e definir o layout

| Tipo de conteúdo | Layout |
|---|---|
| Processo / etapas sequenciais (3–5 etapas claras) | Cards numerados em linha |
| Framework / modelo / metodologia | Grid de blocos com labels |
| Dado/stat central + narrativa | Métrica grande em destaque + texto de suporte |
| Conceito abstrato / liderança / carreira | Quote visual com frase impactante |
| História pessoal / reflexão | Quote visual com fundo de destaque |
| Lista de insights | Lista vertical com marcadores e hierarquia |

### 2. Documentar o Design System

Antes de qualquer HTML:

```
DESIGN SYSTEM — {name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform: LinkedIn Post
Viewport: 1200 x 627
Layout: [escolhido acima]

Colors:
  Background: #0D1B2A  (navy escuro — Luby)
  Primary text: #FFFFFF
  Accent: #1A56DB      (azul — destaques, números)
  Secondary text: #94A3B8
  Surface/card: #1E2D40

Typography:
  Family: 'Inter', sans-serif (Google Fonts @import)
  Hero/Metric: [≥44]px / 700 weight
  Heading: [≥40]px / 700 weight
  Body: [≥24]px / 500 weight
  Caption: [≥20]px / 500 weight

Rationale: [justificativa concisa]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

> Paleta alternativa (fundo claro): Background `#F8FAFC`, text `#111827`, accent `#1A56DB`, surface `#EFF6FF`.

### 3. Gerar o HTML/CSS

**Regras absolutas:**
- `body { width: 1200px; height: 627px; overflow: hidden; margin: 0; padding: 0; }`
- Apenas CSS inline — sem JS, sem CDN exceto Google Fonts `@import`
- Layout com Flexbox ou Grid — nunca `absolute` para conteúdo principal
- Todas as fontes ≥ 20px. Heading ≥ 40px. Body ≥ 24px
- Contraste WCAG AA (4.5:1 mínimo)
- Conteúdo real do post — nenhum placeholder, nenhum Lorem ipsum
- Não mencionar o collaborator pelo nome completo na imagem — usar o tema

**Salvar:**
```
{run_output}/{name}/linkedin-image.html
```

### 4. Renderizar via Playwright

```
1. mcp__playwright__browser_navigate → file:///caminho/absoluto/linkedin-image.html
2. mcp__playwright__browser_resize → width=1200, height=627
3. Aguardar ~500ms para fonts carregarem
4. mcp__playwright__browser_take_screenshot → salvar como {run_output}/{name}/linkedin-image.png
5. mcp__playwright__browser_close
```

### 5. Verificar o screenshot

Ler a imagem gerada. Checar:
- [ ] Texto legível, não cortado
- [ ] Viewport 1200×627 exatos
- [ ] Cores corretas, sem artefatos
- [ ] Conteúdo preenche o espaço sem vazar

Se houver problema: corrigir HTML e re-renderizar (máximo 2 tentativas).

---

## PARTE 2 — URL de Preview para Email (Pollinations.ai)

Gerar uma URL de imagem IA com prompt contextualizado para o campo `image_url` do step-09.

### Construir o prompt

O prompt deve ser específico e visual — extrair do post:
- O tema central (ex: "AI in healthcare", "legacy software modernization")
- A indústria do collaborator (ex: "fintech", "healthcare", "SaaS")
- Um dado ou conceito chave do post (ex: "67% adoption rate", "3-step framework")

**Template do prompt:**
```
{tema do post}, {indústria}, professional technology visual, modern flat design,
dark navy blue background, electric blue accent, clean typography, data visualization,
LinkedIn post style, 1200x627, minimalist, corporate tech aesthetic, no people, no text
```

**Gerar a URL:**
```bash
node -e "
const prompt = 'SEU_PROMPT_AQUI';
const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=1200&height=627&nologo=true&model=flux';
console.log(url);
"
```

Salvar a URL resultante como `image_url`.

---

## Output

**Arquivos gerados:**

| Arquivo | Uso |
|---|---|
| `{run_output}/{name}/linkedin-image.html` | Fonte HTML/CSS (editável) |
| `{run_output}/{name}/linkedin-image.png` | Imagem branded para publicação no LinkedIn |

**Resumo `{run_output}/{name}/image-suggestion.md`:**

```markdown
# Image Suggestion — {name}

**Post flavor:** {flavor}
**Layout type:** {layout escolhido}
**Image URL:** {URL do Pollinations.ai — para o email no step-09}
**Image file:** output/{run_id}/{name}/linkedin-image.png

---

## Design System

{colar o design system do passo 2}

---

## Design Rationale

{justificativa das escolhas visuais}

---

## Email Preview Prompt

{prompt usado no Pollinations.ai}
```

> O campo `**Image URL:**` é lido pelo step-09 para o email.
> O campo `**Image file:**` é o entregável principal — imagem branded de alta qualidade para LinkedIn.

## Next

step-07-linkedin-optimizer (Lucas analisa o perfil LinkedIn do collaborator)
