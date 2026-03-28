# Task: Scaffold do Projeto Next.js

## Descrição
Criar a estrutura completa do projeto Next.js + TypeScript com design tokens,
configuração Hostinger e componentes base reutilizáveis.

## Input
- `squads/landing-page-luby/output/{run_id}/seo-package.md` (para saber o tema: light ou dark)
- `squads/landing-page-luby/output/briefing.md` (para nome da LP / slug)

## Processo

1. **Definir slug da LP** a partir do briefing (snake_case):
   Ex: "Staff Augmentation para fintech" → `staff_augmentation_fintech`

2. **Criar estrutura de arquivos** em `squads/landing-page-luby/output/{run_id}/lp-code/`:

```
lp-code/
├── package.json
├── next.config.js
├── tsconfig.json
├── .env.example
├── public/
│   └── images/         # pasta para assets
├── styles/
│   ├── globals.css     # reset + tokens
│   └── tokens.css      # design tokens Luby
├── lib/
│   └── schema.ts       # JSON-LD schema como objeto TypeScript
├── components/
│   ├── Layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── SectionLabel.tsx
│   │   └── MetricStrip.tsx
│   └── sections/       # seções da LP (criadas no próximo task)
└── app/
    ├── layout.tsx      # HTML shell + <head> com SEO
    └── page.tsx        # montagem da página
```

3. **Escrever package.json**:
```json
{
  "name": "[slug-da-lp]",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.469.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0"
  }
}
```

4. **Escrever next.config.js** para Hostinger (static export):
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // required for static export
  },
};

module.exports = nextConfig;
```

5. **Escrever tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

6. **Escrever styles/tokens.css** com as variáveis do design system Luby:
   - Usar light ou dark theme conforme o briefing e o serviço da LP
   - Incluir todas as variáveis de cor, tipografia e espaçamento

7. **Escrever styles/globals.css** com reset e importação de tokens

8. **Criar lib/schema.ts** com o JSON-LD como objeto TypeScript exportado:
```typescript
export const schemaOrg = [
  // Service schema
  // FAQPage schema se aplicável
] as const;
```

9. **Criar app/layout.tsx** com:
   - Google Fonts Inter (preconnect + link)
   - `<title>`, `<meta name="description">`, `<link rel="canonical">`
   - Open Graph tags
   - Twitter Card tags
   - Schema JSON-LD como `<script type="application/ld+json">`
   - Google Tag Manager snippet (placeholder GTM-XXXXXXX — comentar para o time completar)

10. **Criar componentes base**:

    **Button.tsx:**
    ```tsx
    type ButtonProps = {
      children: React.ReactNode;
      variant?: 'primary' | 'secondary' | 'ghost';
      href?: string;
      onClick?: () => void;
      className?: string;
    };
    ```

    **SectionLabel.tsx:**
    ```tsx
    type SectionLabelProps = { children: React.ReactNode };
    // Renders: uppercase, 11px, letter-spacing 0.1em, accent color
    ```

    **MetricStrip.tsx:**
    ```tsx
    type Metric = { value: string; label: string };
    type MetricStripProps = { metrics: Metric[] };
    // Renders: 3 columns, | separators, centered
    ```

## Output

Todos os arquivos escritos em `squads/landing-page-luby/output/{run_id}/lp-code/`

## Critérios de Qualidade

- [ ] package.json com dependências mínimas (next, react, react-dom, lucide-react, typescript)
- [ ] next.config.js com `output: 'export'` para Hostinger
- [ ] tsconfig.json com strict mode habilitado
- [ ] tokens.css com todas as variáveis de cor e tipografia do design system Luby
- [ ] app/layout.tsx com TODOS os elementos de SEO (title, meta, OG, schema, GTM)
- [ ] Schema JSON-LD como script estático (não JS dinâmico)
- [ ] Button, SectionLabel, MetricStrip implementados e tipados

## Condições de Veto

- Schema JSON-LD como JavaScript dinâmico (useEffect / dangerouslySetInnerHTML)
- package.json sem dependências obrigatórias
- Ausência de app/layout.tsx ou de algum elemento de SEO crítico
