---
type: checkpoint
outputFile: squads/ghostwriter-linkedin/output/image-decision.md
---

# Oferta de Geração de Imagem

O post foi aprovado! Antes de seguir para a entrega, pergunte ao usuário:

**Gostaria de gerar uma imagem para acompanhar este post no LinkedIn?**

Opções:
- **Sim, gerar imagem** — A Diana (Art Director) vai analisar o post e criar um prompt visual para gerar a arte no Google Gemini
- **Não, apenas o texto** — Seguir direto para a entrega do post sem imagem

Se sim → salvar `{"image_requested": true}` em `squads/ghostwriter-linkedin/output/image-decision.md` e seguir para step-09-image-generation.
Se não → salvar `{"image_requested": false}` e pular para step-10-delivery.
