---
task: generate-angles
order: 1
agent: lucio
input: squads/linkedin-luby/output/selected-story.md
output: 5 ângulos distintos com hooks sugeridos para aprovação do usuário
---

## Process

1. Ler `squads/linkedin-luby/output/selected-story.md` — extrair: fato central, dados disponíveis, impacto para B2B
2. Identificar o "ponto de virada" da história: o que muda com essa informação para o mercado enterprise?
3. Mapear conexão com a Luby: como a expertise de 23 anos e 300+ engenheiros da Luby torna essa história ainda mais relevante?
4. Gerar 5 ângulos distintos, um por driver emocional:
   - 🔴 Alerta: urgência e risco de não agir — driver: medo de perder/ficar para trás
   - 🟢 Oportunidade: janela de vantagem antes do mercado perceber — driver: desejo de ganho
   - 📚 Educacional: explicar o que realmente importa — driver: curiosidade e desejo de saber mais
   - ↔️ Contrário: questionar o consenso com dados — driver: ceticismo + credibilidade
   - ⭐ Inspiracional: visão de futuro positivo e concreto — driver: ambição e achievement
5. Para cada ângulo: fornecer hook sugerido (≤ 210 chars) + rationale de 1 linha

## Output Format

```markdown
# Ângulos Gerados — {título da história selecionada}

**Notícia base:** {título} ({fonte}, {data})
**Fato central:** {1-2 frases sobre o que aconteceu}
**Conexão Luby:** {como isso se conecta ao negócio/expertise da Luby}

---

## Ângulo 1 🔴 Alerta
**Hook sugerido:**
"{texto do hook — máximo 210 chars}"
**Rationale:** {driver emocional + por que vai funcionar com a audiência da Luby}

## Ângulo 2 🟢 Oportunidade
[mesmo formato]

## Ângulo 3 📚 Educacional
[mesmo formato]

## Ângulo 4 ↔️ Contrário
[mesmo formato]

## Ângulo 5 ⭐ Inspiracional
[mesmo formato]
```

## Output Example

```markdown
# Ângulos Gerados — GPT-5 com coding autônomo (85% acurácia)

**Notícia base:** OpenAI lança GPT-5 com capacidade de coding autônomo (VentureBeat, 2026-03-25)
**Fato central:** GPT-5 atingiu 85% de acurácia no HumanEval. Primeiros contratos enterprise com Goldman Sachs e Microsoft anunciados.
**Conexão Luby:** A Luby integra IA em times de engenharia há 2 anos em projetos enterprise. Sabemos o que funciona e o que ainda falha na prática.

---

## Ângulo 1 🔴 Alerta
**Hook sugerido:**
"Em 12 meses, a pergunta não será 'contratar dev ou não'.
Será 'quantos devs gerenciam quantos agentes?'"
**Rationale:** Urgência imediata + identidade ameaçada. Faz o CTO parar e pensar no impacto no time dele agora.

## Ângulo 2 🟢 Oportunidade
**Hook sugerido:**
"GPT-5 programa com 85% de acurácia.
Isso não substitui seu time. Multiplica ele — se você souber como."
**Rationale:** Reframe positivo da mesma notícia. Driver: desejo de vantagem antes que todo mundo descubra.

## Ângulo 3 📚 Educacional
**Hook sugerido:**
"Integramos GPT-5 em 3 projetos enterprise no último mês.
O que funciona (e o que ainda falha muito)."
**Rationale:** Perspectiva de quem testou, não de quem especula. Posiciona a Luby como insider.

## Ângulo 4 ↔️ Contrário
**Hook sugerido:**
"Todo mundo fala que GPT-5 vai substituir devs.
Os dados dizem que o problema é completamente diferente."
**Rationale:** Questiona o consenso que domina o feed do LinkedIn agora. Obriga leitura para resolver a tensão.

## Ângulo 5 ⭐ Inspiracional
**Hook sugerido:**
"Imagine seu time de 10 devs com 50 agentes trabalhando em paralelo.
Isso já é possível. Veja como os melhores times estão fazendo."
**Rationale:** Visão de futuro concreta e alcançável. Driver: ambição e desejo de achievement.
```

## Quality Criteria

- [ ] Exatamente 5 ângulos gerados, um por driver emocional listado
- [ ] Cada hook tem ≤ 210 chars
- [ ] Cada ângulo tem rationale com driver emocional identificado
- [ ] Hooks usam estruturas distintas (contrário, dado, pergunta, história, visão)
- [ ] "Conexão Luby" presente e específica (não genérica)

## Veto Conditions

- Dois ângulos com o mesmo driver emocional → reescrever o mais fraco
- Hook com mais de 210 chars → encurtar antes de apresentar
