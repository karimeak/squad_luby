---
type: agent
agent: lara
execution: inline
model_tier: powerful
format: blog-post
---

# Redação do Blog Post em HTML — {title}

A Lara Redatora vai criar o HTML completo do post para o blog **{publisher.channel}**, na voz de **{publisher.name}**, em **{publisher.language}**.

**Input:** `squads/blog-luby/output/article-brief.md` + `squads/blog-luby/output/research-brief.md`
**Output:** `squads/blog-luby/output/post-draft.md`

## Instruções para a Lara

1. Ler `squads/blog-luby/output/article-brief.md` — extrair: title, instructions, max_words, publisher (channel, name, language, flavor, url)
2. Ler `squads/blog-luby/output/research-brief.md` — absorver dados, fontes e ângulos disponíveis
3. Escrever o HTML conforme o Operational Framework do agente
4. Salvar em `squads/blog-luby/output/post-draft.md` no formato:

```markdown
# Post Draft — {title}

**Publisher:** {publisher.name} ({publisher.channel})
**Idioma:** {publisher.language}
**Flavor:** {publisher.flavor}
**Word Count:** {contagem}
**Max Words:** {max_words}

## HTML

\`\`\`html
{HTML completo do post}
\`\`\`

## Notas Editoriais

- Ângulo escolhido: {ângulo do research-brief}
- Tom aplicado: {como o flavor foi interpretado}
- Fontes usadas: {N fontes do research-brief}
```

## Diretrizes

- O HTML deve seguir a estrutura `<article>` com H1, H2s, parágrafos semânticos
- Todas as fontes citadas devem ter link original inline
- Idioma: exatamente o idioma do publisher (sem mistura)
- Respeitar max_words (tolerância: ±10%)
- Se o campo `instructions` do artigo tiver diretrizes específicas, seguir à risca

## Veto Conditions

- Post sem H1 → reescrever
- Post em idioma errado → reescrever
- Post excede max_words em > 20% → encurtar
- Dados não presentes no research-brief usados no texto → remover ou substituir
