# Squad Memory: Blog Writer Auto — Luby

## Estilo de Escrita

## Design Visual

## Estrutura de Conteúdo

## Proibições Explícitas

## Técnico (específico do squad)

### Run 2026-04-30-115250
- 4 artigos publicados: blog_nearsmarter (#22), blog_luby (#34), blog_luby_us (#35), blog_finfy (#36)
- Temas: AI in Legacy Systems (nearsmarter) + OpenTelemetry (luby) + DevEx 2026 (luby_us) + DREX 2026 (finfy)
- Scores Pedro: 95/93/94/93 — todos aprovados (2 com correção de lista Gutenberg)
- Fila vazia em 3 de 4 canais → Tobias executou Phase 3 (scout) para blog_luby, blog_luby_us, blog_finfy
- Imagens Unsplash: VHmBX7FnXw0 (nearsmarter), fmH6yLBwEPw (luby), 9V-2P6Lq9b8 (luby_us), uFF_apyZ-l8 (finfy — diferente do Of_uwkrv1xo usado em run anterior do mesmo fotógrafo)
- Payload WP via Python subprocess + json.dumps() — única forma confiável com caracteres especiais PT-BR
- Gutenberg list: `<ul class="wp-block-list">` com `<!-- wp:list-item -->` por item — Pedro veta se ausente
- wp_post_ids: nearsmarter=3260, luby=55377, luby_us=55280, finfy=46

### Run 2026-04-27-154522
- 4 artigos publicados: blog_nearsmarter (#20), blog_luby (#31), blog_luby_us (#32), blog_finfy (#33)
- Tema: Platform Engineering (luby/luby-us) + Pix Automático (finfy) + AI Code Review (nearsmarter)
- Scores Pedro: 94–97/100 todos aprovados
- Payloads WP publicados via Node.js (--data-binary @file.json) por limitação do curl no Windows
- blog_finfy precisa de HTTPS na URL (http → 301 redirect)
- nearsmarter pode ter latência 503 — fazer retry automático
- Imagens Unsplash: pKiBD4eoOqE (nearsmarter), LXx1hwmp67E (luby), QckxruozjRg (luby-us), Of_uwkrv1xo (finfy)
