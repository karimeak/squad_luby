---
type: agent
agent: victor
execution: inline
model_tier: powerful
inputFile: squads/ghostwriter-linkedin/output/selected-variant.md
---

# Revisão de Engajamento — Victor

O Victor Engajamento vai revisar a qualidade e o potencial de engajamento do post usando os critérios LinkedIn da skill `linkedin-content` e os quality-criteria do squad.

**Input:** `squads/ghostwriter-linkedin/output/selected-variant.md`
**Output:** `squads/ghostwriter-linkedin/output/engagement-review.md`

**Referências obrigatórias:**
- Aplicar regras da skill `linkedin-content` (.agents/skills/linkedin-content/SKILL.md)
- Ler `squads/ghostwriter-linkedin/pipeline/data/quality-criteria.md` (seção Revisão de Engajamento)
- Ler `squads/ghostwriter-linkedin/pipeline/data/tone-of-voice.md`
- Ler `squads/ghostwriter-linkedin/pipeline/data/collaborators.json` para verificar voice markers do {perfil}

**Tarefa engagement-review.md:**

1. Ler e absorver as referências acima
2. Ler `squads/ghostwriter-linkedin/output/selected-variant.md`
3. Avaliar cada critério em escala 1-10 com justificativa específica:
   - Hook strength: Os primeiros ~210 chars param o scroll?
   - Voice authenticity: Soa como {perfil}, não como IA genérica?
   - LinkedIn formatting: Parágrafos curtos, breaks corretos, sem bloco de texto?
   - CTA quality: Pergunta genuína e específica que gera comentários?
   - Hashtag relevance: 3-5 hashtags relevantes na última linha?
   - Content value: Entrega insight real ou apenas opinião vaga?
4. Calcular média e aplicar regras de aprovação de quality-criteria.md
5. Produzir engagement-review.md com:
   - Veredicto: APPROVE / CONDITIONAL APPROVE / REJECT
   - Tabela de scoring (critério | score | justificativa)
   - Required changes (se REJECT): o que exatamente mudar
   - Suggestions (se CONDITIONAL): melhorias opcionais
   - Versão melhorada do post (se CONDITIONAL APPROVE): aplicar os ajustes sugeridos diretamente
