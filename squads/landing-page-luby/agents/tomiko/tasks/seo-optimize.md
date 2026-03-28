# Task: Otimização SEO e Geração do Pacote

## Descrição
Com base na auditoria, gerar todos os elementos SEO prontos para implementação:
título, meta, headings, schema JSON-LD, Open Graph e brief de performance.

## Input
Relatório de auditoria do task anterior (seo-audit-copy.md)

## Processo

1. **Escrever Title Tag** (50-60 caracteres, contar exatamente):
   - Keyword primária nos primeiros 30 chars
   - Diferencial ou benefício no meio
   - "| Luby Software" no final
   - CONTAR CARACTERES antes de finalizar

2. **Escrever Meta Description** (120-155 caracteres, contar exatamente):
   - Inclui keyword primária naturalmente
   - Benefício específico + CTA suave
   - Não repete o title tag
   - CONTAR CARACTERES antes de finalizar

3. **Escrever/ajustar H1**:
   - Manter a força do copy original
   - Inserir keyword primária de forma natural
   - Se impossível conciliar: manter o copy e usar keyword no primeiro H2

4. **Escrever H2s** para cada seção principal:
   - Um H2 por seção com keyword secundária ou long-tail
   - Manter o copy persuasivo — H2s não são listas de keywords

5. **Montar Schema JSON-LD** completo:

   Sempre incluir Service + Organization:
   ```json
   [
     {
       "@context": "https://schema.org",
       "@type": "Service",
       "name": "[Nome específico do serviço desta LP]",
       "description": "[Meta description da página]",
       "serviceType": "[staff augmentation | nearshore development | AI development | etc]",
       "url": "[URL da LP — a definir pelo time]",
       "provider": {
         "@type": "Organization",
         "name": "Luby Software",
         "url": "https://luby.co",
         "logo": {
           "@type": "ImageObject",
           "url": "https://luby.co/logo.png",
           "width": 200,
           "height": 60
         },
         "foundingDate": "2002",
         "numberOfEmployees": {
           "@type": "QuantitativeValue",
           "value": 300
         },
         "address": [
           {
             "@type": "PostalAddress",
             "addressCountry": "BR",
             "addressLocality": "São Paulo",
             "addressRegion": "SP"
           },
           {
             "@type": "PostalAddress",
             "addressCountry": "US",
             "addressLocality": "Miami",
             "addressRegion": "FL"
           }
         ],
         "sameAs": [
           "https://www.linkedin.com/company/luby-software/",
           "https://luby.co"
         ]
       },
       "areaServed": [
         { "@type": "Country", "name": "Brazil" },
         { "@type": "Country", "name": "United States" },
         { "@type": "Place", "name": "Europe" }
       ]
     }
   ]
   ```

   Se há FAQ no copy — adicionar FAQPage schema:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "FAQPage",
     "mainEntity": [
       {
         "@type": "Question",
         "name": "[Pergunta exata do FAQ]",
         "acceptedAnswer": {
           "@type": "Answer",
           "text": "[Resposta do FAQ]"
         }
       }
     ]
   }
   ```

6. **Definir Open Graph tags**:
   - `og:type`: website
   - `og:title`: pode ser diferente do title tag — mais engajante para social
   - `og:description`: meta description ou variação com mais personalidade
   - `og:url`: [URL da LP — placeholder]
   - `og:image`: especificar 1200x630px + tema visual sugerido
   - `og:image:alt`: texto alternativo da imagem social

   Twitter Card:
   - `twitter:card`: summary_large_image
   - `twitter:title`, `twitter:description`, `twitter:image`

7. **Escrever Brief de Performance para Karime** (developer):
   ```markdown
   ## Brief de Performance (Core Web Vitals)

   Targets obrigatórios:
   - LCP < 2.5s
   - INP < 200ms
   - CLS < 0.1

   Implementações obrigatórias:
   - Hero image: formato WebP, max 400KB, `<link rel="preload">` no <head>
   - Imagens below-fold: `loading="lazy"` + `width` e `height` explícitos
   - Google Fonts Inter: `<link rel="preconnect" href="https://fonts.googleapis.com">`
     + `font-display: swap` no CSS
   - Google Tag Manager: snippet no <head> (GTM-XXXXXXX — ID fornecido pelo time)
   - Scripts externos: atributo `defer` em todos os scripts não-críticos
   - CSS: sem stylesheets externas bloqueantes. Tailwind/CSS-in-JS inline apenas.
   - `<link rel="canonical" href="[URL da LP]">` no <head>

   Schema JSON-LD: inserir como `<script type="application/ld+json">` no <head>,
   NÃO via JavaScript dinâmico (para garantir indexação correta pelo Google)
   ```

## Output Format

```markdown
# Pacote SEO Completo — [Nome da LP]
**Data:** [data]
**Keyword Primária:** [keyword]
**Keywords Secundárias:** [lista]

---

## Elementos On-Page

**Title Tag** ([N] chars):
`[título exato]`

**Meta Description** ([N] chars):
`[meta exata]`

**H1** (ajustado):
`[h1 exato]`

**H2s por Seção:**
- Problema: `[h2]`
- Solução: `[h2]`
- Prova Social: `[h2]`
- Benefícios: `[h2]`
- Objeção: `[h2]`
- CTA Final: `[h2]`

---

## Schema JSON-LD

```json
[schema completo Service + Organization]
```

[se FAQ]
```json
[schema FAQPage]
```

---

## Open Graph & Twitter Card

```html
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="[título]" />
<meta property="og:description" content="[descrição]" />
<meta property="og:url" content="[url]" />
<meta property="og:image" content="[url-imagem]" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="[alt]" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[título]" />
<meta name="twitter:description" content="[descrição]" />
<meta name="twitter:image" content="[url-imagem]" />
```

---

## Brief de Performance para Karime
[brief completo conforme definido acima]
```

## Critérios de Qualidade

- [ ] Title tag entre 50-60 chars (contar exatamente)
- [ ] Meta description entre 120-155 chars (contar exatamente)
- [ ] H1 contém keyword primária de forma natural
- [ ] H2s incluem keywords secundárias/long-tail
- [ ] Schema JSON-LD completo: Service + Organization
- [ ] FAQPage schema incluído se há FAQ no copy
- [ ] Open Graph tags completas (tipo, título, descrição, URL, imagem)
- [ ] Twitter Card tags presentes
- [ ] Brief de performance com todos os pontos de CWV
- [ ] Output salvo em squads/landing-page-luby/output/{run_id}/seo-package.md

## Condições de Veto

- Title tag fora da faixa de caracteres (< 45 ou > 65)
- Schema JSON-LD ausente ou incompleto (faltando Organization)
- Brief de performance para Karime ausente
