---
task: "Combined Article Review"
order: 1
input: |
  - article_en: {name}/article-en.md
  - article_pt: {name}/article-pt.md
  - research_brief: {name}/research-brief.md
  - persona_brief: {name}/persona-brief.md
  - quality_criteria: squads/ghostwriter-linkedin-article/pipeline/data/quality-criteria.md
output: |
  - reviewed_article_en: {name}/reviewed-article-en.md
  - reviewed_article_pt: {name}/reviewed-article-pt.md
  - review_report: {name}/review-report.md
---

# Combined Article Review

Revisão técnica + estrutural dos artigos EN-US e PT-BR em um único passo. Com autoridade para auto-corrigir até 2 tentativas.

## Process

Para CADA artigo (EN e PT-BR):

### Parte 1: Tech Review

1. **Identificar todos os claims factuais** no artigo:
   - Percentuais e números específicos
   - Referências a empresas, produtos ou pessoas reais
   - Afirmações sobre mercado, tendências ou resultados
   - Promessas ou claims sobre a Luby

2. **Verificar cada claim contra o research-brief**:
   - Está no brief com fonte? → verificado
   - Não está mas é experiência pessoal ("In my experience")? → aceito
   - Não está e é apresentado como fato? → AUTO-FIX: remover ou soften para linguagem qualitativa

3. **Verificar coerência de expertise**: O claim está dentro do domínio real do collaborator?

### Parte 2: Structure Review

4. **Headline** (score 1-10):
   - Está entre 60-100 chars? Keyword na frente?
   - Cria curiosidade ou promete benefício claro?

5. **Introdução** (score 1-10):
   - 150-250 words? Hook nas primeiras 2-3 frases?
   - Estabelece problema? Faz preview do artigo?

6. **Seções** (score 1-10):
   - 3-5 seções com subheadings H2 informativos?
   - Cada seção 250-400 words? Pelo menos 1 dado por seção?
   - Cada seção termina com takeaway?

7. **Conclusão** (score 1-10):
   - 100-200 words? Sintetiza 1 insight (não resume)?

8. **CTA** (score 1-10):
   - Pergunta única e específica para o público do collaborator?

9. **Legibilidade** (score 1-10):
   - Parágrafos de máximo 3-4 frases?
   - Sem muros de texto?

10. **Word count** (HARD GATE):
    - EN: 1.500-2.000 words?
    - PT-BR: 1.400-1.900 words?
    - Abaixo do mínimo: AUTO-FIX obrigatório (expandir seções)

### Parte 3: Auto-Fix Decision

11. **Calcular média das dimensões** (headline, intro, seções, conclusão, CTA, legibilidade)

12. **Lógica de decisão**:
    - **APPROVE**: média >= 7.0, nenhuma dimensão < 5.0, zero tech issues, word count OK
    - **AUTO-FIX**: qualquer dimensão < 7.0 OU tech issues OU word count fora do range
    - **AUTO-FIX AGRESSIVO**: dimensão < 5.0

13. **Tentativas de auto-fix** (máximo 2):
    - Tentativa 1: corrigir issues específicos identificados
    - Re-avaliar o artigo corrigido
    - Se ainda não passa: Tentativa 2 mais agressiva
    - Após tentativa 2: aceitar com `<!-- REVIEW_WARNING -->` no artigo

14. **Salvar artigo revisado** como reviewed-article-en.md / reviewed-article-pt.md
15. **Produzir review-report.md**

### Auto-Fix Rules

**Tech fixes:**
- Dado não verificado como fato → soften ("significantly" em vez de "40%") ou remover
- Empresa específica sem verificação → generalizar
- Promessa da Luby sem respaldo → remover

**Structure fixes:**
- Word count abaixo do mínimo → expandir seções com menor substância
- Seção sem takeaway → adicionar takeaway
- Conclusão que resume → reescrever para síntese de insight
- CTA genérica → reescrever com especificidade para o público

## Output Format

```markdown
# Review Report — {name} / {flavor}

## EN-US

TECH REVIEW:
| Claim | Status | Ação |
|-------|--------|------|
| "{dado}" | ✓ verificado / ✗ não verificado | soften / removido |

STRUCTURE REVIEW:
| Dimensão | Score | Observação |
|----------|-------|-----------|
| Headline | X/10 | {obs} |
| Introdução | X/10 | {obs} |
| Seções | X/10 | {obs} |
| Conclusão | X/10 | {obs} |
| CTA | X/10 | {obs} |
| Legibilidade | X/10 | {obs} |
Média: X/10

Word count EN: {N} words — {OK / ABAIXO / ACIMA}

Auto-fixes aplicados: {N}
{lista de fixes}

VEREDICTO EN: APPROVE / AUTO-FIX / WARNING

---

## PT-BR

(mesma estrutura)

---

VEREDICTO FINAL: APPROVE / CONDITIONAL (com warnings)
```

## Quality Criteria

- [ ] Todos os claims factuais verificados contra research-brief
- [ ] Scoring table completa por dimensão
- [ ] Word count verificado (EN e PT-BR)
- [ ] Auto-fix aplicado quando necessário
- [ ] Artigos revisados salvos como reviewed-article-en.md e reviewed-article-pt.md

## Veto Conditions

Reject and redo if ANY are true:
1. Review report não foi gerado — sem rastreabilidade
2. Artigo com dado fabricado foi aprovado sem auto-fix
