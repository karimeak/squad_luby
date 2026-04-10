---
step: step-02-persona
name: Carga de Persona
type: agent
agent: sofia
execution: inline
---

# Step 02 — Carga de Persona

## Objetivo
Sofia carrega o perfil do collaborator atual (dados do Supabase via collaborator-queue.json), cruza com o research-brief e produz um persona-brief que guia o ghostwriter.

## Instrucoes para Sofia

### Input
- Ler `collaborator-queue.json` para dados do collaborator atual (name, role, audience_en, tone_en, voice_markers_en, topics, avoid)
- Ler `{name}/research-brief.md` produzido por Marco

### Processo
1. Cruzar Key Findings do research com audiencia e expertise do collaborator
2. Selecionar 1 angulo primario (o mais forte para esta persona) e justificar
3. Filtrar 2-3 dados mais relevantes do research para o publico desta persona
4. Selecionar 3 voice markers EN mais naturais para o tema
5. Listar evitacoes (avoid do perfil + evitacoes tematicas)

### Output
Salvar `{name}/persona-brief.md` no diretorio de output do run com:
- Perfil resumido do collaborator
- Angulo recomendado com justificativa
- Dados filtrados do research
- Voice markers ativos
- O que evitar

## Next
step-03-write (Bruno escreve o post EN)
