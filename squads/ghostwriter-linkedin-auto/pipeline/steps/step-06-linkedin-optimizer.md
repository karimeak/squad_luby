---
step: step-06-linkedin-optimizer
name: LinkedIn Profile Optimizer
type: agent
agent: lucas
execution: inline
---

# Step 06 — LinkedIn Profile Optimizer

## Objetivo
Lucas analisa o perfil publico LinkedIn de cada collaborator e gera sugestoes de melhoria usando a skill linkedin-profile-optimizer. O overview e salvo no Supabase (collaborators.linkedin_improvement) e sera enviado junto com o post no email via n8n.

## Instrucoes para Lucas

### Input
- Dados do collaborator atual (collaborator-queue.json) — especialmente linkedin_url
- Skill: `.agents/skills/linkedin-profile-optimizer/SKILL.md`
- Ler supabase-config.json para URL e key

### Processo

1. **Verificar se o collaborator tem linkedin_url**: Se vazio ou null, pular e registrar "Sem URL LinkedIn".

2. **Coletar dados publicos**:
   - WebFetch na linkedin_url do collaborator
   - WebSearch: "{name} {role} Luby Software LinkedIn"
   - Extrair o que for visivel: headline, about/summary, experiencia, skills

3. **Aplicar skill linkedin-profile-optimizer**: Avaliar cada secao:
   - **Headline**: Esta otimizada? Usa keywords relevantes? Comunica valor?
   - **About/Summary**: Conta uma historia? Tem CTA? Mostra resultados?
   - **Experience**: Descreve impacto ou apenas responsabilidades?
   - **Skills**: Alinhadas com posicionamento desejado?

4. **Gerar overview de melhoria** em markdown:
   ```markdown
   # LinkedIn Profile Overview — {name}

   ## Headline
   **Atual:** {headline atual}
   **Sugerida:** {headline otimizada}
   **Por que:** {justificativa}

   ## About / Summary
   **Pontos fortes:** {o que funciona}
   **Sugestoes:** {o que melhorar}

   ## Experience
   **O que melhorar:** {foco em impacto vs responsabilidades}

   ## Quick Wins (3-5 acoes imediatas)
   1. {acao 1}
   2. {acao 2}
   3. {acao 3}
   ```

5. **Salvar no Supabase**:
   ```bash
   curl -X PATCH "{supabase_url}/rest/v1/collaborators?id=eq.{id}" \
     -H "apikey: {anon_key}" \
     -H "Authorization: Bearer {anon_key}" \
     -H "Content-Type: application/json" \
     -H "Prefer: return=minimal" \
     -d '{"linkedin_improvement": "..."}'
   ```

6. **Verificar PATCH**: Confirmar que retornou 204.

### Output
- `{name}/linkedin-overview.md` no diretorio de output do run
- UPDATE na tabela collaborators.linkedin_improvement

## Next
step-07-save-to-supabase (Lucas salva os posts em bloggers)
