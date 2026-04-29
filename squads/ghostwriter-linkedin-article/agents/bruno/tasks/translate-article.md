---
task: "Translate Article EN to PT-BR"
order: 2
input: |
  - article_en: {name}/article-en.md
  - collaborator: dados do collaborator (voice_markers_pt, tone_pt, audience_pt)
output: |
  - article_pt: {name}/article-pt.md
---

# Translate Article EN to PT-BR

Traduz o artigo EN-US para PT-BR com adaptação cultural completa. Não é tradução literal — é reescrita no mesmo tom, com referências e construções brasileiras naturais.

## Process

1. **Ler article-en.md** na íntegra.

2. **Carregar context PT-BR** do collaborator: voice_markers_pt, tone_pt, audience_pt.

3. **Traduzir headline**: Adaptar para PT-BR — manter keyword e estrutura mas garantir que soe natural em português. Testar: "Um profissional brasileiro clicaria nesse título?"

4. **Traduzir introdução**: Adaptar o hook para ressoar com contexto brasileiro. Manter a estrutura (hook + problema + preview) mas adaptar exemplos se necessário.

5. **Traduzir cada seção**:
   - Trocar voice markers EN pelos equivalentes PT do perfil
   - Adaptar referências culturais:
     - SEC → CVM / BACEN
     - USD → BRL / R$
     - NYSE/NASDAQ → B3
     - FDIC → FGC
     - GAAP → IFRS (BR)
     - SOC2 → LGPD / ISO 27001
     - NYC/SF → SP/RJ quando relevante
   - Adaptar exemplos de empresas: se só mencionar empresas US, adicionar equivalente BR quando existir
   - Manter fontes entre parênteses — traduzir nome da fonte se necessário mas manter URL
   - Manter takeaways — traduzir com naturalidade

6. **Traduzir conclusão**: Manter o insight síntese mas garantir construção natural em PT-BR.

7. **Adaptar CTA**: Não traduzir a pergunta — reescrever para o contexto e audiência brasileira. O tom de uma pergunta profissional muda entre EN e PT-BR.

8. **Verificação final**:
   - [ ] Voice markers EN trocados para versão PT?
   - [ ] Referências culturais brasileiras onde aplicável?
   - [ ] Tom natural em PT-BR (não soa como tradução)?
   - [ ] CTA adaptada (não traduzida)?
   - [ ] Fontes mantidas com URLs?
   - [ ] Word count PT-BR: 1.400-1.900 words? (PT-BR tende a ser ~5% mais longo)

## Output Format

Mesmo formato do artigo EN, mas em PT-BR:

```markdown
# {Headline PT-BR — 60-110 chars}

{Introdução em PT-BR — 150-260 words}

---

## {Subheading PT-BR}

{Corpo em PT-BR}

**Takeaway:** {em PT-BR}

---

(repetir para todas as seções)

---

## {Conclusão}

{Insight síntese em PT-BR}

---

**{CTA adaptada para audiência brasileira}**

---
*Contagem de palavras: {N} words | Idioma: PT-BR*
```

## Quality Criteria

- [ ] Word count 1.400-1.900 words
- [ ] Voice markers PT presentes e distribuídos
- [ ] Referências culturais brasileiras aplicadas onde relevante
- [ ] CTA adaptada (não traduzida literalmente)
- [ ] Tom natural em PT-BR — passa no teste "soa como o colaborador escrevendo em português?"
- [ ] Fontes mantidas com URLs

## Veto Conditions

Reject and redo if ANY are true:
1. Artigo PT-BR é tradução palavra por palavra — soa artificial, não passa no teste de autenticidade
2. Referências puramente americanas em contexto onde equivalente brasileiro existe e é mais relevante
