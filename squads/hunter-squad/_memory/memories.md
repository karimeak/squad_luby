# Squad Memory: Hunter Squad

## Estilo de Escrita

## Design Visual

## Estrutura de Conteúdo

## Proibições Explícitas

## Técnico (específico do squad)

- **Dry-run validado em 2026-04-30**: pipeline completo rodou com 10 sites ativos. Bronze→Silver→Targets funcionando.
- **wellfound**: requer login persistente. Solução implementada: `launch_persistent_context` com perfil em `_opensquad/_browser_profile/wellfound/`. Rodar `python squads/hunter-squad/scripts/wellfound-login.py` uma única vez antes do próximo run. Config no banco atualizado: `requires_profile: true, profile_dir: "wellfound"`.
- **Dedup**: 2º dry-run com mesmos dados → 0 inseridos, 64 skipped. Pipeline de dedup funciona corretamente.
- **Graceful skip em ana-analyst**: quando `inserted=0`, enriquecimento é pulado sem erro. Comportamento correto.
- **RPC4 (refresh_target_jobs_all)**: timeout de 180s é suficiente. Run atual levou ~3.1s.
- **Sites reativados (45)**: após dry-run confirmado, executar `UPDATE hunter_sites SET active = true` para produção.
- **Próximo passo de produção**: agendar run com todos os 45 sites. Sites prioritários: remoteok, weworkremotely, wellfound (corrigir), ycombinator, remotive.
<<<<<<< Updated upstream
<<<<<<< Updated upstream
- **Run 2026-05-06-090110 (produção 44 sites)**: 35 raw → 25 após filtros. Bronze inserted=0 (todas duplicadas). Silver promovidos=24 (RPC2 update=476). Sites OK: aijobs(19), indeed(7), remoteok(2), remotive(1), simplyhired(1). Duração: 5h29min (scraping 2h22min). Pipeline overall_success=true.
- **Sites que precisam correção (33 falhas)**: HTTP 403 anti-bot em glassdoor/ziprecruiter/gun_io/careerbuilder/producthunt_jobs (precisa UA rotation/proxy); HTTP 404 em glassdoor/cyberseek (URLs inválidas); DNS em monster; selectors customizados faltando em remotetechjobs/getgreatcareers/builtin/hired/braintrust/mljobs/infosec_jobs; 15 sites tier 4-5 com timeout 180s hard cap (weworkremotely incluso — bug de regressão); wellfound list selector timeout.
- **Hard cap de 180s/site é muito apertado para tier 4-5**: 15 sites foram cortados por timeout em uma única wave. Recomendação: aumentar para 300s OU paralelizar mais (Semaphore atual=5).
- **Generic best-effort scraper funcionou em 4 sites**: indeed, simplyhired, workinfinland, dice, arc_dev usaram seletor `[data-testid*='job']` com sucesso (mas dice e workinfinland tiveram 0 títulos correspondentes — filtro muito restritivo).
- **Correções aplicadas pós-run 2026-05-06**: (1) sites desativados no DB: monster (DNS), glassdoor (404), cyberseek (404), workinfinland (fora de escopo US), remotetechjobs (parked), hired (merged em LHH), mljobs (domínio parked). (2) sites marcados `scraper_type=requires_auth`: ziprecruiter, gun_io, producthunt_jobs, careerbuilder (HTTP 403 anti-bot). (3) scraper.py tunado: SEMAPHORE 5→8, PER_SITE_TIMEOUT_SEC 180→300, GENERIC_NAV_TIMEOUT_MS 25000→45000. (4) wellfound: novos selectors SPA + wait_for_selector pré-extração. (5) generic scraper: filtra cards por presença de `a[href*='/job']` antes de aceitar. (6) novos extractors customizados: builtin (22 jobs, .job-bounded-responsive), braintrust (20 jobs, app.usebraintrust.com com synth company), infosec_jobs (50 jobs, redirect isecjobs.com), getgreatcareers (15 jobs com URLs sintéticas — apply-links downstream NÃO funcionam, ver warning no DB).
- **Reativados em produção (33 ativos)**: dos 45 sites originais, restam 33 ativos após cleanup. Próximo run deve coletar substancialmente mais vagas com os novos extractors + timeout maior.
=======
- **Sites com anti-bot persistente (run 2026-05-11)**: datayoshi (403), jobspresso (CAPTCHA), powertofly (CAPTCHA), h1bgrader (403), upwork (403), fiverr_pro (403), womenwhocode (503). Considerar mover para `requires_auth` ou implementar proxy/UA rotation.
- **Sites com selector_not_found (run 2026-05-11)**: getgreatcareers, workingnomads, hiretechladies, myvisajobs, h1bdata. DOM mudou — atualizar SITE_SPECIFIC_SELECTORS no scraper.py canônico.
- **Sites com URL/cert quebrado (run 2026-05-11)**: hackajob (HTTP 404 — pode estar morto), triplebyte (CERT_COMMON_NAME_INVALID — domínio expirado?), flexjobs (HTTP2_PROTOCOL_ERROR — pode ser anti-bot).
- **wellfound sessão expirando**: TimeoutError no list selector em 2026-05-11 (12 dias após login persistente em 2026-04-30). Sessão dura ~2 semanas — renovar com `python squads/hunter-squad/scripts/wellfound-login.py` mensalmente.
- **dice title filter rejeita 100%**: 22 cards encontrados mas 0 passaram na whitelist de 167 títulos. Verificar se o `title` extraído está vindo do card correto (pode estar pegando company ou location).
>>>>>>> Stashed changes
=======
- **wellfound sessão dura ~2 semanas**: renovar com `python squads/hunter-squad/scripts/wellfound-login.py` mensalmente. Próxima renovação prevista: **2026-06-08**.
- **RPC `ingest_apify_jobs_bronze` tem contador parcial (descoberto 2026-05-11)**: Path 1 (com counter) só roteia registros com `item->>'id'`. Path 2 (best-effort por url_sha256) insere mas não incrementa counter. Solução adotada: `scripts/normalize.py` agora grava `id` no top-level espelhando `source_job_id`. RPC fica intocado para preservar compatibilidade com pipeline Apify externo. Regex fallback exige 6+ dígitos para evitar capturar ano como ID.
- **Bronze é compartilhado com pipeline Apify externo**: 11.734 rows em apify_jobs vêm de 57 sources. Apify pipeline insere linkedin/greenhouse/workday/lever.co/ashby/etc. segundas 07:00 UTC. Hunter Squad insere remoteok/weworkremotely/aijobs/etc. segundas 11:00 UTC. Dedup conjunta por url_sha256.
- **Sites desativados em 2026-05-11 (10)**: datayoshi, h1bgrader, upwork, fiverr_pro (anti-bot 403); jobspresso, powertofly (CAPTCHA); womenwhocode (503 — re-testar 2026-05-18); hackajob (404), triplebyte (CERT), flexjobs (HTTP2). Total ativo cai de 38 → 28.
- **scripts/ canonical templates (post-2026-05-11)**: `scraper.py`, `normalize.py`, `ingest_bronze.py`. Cada run copia + patch de BASE_DIR. `run_promote_pipeline.py` ainda inline no output folder — promover a canonical no próximo refactor.
- **Fase 4 (URL strategy) investigada em 2026-05-11**: `remoteok/remote-dev-jobs?order=date` retorna 200 mas sem evidência de diferença (default já é date-sorted). `weworkremotely.../remote-programming-jobs.rss` retorna 200 `application/rss+xml` — VÁLIDO mas exige novo `scraper_type=rss_feed` (~50 linhas em scraper.py com feedparser). Recomendação salva em `hunter_sites.config.recommended_strategy` para WWR. Implementar em Fase 5 (arquitetura adaptativa).
- **Yield bottleneck por site (cutoff 7 dias, run 2026-05-11)**: weworkremotely 139→7 (95% cortados), remoteok 30→3 (90%), remotive 20→4 (80%). Páginas mostram listagens estáveis incluindo legado. Fix real exige date-sorted endpoints ou RSS, não apenas pagination tuning.
>>>>>>> Stashed changes
