---
squad: ghostwriter-linkedin
type: quality-criteria
version: "1.0.0"
---

# Critérios de Qualidade — Ghostwriter LinkedIn Luby

## Critérios de Revisão Técnica (Helena)

| Critério | Descrição | Peso |
|----------|-----------|------|
| Precisão factual | Todos os dados, estatísticas e claims têm base verificável ou contexto real | Alto |
| Ausência de alucinações | Nenhuma empresa inventada, nenhum dado fabricado, nenhum nome de pessoa fictício | Crítico |
| Coerência de expertise | O conteúdo está dentro do domínio de conhecimento real do colaborador | Alto |
| Claims verificáveis | Afirmações significativas podem ser rastreadas a fontes ou experiência pessoal declarada | Médio |
| Atribuição de fonte | Toda estatística ou dado retirado de pesquisa tem a fonte citada no texto entre parênteses — ex: "23% de aumento (Gartner, 2024)" | Alto |
| Ausência de promessas falsas | Nenhuma garantia de resultado que a Luby não pode comprovar | Crítico |

**Hard reject triggers (revisão técnica):**
- Qualquer estatística inventada apresentada como fato
- Nome de cliente ou empresa específica sem confirmação
- Promessa de resultado com percentual fabricado
- Claim sobre a Luby que não reflete a realidade da empresa

## Critérios de Revisão de Engajamento (Victor)

| Critério | Escala | Descrição |
|----------|--------|-----------|
| Hook strength | 1-10 | Os primeiros ~210 chars param o scroll? |
| Voice authenticity | 1-10 | Soa como o colaborador, não como IA genérica? |
| LinkedIn formatting | 1-10 | Parágrafos curtos, breaks, sem bloco de texto? |
| CTA quality | 1-10 | Pergunta genuína que gera comentários? |
| Hashtag relevance | 1-10 | 3-5 hashtags relevantes na última linha? |
| Content value | 1-10 | O post entrega insight real, não apenas opinião vaga? |

**Regras de aprovação:**
- APPROVE: média >= 7/10, nenhum critério abaixo de 4/10
- CONDITIONAL APPROVE: média >= 7/10, critério(s) não-crítico(s) entre 4-6/10
- REJECT: média < 7/10 ou qualquer critério abaixo de 4/10

**Hard reject triggers (engajamento):**
- Hook genérico que não passa no scroll-stop test
- Post escrito na voz de IA (buzzwords, estrutura robótica)
- Paredes de texto sem line breaks
- CTA genérica ("O que você acha?") sem especificidade
- Links no corpo do post
- Mais de 5 hashtags ou hashtags no meio do texto

## Critérios de Autenticidade de Persona

O post deve soar como o colaborador específico, não como a Luby genérica:

| Colaborador | Marcadores de voz que devem aparecer |
|-------------|--------------------------------------|
| Wagner | Perspectiva executiva estratégica, menção a decisores financeiros |
| Maise | Calor humano + autoridade comercial, perspectiva relacional |
| Samuel | Data-driven, foco em mercado brasileiro, orientado a resultados |
| Marine | Análise de tendências, perspectiva de produto/growth, insights de mercado |
| Paulo | Experiência em liderança distribuída, cultura de engenharia, honestidade sobre desafios |
| Gardin | Profundidade técnica, arquitetura, IA aplicada, desafia pensamento superficial |
