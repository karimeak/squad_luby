# Briefing — The Bottleneck Isn't the Model (Rodrigo, EN-Personal)

## Metadata
- **Source**: text
- **Language**: en
- **Mode**: personal
- **Speaker**: { name: "Rodrigo Gardin", role: "Técnico / CTO @ Luby" }
- **Priority**: normal

## Content
Most engineers miss this: the bottleneck of AI agents isn't the model. It's the deterministic substrate underneath. METR's randomized 2025 study showed experienced developers are 19% SLOWER with AI in their own codebases — while feeling 20% faster. Reverse-engineering of Claude Code shows ~1.6% of the codebase is AI decision logic, the other 98.4% is deterministic infrastructure (permission gates, context management, tool routing, recovery loops). The agent loop itself is essentially a while loop. DORA 2025 confirms from the other direction: AI is an amplifier — strong teams get stronger, weak teams ship +242.7% more incidents per PR. The single strongest predictor of value is the quality of the internal platform.

Audience: CTOs, Staff Engineers, Tech Leads, Software Architects (US + BR) who already deployed at least 1 AI tool in 2025 and felt the gap between "10x productivity" hype and large-codebase reality.

## References
- Source post (humanized): squads/ghostwriter-linkedin-auto/output/2026-05-13-smoke-rodrigo/Rodrigo Gardin/humanized-post-en.md
- Persona brief: squads/ghostwriter-linkedin-auto/output/2026-05-13-smoke-rodrigo/Rodrigo Gardin/persona-brief.md
- Research brief: squads/ghostwriter-linkedin-auto/output/2026-05-13-smoke-rodrigo/Rodrigo Gardin/research-brief.md

## Notes
Briefing montado pelo squad ghostwriter-linkedin-auto v1.6.0 (Cleidim, step-05d).
Rodrigo bilingue (languages=['en-us','pt-br']), rotação default sem histórico = en-us. Apenas variante EN-Personal renderizada (1 vídeo por collaborator selecionado).
