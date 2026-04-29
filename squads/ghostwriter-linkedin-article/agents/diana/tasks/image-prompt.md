---
task: "Generate Article Cover Image Prompt"
order: 1
input: |
  - reviewed_article_en: {name}/reviewed-article-en.md
output: |
  - image_prompt: {name}/image-prompt.md
---

# Generate Article Cover Image Prompt

Lê o artigo revisado e produz 1 Image Prompt Guide em inglês corrido para capa do artigo LinkedIn (1200×627). O collaborator usa este prompt no gerador de imagem de sua preferência ao publicar.

## Process

1. **Ler reviewed-article-en.md** na íntegra: headline, seções principais, tom geral do artigo.

2. **Identificar o conceito visual central**: Qual a metáfora ou universo visual que melhor representa o TEMA do artigo? Não o título — o tema.

3. **Decidir a abordagem visual** com base no tema:
   - Processo/pipeline/framework → fluxo visual ou diagrama abstrato
   - Comparação/contraste → oposição visual clara
   - Tech/AI/dados → interfaces, dashboards, sinais digitais premium
   - Liderança/estratégia → composição institucional, moderna, limpa
   - Erros/falhas → tensão visual controlada, não dramática
   - Futuro/tendência → editorial tecnológico, sem futurismo exagerado

4. **Compor o Image Prompt Guide** cobrindo obrigatoriamente estas 10 dimensões em sequência, em inglês corrido:
   1. Visual concept — a ideia visual central derivada do tema
   2. Scene or composition — o que aparece, posicionamento dos elementos
   3. Main elements — elementos principais que devem estar presentes
   4. Contextual cues — sinais visuais que conectam ao universo do tema
   5. Design direction — estilo visual (editorial, corporativo, minimalista, etc.)
   6. Lighting and mood — iluminação, atmosfera, tom emocional
   7. Color palette — cores específicas, combinação, contraste
   8. Materials or interface feel — texturas, superfícies, sensação
   9. Composition quality — enquadramento, proporção 16:9, profundidade, respiro
   10. Constraints and negatives — o que NÃO deve aparecer (sempre incluir os negatives padrão)

5. **Negatives obrigatórios** (sempre ao final):
   > no text-heavy layout, no readable typography, no watermark, no extra logos, no distorted anatomy, no deformed hands, no visual clutter, no childish style, no cartoon, no cheap CGI, no generic AI aesthetics, no random elements unrelated to the topic, no fake interfaces with visible text

6. **Salvar em image-prompt.md**.

## Output Format

```markdown
# Image Prompt Guide — {name} / {flavor}
**Artigo:** {headline do artigo}
**Proporção:** 1200×627 (16:9 — LinkedIn Article Cover)

---

## Prompt (copie e cole no seu gerador de imagem preferido)

{Um parágrafo fluido em inglês cobrindo as 10 dimensões. Sem listas, sem markdown, sem comentários. Pronto para colar no Midjourney, Firefly, DALL-E ou Gemini.}

---

## Notas de uso

- Cole o prompt completo como está
- Se o gerador pedir aspect ratio: use 16:9 ou 1200×627
- O LinkedIn recomenda imagens de pelo menos 1200×627px para capas de artigo
```

## Output Example

```markdown
# Image Prompt Guide — Rodrigo / AI Agents in Enterprise Dev
**Artigo:** AI Agents Won't Replace Your Engineers — But They'll Expose the Weak Ones
**Proporção:** 1200×627 (16:9 — LinkedIn Article Cover)

---

## Prompt (copie e cole no seu gerador de imagem preferido)

An editorial photograph-style composition showing the contrast between human engineering judgment and AI automation, depicted through a split visual environment: on one side, a clean abstract representation of structured code flowing through a pipeline — neural pathways rendered as glowing nodes and edges in deep navy blue and electric cyan; on the other side, a human silhouette in a modern workspace reviewing a screen with careful deliberation, suggesting critical thinking rather than passive acceptance. The main elements are the convergence point at the center where both worlds meet, symbolizing augmentation rather than replacement. Contextual cues include circuit-like patterns, terminal interfaces rendered in a tasteful abstract way, and data flow indicators — all suggesting advanced engineering without feeling sci-fi. The design direction is premium editorial tech: precise, modern, slightly dark, corporate without being cold. Lighting is dramatic but controlled — deep shadows with precise accent lighting, blue and cool-white tones creating depth and a sense of focus. Color palette: deep navy (#0D1B2A), electric blue accent (#1A56DB), cool white highlight, minimal warm contrast. The composition quality should feel cinematic — rule of thirds, clear visual hierarchy, excellent depth of field, and generous breathing room on the right side where article title text will be overlaid by the author. Aspect ratio is 16:9 at 1200×627px. No text-heavy layout, no readable typography, no watermark, no extra logos, no distorted anatomy, no deformed hands, no visual clutter, no childish style, no cartoon, no cheap CGI, no generic AI aesthetics, no random elements unrelated to the topic, no fake interfaces with visible text.

---

## Notas de uso

- Cole o prompt completo como está
- Se o gerador pedir aspect ratio: use 16:9 ou 1200×627
- O LinkedIn recomenda imagens de pelo menos 1200×627px para capas de artigo
```

## Quality Criteria

- [ ] Prompt cobre as 10 dimensões em ordem
- [ ] Prompt está em inglês corrido, sem markdown ou listas
- [ ] Negatives padrão incluídos no final
- [ ] Proporção 1200×627 especificada
- [ ] Conceito visual derivado do TEMA do artigo (não apenas do título)

## Veto Conditions

Reject and redo if ANY are true:
1. Prompt tem menos de 100 words — insuficiente para guiar qualquer gerador de imagem
2. Prompt menciona texto legível que precisaria aparecer na imagem
