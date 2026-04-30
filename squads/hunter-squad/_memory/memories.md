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
