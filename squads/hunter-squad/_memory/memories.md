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
- **Run 2026-05-06-090110 (produção 44 sites)**: 35 raw → 25 após filtros. Bronze inserted=0 (todas duplicadas). Silver promovidos=24 (RPC2 update=476). Sites OK: aijobs(19), indeed(7), remoteok(2), remotive(1), simplyhired(1). Duração: 5h29min (scraping 2h22min). Pipeline overall_success=true.
- **Sites que precisam correção (33 falhas)**: HTTP 403 anti-bot em glassdoor/ziprecruiter/gun_io/careerbuilder/producthunt_jobs (precisa UA rotation/proxy); HTTP 404 em glassdoor/cyberseek (URLs inválidas); DNS em monster; selectors customizados faltando em remotetechjobs/getgreatcareers/builtin/hired/braintrust/mljobs/infosec_jobs; 15 sites tier 4-5 com timeout 180s hard cap (weworkremotely incluso — bug de regressão); wellfound list selector timeout.
- **Hard cap de 180s/site é muito apertado para tier 4-5**: 15 sites foram cortados por timeout em uma única wave. Recomendação: aumentar para 300s OU paralelizar mais (Semaphore atual=5).
- **Generic best-effort scraper funcionou em 4 sites**: indeed, simplyhired, workinfinland, dice, arc_dev usaram seletor `[data-testid*='job']` com sucesso (mas dice e workinfinland tiveram 0 títulos correspondentes — filtro muito restritivo).
- **Correções aplicadas pós-run 2026-05-06**: (1) sites desativados no DB: monster (DNS), glassdoor (404), cyberseek (404), workinfinland (fora de escopo US), remotetechjobs (parked), hired (merged em LHH), mljobs (domínio parked). (2) sites marcados `scraper_type=requires_auth`: ziprecruiter, gun_io, producthunt_jobs, careerbuilder (HTTP 403 anti-bot). (3) scraper.py tunado: SEMAPHORE 5→8, PER_SITE_TIMEOUT_SEC 180→300, GENERIC_NAV_TIMEOUT_MS 25000→45000. (4) wellfound: novos selectors SPA + wait_for_selector pré-extração. (5) generic scraper: filtra cards por presença de `a[href*='/job']` antes de aceitar. (6) novos extractors customizados: builtin (22 jobs, .job-bounded-responsive), braintrust (20 jobs, app.usebraintrust.com com synth company), infosec_jobs (50 jobs, redirect isecjobs.com), getgreatcareers (15 jobs com URLs sintéticas — apply-links downstream NÃO funcionam, ver warning no DB).
- **Reativados em produção (33 ativos)**: dos 45 sites originais, restam 33 ativos após cleanup. Próximo run deve coletar substancialmente mais vagas com os novos extractors + timeout maior.
