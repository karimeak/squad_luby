# Orientações de Design — Landing Pages Luby

Guia de **modelo visual e UX**: estrutura, hierarquia, botoes, cards e secoes. Foco em padroes reutilizaveis, nao na paleta de cores especifica (cores vem do design system em `styles/tokens.css`).

> **Este arquivo e referencia, nao regra fixa.** A Karime Dev deve adaptar os padroes ao contexto de cada LP.

---

## Arquitetura da pagina

A pagina segue um **funil narrativo fixo**:

1. Hero
2. Problema
3. Como funciona
4. Infraestrutura (prova de dominio)
5. Porque a Luby
6. Case study
7. Clientes + estatisticas
8. Entregaveis (accordion)
9. CTA final (formulario)
10. Footer

Cada bloco e uma `<section>` com `id` para ancoras (`#problem`, `#how-it-works`, `#contact`, etc.), alinhado com a navbar e com links internos nos CTAs.

**Para replicar:** defina a ordem da historia (dor -> metodo -> prova -> conversao) antes de fixar o visual de cada bloco.

---

## Ritmo de tipografia e cabecalhos

Padrao recorrente nas secoes escuras:

1. **Eyebrow** — linha curta em caixa alta, `letter-spacing` largo (~0,1em), cor de destaque (acento), centrado ou a esquerda conforme o bloco.
2. **Titulo (H2)** — `clamp` entre ~28px e 44px, peso 700, `letter-spacing` ligeiramente negativo, `line-height` ~1,1. Parte do titulo usa **enfase** (acento) para escaneabilidade.
3. **Subtitulo** — ~15px, `line-height` ~1,75, cor secundaria mais suave, `max-width` estreito (520-580px) para coluna de leitura confortavel.

No **hero**, o H1 usa escala maior e linhas em bloco (`display: block`) para leitura em mobile.

---

## Botoes e CTAs

Hierarquia com **formato pill** (`border-radius` alto):

| Papel        | Modelo |
|-------------|--------|
| **Primario** | Preenchido com cor de acento, texto escuro, peso 600-700, padding confortavel; as vezes "->" no copy. |
| **Secundario** | Contorno suave no fundo escuro, texto claro, tamanho semelhante ao primario; uso em pares com `flex-wrap`. |
| **Terciario / ghost** | So borda (tom do acento); hover preenche — exemplo: "See how we solve this". |
| **Submit (form)** | Largura total, cantos um pouco menos arredondados que o hero; loading com opacidade / `disabled`. |
| **Secundario no form** | Full-width, fundo e borda muito subtis; hover nao compete com o submit. |

Na navbar, o CTA "Book a Call" / "Agendar reuniao" repete o **primario** (desktop e drawer mobile).

**Regra:** no maximo **um** primario por zona de decisao; os restantes descem de intensidade.

---

## Modelos de card (por funcao)

Nao ha um card unico; o formato muda com o conteudo:

1. **Problema (hover)** — Tres colunas no desktop; numero grande ("01."), titulo, corpo. Hover: fundo de acento, `scale` leve (~1,04), sombra — sem conteudo escondido.
2. **Como funciona** — Coluna vertical: faixa superior **imagem 16:9** (zoom suave no hover); parte inferior escura com titulo, texto e CTA pill com `margin-top: auto` num flex column. Container com borda e sombra leve.
3. **Infraestrutura (secao clara)** — Secao com fundo claro; cards brancos compactos; **icone** num quadrado arredondado com fundo de acento; titulo + texto — padrao "feature grid" B2B.
4. **Metricas (case)** — Faixa tipo KPI: celulas com fundo/borda tintados, valor grande + label pequena.
5. **Checklist** — Linhas com circulo check a esquerda (borda + fundo suave); alinhamento `flex-start`.
6. **Accordion (entregaveis)** — Item com borda; cabecalho e botao full-width com **+ / x** num circulo; conteudo em bullets. Um painel pode abrir por defeito.
7. **Faixa "Engagement model"** — Banda full-width: bloco texto + CTA a esquerda; grelha de **mini-cards** (check + frase) a direita; coluna -> linha em breakpoints maiores.

---

## Secao de clientes

Tres camadas:

1. **Cabecalho** — H2 centrado com enfase num segmento; paragrafo curto com `max-width` ~540px.
2. **Grelha de logos** — `grid` 2 colunas (mobile) -> 4 (`sm+`); cada tile e **caixa neutra** (altura fixa ~112px, padding, `border-radius` ~12px); logos com `object-fit: contain` e limites de tamanho para nao distorcer marcas.
3. **Estatisticas** — Grelha 2x2 ou 4 colunas; numero grande + sufixo opcional destacado; label pequena centrada por baixo.

Logos em fundo uniforme **equalizam** marcas diferentes; as stats acrescentam **prova numerica**.

---

## Navegacao

- Navbar **fixa**, fundo semitransparente com **backdrop blur**, borda inferior discreta.
- Logo a esquerda; links centrados no desktop; CTA primario a direita.
- Mobile: hamburger + lista simples com o mesmo CTA.

---

## Formulario de conversao (CTA final)

- **Duas colunas** (`md+`): esquerda = copy (eyebrow, H2, paragrafo, faixa de prova com check); direita = **card** (fundo mais escuro, borda leve) com o form.
- Labels pequenas; inputs com cantos ~8px; **foco** com borda reforcada no acento.
- Acao principal: submit full-width; acao secundaria: link estilizado como botao suave (ex. "Book a call now" / "Agendar reuniao").
- Fundo da secao: textura leve (ex. grelha de pontos) + glow radial — nao roubar foco aos campos.
- Campos padronizados: ver `pipeline/data/language-config.md` (name, last_name, phone, email, message + origin_url oculto). Todos com asterisco (*) obrigatorio.

---

## Movimento e acessibilidade

- Entradas com **stagger** (ex. Framer Motion) no hero.
- **Marquee** no rodape do hero: borda superior, fundo escuro + blur, texto duplicado para loop (keyframes CSS).
- Imagens em cards: **scale** no hover, transicao ~0,4s.
- Efeitos dependentes do rato devem respeitar **`prefers-reduced-motion`** quando possivel.

---

## Contraste entre secoes ("respiro")

A maior parte da pagina e **fundo escuro**. Uma secao (ex. infraestrutura) usa **fundo claro** + tipografia escura + cards brancos — funciona como pausa visual no meio do scroll.

---

## Grid e larguras

- **Largura maxima do conteudo:** ~1120px, centrada.
- **Padding horizontal:** ~24px.
- **Padding vertical:** `clamp` (ex. 48px-100px) entre mobile e desktop.
- **Tailwind (referencia):** 1 coluna -> `sm` / `md` / `lg` com mais colunas conforme o bloco.

---

## Referencia de componentes

Componentes esperados: `Navbar`, `Hero`, `Problem`, `HowItWorks`, `Infrastructure`, `WhyLuby`, `CaseStudy`, `Clients`, `Deliverables`, `FinalCTA`, `Footer`. Ordem em `app/page.tsx`.

Estilos globais e keyframes (ex. marquee) em `app/globals.css`.
