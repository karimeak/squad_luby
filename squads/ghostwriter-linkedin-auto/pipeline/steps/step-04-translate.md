---
step: step-04-translate
name: Traducao EN-US > PT-BR
type: agent
agent: bruno
execution: inline
---

# Step 04 — Traducao EN-US > PT-BR

## Objetivo
Bruno traduz o post EN-US para PT-BR, adaptando culturalmente — nao traduzindo literalmente. Voice markers, referencias de mercado e CTA sao adaptados para o contexto brasileiro.

## Instrucoes para Bruno

### Input
- Ler `{name}/post-en.md` — post EN-US aprovado
- Ler dados do collaborator em collaborator-queue.json: voice_markers_pt, tone_pt, audience_pt

### Processo

1. **Trocar voice markers**: Substituir voice markers EN pelos equivalentes PT do perfil do collaborator.
   Exemplo: "I've seen" -> "Ja vi" / "The companies that win" -> "As empresas que vencem"

2. **Adaptar referencias culturais**:
   - SEC -> CVM
   - FDIC -> FGC
   - USD -> BRL (quando relevante)
   - GAAP -> IFRS
   - SOC2 -> LGPD
   - NY/SF -> SP/RJ (quando relevante)
   - US-specific examples -> Brazilian equivalents quando possivel

3. **Adaptar CTA**: Nao traduzir literalmente. Reescrever para o publico brasileiro.
   - "What's the biggest compliance blocker you've seen?" -> "Qual o maior bloqueio de compliance que voce ja enfrentou?"

4. **Manter estrutura**: Hook, corpo, insights, takeaway, CTA, hashtags — mesma estrutura do EN.

5. **Hashtags**: Manter as mesmas se forem universais. Trocar por equivalentes PT-BR se necessario.

### Regras
- Nao e traducao literal — deve soar natural em PT-BR
- Voice markers PT obrigatorios (nao usar os EN)
- Referencias brasileiras quando aplicavel
- Manter 700-1500 chars
- Fonte entre parenteses mantida em cada dado

### Verificacao
- [ ] Voice markers EN-US trocados para versao PT-BR
- [ ] Referencias culturais brasileiras
- [ ] Tom preservado mas natural em PT-BR
- [ ] Nao e traducao literal
- [ ] 700-1500 chars
- [ ] Fonte entre parenteses em cada dado

### Output
Salvar `{name}/post-pt.md` no diretorio de output do run.

## Next
step-05-review (Helena faz revisao combinada tech + engajamento)
