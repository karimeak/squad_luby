---
type: checkpoint
---

# Step 08: 🛑 Aprovação — Qualidade do Enriquecimento IA?

Antes de promover os dados para o ouro, valide a qualidade da extração da Ana Analyst.

## Instructions

Read `squads/hunter-squad/output/analyst-samples.json` and display:

**Estatísticas de Enriquecimento:**
- Total enriquecidos: {update_stats.success}
- Falhas de extração: {update_stats.failed}
- Taxa de confiança alta: {high_confidence_rate}%

**Amostra de 3 Vagas Enriquecidas:**
For each of the 3 sample jobs, display:

---
🏢 **{title}** — {company} ({source})
🛠️ Skills: {ai_key_skills joined with ", "}
📊 Nível: {ai_experience_level} | 💰 {ai_salary_minvalue} {ai_salary_unittext}/null
🌐 Remote: {remote_derived} | 🏠 Domain: {domain_derived}
🎯 Confiança: {extraction_confidence}
---

**Opções:**
1. ✅ Qualidade aprovada — continuar para promote pipeline
2. 🔄 Ajustar prompt de extração e re-enriquecer (rerun Step 07)
3. ❌ Cancelar pipeline (dados já inseridos no bronze — serão enriquecidos na próxima run)

On option 1: proceed to Step 09
On option 2: display current extraction system prompt, allow user to modify, rerun Step 07, return to this checkpoint
On option 3: abort — note that bronze data is safe and will be enriched in the next scheduled run
