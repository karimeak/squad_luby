---
step: step-08-delivery
name: Entrega Final
type: agent
agent: bruno
execution: inline
terminal: true
---

# Step 08 — Entrega Final

## Objetivo
Bruno consolida todos os posts gerados, salva os arquivos finais no diretorio output/, atualiza o post-history.json e produz um log de resumo da execucao completa.

## Instrucoes para Bruno

### Input
- Todos os posts revisados: `{name}/reviewed-post-en.md` e `{name}/reviewed-post-pt.md` para cada collaborator
- `{name}/review-report.md` para scores
- `{name}/save-confirmation.md` para IDs Supabase
- `collaborator-queue.json` para lista completa

### Processo

1. **Para cada collaborator processado**:
   - Salvar post EN final: `squads/ghostwriter-linkedin-auto/output/{name}-{flavor-slug}-EN-{YYYY-MM-DD}.md`
   - Salvar post PT-BR final: `squads/ghostwriter-linkedin-auto/output/{name}-{flavor-slug}-PT-BR-{YYYY-MM-DD}.md`

2. **Atualizar post-history.json**:
   Ler `squads/ghostwriter-linkedin-auto/output/post-history.json` (criar se nao existir).
   Adicionar entrada para cada post gerado:
   ```json
   {
     "run_id": "{timestamp do run}",
     "date": "{YYYY-MM-DD}",
     "collaborator": "{name}",
     "flavor": "{flavor}",
     "language": "EN",
     "size": "Medium",
     "file": "{filename}",
     "blogger_id": "{uuid do Supabase}",
     "tech_score": "{score}",
     "engagement_score": "{score}",
     "status": "completed"
   }
   ```

3. **Produzir log de resumo** apresentado ao usuario:
   ```
   ==============================
    GHOSTWRITER LINKEDIN AUTO — RUN COMPLETE
   ==============================

   Data: {YYYY-MM-DD}
   Collaborators processados: {N}

   | Collaborator | Flavor | Tech | Engagement | Status |
   |---|---|---|---|---|
   | Wagner | {flavor} | 9.0 | 8.2 | saved |
   | Maise | {flavor} | 8.5 | 7.8 | saved |
   ...

   Posts salvos no Supabase (tabela bloggers): {N * 2} registros
   LinkedIn improvements atualizados: {N} collaborators

   Proximos passos:
   - Executar workflow n8n para enviar emails
   - Posts ficam em bloggers com submitted_content=false ate envio
   ==============================
   ```

### Output
- Posts finais em `squads/ghostwriter-linkedin-auto/output/`
- `squads/ghostwriter-linkedin-auto/output/post-history.json` atualizado
- Log de resumo exibido ao usuario

## Terminal
Este e o ultimo step do pipeline.
