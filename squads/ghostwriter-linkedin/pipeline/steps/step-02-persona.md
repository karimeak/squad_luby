---
type: agent
agent: sofia
execution: inline
model_tier: powerful
inputFile: squads/ghostwriter-linkedin/pipeline/data/collaborators.json
---

# Carga de Persona — Colaborador: {perfil}

A Sofia Persona vai carregar o perfil do colaborador **{perfil}** do arquivo `collaborators.json` e produzir um persona-brief que orienta a escrita do post.

**Input:** perfil = `{perfil}`, idioma = `{idioma}`, research-brief.md
**Output:** `squads/ghostwriter-linkedin/output/persona-brief.md`

**Tarefa load-persona.md:**

1. Ler `pipeline/data/collaborators.json` e extrair o perfil de `{perfil}`
2. Ler `squads/ghostwriter-linkedin/output/research-brief.md`
3. Cruzar os dados do research com o perfil do colaborador:
   - Quais findings do research fazem sentido para o público deste colaborador?
   - Qual ângulo do research alinha com o tom e área de expertise deste colaborador?
   - Quais voice markers desta persona devem aparecer no post?
4. Produzir persona-brief.md com:
   - **Perfil resumido**: nome, papel, tom, audiência
   - **Ângulo recomendado**: qual dos ângulos do research melhor encaixa nesta persona
   - **Dados a usar**: os 2-3 dados do research mais relevantes para este perfil
   - **Voice markers**: 3-5 expressões/construções que soam como este colaborador
   - **Evitar**: o que NÃO deve aparecer neste post para este colaborador
