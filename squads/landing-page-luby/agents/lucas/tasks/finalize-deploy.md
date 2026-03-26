# Task: Finalização e Instruções de Deploy na Hostinger

## Descrição
Realizar verificações finais, gerar o build e entregar instruções detalhadas
de deploy na Hostinger.

## Input
Projeto completo scaffolado + componentes + integração dos tasks anteriores

## Processo

### 1. Verificação de Build

Verificar se o projeto compila sem erros TypeScript e sem warnings críticos:

```bash
# Simular — Lucas deve verificar todos os arquivos criados:
# 1. Todos os imports corretos (sem paths quebrados)
# 2. Todos os tipos TypeScript corretos (sem `any` implícito)
# 3. Todas as props obrigatórias passadas nos componentes
# 4. Nenhum `useEffect` em Server Components (sem 'use client')
# 5. Nenhuma imagem Next.js com `fill` sem wrapper de altura definida
```

### 2. Verificação Mobile

Checklist para responsividade:

```markdown
MOBILE CHECKLIST (375px)
- [ ] Navbar: hamburguer visível, links ocultos
- [ ] Hero: headline legível, CTAs empilhados (não side-by-side)
- [ ] MetricStrip: 1 coluna ou scroll horizontal
- [ ] Cards de solução: 1 coluna
- [ ] Testimonial: 1 coluna
- [ ] Benefícios: 1 coluna
- [ ] FAQ accordion: funciona em touch
- [ ] Formulário de contato: campos full-width, botão full-width
- [ ] Footer: empilhado verticalmente
```

### 3. Criar README.md do Projeto

```markdown
# [Nome da LP] — Luby Software Landing Page

## Stack
- Next.js 15 (App Router)
- TypeScript 5
- CSS Modules (design system Luby)
- lucide-react (ícones)
- Output: static export para Hostinger

## Setup Local

npm install
npm run dev

## Build de Produção

npm run build

Após o build, a pasta `out/` contém os arquivos estáticos.

## Deploy na Hostinger — Passo a Passo

### Opção 1: Upload via File Manager (Hostinger hPanel)
1. Acesse o hPanel em hpanel.hostinger.com
2. Vá em "Hosting" → selecione o plano
3. Abra "File Manager"
4. Navegue até `public_html/[slug-da-lp]/` (criar pasta se não existir)
5. Faça upload de todos os arquivos da pasta `out/`
6. Acesse: https://landing.luby.co/[slug-da-lp]/

### Opção 2: Deploy via Git + CI (recomendado para produção)
1. Crie repositório no GitHub (privado)
2. Conecte ao Hostinger via "Git" no hPanel
3. Configure build command: `npm run build`
4. Output directory: `out`
5. Deploy automático a cada push na branch main

### Opção 3: Deploy via Hostinger Node.js App (se usar SSR)
1. No hPanel → "Node.js"
2. Criar novo app
3. Entry point: `server.js` (adicionar se necessário)
4. Node.js version: 20.x

## Após o Deploy — Verificações Obrigatórias

1. [ ] Schema JSON-LD válido: https://search.google.com/test/rich-results
2. [ ] Open Graph preview: https://developers.facebook.com/tools/debug/
3. [ ] Twitter Card preview: https://cards-dev.twitter.com/validator
4. [ ] Google PageSpeed Insights: https://pagespeed.web.dev/
5. [ ] Mobile-friendly test: https://search.google.com/test/mobile-friendly
6. [ ] Configurar GTM ID real (substituir GTM-XXXXXXX em layout.tsx)
7. [ ] Submeter URL ao Google Search Console

## Estrutura de Arquivos

[Listar a estrutura final de arquivos criados]

## Notas Técnicas

[Documentar decisões técnicas tomadas durante o build]
```

### 4. Criar .env.example

```bash
# Google Tag Manager ID (obrigatório para analytics)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# URL de submit do formulário de contato (endpoint backend)
NEXT_PUBLIC_FORM_ENDPOINT=https://api.luby.co/contact

# URL base da LP (para canonical e OG)
NEXT_PUBLIC_BASE_URL=https://landing.luby.co
```

### 5. Relatório Final de Build

```markdown
# Relatório de Build — [Nome da LP]
**Data:** [data]
**Desenvolvedor:** Lucas Dev

## Estrutura de Arquivos Criada

[lista completa de todos os arquivos]

## Componentes Implementados

| Componente | Status | Notas |
|------------|--------|-------|
| Navbar | ✅ | Hamburguer mobile com estado local |
| HeroSection | ✅ | MetricStrip integrado |
| ProblemSection | ✅ | [N] problemas |
| SolutionSection | ✅ | [processo/capabilities] |
| SocialProofSection | ✅ | [N] testimonial(s) + dados |
| BenefitsSection | ✅ | [N] benefícios |
| ObjectionSection | ✅ | |
| FaqSection | ✅/N/A | [N] perguntas ou não aplicável |
| ContactSection | ✅ | Client component com loading state |
| Footer | ✅ | |

## SEO Implementado

| Elemento | Status |
|----------|--------|
| Title tag | ✅ [N] chars |
| Meta description | ✅ [N] chars |
| Canonical | ✅ |
| Open Graph (title, desc, img) | ✅ |
| Twitter Card | ✅ |
| Schema Service + Organization | ✅ |
| Schema FAQPage | ✅/N/A |
| Google Fonts preconnect | ✅ |
| Hero image preload | ✅ |
| GTM snippet | ✅ (aguarda ID real) |

## Decisões Técnicas

[documentar cada decisão não-óbvia]

## TODOs para o Time

1. **GTM ID**: Substituir GTM-XXXXXXX em `/app/layout.tsx` pelo ID real
2. **Formulário endpoint**: Configurar `NEXT_PUBLIC_FORM_ENDPOINT` no .env
3. **Imagem OG**: Criar imagem 1200x630px e colocar em `/public/images/og-image.jpg`
4. **Hero image**: Colocar hero.webp em `/public/images/hero.webp`
5. **Validações pós-deploy**: Executar todos os itens da seção "Após o Deploy"

## Output Gerado

Projeto em: `squads/landing-page-luby/output/{run_id}/lp-code/`
```

## Critérios de Qualidade

- [ ] Mobile checklist completo (todos os itens verificados)
- [ ] README.md com instruções de deploy Hostinger (3 opções)
- [ ] .env.example com todas as variáveis necessárias
- [ ] Relatório de build com tabela de componentes e SEO
- [ ] TODOs para o time claramente listados

## Condições de Veto

- README sem instruções de deploy na Hostinger
- Relatório de build sem tabela de componentes implementados
- TODOs para o time ausentes (GTM ID, endpoint de formulário, imagens)
