---
type: agent
agent: bruno
execution: inline
model_tier: powerful
---

# Entrega do Post Final

O Bruno Ghostwriter faz a entrega final do post em markdown pronto para publicação.

**Input:** `squads/ghostwriter-linkedin/output/final-post.md`
**Output:** `squads/ghostwriter-linkedin/output/{perfil}-{flavor-slug}-{date}.md`

**Tarefa deliver-post.md:**

1. Ler `squads/ghostwriter-linkedin/output/final-post.md`
2. Aplicar ajustes finais indicados pelo usuário na aprovação (se houver)
3. Gerar o nome do arquivo: `{perfil}-{flavor-slug}-{idioma}-{YYYY-MM-DD}.md`
   - flavor-slug: flavor em kebab-case, máx 5 palavras
4. Salvar o post final no arquivo nomeado acima em `squads/ghostwriter-linkedin/output/`
5. Apresentar o post ao usuário com:
   - O texto completo pronto para copiar e colar no LinkedIn
   - Contagem de caracteres
   - Lembrete: "Publique entre 7-9h ou 12-13h no horário do seu público. Engaje nos comentários nos primeiros 30-60 min após publicar."
