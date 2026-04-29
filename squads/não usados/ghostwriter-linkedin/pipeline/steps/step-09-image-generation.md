---
type: agent
agent: diana
execution: inline
model_tier: powerful
---

# Geração de Imagem para o Post

A Diana Arte assume como Art Director para gerar a imagem do post aprovado.

**Input:** `squads/ghostwriter-linkedin/output/final-post.md`
**Output:** Screenshot/imagem salva em `squads/ghostwriter-linkedin/output/`

**Fluxo:**

1. Ler o post final aprovado em `squads/ghostwriter-linkedin/output/final-post.md`
2. Aplicar o processo interno completo da Diana:
   - Limpeza do material (remover hashtags, CTAs, duplicações)
   - Leitura estratégica (tema, mensagem central, objetivo)
   - Decisão visual (tipo de arte mais adequada)
   - Definição de hierarquia e foco
3. Gerar 1 prompt final em inglês seguindo a estrutura obrigatória:
   - Visual concept, scene, main elements, contextual cues, design direction, lighting, color palette, materials, composition quality, negatives
4. Apresentar o prompt ao usuário para aprovação antes de gerar
5. Abrir Google Gemini via Playwright:
   - Navegar para https://gemini.google.com/app
   - Localizar o campo de input de texto
   - Digitar o prompt: "Generate an image: {prompt}"
   - Enviar e aguardar a geração
   - Tirar screenshot do resultado
6. Apresentar o resultado ao usuário
7. Se aprovado, salvar screenshot em `squads/ghostwriter-linkedin/output/`
8. Se o usuário quiser ajustes, refinar o prompt e repetir a geração
