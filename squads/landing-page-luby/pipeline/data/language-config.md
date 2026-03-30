# Configuração por Idioma — Landing Page Luby

Este arquivo define as variáveis que mudam conforme o idioma selecionado no briefing.
O idioma é definido no **step-01-briefing** e propagado para todos os agentes.

---

## PT-BR (Público Brasileiro)

| Variável | Valor |
|---|---|
| `language` | `pt-BR` |
| `site_url` | `https://luby.com.br/` |
| `schedule_url` | `https://agendamento.luby.com.br/` |
| `edge_function` | `contacts-landings-br` |
| `supabase_table` | `contacts_landings_br` |
| `cta_schedule_label` | `Agendar reunião` |
| `cta_schedule_link` | `https://agendamento.luby.com.br/` |

**Backlinks internos:** usar domínio `luby.com.br` para todos os links internos.

---

## EN-US (American English)

| Variável | Valor |
|---|---|
| `language` | `en-US` |
| `site_url` | `https://luby.co/` |
| `schedule_url` | `https://schedule.luby.co/` |
| `edge_function` | `submit-lead` |
| `supabase_table` | `contacts_landings` |
| `cta_schedule_label` | `Schedule a call` |
| `cta_schedule_link` | `https://schedule.luby.co/` |

**Backlinks internos:** usar domínio `luby.co` para todos os links internos.

---

## Formulário Padrão (ambos idiomas)

O payload é **idêntico** para ambas as edges — só muda o endpoint.

### Campos visíveis no formulário

Todos os campos são obrigatórios (`required`) e exibem **asterisco (*)** no label.

| Campo | Name Attribute | Tipo | Obrigatório | PT-BR Label | EN-US Label |
|---|---|---|---|---|---|
| Nome | `name` | text | Sim * | Nome * | First Name * |
| Sobrenome | `last_name` | text | Sim * | Sobrenome * | Last Name * |
| Telefone | `phone` | tel | Sim * | Telefone * | Phone * |
| E-mail | `email` | email | Sim * | E-mail * | Email * |
| Mensagem | `message` | textarea | Sim * | Mensagem * | Message * |

**Design:** cada label deve exibir `*` em cor de destaque (ex: `var(--color-primary)` ou vermelho) indicando campo obrigatório. Validação client-side com `required` em todos os inputs.

### Campo Telefone — Prefixo com Bandeira

O campo de telefone deve exibir um **seletor de prefixo internacional** com a bandeira do país (emoji Unicode) à esquerda do input numérico.

- **Default PT-BR:** prefixo `+55` com bandeira 🇧🇷 (Brasil)
- **Default EN-US:** prefixo `+1` com bandeira 🇺🇸 (Estados Unidos)
- O seletor deve incluir os prefixos mais comuns (BR, US, UK, DE, FR, PT, AR, MX, etc.)
- Cada opção do dropdown exibe: `{bandeira} {prefixo}` (ex: `🇧🇷 +55`)
- O payload final concatena prefixo + número sem espaços (ex: `"+5511999999999"`)
- Layout: dropdown de prefixo (largura fixa ~90px) + input tel (flex: 1) lado a lado

### Campos ocultos (preenchidos automaticamente)

| Campo | Valor | Descrição |
|---|---|---|
| `origin_url` | `window.location.href` | URL da LP de onde o lead veio |

### Payload enviado ao Supabase

```json
{
  "origin_url": "https://landing.luby.co/slug",
  "name": "João",
  "last_name": "Silva",
  "email": "joao@empresa.com",
  "phone": "+5511999999999",
  "message": "Gostaria de saber mais sobre..."
}
```

### Conexão do Formulário

```
POST https://{SUPABASE_URL}/functions/v1/{edge_function}

Headers:
  Content-Type: application/json
  Authorization: Bearer {SUPABASE_ANON_KEY}
```

- **PT-BR:** `POST .../functions/v1/contacts-landings-br` → tabela `contacts_landings_br`
- **EN-US:** `POST .../functions/v1/submit-lead` → tabela `contacts_landings`

### Validação

- **BR edge** valida: `name` e `email` obrigatórios (retorna 400 se ausentes)
- **US edge** aceita todos os campos como opcionais (mas `name` e `email` são esperados)

### Variáveis de Ambiente (.env)

```env
NEXT_PUBLIC_SUPABASE_URL=https://{project-ref}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY={anon-key}
NEXT_PUBLIC_EDGE_FUNCTION={edge_function}
NEXT_PUBLIC_BASE_PATH={basePath}
```

O componente `ContactForm.tsx` deve ler `NEXT_PUBLIC_EDGE_FUNCTION` para montar a URL de envio.

---

## Deploy na Hostinger — basePath

Toda LP é deployada na **Hostinger** em um subdiretório do domínio `landing.{domínio}`.
A URL final é definida no briefing e determina o `basePath` do Next.js.

### Exemplo

| URL final | basePath |
|---|---|
| `https://landing.luby.com.br/staff-augmentation/` | `/staff-augmentation` |
| `https://landing.luby.co/nearshore-development/` | `/nearshore-development` |
| `https://landing.luby.co/lending_infrastructure_modernization/` | `/lending_infrastructure_modernization` |

### Configuração obrigatória em `next.config.js`

```js
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
```

### O que o basePath afeta

- **Assets**: `<img src={\`${basePath}/logo-light.png\`}>` — todos os caminhos de imagem/favicon precisam ser prefixados
- **Sitemap**: `<loc>` deve usar a URL completa (ex: `https://landing.luby.co/nearshore-development/`)
- **Canonical / og:url**: URL completa com basePath
- **Schema JSON-LD**: `url` do Service deve incluir o path completo
- **origin_url do formulário**: `window.location.href` já captura automaticamente
- **Footer brand link**: usar a URL completa da LP
- **Link interno de navegação**: usar `basePath` + anchor (ex: `${basePath}/#contact`)

---

## Assets Padrão (ambos idiomas)

### Favicon
- Localização: `squads/landing-page-luby/assets/favicon.ico`
- Usar o mesmo favicon para PT-BR e EN-US

### Logo
- Versão clara: `squads/landing-page-luby/assets/logo-light.png`
- Versão escura: `squads/landing-page-luby/assets/logo-dark.png`
- A versão usada depende do tema da LP (light → logo escura, dark → logo clara)

### Logos de Clientes (seção Clients — obrigatória em toda LP)

Toda LP deve ter uma seção **Clients** exibindo logos dos clientes conforme o idioma.
Copiar a pasta correspondente para `public/clients/` no build.

**PT-BR** — pasta `squads/landing-page-luby/assets/br-clients/`:
- MULTI.png
- vitacon.png
- TOYOTA.png
- QTC.png
- CIEE.png
- ASSEFAZ.png
- PREVENTSENIOR.png
- CELCOIN.png
- FUNDACAOLEMANN.png
- SAFRAPAY.png
- UNIVERSAL.png
- arredondar.png

**EN-US** — pasta `squads/landing-page-luby/assets/us-clients/`:
- MASSPAY.png
- DCI.png
- FOXTROT.png
- GIGPAY.png
- USEND.png
- INTERCO.png
- CALIBER.png
- Sunwest-Bank.png
- Papaya.png
- ONLINE-IPS.png
- Neocova.png
- SIEMENS.png

**Design:** logos em escala de cinza (CSS `filter: grayscale(1) opacity(0.6)`) com hover para cor original. Layout em grid horizontal com scroll ou wrap. Lazy load em todas as imagens.

### Sitemap
- Toda LP deve gerar `sitemap.xml` na raiz do build (`out/sitemap.xml`)
- Formato padrão com `<urlset>`, `<url>`, `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`
- URL base conforme idioma: `luby.com.br` (BR) ou `luby.co` (US)
