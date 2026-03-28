---
type: agent
agent: maise
execution: inline
model_tier: powerful
format: copywriting
inputFile: squads/landing-page-luby/output/lp-structure.md
---

# Criação do Copy

A Maise Copy escreve o copy completo da landing page baseado na estrutura aprovada,
em seguida aplica o Copy Stress Test e otimiza para conversão.

**Input:** `squads/landing-page-luby/output/lp-structure.md` (wireframe + headline aprovada)
**Tasks:** write-copy.md → optimize-copy.md
**Output:** `squads/landing-page-luby/output/{run_id}/landing-page.md`

**O que a Maise entrega:**
- Copy completo de cada seção da landing page
- Hero: headline aprovada + subtítulo + CTA + social proof strip
- Problem statement com linguagem espelho
- Solução/mecanismo com O COMO em passos concretos
- Prova social com dado quantitativo + depoimento específico
- Benefícios por stakeholder
- Objeção principal nomeada e respondida com prova
- CTA final com headline de fechamento + microcopy + botão

**Após escrita:** Copy stress test + corte de 15-25% + anti-commodity check
**Log de otimização** incluído no arquivo final.

## Veto Conditions

- Hero começa com o nome da empresa, "Somos" ou "A Luby é"
- CTA principal é "Saiba mais", "Clique aqui" ou variante genérica
- Nenhuma prova social com dado quantitativo ou depoimento nomeado
- Objeção principal ignorada completamente
- Corte de copy < 10% (otimização não realizada)
