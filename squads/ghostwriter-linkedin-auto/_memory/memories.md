# Squad Memory: Ghostwriter LinkedIn Auto — Luby

## Estilo de Escrita

- Posts usam voz ativa e primeira pessoa, sem em dashes (—), sem links no corpo, hashtags somente na última linha
- Hooks under 210 chars — provocação, dado ou citação que gera tensão imediata
- Char count: 700–1,500 por post (EN e PT-BR)
- PT-BR deve soar como escrita original, não tradução — trocar voice markers por versão BR equivalente
- Termos técnicos (CQRS, Kafka, LangGraph, MCP, etc.) permanecem em inglês no PT-BR

## Design Visual

- Imagens LinkedIn: geradas via Gemini (1ª imagem) + Pollinations.ai fallback (demais) usando Playwright MCP
- Gemini: rate limit free tier após 1 imagem — após Marine, todos os demais vão direto para Pollinations
- Pollinations.ai workflow: `browser_evaluate → window.location.href = 'about:blank'` PRIMEIRO para limpar referrer, depois `window.location.href = '{pollinations_url}'` — sem esse passo, erro de auth "Authenticated users should use enter.pollinations.ai"
- Pollinations URL: `https://image.pollinations.ai/prompt/{encoded_prompt}?width=1200&height=627&nologo=true&model=flux`
- Screenshot: após navegação Pollinations, usar `browser_take_screenshot` com type:jpeg para capturar a imagem renderizada
- Formato output: 1200×627px salvo em `output/{run_id}/v1/{Name}/linkedin-image.jpg`

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
