# Squad Memory: Ghostwriter LinkedIn Auto — Luby

## Estilo de Escrita

- Posts usam voz ativa e primeira pessoa, sem em dashes (—), sem links no corpo, hashtags somente na última linha
- Hooks under 210 chars — provocação, dado ou citação que gera tensão imediata
- Char count: 700–1,500 por post (EN e PT-BR)
- PT-BR deve soar como escrita original, não tradução — trocar voice markers por versão BR equivalente
- Termos técnicos (CQRS, Kafka, LangGraph, MCP, etc.) permanecem em inglês no PT-BR

## Design Visual

- **Imagens LinkedIn: geradas EXCLUSIVAMENTE via Google Gemini via Playwright MCP — Pollinations.ai está PROIBIDO** (decisão definitiva 2026-05-11)
- Diana NUNCA constrói URL Pollinations sob nenhuma hipótese
- Cadência obrigatória para evitar rate limit Gemini: 60s entre requests; em batches >10, pausa de 2min a cada 10 imagens; backoff exponencial em caso de erro/recusa
- Workflow Gemini: `browser_navigate gemini.google.com/app` → `browser_snapshot` → `browser_type` (prompt completo, submit:true) → `browser_wait_for` 25-30s → `browser_evaluate` para extrair URL da img (filtrar `naturalWidth > 100` para descartar avatars) → trocar `w200-h200` por `w1200-h1200` → `browser_navigate` para a URL high-res → `browser_take_screenshot` type:jpeg
- Formato output: 1200×627px salvo em `output/{run_id}/v1/{Name}/linkedin-image.jpg`
- Email/post recebe a imagem via upload para storage próprio (Supabase storage) ou anexo, nunca via hotlink externo

## Estrutura de Conteúdo

- Ângulos usados: CONTRARIAN, DATA-DRIVEN, PATTERN RECOGNITION, PERSONAL STORY, LIST
- Cada collaborator tem flavor único — evitar repetir flavor com mesmo collaborator em runs consecutivos (verificar post-history.json)
- Review mínimo: 7.0/10 para aprovação; auto-fix se EN ou PT abaixo do threshold
- Estrutura de post: Hook → Insight/tensão → Dados (3–5) → Framework ou lista → CTA peer-directed (não vendedor)

## Proibições Explícitas

- Nunca usar "Luby" no corpo do post para não parecer propaganda
- Nunca mencionar nearshore/outsourcing/custo para Maise (framing proibido)
- Nunca usar emojis no corpo do post
- Nunca colocar links no corpo — somente em comentário separado se necessário
- Nunca usar dados não verificados no research-brief

## Técnico (específico do squad)

- Supabase URL: https://pbvjsixlqnuzcnqahbxu.supabase.co | tabela collaborators (linkedin_improvement) + bloggers (content, submitted_content)
- Edge Function: https://pbvjsixlqnuzcnqahbxu.supabase.co/functions/v1/blog-approval com mode="linkedin-post"
- Edge Function aceita payloads com conteúdo completo (post EN + PT + linkedin_overview + image_url) — testado com sucesso em run 2026-04-27
- PowerShell: NÃO usar `ConvertTo-Json` para strings longas — em PS 5.1 envolve em `{"value":"..."}`. Usar escaping manual: `$str.Replace('\','\\').Replace('"','\"').Replace("\`r\`n",'\n').Replace("\`n",'\n')` e montar JSON manualmente
- Supabase PATCH: body de conteúdo longo funciona quando enviado como bytes UTF-8: `[System.Text.Encoding]::UTF8.GetBytes($body)` como parâmetro `-Body`
- SMTP: noreply@nearsmarter.com via Zoho, from_name "Ghostwriter Luby"
- HTTP server local (Node.js port 7890) necessário para Playwright renderizar HTML (file:// protocol bloqueado)
- Subagentes paralelos para steps 01–05: disparar todos de uma vez, aguardar notificações. Steps 06–10 são inline sequenciais
- Run output path: output/{run_id}/{name}/v1/ — versioning preparado para reruns
