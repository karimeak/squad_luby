# Task: Otimização do Copy

## Descrição
Aplicar o Copy Stress Test e otimizar o copy completo da landing page:
cortar filler, fortalecer provas fracas, verificar ritmo e fazer o
anti-commodity check final.

## Input
Copy completo gerado em write-copy.md (na mesma execução)

## Processo

1. **Copy Stress Test** — verificar cada seção:

   Para cada seção, responder internamente:
   - Um CTO sofisticado e cético acreditaria neste claim?
   - Há prova concreta por trás de toda afirmação significativa?
   - A promessa está calibrada para o nível de consciência?
   - Há fricção ou confusão no fluxo entre seções?
   - Alguma frase pode ser cortada sem perder substância?

2. **Cortar 15-25% do copy** sem perder substância:
   - Eliminar filler ("Para que você possa", "É importante saber que", "Neste sentido")
   - Eliminar redundâncias (não dizer a mesma coisa de formas diferentes)
   - Encurtar frases longas: se tem mais de 20 palavras, pode ser cortada
   - Regra: cada linha deve ganhar seu lugar. Se não faz o visitante avançar, fora.

3. **Scroll-stop test** na headline:
   - Se estivesse rolando a tela a 3x a velocidade normal, a headline pararia o scroll?
   - Se não, reescrever até passar no teste

4. **Anti-commodity check**:
   - Este copy poderia ser publicado pela Accenture, Totvs ou Stefanini sem mudança?
   - Se sim: identificar os elementos genéricos e substituir por perspectiva específica da Luby
   - Elementos que tornam copy específico: dados reais, processo nomeado, setor de atuação,
     anos de experiência com evidência, nome de clientes reais

5. **Verificar ritmo mobile**:
   - Nenhum parágrafo > 3 linhas em tela de celular
   - Quebrar blocos densos em unidades menores
   - Alternar: parágrafo curto → parágrafo mais longo → frase solo de impacto

6. **Verificar vocabulário proibido**:
   - Sem: "solução completa", "end-to-end", "parceiro estratégico", "qualidade superior",
     "inovação" solto, "referência no mercado", "melhor do mercado"
   - Se encontrado: substituir por dado ou processo específico

7. **Verificar CTA**:
   - Botão principal: verbo de ação + benefício específico (≤ 5 palavras)
   - Microcopy: reduz pelo menos 2 objeções de fricção
   - Regra: "Saiba mais" e variantes são proibidos

## Output Format

Entregar o copy otimizado completo no mesmo formato de write-copy.md, com as alterações aplicadas.

Incluir ao final:

```markdown
---
## Log de Otimização

**Corte:** [X%] de words removidas
**Stress test:** [Passou / Itens ajustados: lista]
**Anti-commodity:** [Passou / Elementos atualizados: lista]
**Ritmo mobile:** [Aprovado / Ajustes realizados]
**Vocabulário proibido encontrado:** [Nenhum / Lista de substituições]
```

## Critérios de Qualidade

- [ ] 15-25% do copy cortado (documentado no log)
- [ ] Scroll-stop test da headline aprovado
- [ ] Anti-commodity check passou (copy não pode ser usado por concorrente sem mudança)
- [ ] Nenhum parágrafo > 3 linhas
- [ ] Nenhum vocabulário proibido presente
- [ ] CTA principal com verbo de ação, sem "Saiba mais"
- [ ] Output salvo em squads/landing-page-luby/output/{run_id}/landing-page.md

## Condições de Veto

- Copy cortado < 10% (otimização não realizada de fato)
- Anti-commodity check falhou (copy ainda genérico)
- Vocabulário proibido ainda presente após otimização
