---
task: generate-feedback
order: 2
agent: renata
input: Scoring completo de score-content.md
output: Review estruturado completo com veredicto final e feedback acionável
---

## Process

1. Ler o scoring gerado em score-content.md
2. Para cada critério com score < 7: identificar o parágrafo/slide/seção exata do problema
3. Classificar cada item de feedback:
   - "Required change:" — afeta o veredicto, bloqueia aprovação
   - "Suggestion (non-blocking):" — melhoria de qualidade, não bloqueia
4. Para cada Required change: escrever instrução de reescrita (não apenas diagnóstico)
5. Identificar Strengths: pelo menos 1 por formato (o que funciona bem e deve ser preservado)
6. Se REJECT: escrever "Path to Approval" com lista numerada de mudanças obrigatórias
7. Montar o review completo no formato estruturado
8. Se esta for a 3ª revisão com os mesmos problemas: adicionar "ESCALAÇÃO" ao veredicto

## Output Format

```markdown
==============================
 REVIEW VERDICT: {APPROVE / CONDITIONAL APPROVE / REJECT}
==============================

Conteúdo: {título/ângulo}
Formatos: Post + Carrossel + Artigo
Data: {data}
Revisão: {N} de 3

------------------------------
 SCORING — LINKEDIN POST
------------------------------
[tabela de scoring]
Média post: X,X/10

------------------------------
 SCORING — CARROSSEL
------------------------------
[tabela]
Média carrossel: X,X/10

------------------------------
 SCORING — ARTIGO
------------------------------
[tabela]
Média artigo: X,X/10

==============================
 MÉDIA GERAL: X,X/10 — {VEREDICTO}
==============================

STRENGTHS:
Strength: {o que funciona e por quê — específico, com localização}
Strength: {segundo ponto forte — específico}

REQUIRED CHANGES: (se houver)
Required change: {localização exata} — {problema} — {instrução de reescrita}
Required change: {localização exata} — {problema} — {instrução de reescrita}

SUGGESTIONS (non-blocking):
Suggestion: {melhoria opcional com instrução específica}

PATH TO APPROVAL: (apenas em REJECT)
1. {mudança 1 — específica e localizada}
2. {mudança 2}
...

VERDICT: {APPROVE/CONDITIONAL APPROVE/REJECT} — {1 frase resumindo o veredicto}
```

## Output Example

```markdown
==============================
 REVIEW VERDICT: APPROVE
==============================

Conteúdo: IA não substitui devs — multiplica os bons
Formatos: Post + Carrossel + Artigo
Data: 2026-03-26
Revisão: 1 de 3

------------------------------
 SCORING — LINKEDIN POST
------------------------------
| Critério | Score | Justificativa |
|---|---|---|
| Hook (scroll-stop) | 9/10 | "Os dados dizem que o problema é diferente" — obriga a continuação |
| Voz pessoal | 9/10 | "Trabalhamos com 300+ engenheiros" — perspectiva de insider autêntica |
| Estrutura | 8/10 | Hook → contexto → 5 insights → CTA executado corretamente |
| Especificidade | 8/10 | "3x mais produtivos", "1 agente em 1 fluxo" — concreto e credível |
| CTA genuíno | 7/10 | Pergunta específica sobre obstáculos — convida resposta baseada em experiência |
| Relevância Luby | 9/10 | Perspectiva de 12 meses com 300+ engenheiros é inconfundivelmente Luby |
| Anti-corporativo | 10/10 | Zero jargão detectado |
Média post: 8,6/10

[... scoring carrossel e artigo ...]

==============================
 MÉDIA GERAL: 8,2/10 — APPROVE
==============================

STRENGTHS:
Strength: O hook do post "Os dados dizem que o problema é diferente" cria tensão cognitiva
imediata — o leitor tem uma crença (IA substitui devs) que precisa resolver. Esse é exatamente
o tipo de abertura que para o scroll de CTOs em modo leitura rápida.

Strength: O carrossel usa o dado "300+ engenheiros" como âncora de credibilidade logo no
Slide 3. Isso posiciona a Luby como observador experiente, não como especulador.

SUGGESTIONS (non-blocking):
Suggestion: O CTA do artigo poderia ser mais específico: em vez de "comente abaixo",
indicar o que o leitor deve incluir no comentário — ex: "Comente: qual a sua maior
barreira atual — processo, ferramentas ou cultura?"

VERDICT: APPROVE — Publicar os 3 formatos. Suggestions opcionais antes da publicação.
```

## Quality Criteria

- [ ] Veredicto aparece no início do review (não no final)
- [ ] Pelo menos 1 Strength por formato (3 no mínimo total)
- [ ] Todos os Required changes têm localização exata + instrução de reescrita
- [ ] Suggestions claramente separados de Required changes
- [ ] Path to Approval presente em todo REJECT
- [ ] Número da revisão registrado

## Veto Conditions

- Required change sem instrução de reescrita → completar antes de finalizar
- REJECT sem Path to Approval → adicionar antes de finalizar
- Strengths genéricos ("bom trabalho") → substituir por strengths específicos com localização
