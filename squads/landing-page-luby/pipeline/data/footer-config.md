# Footer — Configuração por Idioma

O footer é **obrigatório e padronizado** em toda LP. O layout é idêntico para BR e US —
muda o conteúdo (labels, links, copyright) e há diferenças sutis de cor entre as versões.

O componente `Footer.tsx` é baseado nos footers de referência reais da Luby.

---

## Ajustes dos templates originais para o projeto

| Original | Nosso projeto |
|---|---|
| BR: `logoluby.svg` + `filter: brightness(0) invert(1)` | `logo-light.png` (já é branco, sem filtro CSS) |
| US: `Clara.png` via `NEXT_PUBLIC_BASE_PATH` | `logo-light.png` (mesmo asset, sem env var de path) |
| `basePath` / `NEXT_PUBLIC_BASE_PATH` hardcoded | Remover — cada LP é um projeto Next.js deployado na raiz |
| Brand `href` hardcoded por LP | Usar `site_url` do language-config.md (`luby.com.br` ou `luby.co`) |
| `alt` do logo hardcoded | Dinâmico: `"Luby Software - {título da LP}"` |

## Dependências

- `lucide-react` (Phone, Mail, Globe, MapPin) — já listado no projeto
- Tailwind CSS para grid (`grid`, `grid-cols-2`, `md:grid-cols-[1fr_repeat(3,auto)]`, `col-span-2`, `md:col-span-1`)
- Se o projeto não usar Tailwind, reescrever o grid em CSS puro

---

## Estrutura do Footer

```
┌─────────────────────────────────────────────────────┐
│  Logo                                               │
│  📍 Escritório 1 (endereço, tel, email, site)       │
│  📍 Escritório 2 (endereço, tel, email, site)       │
│                                                     │
│  Serviços/Services  Empresa/Company  Contato/Contact│
│  - link             - link           - link         │
│  - link             - link           - link         │
│  - link             - link                          │
│  - link             - link                          │
├─────────────────────────────────────────────────────┤
│  Termos | Privacidade          © 2026 Luby Software │
└─────────────────────────────────────────────────────┘
```

---

## PT-BR — Dados do Footer

### Serviços
```ts
const services = [
  { label: "Modernização de Legado", href: "https://luby.com.br/solucoes-tecnologicas/" },
  { label: "FastTrack",              href: "https://fasttrack.luby.com.br" },
  { label: "Desenvolvimento",        href: "https://luby.com.br" },
  { label: "Consultoria",            href: "https://luby.com.br" },
];
```

### Empresa
```ts
const company = [
  { label: "Sobre a Luby", href: "https://luby.com.br/a-luby/" },
  { label: "Clientes",     href: "https://luby.com.br/cases/" },
  { label: "Carreiras",    href: "https://luby.com.br/carreiras/" },
  { label: "Blog",         href: "https://luby.com.br/blog/" },
];
```

### Contato
```ts
const contact = [
  { label: "Contato",  href: "https://luby.com.br/contato/" },
  { label: "Suporte",  href: "https://luby.com.br/contato/" },
];
```

### Escritórios (BR primeiro)
```ts
const locations = [
  {
    country: "Brasil",
    siteUrl: "https://luby.com.br",
    address: "Edifício Villa Office\nR. Amália de Noronha, 151 sala 303\nPinheiros, São Paulo - SP",
    phone: "+55 11 3055 3404",
    email: "comercial@luby.com.br",
    web: "luby.com.br",
  },
  {
    country: "Estados Unidos",
    siteUrl: "https://luby.co",
    address: "1110 Brickell Avenue Suite 310\nMiami, FL Estados Unidos",
    phone: "+1 305 600 1993",
    email: "sales@luby.co",
    web: "luby.co",
  },
];
```

### Legal
```ts
const legal = [
  { label: "Termos de Uso",           href: "https://luby.com.br/termos-de-uso/" },
  { label: "Política de Privacidade", href: "https://luby.com.br/politica-de-privacidade/" },
];
```

### Copyright
```
© 2026 Luby Software. Todos os direitos reservados.
```

---

## EN-US — Dados do Footer

### Services
```ts
const services = [
  { label: "Legacy Modernization", href: "https://luby.co" },
  { label: "FastTrack",            href: "https://fasttrack.luby.co" },
  { label: "Development",          href: "https://luby.co" },
  { label: "Consulting",           href: "https://luby.co" },
];
```

### Company
```ts
const company = [
  { label: "About Luby", href: "https://luby.co/about" },
  { label: "Clients",    href: "https://luby.co/cases/" },
  { label: "Careers",    href: "https://luby.co/careers/" },
  { label: "Blog",       href: "https://luby.co/blog" },
];
```

### Contact
```ts
const contact = [
  { label: "Contact", href: "https://luby.co/contact/" },
  { label: "Support", href: "https://luby.co/contact/" },
];
```

### Escritórios (US primeiro)
```ts
const locations = [
  {
    country: "United States",
    siteUrl: "https://luby.co",
    address: "1110 Brickell Avenue Suite 310\nMiami, FL United States",
    phone: "+1 305 600 1993",
    email: "sales@luby.co",
    web: "luby.co",
  },
  {
    country: "Brazil",
    siteUrl: "https://luby.com.br",
    address: "Villa Office Building\nR. Amália de Noronha, 151 Suite 303\nPinheiros, São Paulo - SP",
    phone: "+55 11 3055 3404",
    email: "comercial@luby.com.br",
    web: "luby.com.br",
  },
];
```

### Legal
```ts
const legal = [
  { label: "Terms of Use",    href: "https://luby.co/terms-conditions/" },
  { label: "Privacy Policy",  href: "https://luby.co/terms-conditions/" },
];
```

### Copyright
```
© 2026 Luby Software. All rights reserved.
```

---

## Column Headers por idioma

| Coluna | PT-BR | EN-US |
|---|---|---|
| Serviços | Serviços | Services |
| Empresa | Empresa | Company |
| Contato | Contato | Contact |

---

## Estilos (unificados — design system tokens)

O footer é sempre fundo escuro, independente do tema da LP. Usar os tokens do
**design system dark** definidos em `styles/tokens.css`:

| Token | Valor | Uso no footer |
|---|---|---|
| `--color-bg` | `#0A0A0A` | Background do footer |
| `--color-text` | `#FFFFFF` | — (não usado diretamente no footer) |
| `--color-text-secondary` | `#6B6B6B` | Column headings, location labels/icons, legal, copyright |
| `--color-border` | `rgba(255,255,255,0.08)` | Border top + bottom divider |

### Estilos com tokens (ambos idiomas — idênticos)

```ts
// Links das colunas
const linkStyle = {
  fontSize: 13,
  color: "var(--color-text-secondary)",   // #6B6B6B
  textDecoration: "none",
  lineHeight: 2,
  display: "block",
  transition: "color 0.15s",
};
// Hover: color → "#BFBFBF"

// Heading das colunas
const colHeadStyle = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--color-text-secondary)",   // #6B6B6B
  marginBottom: 14,
};
```

### Mapeamento completo

```
Footer background:      var(--color-bg)              → #0A0A0A
Border top:             1px solid var(--color-border) → rgba(255,255,255,0.08)
Bottom divider:         1px solid var(--color-border) → rgba(255,255,255,0.08)
Column headings:        var(--color-text-secondary)   → #6B6B6B
Link text:              var(--color-text-secondary)   → #6B6B6B
Link hover:             #BFBFBF
Location labels/icons:  var(--color-text-secondary)   → #6B6B6B
Location details:       var(--color-text-secondary)   → #6B6B6B
Legal links:            var(--color-text-secondary)   → #6B6B6B
Legal hover:            #808080
Copyright:              var(--color-text-secondary)   → #6B6B6B
Logo:                   logo-light.png, height 44px, width auto
Lucide icons:           size 12
Max width container:    1100px
```
