# Memórias do Squad — Ghostwriter LinkedIn Luby

_Atualizado automaticamente após cada execução do pipeline._

## Aprendizados Gerais

- Maise voice markers ("Something I keep seeing", "My clients always ask me", "The pattern is clear", "What most people overlook") funcionam bem em posts contrarian/data-driven. 4/4 foram usados naturalmente no primeiro post.
- Ângulo Trust Crisis (adoção vs. risco) ressoou imediatamente com o usuário — aprovado sem ajustes estruturais.
- Victor sugeriu encurtar a CTA (de 20 palavras para 14). Padrão a manter: CTAs mais curtas performam melhor.
- Tema customizado (fora do Supabase) funcionou bem no pipeline — o usuário digitou "Desenvolvimento orientado por IA, Claude Code" como input livre.
- Gardin voice markers ("Most engineers miss this", "The architectural decision that changed everything") funcionam naturalmente em posts de arquitetura. Victor sugeriu adicionar "Most engineers miss this:" inline — aprovado.
- Posts com listas numeradas de camadas/stack geraram post tipo "saveable" — Victor deu 9/10 em Content Value.
- Helena flagou "3x throughput" como dado não verificado — padrão a manter: sempre verificar multiplicadores específicos contra o research-brief.
- Marine voice markers ("The data tells a different story", "Most product teams ignore", "I've been tracking this trend") funcionam naturalmente em posts de estratégia/insight. 3/4 usados na primeira execução.
- Victor sugeriu reordenar lista de insights colocando o dado mais surpreendente (percepção vs realidade) na posição 1 — usuário aprovou. Padrão: o dado mais counterintuitive deve liderar a lista.
- Helena flagou "6%" como dado aproximado (~6% no research) — fix aplicado para "roughly 6%". Padrão: sempre preservar indicadores de aproximação das fontes.
- Sessão Playwright/Gemini para geração de imagem não funcionou (login necessário, headless mode). Prompt salvo para geração manual. TODO: configurar sessão persistente do Google no browser profile.

## Padrões por Colaborador

### Maise
- Primeira execução: tema AI-Driven Development / Claude Code, EN
- Ângulo escolhido: Contrarian (Trust Crisis — 84% adoption / 46% distrust)
- Voice markers todos utilizados com sucesso
- Público: CEOs, CFOs, VPs — evitar jargão técnico, developer workflow details

### Gardin
- Primeira execução: tema Claude Code, EN, Medium
- Ângulo escolhido: Architecture Deep-Dive (5-Layer Stack: MCP → Skills → Agent → Subagents → Agent Teams)
- Variante B escolhida sobre A (Productivity Paradox) — preferência por depth/architecture sobre contrarian
- Voice markers "Most engineers miss this" e perspectiva arquitetural funcionaram bem
- Público: CTOs, Staff Engineers, Tech Leads — profundidade técnica é essencial
- Helena: CONDITIONAL APPROVE 8.8/10 (1 fix: dado sem fonte)
- Victor: CONDITIONAL APPROVE 8.3/10 (voice marker adicionado)
- Score consolidado: 8.6/10
- Aprovação final sem pedido de ajustes

## Temas já produzidos

| Data | Colaborador | Flavor | Idioma | Arquivo de saída |
|------|-------------|--------|--------|-----------------|
| 2026-03-27 | Maise | AI-Driven Development, Claude Code | EN | output/2026-03-27-152533/maise-ai-driven-dev-claude-code-EN-2026-03-27.md |
| 2026-03-30 | Gardin | Claude Code | EN | output/2026-03-30-095549/v1/gardin-claude-code-5-layer-stack-EN-2026-03-30.md |
| 2026-03-30 | Marine | Desenvolvimento orientado por IA | EN | output/2026-03-30-194519/v1/marine-ai-driven-dev-mirror-EN-2026-03-30.md |

## Feedbacks do usuário

- Usuário escolheu Variante A (contrarian) sobre Variante B (data-driven case study) para Maise — preferência por provocação intelectual vs. case study.
- Aprovação final sem pedido de ajustes — post passou revisão técnica (9.4/10) e engajamento (8.2/10).
- Usuário escolheu Variante B (architecture) sobre Variante A (contrarian/productivity paradox) para Gardin — preferência por profundidade técnica e conteúdo "saveable" vs. provocação contrarian.
- Aprovação final sem pedido de ajustes — post passou revisão técnica (8.8/10) e engajamento (8.3/10).
- Usuário escolheu Variante A (enterprise advisory/contrarian) sobre Variante B (data-driven pipeline) para Marine — preferência por visão estratégica e framing organizacional.
- Usuário aplicou sugestão do Victor (reordenar lista) — disposto a aceitar melhorias de engajamento sugeridas pelos revisores.
- Aprovação com 1 ajuste (reordenar lista) — post passou revisão técnica (9.2/10) e engajamento (8.6/10). Score consolidado: 8.9/10.

### Marine
- Primeira execução: tema Desenvolvimento orientado por IA, EN, Text Medium
- Ângulo escolhido: Enterprise Advisory / Contrarian (AI is a mirror, not a magic wand — DORA Report)
- Variante A escolhida sobre B (data-driven pipeline bottleneck) — preferência por visão estratégica organizacional
- Voice markers "The data tells a different story", "Most product teams ignore", "I've been tracking this trend" funcionaram bem
- Público: CPOs, Heads of Product, Growth Leads — foco em estratégia, não técnico
- Helena: CONDITIONAL APPROVE 9.2/10 (1 fix: ~6% → roughly 6%)
- Victor: APPROVE 8.6/10 (1 suggestion: reordenar lista — aceito pelo usuário)
- Score consolidado: 8.9/10
- Aprovação com 1 ajuste (reordenação de lista por sugestão do Victor)
