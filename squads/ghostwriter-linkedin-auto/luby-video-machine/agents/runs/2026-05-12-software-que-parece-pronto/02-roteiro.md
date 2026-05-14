# Roteiro — Software que parece pronto mas não está

## Metadata
- **Narração**: sim
- **Voz**: autoritativa-calma, gênero indiferente; tom de
  reconhecimento ("vou te dizer uma coisa que você já sabe")
- **Total de palavras PT (narração)**: 79
- **Total de palavras EN (narração)**: 76

---

## Beat 1 — Intro (3s)

**PT**: A definição de "pronto" mente.

**EN**: The definition of "done" lies.

**Palavras-chave para sync**:
- (Intro é assinatura — sem sync)

**Notas para o Diretor**: Abertura desconfortável. Tagline declarativa
sem ornamento. Eyebrow pode ser "ENGENHARIA HONESTA" ou
"DEFINITION OF DONE". Logo respira. Sem pressão, sem urgência —
o silêncio reforça a tese.

---

## Beat 2 — Hook (5.5s)

**PT**: O que parece pronto na review **não é** o que está pronto na
produção.

**EN**: What looks done in review **isn't** what's done in production.

**Palavras-chave para sync**:
- parece pronto / looks done (lado A)
- está pronto / actually done (lado B)

**Notas para o Diretor**: O scroll-stopper. Frase declarativa, sem
exclamação. Visualmente é o contraste binário entre dois "prontos"
diferentes. **Reservado pra metáfora `dualidade-split-screen`** —
que agora é full-bleed no archetype redesenhado: lado dark ("parece
pronto") + lado light ("está pronto"), com símbolo `≠` central.

A frase é dita CALMA. O choque está no `≠`, não na voz.

---

## Beat 3 — Bullets (13s)

**PT**:
"Pronto" pra quem só vê a review:

- A feature funciona

"Pronto" pra quem responde por produção:

- Tratamento de erro completo
- Performance sob carga real
- Segurança contra payload malicioso
- Observabilidade pra debugar
- Testes de borda
- Migração sem perda
- Rollback em caso de problema

**EN**:
"Done" for who sees only the review:

- The feature works

"Done" for who owns production:

- Complete error handling
- Performance under real load
- Security against malicious payloads
- Observability for debugging
- Edge case tests
- Migration without data loss
- Rollback when things break

**Palavras-chave para sync**:
- (Lista — sem sync palavra-imagem; cada item é entrada estaturada
  no archetype)

**Notas para o Diretor**: A cena densa. **Visualmente: descascamento
progressivo** — começa com 1 item ("a feature funciona") visível,
DEPOIS revelam-se as 7 camadas que o cliente não vê. Metáfora ideal
do catálogo: `camadas-de-cebola` (descascamento sequencial — perfeito
porque a tese AQUI é justamente "tem mais camada que você imagina") OU
`vista-explodida` (componentes separando do todo).

Iceberg está descartado (cliente-ve-time-entrega já usou). Ambos
camadas-de-cebola e vista-explodida são NOVOS no projeto — o Diretor
escolhe e propõe archetype novo via Notes.

A desproporção 1 item visível vs 7 invisíveis É o argumento. Sem
narrar todos os 7 — a narração diz "tratamento de erro completo,
performance, segurança... pra debugar, testar, migrar, voltar atrás" e
deixa os 7 itens entrarem na tela em stagger.

---

## Beat 4 — Stat (5.5s)

**PT**: 70% do trabalho que sustenta o software acontece **depois**
da feature funcionar.

**EN**: 70% of the work that sustains software happens **after** the
feature works.

**Palavras-chave para sync**:
- 70%
- depois / after

**Notas para o Diretor**: Stat sobre o trabalho INVISÍVEL. Os 70%
é uma estimativa intuitiva (não auditada) — declarado explicitamente
em source line. A palavra "depois" é o pivot — o trabalho começa
quando a maioria das pessoas acha que terminou.

NÃO usar donut (cliente-ve já usou). NÃO usar comparison-bars (time-
220 já usou). NÃO usar metric-grid (pergunta-errada + how-we-apply
usaram). Variar — sugiro `big-stat typographic` (variante usada SÓ
no luby-demo legacy; sem aparição em vídeos reais novos). Número
grande, sem decoração comparativa, ancorado pela source line.

---

## Beat 5 — CTA (3s)

**PT**: Veja como definimos "pronto".

luby.co/definition-of-done

**EN**: See how we define "done."

luby.co/definition-of-done

**Palavras-chave para sync**:
- (CTA usa logo-with-bloom premium)

**Notas para o Diretor**: Closing-card sereno. Headline curta,
declarativa. URL mono. Sem pressão. A serenidade É a tese —
quem reconheceu o problema já sabe o que fazer.

Em personal mode (variante), o closing-card renderiza sem logo Luby
(comportamento já implementado). Headline + URL ficam.

---

## Observações gerais

- **Tom calibrado**: cumplicidade, não superioridade. "A definição
  de pronto MENTE" diz uma verdade que o CTO já viveu — não é
  acusação. A diferença entre "vocês não sabem" e "todos passamos
  por isso" é o tom inteiro deste vídeo.
- **A palavra "pronto" entre aspas é deliberada** em todo o roteiro.
  Marca que estamos questionando a definição corrente, não a
  qualidade do trabalho.
- **A lista de 7 itens no Bullets é grande** — fica DENSA por design.
  Não comprimir pra 4. A densidade É o argumento ("olha quanta
  coisa NÃO aparece").
- **70% é estimativa** (source line obrigatória). Se o Revisor
  desconfiar, o número pode virar "A maior parte" sem perder
  impacto.
- **Tradução EN**: "done" funciona perfeitamente como anchor (mesma
  carga de "pronto"). "Production-ready" também caberia mas é mais
  jargão técnico — preferi "done" pra paralelismo com PT. Aspas
  mantidas em ambos os idiomas.

## Mensagens descartadas
- "220+ engenheiros e 1.350 projetos garantem essa profundidade" —
  vira outro vídeo (formato milestone). Aqui apareceria como
  brochura.
- "Fortune 500 confia nessa profundidade" — pode aparecer
  implicitamente no Bullets (sub-caption opcional) mas não vira beat.
- "Lista de coisas pra checar antes de aprovar" — é a tentação fácil
  pra esse tema. O Diretor deve RESISTIR a virar tutorial.
