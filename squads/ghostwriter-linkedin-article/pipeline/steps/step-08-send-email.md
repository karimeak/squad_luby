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
- `squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-en.md` — artigo EN final
- `squads/ghostwriter-linkedin-article/output/{name}/reviewed-article-pt.md` — artigo PT-BR final
- `squads/ghostwriter-linkedin-article/output/{name}/image-prompt.md` — image prompt guide
- `squads/ghostwriter-linkedin-article/output/{name}/save-confirmation.md` — IDs Supabase
- `squads/ghostwriter-linkedin-article/output/collaborator-queue.json` — email e nome do collaborator
- `squads/ghostwriter-linkedin-article/agents/lucas/tasks/send-email.md` — instruções detalhadas

## Instructions

### Process

1. Ler todos os inputs: smtp-config, supabase-config, artigos, image-prompt, save-confirmation
2. Montar payload com mode="linkedin-article" incluindo artigos EN + PT-BR + image prompt
3. Chamar Edge Function via curl
4. Em caso de falha: tentar 1x. Se falhar: registrar `email_failed`, continuar sem bloquear
5. Após envio bem-sucedido: atualizar submitted_content=true para blogger_id_en e blogger_id_pt
6. Produzir email-confirmation.md

## Output Format

```markdown
# Email Delivery — {name}

- Collaborator: {email} — ✓ enviado / ✗ falhou
- Article EN: ✓ incluído
- Article PT-BR: ✓ incluído
- Image Prompt: ✓ incluído
- submitted_content EN: true ✓
- submitted_content PT: true ✓
- Timestamp: {ISO datetime}
```

## Veto Conditions

Reject and redo if ANY are true:
1. submitted_content não foi atualizado após envio confirmado

## Quality Criteria

- [ ] Email enviado com artigos EN + PT-BR + image prompt
- [ ] submitted_content atualizado após envio
- [ ] Erros de email registrados sem bloquear
