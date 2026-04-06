---
type: agent
agent: pedro
execution: inline
model_tier: powerful
---

# Revisão Técnica e SEO (auto-retry 2x)

O Pedro Revisor vai revisar o post. Se reprovar, a Lara corrige automaticamente. Máximo 2 tentativas.

**Input:** `article-brief.md` + `research-brief.md` + `post-draft.md`
**Output:** `squads/blog-luby-auto/output/tech-review.md` + `post-draft.md` (atualizado se houve correção)

## Instruções para o Pedro

1. Executar os 5 blocos de revisão (precisão técnica, fontes, HTML, SEO, idioma)
2. Calcular score e resultado: APROVADO / APROVADO COM RESSALVAS / VETADO
3. Salvar relatório em `squads/blog-luby-auto/output/tech-review.md`

## Lógica de auto-retry (VETADO)

Se o resultado for **VETADO**:

**Tentativa 1:**
- Listar as correções obrigatórias de forma específica e acionável
- Assumir o papel da Lara e corrigir o HTML diretamente (aplicar cada correção listada)
- Re-executar a revisão no HTML corrigido
- Se APROVADO ou APROVADO COM RESSALVAS → salvar o HTML corrigido em `post-draft.md`, prosseguir

**Tentativa 2 (se ainda VETADO após tentativa 1):**
- Repetir o processo de correção focando nos itens que ainda falham
- Re-executar a revisão
- Se APROVADO ou APROVADO COM RESSALVAS → salvar e prosseguir
- Se ainda VETADO → registrar em `tech-review.md`: "ERRO: 2 tentativas de correção falharam. Motivo: {razão}". Prosseguir com o melhor HTML disponível e sinalizar o problema no email de aprovação.

**Nunca bloquear o pipeline** — após 2 tentativas, prosseguir sempre.

## Ao final

Se o resultado for VETADO após 2 tentativas, adicionar ao final de `post-draft.md`:
```
<!-- REVIEW_WARNING: Pedro rejeitou após 2 tentativas. Verificar tech-review.md -->
```
Ada vai incluir este aviso no email de aprovação.
