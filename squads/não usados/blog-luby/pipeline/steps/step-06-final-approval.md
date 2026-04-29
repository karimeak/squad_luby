---
type: checkpoint
outputFile: squads/blog-luby/output/final-post.md
---

# Aprovação Final — Post + Imagem

Revisão técnica concluída e imagem selecionada. Apresente ao usuário o pacote completo:

## O que apresentar

1. **Imagem selecionada** — ler `output/image-selection.md` e exibir:
   - URL da imagem (preview clicável): `{image_url}`
   - Fotógrafo: {photographer_name} — {photographer_profile_url}
   - Justificativa da escolha pela Iris

2. **Preview do post** — exibir o conteúdo textual limpo (sem tags HTML) do `output/post-with-image.md`, incluindo o indicador de onde a imagem será inserida:
   ```
   [📸 IMAGEM: {alt_text} — Foto por {photographer_name}]
   {H1}
   {intro}
   ...
   ```

3. **Resultado da revisão técnica** — score e principais pontos do `output/tech-review.md`

4. **Resumo do pacote**:
   - Título: {title}
   - Canal: {publisher.channel}
   - Publisher: {publisher.name}
   - Idioma: {publisher.language}
   - Palavras: {word_count} / {max_words}
   - Score técnico: {score}/100
   - Imagem: {photographer_name} via Unsplash ✓

## Perguntar via AskUserQuestion

- **"Aprovar e publicar no Supabase"** — salva o HTML completo (com imagem) na tabela articles
- **"Ajustar o texto"** — descreva as mudanças no campo "Other"; volta para a Lara reescrever
- **"Trocar a imagem"** — volta para a Iris buscar uma imagem diferente
- **"Cancelar"** — encerra o pipeline sem salvar

## Se aprovado

- Copiar o conteúdo de `output/post-with-image.md` para `output/final-post.md`
- Prosseguir para step-07-publish (Bia salva no Supabase)

## Se ajustar texto (on_reject)

- Salvar feedback em `output/final-post.md` com a nota `REJEITADO: {feedback}`
- Retornar ao step-03-write com as instruções

## Se trocar imagem

- Retornar ao step-05-image-search (Iris busca uma nova imagem)
