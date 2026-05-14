# Storyboard — Acelerar com IA sem perder segurança

## Choreography summary

Vídeo em arco "premium → minimal denso → premium". Abre com assinatura
Luby calma e autoritativa (3s). Cuts em TransitionFlash para o mundo
minimal-sync onde mora a substância: pergunta gancho (5.3s), três pilares
visualizados como diagrama-fluxograma (14.3s), e o número-âncora 60%
com comparativo visual (5.3s). Cut de volta para o mundo Luby premium
no CTA, fechando com logo + URL com bloom (3.7s).

O ritmo varia intencionalmente: cenas densas no miolo (muitos elementos
visuais entrando em sync com narração), pontas limpas (foco no logo e
mensagem assinatura).

---

## Cena 1 — Intro
- **Modo**: luby-premium
- **Frames**: TIMELINE.intro (0–90)

### Descrição
Logo Luby centralizado aparece com o blue dot drop signature. Tagline
"Desenvolvimento com IA, com segurança" revela abaixo via mask reveal.
Eyebrow técnico "AI-AUGMENTED ENGINEERING" acima do logo. Linha
decorativa fina desenha abaixo da tagline. BackgroundAtmosphere
respirando atrás de tudo. Ambiente premium calmo.

### Layout
- **Background**: BackgroundAtmosphere(hero=true)
- **Primary**: Logo centralizado, height=220
- **Secondary acima**: Eyebrow mono uppercase, blue, size=16, tracking 0.34em
- **Secondary abaixo**: Tagline display medium, gray100, size=38
- **Detalhe**: Linha horizontal 120px abaixo da tagline, com glow

### Elementos visuais
| ID | Tipo | Props | Propósito |
|----|------|-------|-----------|
| logo | logo | variant=white, animated, height=220 | Assinatura |
| eyebrow | text | mono, blue, 16px, uppercase | Categoria |
| tagline | text | display medium, gray100, 38px | Promessa |
| underline | line-draw | 120px, glow=true | Acabamento |

### Sync mappings
N/A (intro é assinatura, sem sync palavra-imagem).

### Coreografia
| Element | Enter frame | Exit frame | Easing in | Easing out |
|---------|-------------|------------|-----------|------------|
| logo | 0 | 60 | enter | exit |
| eyebrow | 22 | 60 | enterSoft | exit |
| tagline | 26 | 60 | enter | exit |
| underline | 34 | 60 | enterSoft | exit |

### Highlight frame
Frame 40 — logo totalmente revelado, halo azul respirando, tagline lida.

### Intenção narrativa
- **Feeling**: autoridade calma, marca presente
- **Memory anchor**: a marca Luby vinculada ao conceito "IA + segurança"

---

## Cena 2 — Hook
- **Modo**: luby-minimal
- **Frames**: TIMELINE.hook (60–220)

### Descrição
TransitionFlash entre frames 80-95 muda do mundo premium para o
minimal. Fundo navy escuro sólido. A pergunta entra palavra por palavra,
cada palavra-chave recebendo um ícone Lucide acima dela em sync exato.
Os ícones trocam conforme a leitura avança — "acelerar" mostra Zap,
"IA" troca para Sparkles, "segurança" mostra ShieldCheck maior (é o
clímax da pergunta). Texto branco puro, ícones em azul brand sem glow.

### Layout
- **Background**: colors.surface0 sólido (sem BackgroundAtmosphere)
- **Primary**: Pergunta centralizada horizontalmente, lower-third
- **Acima de palavras-chave**: ícones Lucide flutuando, 80-96px

### Elementos visuais
| ID | Tipo | Props | Propósito |
|----|------|-------|-----------|
| pergunta | text-animated | display black, white, 92px | Mensagem |
| icon-zap | icon | Zap, 80px, blue, no-glow | Sync "acelerar" |
| icon-sparkles | icon | Sparkles, 80px, blue, no-glow | Sync "IA" |
| icon-shield | icon | ShieldCheck, 96px, blue, no-glow | Sync "segurança" |

### Sync mappings (palavra → ícone)
| Palavra PT | Palavra EN | Ícone | Tamanho | Posição | Enter | Exit |
|------------|------------|-------|---------|---------|-------|------|
| acelerar | AI-fast | Zap | 80 | above-word | pop (emphasis) | swap |
| IA | (em AI-fast) | Sparkles | 80 | above-word | pop | swap |
| segurança | security | ShieldCheck | 96 | above-word | pop | (none — fica até exit da cena) |

### Coreografia
- Pergunta: revelação word-by-word a partir de frame 90, em sync com narração
- Cada ícone aparece NO MESMO FRAME que sua palavra-chave
- Saída: cena toda exit em 200-220

### Highlight frame
Frame 180 — pergunta completa visível, ShieldCheck grande sobre
"segurança" parado e visível.

### Intenção narrativa
- **Feeling**: tensão produtiva, curiosidade legítima
- **Memory anchor**: a pergunta que fica martelando ("é mesmo possível?")

---

## Cena 3 — Bullets
- **Modo**: luby-minimal
- **Frames**: TIMELINE.bullets (200–600)

### Descrição
Os três pilares viram um **diagrama-fluxograma horizontal** em vez de
lista vertical. Três cards equidistantes, cada um com seu ícone Lucide
acima do título. Linhas conectoras finas entre os cards mostram que é
um processo sequencial (PR → vulnerability gate → compliance). Eyebrow
"TRÊS PILARES" no topo. Título "O modo Luby" acima do diagrama.

### Layout
- **Background**: colors.surface0 sólido
- **Topo (~150px)**: Pill eyebrow + título
- **Centro (~600px)**: Três cards horizontais com conectores entre eles
- **Card width**: ~360px cada, gap de 80px entre eles

### Elementos visuais
| ID | Tipo | Props | Propósito |
|----|------|-------|-----------|
| eyebrow | pill | "TRÊS PILARES" / "THREE PILLARS" | Categoria |
| title | text | display black, 88px, white | Título |
| card-1 | concept-card | GitPullRequest 56px + "Code review" + caption | Pilar 1 |
| card-2 | concept-card | ShieldCheck 56px + "Vulnerability gates" + caption | Pilar 2 |
| card-3 | concept-card | FileCheck 56px + "Compliance" + caption | Pilar 3 |
| conn-12 | connector | de card-1 para card-2, flow ativo | Sequência |
| conn-23 | connector | de card-2 para card-3, flow ativo | Sequência |

### Sync mappings (palavra → ícone)
| Palavra PT | Palavra EN | Ícone | Onde |
|------------|------------|-------|------|
| code review | code review | GitPullRequest | dentro do card-1 |
| vulnerabilidades | vulnerability | ShieldCheck | dentro do card-2 |
| compliance | compliance | FileCheck | dentro do card-3 |

### Coreografia
- Eyebrow + título: frames 200-240
- Card 1: frame 240 (enter pop)
- Connector 1→2 desenha: frame 270
- Card 2: frame 290
- Connector 2→3 desenha: frame 320
- Card 3: frame 340
- Hold com flow dots animados nos connectors: 360-560
- Exit cascateado: 560-600

### Highlight frame
Frame 400 — três cards completos + conectores com flow dots no meio,
diagrama inteiro respirando.

### Intenção narrativa
- **Feeling**: ordem, disciplina, processo (não improviso)
- **Memory anchor**: "eles têm 3 pilares" — fácil de lembrar e citar

---

## Cena 4 — Stat
- **Modo**: luby-minimal
- **Frames**: TIMELINE.stat (580–760)

### Descrição
Número 60% gigante (branco puro, sem gradient) faz count-up animado.
Caption "menos vulnerabilidades em produção" abaixo. Ao lado direito do
número, uma **barra horizontal comparativa**: barra superior (cinza,
representando "antes") já cheia; barra inferior (azul brand, representando
"depois") cresce até 40% (porque é "60% menos = 40% restante"). Ícones
pequenos junto às barras: ShieldX para "antes", ShieldCheck para "depois".
Source line abaixo.

### Layout
- **Esquerda (60% do quadro)**: número 60% gigante + caption + source
- **Direita (40% do quadro)**: barras comparativas com ícones

### Elementos visuais
| ID | Tipo | Props | Propósito |
|----|------|-------|-----------|
| number | big-stat | "60%", 320px, white | Estatística |
| caption | text | medium, 38px, gray100 | Contexto |
| source | text | mono, 16px, gray400 | Credibilidade |
| bar-before | bar | full, gray | "Antes" |
| bar-after | bar | growing to 40%, blue | "Depois" |
| icon-x | icon | ShieldX, 32px, gray | Sync "antes" |
| icon-check | icon | ShieldCheck, 32px, blue | Sync "depois" |

### Sync mappings
| Palavra | Ícone | Onde |
|---------|-------|------|
| vulnerabilidades / vulnerabilities | (já presente em ShieldX e ShieldCheck) | direita |

### Coreografia
- Eyebrow "O RESULTADO" / "THE RESULT": frame 580
- Número começa count-up: frame 600
- Caption mask reveal: frame 624
- Barra "antes" aparece preenchida: frame 640
- Barra "depois" cresce de 0 a 40%: frames 660-700
- Source slide-in: frame 720
- Hold: 720-740
- Exit: 740-760

### Highlight frame
Frame 700 — "60%" gigante + barras comparativas em estado final,
contraste visual claro entre antes/depois.

### Intenção narrativa
- **Feeling**: prova, impacto, materialidade
- **Memory anchor**: "60% menos vulnerabilidades" — número específico
  e citável

---

## Cena 5 — CTA
- **Modo**: luby-premium
- **Frames**: TIMELINE.cta (740–900)

### Descrição
TransitionFlash de volta ao mundo premium em 730-745. BackgroundAtmosphere
volta a respirar. Headline "Construa com IA. Construa com segurança."
mask reveals centralizado. Logo Luby + linha separadora + URL
luby.co/ai-security-diagnostic com bloom azul atrás. Glow generoso,
breathing, marca presente.

### Layout
- **Centro vertical superior**: Headline em duas linhas
- **Centro vertical inferior**: Logo | linha | URL inline

### Elementos visuais
| ID | Tipo | Props | Propósito |
|----|------|-------|-----------|
| headline | mask-reveal text | display black, 76px, white, center | Mensagem |
| logo | logo | variant=white, animated, height=70 | Marca |
| separator | line | 56px vertical, whiteA40 | Separar logo de URL |
| url | text | mono medium, 44px, blueBright | Ação |
| bloom | radial-glow | atrás de logo+URL, grande | Premium feel |

### Sync mappings
N/A.

### Coreografia
- Headline mask reveal: 740
- Logo enter com halo: 754
- URL fade-in slide-up: 762
- Hold com bloom respirando: 762-900

### Highlight frame
Frame 830 — headline completa, logo respirando, URL legível, bloom
azul atrás de tudo.

### Intenção narrativa
- **Feeling**: confiança, convite, ação concreta
- **Memory anchor**: URL específica → leva à conversão

---

## Notes para o Motion Designer

1. **TransitionFlash** é peça nova — verifique se já existe no projeto.
   Se não, peça ao Diretor para aprovar a implementação antes (não
   improvise).
2. **Sync rígido**: as palavras-chave PRECISAM de sync palavra-imagem
   exato. ±2 frames tolerância máxima. Se algum drift for inevitável,
   prefere o ícone chegar UM frame ANTES da palavra (o olho perdoa).
3. **Barras comparativas na Stat**: não existe primitiva pronta. Pode
   ser implementado como dois retângulos animados; sem precisar de
   componente novo dedicado se for usado só aqui. Mas se a equipe
   antever que vai usar mais vezes, vale criar `ComparisonBar.tsx`.
4. **Conectores entre cards na Bullets**: usar o Connector existente com
   `flow=true`. Cuidado com SVG canvas — deve ser largo o suficiente
   para abranger os 3 cards (>=1800px).
5. **Ícones na Stat (ShieldX e ShieldCheck pequenos)**: tamanho pequeno
   (32px) é o limite inferior de legibilidade no LinkedIn — confirme
   visualmente que ainda é claro.
6. **TIMELINE atual pode precisar de ajuste**: a duração de cada janela
   pode estar diferente do que esse storyboard assume. Confira
   `src/design/timeline.ts` e ajuste o storyboard SE for menos trabalho,
   ou ajuste a TIMELINE SE o storyboard estiver mais correto narrativamente.
