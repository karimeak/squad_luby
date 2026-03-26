---
type: agent
agent: lucas
execution: subagent
model_tier: powerful
---

# Build da Landing Page

O Lucas Dev constrói a landing page completa em Next.js + TypeScript,
integrando o copy aprovado e o pacote SEO da Beatriz.

**Input:**
- `squads/landing-page-luby/output/{run_id}/landing-page.md` (copy aprovado)
- `squads/landing-page-luby/output/{run_id}/seo-package.md` (pacote SEO completo)
- `squads/landing-page-luby/output/briefing.md` (contexto e slug da LP)

**Tasks:** scaffold-project.md → build-components.md → integrate-copy-seo.md → finalize-deploy.md
**Output:** `squads/landing-page-luby/output/{run_id}/lp-code/` (projeto Next.js completo)

**O que o Lucas entrega:**

Projeto Next.js + TypeScript com:
- `package.json` (next 15, react 19, lucide-react, typescript)
- `next.config.js` com `output: 'export'` para deploy estático na Hostinger
- `tsconfig.json` com strict mode
- `styles/tokens.css` com design system Luby (cores, tipografia, espaçamento)
- `app/layout.tsx` com todos os elementos SEO: title, meta, canonical, OG, Twitter Card, schema JSON-LD (estático), GTM, Google Fonts preconnect
- `lib/schema.ts` com o schema JSON-LD como objeto TypeScript
- Componentes de seção: Navbar, Hero, Problem, Solution, SocialProof, Benefits, Objection, FAQ (se aplicável), Contact, Footer
- Componentes UI: Button, SectionLabel, MetricStrip
- `app/page.tsx` com montagem completa da página
- `.env.example` com variáveis necessárias (GTM ID, form endpoint, base URL)
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

**Deploy Hostinger:**
- Static export (`out/`) pronto para upload via File Manager
- Ou deploy via Git + CI (opção documentada no README)
- Instruções passo a passo para o time

## Veto Conditions

- Schema JSON-LD como JavaScript dinâmico (useEffect) em vez de script estático
- Copy da Karime alterado durante a implementação
- Projeto sem next.config.js com output: 'export'
- README sem instruções de deploy na Hostinger
- Algum item do brief SEO da Beatriz não implementado
