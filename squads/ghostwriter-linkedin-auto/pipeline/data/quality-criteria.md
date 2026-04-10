---
squad: ghostwriter-linkedin-auto
type: quality-criteria
version: "1.0.0"
---

# Criterios de Qualidade — Ghostwriter LinkedIn Auto Luby

## Modo Automatico

Este squad opera sem checkpoints humanos. Helena faz revisao combinada (tech + engajamento) com auto-fix. Ate 2 tentativas de correcao antes de aceitar com warning.

## Criterios de Revisao Tecnica

| Criterio | Descricao | Peso |
|----------|-----------|------|
| Precisao factual | Todos os dados tem base verificavel ou contexto real | Alto |
| Ausencia de alucinacoes | Nenhuma empresa inventada, nenhum dado fabricado | Critico |
| Coerencia de expertise | O conteudo esta dentro do dominio do colaborador | Alto |
| Claims verificaveis | Afirmacoes rastreaveis a fontes ou experiencia pessoal | Medio |
| Atribuicao de fonte | Toda estatistica tem fonte entre parenteses | Alto |
| Ausencia de promessas falsas | Nenhuma garantia que a Luby nao pode comprovar | Critico |

**Hard reject triggers (auto-fix obrigatorio):**
- Qualquer estatistica inventada apresentada como fato -> soften
- Nome de empresa especifica sem confirmacao -> remover
- Promessa de resultado com percentual fabricado -> remover
- Claim sobre a Luby que nao reflete a realidade -> remover

## Criterios de Revisao de Engajamento

| Criterio | Escala | Descricao |
|----------|--------|-----------|
| Hook strength | 1-10 | Os primeiros ~210 chars param o scroll? |
| Voice authenticity | 1-10 | Soa como o colaborador, nao como IA? |
| LinkedIn formatting | 1-10 | Paragrafos curtos, breaks, sem bloco de texto? |
| CTA quality | 1-10 | Pergunta genuina que gera comentarios? |
| Hashtag relevance | 1-10 | 3-5 hashtags relevantes na ultima linha? |
| Content value | 1-10 | Insight real, nao apenas opiniao vaga? |

## Regras de Decisao (modo automatico)

| Condicao | Acao |
|----------|------|
| Media >= 7, nenhum criterio < 4, zero tech issues | **APPROVE** — aceitar como esta |
| Media >= 7, criterios 4-6, OU tech issues menores | **AUTO-FIX** — corrigir e re-avaliar |
| Media < 7 OU qualquer criterio < 4 | **AUTO-FIX** — correcoes mais agressivas |
| Apos 2 tentativas de auto-fix sem resolver | **ACCEPT WITH WARNING** — marcar com `<!-- REVIEW_WARNING -->` |

## Auto-Fix Hierarchy

1. **Tech issues primeiro**: Dados nao verificados, empresas nao confirmadas, promessas falsas
2. **Hook**: Se < 7, reescrever usando Hook Formulas da skill linkedin-content
3. **CTA**: Se generica, reescrever para publico especifico
4. **Formatting**: Quebrar muros de texto
5. **Voice markers**: Incorporar 1-2 se ausentes

## Criterios de Autenticidade de Persona

O post deve soar como o colaborador especifico:

| Colaborador | Marcadores que devem aparecer |
|-------------|-------------------------------|
| Wagner | Perspectiva executiva estrategica, decisores financeiros |
| Maise | Calor humano + autoridade comercial, perspectiva relacional |
| Samuel | Data-driven, mercado brasileiro, orientado a resultados |
| Marine | Analise de tendencias, produto/growth, insights de mercado |
| Paulo | Lideranca distribuida, cultura de engenharia, honestidade |
| Gardin | Profundidade tecnica, arquitetura, IA aplicada |
