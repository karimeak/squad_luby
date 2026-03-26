---
type: agent
agent: beatriz
execution: inline
model_tier: powerful
---

# Otimização SEO

A Beatriz SEO audita o copy aprovado, pesquisa keywords e entrega o pacote SEO
completo: title, meta, headings, schema JSON-LD, Open Graph e brief de performance para Lucas.

**Input:**
- `squads/landing-page-luby/output/{run_id}/landing-page.md` (copy aprovado pelo Rodrigo)
- `squads/landing-page-luby/output/briefing.md` (contexto do serviço e audiência)

**Tasks:** seo-audit-copy.md → seo-optimize.md
**Output:** `squads/landing-page-luby/output/{run_id}/seo-package.md`

**O que a Beatriz entrega:**
- Keyword primária definida com volume estimado e intent
- Keywords secundárias e long-tail
- Title tag (50-60 chars, exato)
- Meta description (120-155 chars, exata)
- H1 ajustado para incluir keyword (sem sacrificar copy)
- H2s otimizados por seção com keywords secundárias
- Schema JSON-LD completo: Service + Organization (obrigatório) + FAQPage (se aplicável)
- Open Graph tags completas (título, descrição, spec de imagem 1200x630)
- Twitter Card tags
- Brief técnico de performance para Lucas (Core Web Vitals, preloads, fonts, GTM)

## Veto Conditions

- Keyword primária sem pesquisa (só intuição, sem volume estimado)
- Title tag fora da faixa de caracteres (< 45 ou > 65)
- Schema JSON-LD ausente ou sem Organization
- Brief de performance para Lucas ausente
