# Task: Integração de Copy e SEO

## Descrição
Integrar o copy aprovado e o pacote SEO da Beatriz nos componentes e no `<head>`.
Verificar consistência e completude antes do build final.

## Input
- `squads/landing-page-luby/output/{run_id}/landing-page.md`
- `squads/landing-page-luby/output/{run_id}/seo-package.md`

## Processo

### 1. Integrar Copy nos Componentes

Ler `landing-page.md` e mapear cada bloco de copy para o componente correspondente:

| Seção do copy | Componente | Props a preencher |
|--------------|------------|-------------------|
| HERO | HeroSection | headline, subtitle, primaryCta, metrics |
| PROBLEM STATEMENT | ProblemSection | problems[] |
| SOLUÇÃO / MECANISMO | SolutionSection | steps[] ou capabilities[] |
| PROVA SOCIAL | SocialProofSection | metrics[], testimonials[] |
| BENEFÍCIOS | BenefitsSection | benefits[] |
| OBJEÇÃO | ObjectionSection | question, answer, proof |
| FAQ (se existir) | FaqSection | items[] |
| CTA FINAL | ContactSection | headline, microcopy |

**Regra absoluta**: nenhum texto do copy é alterado durante a integração.
Se um copy tem "300+ engenheiros", o componente recebe "300+ engenheiros" — não "mais de 300 engenheiros".

### 2. Atualizar app/layout.tsx com o pacote SEO completo

Verificar e atualizar cada elemento:

```tsx
import type { Metadata } from 'next';
import { schemaOrg } from '@/lib/schema';

export const metadata: Metadata = {
  title: '[Title Tag do pacote SEO — exato, incluindo "| Luby Software"]',
  description: '[Meta description do pacote SEO — exato]',
  metadataBase: new URL('https://landing.luby.co'),
  alternates: {
    canonical: '/[slug-da-lp]/',
  },
  openGraph: {
    type: 'website',
    title: '[og:title do pacote SEO]',
    description: '[og:description do pacote SEO]',
    url: '/[slug-da-lp]/',
    images: [
      {
        url: '/images/og-image.jpg',  // 1200x630
        width: 1200,
        height: 630,
        alt: '[og:image:alt do pacote SEO]',
      },
    ],
    siteName: 'Luby Software',
  },
  twitter: {
    card: 'summary_large_image',
    title: '[twitter:title]',
    description: '[twitter:description]',
    images: ['/images/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Fonts preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Hero image preload — atualizar src */}
        <link rel="preload" as="image" href="/images/hero.webp" />

        {/* Schema JSON-LD — ESTÁTICO, não via JavaScript */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />

        {/* Google Tag Manager — completar com ID real */}
        {/* TODO: Substituir GTM-XXXXXXX pelo ID real do GTM da Luby */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-XXXXXXX');
        ` }} />
      </head>
      <body>
        {/* GTM noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
```

### 3. Atualizar lib/schema.ts com o schema exato da Beatriz

Converter o JSON-LD do `seo-package.md` para objeto TypeScript:

```typescript
export const schemaOrg = [
  // Service schema — exatamente como definido pela Beatriz
  {
    "@context": "https://schema.org",
    "@type": "Service",
    // ... props exatas do pacote SEO
  },
  // FAQPage schema se aplicável
] as const satisfies readonly Record<string, unknown>[];
```

### 4. Verificar app/page.tsx — Montagem Final

Garantir que:
- Todos os componentes de seção estão importados e montados em ordem
- Nenhuma seção do copy está faltando
- A ordem das seções corresponde ao copy aprovado
- Navbar e Footer estão presentes

```tsx
import Navbar from '@/components/Layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import ProblemSection from '@/components/sections/ProblemSection';
import SolutionSection from '@/components/sections/SolutionSection';
import SocialProofSection from '@/components/sections/SocialProofSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import ObjectionSection from '@/components/sections/ObjectionSection';
import FaqSection from '@/components/sections/FaqSection';  // se aplicável
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Layout/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection ... />
        <ProblemSection ... />
        <SolutionSection ... />
        <SocialProofSection ... />
        <BenefitsSection ... />
        <ObjectionSection ... />
        {/* FaqSection se copy tem FAQ */}
        <ContactSection ... />
      </main>
      <Footer />
    </>
  );
}
```

### 5. Checklist de integração final

```markdown
CHECKLIST DE INTEGRAÇÃO

Copy:
- [ ] Headline do hero: EXATO conforme copy aprovado
- [ ] Subtítulo: EXATO
- [ ] Dados do MetricStrip: EXATOS (ex: "300+ engenheiros")
- [ ] Copy do problem statement: EXATO
- [ ] Seção de solução/mecanismo: EXATO (incluindo passos numerados)
- [ ] Depoimento(s): EXATOS (nome, cargo, empresa, citação)
- [ ] Benefícios: EXATOS
- [ ] Objeção e resposta: EXATOS
- [ ] FAQ se houver: EXATO
- [ ] Headline do CTA final: EXATO
- [ ] Microcopy do CTA: EXATO
- [ ] Texto dos botões: EXATOS

SEO:
- [ ] Title tag: EXATO (incluindo "| Luby Software")
- [ ] Meta description: EXATA
- [ ] canonical: URL correta
- [ ] Open Graph title: EXATO
- [ ] Open Graph description: EXATA
- [ ] og:image spec (1200x630): placeholder criado
- [ ] Twitter Card: todos os campos
- [ ] Schema JSON-LD em lib/schema.ts: EXATO conforme Beatriz
- [ ] Schema inserido como script estático no layout: SIM
- [ ] GTM snippet: presente (com TODO para ID real)
- [ ] Google Fonts preconnect: presente
- [ ] Hero image preload: presente
```

## Critérios de Qualidade

- [ ] Checklist de integração completo (todos os itens verificados)
- [ ] Nenhum texto do copy foi alterado durante integração
- [ ] Schema JSON-LD em lib/schema.ts válido (JSON sintaticamente correto)
- [ ] layout.tsx tem todos os elementos de SEO do pacote da Beatriz
- [ ] app/page.tsx monta todas as seções na ordem correta

## Condições de Veto

- Algum elemento de copy alterado durante integração
- Schema JSON-LD com erro de sintaxe JSON
- Title tag ou meta description ausentes no layout.tsx
- Seção do copy ausente da page.tsx
