---
task: optimize-linkedin
order: 5
agent: lucio
input: Post + carrossel + artigo criados
output: Versões finais otimizadas dos 3 formatos
---

## Process

1. **Otimizar o post**:
   - Cortar 15-25% das palavras sem perder substância (eliminar filler, não substância)
   - Verificar hook: passa no scroll-stop test? Se não, reescrever antes de continuar
   - Verificar: ≤ 210 chars no hook | zero links no corpo | 3-5 hashtags | ≤ 3.000 chars total
   - Anti-commodity check: esse post poderia ser publicado pela Accenture sem mudança? → se sim, inserir perspectiva Luby inconfundível

2. **Otimizar o carrossel**:
   - Contar palavras por slide — se qualquer slide tem > 25 palavras, encurtar
   - Verificar progressão: os slides constroem um argumento? Ou são lista desconectada?
   - Verificar Slide 1 (hook forte) e Slide final (CTA específico)
   - Ajustar descrições de design se necessário para garantir layout limpo

3. **Otimizar o artigo**:
   - Verificar headline: keyword nos primeiros 70 chars? Gera curiosidade sem clickbait?
   - Verificar parágrafos: algum tem > 4 frases? Quebrar
   - Verificar takeaways: são todos genuinamente acionáveis? Generalidades → reescrever
   - Contar palavras: 1.500-2.000? Expandir se < 1.200 | cortar se > 2.200

4. **Anti-commodity check final** (todos os 3 formatos):
   - O conteúdo tem perspectiva Luby inconfundível? (23 anos, 300+ engenheiros, B2B enterprise global)
   - Alguma afirmação genérica que qualquer empresa tech poderia fazer? → substituir por dado ou perspectiva específica

5. **Salvar versões finais** em `squads/linkedin-luby/output/{run_id}/`:
   - `linkedin-post.md`
   - `carousel.md`
   - `article.md`

## Output Format

Nenhum formato especial — salvar os 3 arquivos com o conteúdo final otimizado.
Adicionar ao início de cada arquivo:

```markdown
---
format: linkedin-post | carousel | article
squad: linkedin-luby
run_id: {run_id}
angle: {ângulo selecionado}
story: {título da notícia base}
created: {data}
status: ready-for-review
---
```

## Output Example

Arquivo `linkedin-post.md` após otimização:

```markdown
---
format: linkedin-post
squad: linkedin-luby
run_id: 2026-03-26-143022
angle: Contrário — questionar consenso com dados
story: OpenAI lança GPT-5 com coding autônomo (85% acurácia)
created: 2026-03-26
status: ready-for-review
---

=== HOOK ===
Todo mundo fala que GPT-5 vai substituir devs.

Os dados dizem que o problema é diferente.

=== BODY ===
[conteúdo otimizado]
...
```

## Quality Criteria

- [ ] Post cortado em 15-25% em relação à versão original
- [ ] Post: hook ≤ 210 chars, zero links no corpo, 3-5 hashtags, ≤ 3.000 chars
- [ ] Carrossel: todos os slides ≤ 25 palavras, progressão lógica verificada
- [ ] Artigo: 1.500-2.000 palavras, todos os parágrafos ≤ 4 frases
- [ ] Anti-commodity check passou (perspectiva Luby inconfundível nos 3 formatos)
- [ ] Frontmatter adicionado nos 3 arquivos com status: ready-for-review

## Veto Conditions

- Anti-commodity check falhou → reescrever seção problemática antes de finalizar
- Post com hook > 210 chars após otimização → encurtar até conformidade
