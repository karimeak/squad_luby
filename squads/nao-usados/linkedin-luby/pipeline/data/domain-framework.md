# Domain Framework — LinkedIn Content Production B2B Tech

## Core Operational Framework

### Phase 1: News Discovery & Ranking
1. Varrer Tier 1 sources (TechCrunch, VentureBeat, HN, ProductHunt) — extrair 10-15 histórias candidatas
2. Varrer Tier 2 sources conforme disponibilidade e relevância
3. Filtrar por critérios de relevância B2B enterprise + Luby
4. Ranquear por: urgência × relevância × ângulo potencial × dados disponíveis
5. Selecionar top 5 histórias e apresentar com: título, fonte, data, resumo, por que importa para Luby

### Phase 2: Angle Generation
1. Selecionar a única história escolhida pelo usuário
2. Mapear o fato central e seus desdobramentos para o mercado B2B
3. Gerar 5 ângulos distintos — cada um com driver emocional diferente:
   - 🔴 Alerta/Medo: urgência e risco de não agir
   - 🟢 Oportunidade: janela de vantagem competitiva
   - 📚 Educacional: desmistificar e explicar profundamente
   - ↔️ Contrário: questionar o consenso com dados
   - ⭐ Inspiracional: visão de futuro positivo
4. Para cada ângulo: fornecer hook sugerido (primeira linha do post)
5. Apresentar 5 ângulos com hooks e aguardar seleção

### Phase 3: Content Creation — LinkedIn Post
1. Diagnóstico pré-escrita: nível de consciência da audiência + driver psicológico dominante
2. Gerar 3 opções de hook usando estruturas diferentes (contrário, dado, pergunta, história)
3. Aguardar confirmação do hook antes de escrever o corpo
4. Escrever corpo: história/contexto (2-3 parágrafos curtos) → insights (3-5 bullets) → CTA
5. Verificar: 210 chars para fold, sem links no corpo, 3-5 hashtags no final, < 3.000 chars total

### Phase 4: Content Creation — LinkedIn Carousel
1. Estruturar 10-15 slides baseados no ângulo e insights do post
2. Slide 1: Hook slide — bold statement ou pergunta provocativa (mesma energia do hook do post)
3. Slides 2-12: Um conceito por slide, máximo 25 palavras por slide
4. Slide final: CTA claro (comentar, seguir, salvar)
5. Descrever design visual: paleta Luby, tipografia limpa, ícones simples

### Phase 5: Content Creation — LinkedIn Article
1. Headline SEO-first: keyword principal nos primeiros 70 chars, criar curiosidade
2. Introdução (150-250 palavras): problema → relevância → preview do que o leitor vai ganhar
3. 3-5 seções de 250-400 palavras cada, com H2 por seção
4. Cada seção: narrative + dado/exemplo + takeaway acionável
5. Conclusão (100-200 palavras): síntese + único insight memorável
6. CTA: uma pergunta ou convite à discussão

### Phase 6: Optimization Pass
1. Verificar hook: passa no scroll-stop test?
2. Cortar 15-25% do conteúdo sem perder substância
3. Anti-commodity check: o conteúdo poderia ter sido escrito por qualquer empresa?
4. Garantir tom Luby (técnico-humano, não corporativo)
5. Verificar especificidade: dados e exemplos concretos em vez de afirmações vagas

### Phase 7: Quality Review
1. Aplicar scoring (1-10) em todos os critérios definidos em quality-criteria.md
2. Verificar hard rejection triggers (score < 4 em qualquer critério)
3. Calcular média: ≥7.0 = APPROVE, <7.0 = REJECT
4. Escrever feedback acionável com localização exata dos problemas
5. Se REJECT: retornar ao criador com required changes claramente definidos

## Decision Criteria

- **Post vs Carrossel como principal**: Carrossel quando o tema tem 5+ insights estruturáveis; post quando é narrativa/história
- **Ângulo contrário vs educacional**: Contrário quando o consenso é fraco ou baseado em hype; educacional quando a audiência está aprendendo algo genuinamente novo
- **Artigo vs post longo**: Artigo quando o tema merece profundidade evergreen para SEO; post quando é time-sensitive
- **Usar dado interno vs externo**: Priorizar dados da Luby (casos, métricas) quando disponíveis; usar dados de mercado como contexto
- **Rejeitar vs aprovar condicionalmente**: Rejeitar se hook não passa scroll-stop test OU se qualquer score < 4; aprovação condicional se ≥7 média mas com ajuste menor necessário

## Platform-Specific Rules

### LinkedIn Post
- Máximo 3.000 caracteres; hook visível em 210 chars
- Sem links no corpo; "link nos comentários" se necessário
- 3-5 hashtags na última linha
- Parágrafo máximo de 2 frases; linha em branco entre parágrafos
- Pergunta genuine no final (não retórica)

### LinkedIn Carousel
- Upload como PDF; 10-15 slides (máximo alcance)
- 1 ideia por slide; 20-30 palavras máximo
- Slide 1 = hook; último slide = CTA
- Fontes grandes, design limpo, mínimo de clutter

### LinkedIn Article
- 1.500-2.000 palavras; < 1.000 parece thin content
- Headline: 60-100 chars ótimo, máximo 220
- H2 por seção; H3 para sub-pontos
- Parágrafos de 2-4 frases máximo
