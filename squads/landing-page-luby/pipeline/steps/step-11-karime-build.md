---
type: agent
agent: karime
execution: subagent
model_tier: powerful
---

# Build da Landing Page

A Karime Dev constrói a landing page completa em Next.js + TypeScript,
integrando o copy aprovado e o pacote SEO da Tomiko.

**Input:**
- `squads/landing-page-luby/output/{run_id}/landing-page.md` (copy aprovado)
- `squads/landing-page-luby/output/{run_id}/seo-package.md` (pacote SEO completo)
- `squads/landing-page-luby/output/briefing.md` (contexto, slug e **idioma** da LP)
- `squads/landing-page-luby/pipeline/data/language-config.md` (variáveis por idioma)
- `squads/landing-page-luby/pipeline/data/footer-config.md` (dados do footer por idioma)

**Tasks:** scaffold-project.md → build-components.md → integrate-copy-seo.md → finalize-deploy.md
**Output:** `squads/landing-page-luby/output/{run_id}/lp-code/` (projeto Next.js completo)

**O que a Karime entrega:**

Projeto Next.js + TypeScript com:
- `package.json` (next 15, react 19, lucide-react, typescript)
- `next.config.js` com `output: 'export'`, `basePath`, `assetPrefix` e `trailingSlash: true` para deploy estático na Hostinger
- `tsconfig.json` com strict mode
- `styles/tokens.css` com design system Luby (cores, tipografia, espaçamento)
- `app/layout.tsx` com todos os elementos SEO: title, meta, canonical, OG, Twitter Card, schema JSON-LD (estático), GTM, Google Fonts preconnect, favicon
- `lib/schema.ts` com o schema JSON-LD como objeto TypeScript
- Componentes de seção: Navbar, Hero, Problem, Solution, Clients, SocialProof, Benefits, Objection, FAQ (se aplicável), Contact, Footer
- Componentes UI: Button, SectionLabel, MetricStrip
- `components/ContactForm.tsx` — formulário padronizado (name, last_name, phone, email, message + origin_url oculto) com envio via Supabase Edge Function
- `app/page.tsx` com montagem completa da página
- `public/favicon.ico` — favicon padrão Luby (de `squads/landing-page-luby/assets/`)
- `public/logo-light.png` — logo versão clara (de `squads/landing-page-luby/assets/`)
- `public/logo-dark.png` — logo versão escura (de `squads/landing-page-luby/assets/`)
- `public/sitemap.xml` — sitemap SEO com URL base conforme idioma selecionado
- `.env.example` com variáveis necessárias (GTM ID, SUPABASE_URL, SUPABASE_ANON_KEY, EDGE_FUNCTION, base URL)
- `README.md` com instruções de deploy na Hostinger (3 opções)
- Relatório de build com tabela de componentes e checklist de SEO

**Design system:**
- Cores Luby: #7ab800 (light) ou #D97757 (dark) conforme briefing
- Tipografia: Inter via Google Fonts, clamp() para responsive
- Mobile-first: 375px → 768px → 1200px+

**SEO implementado:**
- Title, meta, canonical no `<head>` via Next.js Metadata API
- Schema JSON-LD como `<script type="application/ld+json">` estático
- Open Graph e Twitter Card completos
- Google Fonts preconnect + font-display swap
- Hero image preload
- GTM snippet (com TODO para ID real)
- Imagens com `width`, `height` e `loading="lazy"`
- `sitemap.xml` gerado na raiz do build com URL base conforme idioma
- Favicon e logos da Luby incluídos em `public/`

**Deploy Hostinger (obrigatório):**
- Static export (`out/`) pronto para upload via File Manager na Hostinger
- `basePath` e `assetPrefix` configurados conforme URL final do briefing
- Todos os assets prefixados com `basePath` (imagens, favicon, logos, links internos)
- Ou deploy via Git + CI (opção documentada no README)
- Instruções passo a passo para o time

## Veto Conditions

- Schema JSON-LD como JavaScript dinâmico (useEffect) em vez de script estático
- Copy da Maise alterado durante a implementação
- Projeto sem next.config.js com output: 'export', basePath e assetPrefix
- Assets sem prefixo basePath (imagens quebradas no deploy)
- README sem instruções de deploy na Hostinger
- Algum item do brief SEO da Tomiko não implementado
- Formulário com campos diferentes do padrão (name, last_name, phone, email, message, origin_url)
- Formulário sem envio via Supabase Edge Function conforme language-config.md
- Projeto sem sitemap.xml na raiz do build
- Projeto sem favicon.ico em public/
- URLs ou backlinks apontando para o domínio errado (ex: luby.co em LP PT-BR)
