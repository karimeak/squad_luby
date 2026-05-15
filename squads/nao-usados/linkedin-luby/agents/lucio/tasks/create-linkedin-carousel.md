---
task: create-linkedin-carousel
order: 3
agent: lucio
input: Post criado em create-linkedin-post.md + selected-angle.md
output: Roteiro completo de carrossel em squads/linkedin-luby/output/{run_id}/carousel.md
---

## Process

1. Ler o post criado e o ângulo selecionado — o carrossel expande os mesmos insights com formato visual
2. Definir estrutura de 10-15 slides:
   - Slide 1: Hook slide (1 frase provocativa ou dado impactante — mesma energia do hook do post)
   - Slides 2-N: Um conceito por slide, máximo 25 palavras, progressão lógica de argumento
   - Slide final: CTA específico (comentar, salvar, seguir)
3. Escrever o conteúdo de cada slide — texto conciso, imagem a ser descrita, nota de design
4. Descrever o layout visual para cada slide:
   - Paleta Luby: azul corporativo (#0066CC), branco (#FFFFFF), cinza escuro (#333333)
   - Tipografia: títulos grandes (>36pt), corpo médio (>24pt)
   - Layout: fundo limpo, ícone ou número de destaque, uma ideia por slide
5. Verificar contagem de palavras por slide (máximo 25) e progressão lógica

## Output Format

```markdown
# Roteiro de Carrossel — {título baseado no ângulo}

**Total de slides:** {N}
**Ângulo:** {ângulo selecionado}
**Paleta:** Luby blue (#0066CC), white (#FFFFFF), dark gray (#333333)

---

## Slide 1 — Hook
**Texto:**
{hook forte — 1-2 frases, máximo 20 palavras}
**Design:** {descrição do layout visual, elemento de destaque}

## Slide 2 — {subtítulo do conceito}
**Texto:**
{conteúdo — máximo 25 palavras}
**Design:** {ícone ou elemento visual sugerido}

[repetir para todos os slides]

## Slide {N} — CTA
**Texto:**
{chamada para ação específica}
**Design:** {logotipo Luby + ação clara}
```

## Output Example

```markdown
# Roteiro de Carrossel — IA não substitui devs: ela multiplica os bons

**Total de slides:** 12
**Ângulo:** Contrário — questionar o consenso com dados
**Paleta:** Luby blue (#0066CC), white (#FFFFFF), dark gray (#333333)

---

## Slide 1 — Hook
**Texto:**
IA vai substituir devs?

Não. Mas vai tornar os bons 3x mais produtivos.
**Design:** Fundo azul Luby. Texto branco grande. Ícone de robô + seta para cima.

## Slide 2 — O mito
**Texto:**
O que o feed do LinkedIn diz:
"GPT-5 vai substituir programadores"
**Design:** Fundo branco. Ícone de notificação/feed. Texto em cinza médio.

## Slide 3 — A realidade
**Texto:**
O que 300+ engenheiros em projetos enterprise mostram:
O gargalo é processo, não quantidade de devs.
**Design:** Fundo azul Luby. Número "300+" em destaque. Texto branco.

## Slide 4 — Problema real
**Texto:**
As empresas não estão cortando times.
Estão sem saber como integrar IA nos times que têm.
**Design:** Fundo branco. Ícone de engrenagem com ponto de interrogação.

## Slide 5 — O que os times que acertam fazem (1/5)
**Texto:**
1. Definem quais tarefas são para IA
e quais são para o engenheiro.
**Design:** Número "1" grande em azul. Texto compacto.

## Slide 6 — (2/5)
**Texto:**
2. Treinam em prompt engineering
antes de dar acesso às ferramentas.
**Design:** Número "2" em azul. Ícone de livro/estudo.

## Slide 7 — (3/5)
**Texto:**
3. IA gera. Dev revisa.
Nunca o contrário.
**Design:** Fluxo simples: IA → revisão humana. Setas.

## Slide 8 — (4/5)
**Texto:**
4. Medem output real:
features entregues, bugs corrigidos.
Não "horas economizadas".
**Design:** Ícone de gráfico de barras. Número "4" em azul.

## Slide 9 — (5/5)
**Texto:**
5. Começam com 1 agente em 1 fluxo.
Escalam depois — não antes.
**Design:** Escada ascendente simples. Número "5" em azul.

## Slide 10 — O resultado
**Texto:**
Dev que gerencia IA: 3x mais output.
Dev que não usa: 1x e perdendo terreno.
**Design:** Comparativo visual. Barra azul (3x) vs barra cinza (1x).

## Slide 11 — A questão real
**Texto:**
O problema não é IA vs dev.
É: sua empresa tem processo para integrar os dois?
**Design:** Fundo azul. Pergunta em branco. Destaque emocional.

## Slide 12 — CTA
**Texto:**
Sua empresa já integrou IA no time de engenharia?
Comente: o maior obstáculo que você encontrou.
**Design:** Logo Luby + CTA claro. Fundo branco limpo.
```

## Quality Criteria

- [ ] 10-15 slides (não abaixo de 10, não acima de 15)
- [ ] Slide 1 é um hook forte que convida o clique para próxima
- [ ] Máximo 25 palavras por slide (contar antes de finalizar)
- [ ] Slide final tem CTA específico e acionável
- [ ] Layout visual descrito para cada slide com paleta Luby
- [ ] Progressão lógica do argumento slide a slide

## Veto Conditions

- Qualquer slide com mais de 30 palavras → encurtar antes de continuar
- Slide final sem CTA → adicionar antes de finalizar
- Menos de 10 slides → expandir com conceitos adicionais do ângulo
