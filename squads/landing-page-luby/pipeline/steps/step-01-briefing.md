---
type: checkpoint
outputFile: squads/landing-page-luby/output/briefing.md
---

# Briefing da Landing Page

**Squad:** Landing Page Luby — Produção de landing pages de alta conversão
**Próximo passo:** O Cleidson vai analisar a audiência, pesquisar concorrentes e
definir a estratégia completa de conversão (Big Idea, framework, estrutura de seções).

---

**Antes de começar:** verifique que o arquivo `.env` do projeto está configurado com as credenciais necessárias para o deploy funcionar. O deploy é feito via MCP (Hostinger).

Variáveis obrigatórias:
- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key do Supabase
- `NEXT_PUBLIC_EDGE_FUNCTION` — Nome da Edge Function (definido pelo idioma)
- `NEXT_PUBLIC_BASE_PATH` — basePath da LP (definido pela URL final)
- `NEXT_PUBLIC_GTM_ID` — ID do Google Tag Manager (opcional, pode adicionar depois)

Se ainda não tem essas credenciais configuradas, podemos resolver juntos durante o processo.

---

Em qual idioma a landing page será escrita?

1. PT-BR (Público brasileiro) — site luby.com.br, formulário via edge function `contacts-landings-br`
2. EN-US (American English) — site luby.co, formulário via edge function `submit-lead`

**Importante:** esta escolha define automaticamente:
- URL do site e backlinks internos
- Link de agendamento (Schedule / Agendamento)
- Edge Function e tabela Supabase do formulário
- Idioma de todo o copy, SEO e código

Consulte `pipeline/data/language-config.md` para a tabela completa de variáveis por idioma.

---

Para qual produto ou serviço da Luby esta landing page será criada?

Exemplos:
- "Staff Augmentation para empresas de fintech"
- "Desenvolvimento de MVP para startups B2B"
- "Modernização de sistemas legados para empresas enterprise"
- "Nearshore Development para empresas americanas"

---

Qual é o objetivo principal desta landing page?

1. Captura de lead (formulário de contato / agendamento de reunião)
2. Solicitação de proposta comercial
3. Download de conteúdo (e-book, guia, case)
4. Inscrição em webinar ou evento

---

Quem é o visitante ideal desta página?

Exemplos:
- "CTO de scale-up de fintech, 100-500 funcionários, Brasil"
- "VP de Engenharia em multinacional americana buscando time nearshore"
- "Head de Produto em healthtech que precisa escalar o time rapidamente"

Digite o perfil do visitante ideal (cargo, empresa, país, contexto):

---

Qual será a URL final da landing page na Hostinger?

Exemplos:
- `https://landing.luby.com.br/staff-augmentation/`
- `https://landing.luby.co/nearshore-development/`
- `https://landing.luby.co/lending_infrastructure_modernization/`

**Ainda não definiu a URL?** Sem problema — podemos configurar o domínio e o subdiretório juntos agora via MCP (Hostinger). Basta escolher a opção "Configurar agora".

**Importante:** esta URL define o `basePath` do Next.js e afeta:
- `next.config.js` → `basePath` e `assetPrefix`
- Caminhos de todos os assets (imagens, favicon, logos)
- URL canônica e sitemap
- `origin_url` enviado pelo formulário
- Open Graph `og:url`

Formato: `https://landing.{domínio}/{slug}/`
Digite a URL completa ou escolha "Configurar agora" para definirmos via MCP:
