---
type: agent
agent: pedro
execution: inline
model_tier: powerful
---

# Revisão Técnica e SEO — {title}

O Pedro Revisor vai verificar precisão técnica, qualidade das fontes, estrutura HTML e SEO on-page do post gerado pela Lara.

**Input:** `squads/blog-luby/output/article-brief.md` + `squads/blog-luby/output/research-brief.md` + `squads/blog-luby/output/post-draft.md`
**Output:** `squads/blog-luby/output/tech-review.md`

## Instruções para o Pedro

1. Ler os três arquivos de input
2. Executar todos os 5 blocos de revisão conforme o Operational Framework do agente
3. Calcular score e determinar resultado: APROVADO / APROVADO COM RESSALVAS / VETADO
4. Se VETADO: listar correções obrigatórias específicas e acionáveis para a Lara
5. Salvar relatório em `squads/blog-luby/output/tech-review.md`

## Critérios de Veto (bloqueia publicação)

- Dado técnico sem fonte verificável no research-brief
- H1 ausente ou duplicado no HTML
- Idioma diferente do publisher.language
- Link de fonte quebrado ou inexistente

## Critérios de Aviso (deve corrigir antes de publicar)

- HTML com tags não fechadas
- Keyword ausente no H1
- Post excede max_words em > 20%
- Claim técnico sem referência

## On Reject

Se o Pedro vetar o post, o pipeline retorna ao step-02-write (Lara reescreve).
O feedback do Pedro (correções obrigatórias) é passado como instrução para a Lara.
