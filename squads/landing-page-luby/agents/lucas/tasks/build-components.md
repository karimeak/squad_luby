# Task: Build dos Componentes de Seção

## Descrição
Implementar cada seção da landing page como componente TypeScript independente,
seguindo o design system Luby e a estrutura das LPs de referência.

## Input
- `squads/landing-page-luby/output/{run_id}/landing-page.md` (copy aprovado)
- `squads/landing-page-luby/output/{run_id}/seo-package.md` (H2s otimizados)
- Projeto scaffolado no task anterior

## Seções a implementar

Para cada seção, criar `components/sections/[SectionName].tsx`.
Todos os componentes são Server Components (sem 'use client' a menos que
necessário para interatividade — ex: formulário com estado).

---

### 1. Navbar.tsx

```tsx
// Sticky, transparente com scroll → background sólido
// Logo Luby (SVG inline ou <Image>)
// Links de navegação (anchors para seções da página)
// CTA button primário
// Hamburguer menu mobile (sem lib externa — estado local com useState)
```

Comportamento:
- Desktop: horizontal, links visíveis
- Mobile: hamburguer → menu fullscreen ou drawer
- Sticky com `position: sticky; top: 0; z-index: 100`
- Transição de fundo ao scrollar (opcional: use `useEffect` + `window.scrollY`)

---

### 2. HeroSection.tsx

Elementos obrigatórios (integrar copy exato da Karime):
```tsx
type HeroProps = {
  headline: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  metrics: Array<{ value: string; label: string }>;  // MetricStrip
};
```

Layout:
- Conteúdo centralizado ou left-aligned (conforme referência do briefing)
- Headline: `--text-hero` com font-weight 700
- Subtitle: `--text-h3` com font-weight 400, cor `--color-text-secondary`
- CTAs: Button primary + Button secondary, gap 12px
- MetricStrip abaixo dos CTAs: 3 dados da Luby relevantes para esta LP

---

### 3. ProblemSection.tsx

```tsx
type ProblemSectionProps = {
  sectionLabel: string;
  headline: string;          // H2 otimizado do SEO package
  problems: Array<{
    number: string;          // "01", "02", "03"
    title: string;
    description: string;
  }>;
};
```

Layout:
- Numeração grande (font-size clamp(48px, 6vw, 80px)) como elemento decorativo
- Cada problema em linha ou card
- Background: `--color-bg-alt`

---

### 4. SolutionSection.tsx

```tsx
type SolutionSectionProps = {
  sectionLabel: string;
  headline: string;
  description: string;
  steps?: Array<{ step: string; title: string; description: string }>;
  capabilities?: Array<{ icon: string; title: string; description: string }>;
};
```

Layout:
- Se tem processo em passos: timeline vertical ou cards numerados
- Se tem capabilities: grid 3 colunas desktop / 1 coluna mobile
- CapabilityCard: ícone Lucide + título bold + descrição, border-radius 14px

Ícones Lucide sugeridos para serviços Luby:
```tsx
import { Code2, Layers, Cpu, Shield, Zap, Users, Globe, Database } from 'lucide-react';
```

---

### 5. SocialProofSection.tsx

```tsx
type Metric = { value: string; label: string; sublabel?: string };
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
};
type SocialProofProps = {
  headline: string;
  metrics?: Metric[];
  testimonials: Testimonial[];
  clientLogos?: string[];   // nomes das empresas (text-based se sem imagens)
};
```

Layout:
- Métricas destacadas (números grandes, cor primary)
- Testimonial card: citação em quote, nome + cargo + empresa, border esquerdo primary
- Client logos: grid flexível (text se sem assets de imagem)

---

### 6. BenefitsSection.tsx

```tsx
type Benefit = {
  icon: string;    // nome do ícone Lucide
  stakeholder?: string;  // "Para o CTO", "Para o CFO"
  title: string;
  description: string;
};
type BenefitsProps = {
  sectionLabel: string;
  headline: string;
  benefits: Benefit[];
};
```

Layout:
- Grid 2 ou 3 colunas desktop / 1 coluna mobile
- Ícone em cor primary, título bold, descrição em cor secondary

---

### 7. ObjectionSection.tsx

```tsx
type ObjectionProps = {
  question: string;
  answer: string;
  proof?: string;     // dado ou frase de prova específica
};
```

Layout:
- Fundo diferenciado (card ou bg-alt)
- Pergunta em negrito, resposta em texto normal
- Prova em destaque (badge ou border esquerdo)

---

### 8. FaqSection.tsx (se copy tem FAQ)

```tsx
type FaqItem = { question: string; answer: string };
type FaqSectionProps = {
  headline: string;
  items: FaqItem[];
};
```

Layout:
- Accordion sem lib externa — `useState` para controlar item aberto
- Ícone `+`/`-` ou ChevronDown da Lucide
- Animação de altura: `max-height` transition

---

### 9. ContactSection.tsx

```tsx
// Formulário com: nome, email, telefone, mensagem
// Submit via fetch para endpoint (placeholder — comentar no código)
// Feedback de sucesso/erro sem reload
// 'use client' obrigatório
```

Layout:
- Formulário em card com padding
- Labels visíveis (não só placeholders)
- Botão de submit com loading state
- Campos com `name`, `type`, `required` corretos para acessibilidade

---

### 10. Footer.tsx

```tsx
// Logo Luby
// Endereços: São Paulo, BR + Miami, FL
// Links: Serviços, Company, Legal
// Copyright
// Links de redes sociais (LinkedIn)
```

---

### 11. app/page.tsx — Montagem da página

```tsx
// Importa e monta todos os componentes de seção em ordem
// Props são os dados do copy aprovado — hardcoded neste arquivo
// NÃO busca dados de API — é static
```

## Estilo CSS

Para cada componente, escrever o CSS como:
- CSS Modules (componente.module.css) — preferência para isolamento
- OU CSS-in-JS inline como style objects — apenas para casos simples
- Usar variáveis do tokens.css
- Usar `clamp()` para valores responsivos
- Media queries: `@media (max-width: 768px)` para mobile

## Critérios de Qualidade

- [ ] Todos os componentes de seção implementados conforme copy aprovado
- [ ] Design system Luby aplicado consistentemente (cores, tipografia, espaçamento)
- [ ] Responsivo: 375px (mobile), 768px (tablet), 1200px+ (desktop)
- [ ] Ícones Lucide importados corretamente (tree-shakeable)
- [ ] Formulário com 'use client', estados de loading e feedback
- [ ] Accordion do FAQ sem libs externas
- [ ] Sem imagens com dimensões explicitamente ausentes

## Condições de Veto

- Copy da Karime alterado (parafrasear, resumir, "melhorar")
- Componente sem responsividade mobile
- Formulário sem estados de loading/feedback
- Instalação de package não-autorizado sem documentar motivo
