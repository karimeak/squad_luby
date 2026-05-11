---
execution: inline
agent: lucas
inputFile: squads/ghostwriter-linkedin-article/output/{name}/save-confirmation.md
outputFile: squads/ghostwriter-linkedin-article/output/{name}/email-confirmation.md
model_tier: powerful
---

# Step 08 — Envio de Email para o Collaborator

## Context Loading

- `squads/ghostwriter-linkedin-article/pipeline/data/smtp-config.json` — credenciais e edge function URL
- `squads/ghostwriter-linkedin-article/pipeline/data/supabase-config.json` — URL e anon key
- `squads/ghostwriter-linkedin-article/output/{name}/humanized-article-en.md` — artigo EN final (revisado + humanizado)
- `squads/ghostwriter-linkedin-article/output/{name}/humanized-article-pt.md` — artigo PT-BR final (revisado + humanizado)
- `squads/ghostwriter-linkedin-article/output/{name}/image-prompt.md` — contém linha `**Image URL:**` (capa real do Supabase Storage)
- `squads/ghostwriter-linkedin-article/output/{name}/save-confirmation.md` — IDs Supabase + image_url
- `squads/ghostwriter-linkedin-article/output/collaborator-queue.json` — email e nome do collaborator
- `squads/ghostwriter-linkedin-article/agents/lucas/tasks/send-email.md` — instruções detalhadas

## Instructions

### Process

1. Ler todos os inputs: smtp-config, supabase-config, artigos humanizados, image-prompt, save-confirmation
2. Extrair `image_url` da linha `**Image URL:**` em `image-prompt.md`. Se for `null`, enviar string vazia no payload — a Edge Function deve omitir a tag `<img>` no template
3. Montar payload com `mode="linkedin-article"` incluindo artigos EN + PT-BR + image_url
4. Chamar Edge Function via curl
5. Em caso de falha: tentar 1x. Se falhar: registrar `email_failed`, continuar sem bloquear
6. Após envio bem-sucedido: atualizar `submitted_content=true` para blogger_id_en e blogger_id_pt
7. Produzir email-confirmation.md

## Output Format

```markdown
# Email Delivery — {name}

- Collaborator: {email} — ✓ enviado / ✗ falhou
- Article EN: ✓ incluído
- Article PT-BR: ✓ incluído
- Image URL: {URL pública ou ✗ sem URL}
- submitted_content EN: true ✓
- submitted_content PT: true ✓
- Timestamp: {ISO datetime}
```

## Veto Conditions

Reject and redo if ANY are true:
1. submitted_content não foi atualizado após envio confirmado

## Quality Criteria

- [ ] Email enviado com artigos EN + PT-BR + image_url
- [ ] image_url propagado no payload (ou string vazia se geração falhou)
- [ ] submitted_content atualizado após envio
- [ ] Erros de email registrados sem bloquear
