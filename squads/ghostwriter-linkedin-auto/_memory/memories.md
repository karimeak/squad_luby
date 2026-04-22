# Squad Memories — ghostwriter-linkedin-auto

## Criacao
- **Data:** 2026-04-07
- **Base:** Copia automatizada do squad ghostwriter-linkedin
- **Diferenca principal:** Sem checkpoints, auto-fix, salva em Supabase, email direto via Edge Function

## v1.1.0 — 2026-04-22
- Adicionado step-06-image-suggestion (Bruno gera fluxograma Mermaid ou prompt IA conforme o tipo de post)
- Adicionado step-09-send-email (Lucas envia email via `blog-approval` Edge Function com mode `linkedin-post`)
- Email vai para collaborator + notification_emails; inclui post EN, PT, imagem e dicas de perfil
- `submitted_content` atualizado para `true` no Supabase após envio confirmado
- n8n removido do fluxo — entrega é agora 100% pelo pipeline

## Learnings
(Sera preenchido apos as primeiras execucoes)
