---
step: step-06-image-suggestion
name: Geração de Imagem para o Post (Gemini via Playwright)
type: agent
agent: diana
execution: inline
model_tier: powerful
skills:
  - playwright
---

# Step 06 — Geração de Imagem para o Post (Diana + Gemini)

## Objetivo

Diana gera um **Image Prompt Guide** estruturado a partir do post revisado e abre o Google Gemini via Playwright para gerar a imagem diretamente — sem aprovação humana (pipeline autônomo).

Duas saídas:
1. **Imagem principal** (`linkedin-image.png`) — screenshot do Gemini, para publicar no LinkedIn
2. **URL de preview** (`image_url`) — Pollinations.ai, para o campo de imagem no email do step-09

## Inputs

- `{run_output}/{name}/reviewed-post-en.md` — post final revisado EN
- `{run_output}/{name}/research-brief.md` — tema, flavor, indústria do collaborator

---

## PARTE 1 — Image Prompt Guide (Diana)

### 1. Limpeza do material

Ler o post revisado e o research brief. Ignorar hashtags, links, emojis, CTAs genéricos e trechos redundantes. Extrair apenas a essência do conteúdo.

### 2. Leitura estratégica

Identificar:
- Tema principal
- Mensagem central
- Objetivo do post
- Tipo de arte adequada (fluxo, síntese conceitual, arte tech, institucional, comparação, etc.)

### 3. Decisão visual + hierarquia

| Conteúdo | Abordagem visual |
|---|---|
| Processo / etapas sequenciais | Arte de fluxo visual |
| Comparação / antes-depois | Oposição visual clara |
| Opinião forte / insight / tendência | Síntese conceitual |
| Tecnologia / IA / dados / código | Sinais visuais do universo tech |
| Posicionamento institucional | Composição moderna, clean, corporativa |

Regra: 1 ideia dominante + no máximo 2 apoios secundários.

### 4. Gerar o Image Prompt Guide

Produzir um prompt fluido em inglês, **em parágrafo único**, cobrindo obrigatoriamente estas 10 seções:

1. Visual concept — ideia central derivada do tema do post
2. Scene or composition — o que aparece, posicionamento dos elementos
3. Main elements — o que deve estar presente
4. Contextual cues — sinais visuais que conectam ao tema (interfaces, dados, código, etc.)
5. Design direction — estilo (editorial, corporativo, minimalista, etc.)
6. Lighting and mood — iluminação, atmosfera, tom emocional
7. Color palette — cores específicas, combinação, contraste
8. Materials or interface feel — texturas, superfícies (se relevante)
9. Composition quality — enquadramento, proporção, profundidade, respiro
10. Constraints and negatives — o que NÃO deve aparecer

**Negatives obrigatórios (sempre ao final):**
> no text-heavy layout, no long paragraphs, no fake readable typography, no watermark, no extra logos, no distorted anatomy, no deformed hands, no visual clutter, no childish style, no cartoon, no illustration look unless intentionally required, no CGI look, no cheap futuristic effects, no random elements unrelated to the topic, no generic AI aesthetics

**Formato do prompt:** apenas texto inglês corrido. Sem análise, sem título, sem aspas, sem markdown, sem listas.

---

## PARTE 2 — Geração via Google Gemini (Playwright)

### 1. Abrir o Gemini

```
mcp__playwright__browser_navigate → https://gemini.google.com/app
```

Aguardar o textbox "Insira um comando para o Gemini" aparecer no snapshot.

### 2. Digitar o prompt

Usar `mcp__playwright__browser_snapshot` para encontrar o ref do textbox.
Digitar com `mcp__playwright__browser_type` (submit: true):
```
Generate an image: {image_prompt_guide}
```

### 3. Aguardar a geração

Esperar 20–30 segundos (`mcp__playwright__browser_wait_for`, time: 20).
Confirmar com snapshot: quando aparecerem botões "Boa resposta" / "Compartilhar imagem", a geração está completa.

### 4. Extrair a URL da imagem gerada

```js
// mcp__playwright__browser_evaluate
() => {
  const imgs = document.querySelectorAll('img');
  const results = [];
  imgs.forEach(img => {
    if (img.src && img.src.length > 100 && img.naturalWidth > 100) {
      results.push({ src: img.src, width: img.naturalWidth, height: img.naturalHeight });
    }
  });
  return results;
}
```

Selecionar a primeira imagem com `naturalWidth > 100` (as avatars têm 64px). Modificar o size param da URL: substituir `w200-h200` por `w1200-h1200`.

### 5. Navegar para a URL da imagem e salvar

**IMPORTANTE:** Não usar `fetch()` — causa erro de CORS. Usar navegação direta.

```
mcp__playwright__browser_navigate → {url_com_w1200-h1200}
```

O browser autenticado segue o redirect para a URL final em alta resolução.

```
mcp__playwright__browser_resize → width: 1200, height: 1200
mcp__playwright__browser_take_screenshot → type: jpeg, filename: {run_output}/{name}/linkedin-image.jpg
```

### 6. Verificar

O screenshot retorna a imagem visualmente. Checar:
- [ ] Imagem coerente com o tema do post
- [ ] Qualidade visual aceitável (sem artefatos graves)
- [ ] Tamanho do arquivo > 50KB

Se Gemini recusar o prompt: simplificar e tentar uma vez.

### 7. Fechar o browser

```
mcp__playwright__browser_close
```

---

## PARTE 3 — URL de Preview para Email (Pollinations.ai)

Gerar uma URL de imagem AI para o campo `image_url` do step-09 (email).

### Construir o prompt Pollinations

Extrair do post e do research brief:
- Tema central (ex: "AI in healthcare", "legacy software modernization")
- Indústria do collaborator (ex: "fintech", "healthcare", "SaaS")
- Um dado ou conceito chave (ex: "3-step framework", "67% adoption")

**Template:**
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
| `{run_output}/{name}/linkedin-image.png` | Imagem principal para publicar no LinkedIn |

**Resumo `{run_output}/{name}/image-suggestion.md`:**

```markdown
# Image Suggestion — {name}

**Post flavor:** {flavor}
**Visual approach:** {abordagem escolhida}
**Image file:** output/{run_id}/{name}/linkedin-image.png
**Image URL (email):** {URL do Pollinations.ai}

---

## Image Prompt Guide

{prompt completo enviado ao Gemini}

---

## Visual Rationale

{justificativa concisa das escolhas visuais — tema → decisão → resultado}

---

## Email Preview Prompt

{prompt usado no Pollinations.ai}
```

> O campo `**Image URL (email):**` é lido pelo step-09 para o email.
> O campo `**Image file:**` é o entregável principal — imagem gerada pelo Gemini para LinkedIn.

## Next

step-07-linkedin-optimizer (Lucas analisa o perfil LinkedIn do collaborator)
