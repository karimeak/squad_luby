---
type: agent
agent: lucio
execution: inline
model_tier: powerful
format: linkedin-post
inputFile: squads/linkedin-luby/output/selected-angle.md
---

# Criação de Conteúdo LinkedIn

O Lúcio LinkedIn cria os 3 formatos com o ângulo e tom selecionados.

**Input:** `squads/linkedin-luby/output/selected-angle.md` (ângulo + tom + hook)
**Tasks:** create-linkedin-post.md → create-linkedin-carousel.md → create-linkedin-article.md → optimize-linkedin.md
**Output:** `squads/linkedin-luby/output/{run_id}/linkedin-post.md` + `carousel.md` + `article.md`

**Sequência de criação:**

1. **Post de texto** (create-linkedin-post.md):
   - Apresentar 3 opções de hook para confirmação antes de escrever o corpo
   - Escrever corpo após confirmação do hook
   - Formato: hook + body + insights + CTA + hashtags

2. **Carrossel** (create-linkedin-carousel.md):
   - 10-15 slides, máximo 25 palavras por slide
   - Slide 1 = hook forte; slide final = CTA
   - Incluir descrição de design com paleta Luby

3. **Artigo** (create-linkedin-article.md):
   - Headline SEO-first (60-100 chars)
   - 3-5 seções com H2 + takeaway acionável por seção
   - 1.500-2.000 palavras

4. **Otimização** (optimize-linkedin.md):
   - Corte de 15-25% no post
   - Verificação de qualidade nos 3 formatos
   - Anti-commodity check final

**Formato injetado:** linkedin-post (regras do _opensquad/core/best-practices/linkedin-post.md aplicadas)
