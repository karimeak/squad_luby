# Research Brief — AI-Driven Development

**Idioma:** EN
**Data:** 2026-03-30
**Perfil:** Marine (Strategy/Product)

---

## Key Findings

1. **The AI Productivity Paradox: 90% adoption, marginal organizational gains**
   Faros AI analyzed telemetry from 10,000+ developers across 1,255 teams. Teams with high AI adoption completed 21% more tasks and merged 98% more pull requests — but PR review time increased 91%, creating a critical human-approval bottleneck. At the organizational level (DORA metrics: deployment frequency, lead time, change fail rate, MTTR), there is no significant correlation between AI adoption and better outcomes.
   - Confidence: HIGH (corroborated by Faros AI report, 2025 DORA Report, and METR study)
   - Source: Faros AI — https://www.faros.ai/blog/ai-software-engineering
   - Source: 2025 DORA Report (Google Cloud) — https://dora.dev/research/2025/dora-report/
   - Source: InfoQ coverage of DORA — https://www.infoq.com/news/2026/03/ai-dora-report/

2. **METR RCT: Experienced developers are 19% slower with AI tools**
   A randomized controlled trial by METR studied 16 experienced open-source developers (repos averaging 22k+ stars, 1M+ lines of code). When allowed to use AI tools (primarily Cursor Pro with Claude 3.5/3.7 Sonnet), developers took 19% longer to complete issues. The perception gap is striking: developers expected a 24% speedup, and even after being slower, believed AI had sped them up by 20%.
   - Confidence: MEDIUM (single rigorous RCT, small sample size of 16, but peer-reviewed methodology)
   - Source: METR — https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
   - Source: arXiv paper — https://arxiv.org/abs/2507.09089

3. **Stack Overflow 2025: Developer trust in AI is at an all-time low**
   Despite 80% of developers using AI tools, only 29% trust AI output accuracy (down from 40% the prior year). 46% actively distrust it. The top frustration (cited by 45% of respondents): "AI solutions that are almost right, but not quite." 66% say they spend more time fixing near-correct AI code. Experienced developers have the lowest "highly trust" rate (2.6%) and the highest "highly distrust" rate (20%).
   - Confidence: HIGH (Stack Overflow's annual survey with massive developer sample, corroborated by multiple outlets)
   - Source: Stack Overflow 2025 Developer Survey — https://survey.stackoverflow.co/2025/ai
   - Source: Stack Overflow Blog — https://stackoverflow.blog/2025/12/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/

4. **AI is a "mirror and multiplier" of existing engineering maturity**
   The 2025 DORA Report's central finding: AI does not automatically improve software delivery performance. It amplifies whatever already exists — strengthening high-performing teams while exposing weaknesses in organizations with fragmented processes. Seven organizational capabilities magnify AI's positive impact, with Value Stream Management identified as the practice that converts individual AI productivity gains into organizational advantage. Only ~6% of organizations ("high performers" per McKinsey) have fundamentally redesigned workflows to capture AI's value.
   - Confidence: HIGH (DORA Report by Google, corroborated by McKinsey State of AI 2025)
   - Source: DORA Report 2025 — https://dora.dev/research/2025/dora-report/
   - Source: IT Revolution analysis — https://itrevolution.com/articles/ais-mirror-effect-how-the-2025-dora-report-reveals-your-organizations-true-capabilities/
   - Source: McKinsey State of AI 2025 — https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai

5. **Over 46% of code in repos is now AI-generated or AI-assisted**
   GitHub reports that Copilot now generates 46% of code written by developers (reaching 61% for Java). GitHub Copilot has 4.7M paid subscribers (Jan 2026), deployed at ~90% of Fortune 100 companies, with 75% YoY growth. Meanwhile, 41% of all code written in 2025 was AI-generated according to broader industry estimates, and this share continues climbing.
   - Confidence: MEDIUM (GitHub's own data — vendor source, but corroborated by independent code analysis platforms)
   - Source: GitHub Copilot Statistics — https://www.getpanto.ai/blog/github-copilot-statistics
   - Source: AI Coding Statistics — https://www.getpanto.ai/blog/ai-coding-assistant-statistics

6. **Security risk: AI-generated code introduces 322% more privilege escalation paths**
   Research shows AI-generated code introduced 322% more privilege escalation paths and 153% more design flaws compared to human-written code. Combined with the surge in AI-authored code volume, this represents a rapidly growing attack surface that most enterprises have not adequately addressed.
   - Confidence: MEDIUM (cited in Faros AI report and multiple secondary sources, but original research provenance needs verification)
   - Source: Faros AI Productivity Paradox Report — https://www.faros.ai/blog/ai-software-engineering
   - Source: Cerbos analysis — https://www.cerbos.dev/blog/productivity-paradox-of-ai-coding-assistants

7. **The "review bottleneck" is the hidden cost of AI-accelerated coding**
   As AI speeds up code generation, the downstream stages (code review, integration testing, deployment approval) become the constraint. PR review time increases 91% in high-AI-adoption teams. Engineers merged 27.2% more pull requests but experienced a 19.6% rise in out-of-hours commits — suggesting AI is not saving time but redistributing it, with quality assurance absorbing the extra load.
   - Confidence: HIGH (Faros AI telemetry data, corroborated by Scientific American reporting and DORA findings)
   - Source: Faros AI — https://www.faros.ai/blog/ai-software-engineering
   - Source: Scientific American — https://www.scientificamerican.com/article/why-developers-using-ai-are-working-longer-hours/

8. **Gartner projects 90% of enterprise software engineers using AI code assistants by 2028**
   Updated from an earlier 75% prediction (April 2024), Gartner now projects 90% enterprise adoption by 2028, up from <14% in early 2024. The AI code assistant market was estimated at $3.0-3.5B in 2025, projected to reach $14.6B by 2033. 78% of Fortune 500 companies already have some form of AI-assisted development in production.
   - Confidence: HIGH (Gartner primary source, corroborated by market data)
   - Source: Gartner — https://www.gartner.com/en/newsroom/press-releases/2024-04-11-gartner-says-75-percent-of-enterprise-software-engineers-will-use-ai-code-assistants-by-2028
   - Source: Fortune 500 data — https://blog.exceeds.ai/ai-coding-tools-adoption-rates/

---

## Trending Angles

- **Contrarian**: "AI-driven development is making your best engineers slower" — The METR study showed experienced developers take 19% longer with AI tools, yet believe they're 24% faster. This perception gap is the real danger for enterprises investing millions in AI tooling without measuring actual outcomes. Marine can challenge the "AI = instant productivity" narrative that vendors push, positioning Luby as a consultancy that understands the nuance.
  - Evidence: METR RCT (arxiv.org/abs/2507.09089), Stack Overflow trust decline to 29%

- **Data-driven**: "The 91% review bottleneck: Why AI writes code faster but your team ships slower" — The Faros AI data showing 98% more PRs but 91% longer review times is a perfect enterprise story. The bottleneck has shifted from writing to reviewing. Marine can frame this as a systems-thinking problem: AI-driven development demands redesigning the entire delivery pipeline, not just the coding phase.
  - Strongest stat: 21% more tasks completed, 98% more PRs merged, but 91% longer review time and 19.6% more out-of-hours work (Faros AI, 10,000+ developers)

- **Personal story / Enterprise advisory**: "AI is a mirror, not a magic wand — what the DORA Report means for your engineering org" — The DORA "mirror and multiplier" finding is perfect for Marine's Strategy/Product role. Only ~6% of companies have redesigned workflows to capture AI's value. Marine can share how Luby approaches AI-driven development as an organizational transformation, not just a tool rollout — connecting to Luby's 23+ years of enterprise software consulting.
  - Evidence: 2025 DORA Report, McKinsey (6% high performers)

- **List**: "5 things enterprise leaders get wrong about AI-driven development" — (1) Assuming AI = automatic productivity, (2) Ignoring the review bottleneck, (3) Not measuring actual vs. perceived speed, (4) Treating it as a tool problem instead of a workflow problem, (5) Overlooking the security implications of 322% more privilege escalation paths. Each point is backed by the data above.
  - Evidence: All sources combined

- **Pattern interrupt**: "66% of developers now spend more time fixing AI code than writing it" — This counterintuitive stat from Stack Overflow (66% say they spend more time fixing "almost-right" AI code) flips the productivity narrative entirely. Opens the door to discussing why enterprises need expert human oversight, mature DevOps practices, and experienced partners — exactly what a consultancy like Luby provides.
  - Evidence: Stack Overflow 2025, Faros AI report

---

## Sources

| # | Source | URL | Date | Relevance |
|---|--------|-----|------|-----------|
| 1 | METR — AI Developer Productivity RCT | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ | Jul 2025 | 10/10 |
| 2 | 2025 DORA State of AI-Assisted Software Development (Google) | https://dora.dev/research/2025/dora-report/ | Dec 2025 | 10/10 |
| 3 | Stack Overflow 2025 Developer Survey — AI Section | https://survey.stackoverflow.co/2025/ai | Dec 2025 | 9/10 |
| 4 | Faros AI — The AI Productivity Paradox Report | https://www.faros.ai/blog/ai-software-engineering | 2025 | 9/10 |
| 5 | InfoQ — AI Amplifying Performance, DORA Report | https://www.infoq.com/news/2026/03/ai-dora-report/ | Mar 2026 | 8/10 |
| 6 | McKinsey — State of AI 2025 | https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai | 2025 | 8/10 |
| 7 | McKinsey — Unleashing Developer Productivity with GenAI | https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/unleashing-developer-productivity-with-generative-ai | 2024-2025 | 7/10 |
| 8 | Stack Overflow Blog — Developers Willing but Reluctant | https://stackoverflow.blog/2025/12/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/ | Dec 2025 | 8/10 |
| 9 | Scientific American — Developers Using AI Working Longer Hours | https://www.scientificamerican.com/article/why-developers-using-ai-are-working-longer-hours/ | 2025 | 7/10 |
| 10 | Gartner — 75% (now 90%) Enterprise Engineers Using AI by 2028 | https://www.gartner.com/en/newsroom/press-releases/2024-04-11-gartner-says-75-percent-of-enterprise-software-engineers-will-use-ai-code-assistants-by-2028 | Apr 2024 | 7/10 |
| 11 | IT Revolution — AI's Mirror Effect (DORA Analysis) | https://itrevolution.com/articles/ais-mirror-effect-how-the-2025-dora-report-reveals-your-organizations-true-capabilities/ | 2025 | 7/10 |
| 12 | Cerbos — Productivity Paradox of AI Coding Assistants | https://www.cerbos.dev/blog/productivity-paradox-of-ai-coding-assistants | 2025 | 6/10 |
| 13 | GitHub Copilot Statistics 2026 | https://www.getpanto.ai/blog/github-copilot-statistics | 2026 | 6/10 |
| 14 | AI Coding Statistics — Adoption & Productivity Metrics | https://www.getpanto.ai/blog/ai-coding-assistant-statistics | 2026 | 6/10 |
| 15 | arXiv — METR Paper (peer-reviewed) | https://arxiv.org/abs/2507.09089 | Jul 2025 | 9/10 |
| 16 | Stanford HAI — 2025 AI Index Report | https://hai.stanford.edu/ai-index/2025-ai-index-report | 2025 | 7/10 |
| 17 | Deloitte — State of AI in the Enterprise 2026 | https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html | 2026 | 6/10 |

---

## Gaps

1. **Luby-specific or nearshore-specific data**: No published research was found on how AI-driven development specifically impacts nearshore/offshore software consultancies or the Latin American tech market. This is a potential differentiation angle for Marine but would need to rely on Luby's own internal data or anecdotal experience.

2. **Long-term code maintainability studies**: While security flaws (322% more privilege escalation paths) are documented, there is limited rigorous research on the long-term maintainability cost of AI-generated codebases over 2-5 year horizons. GitClear has some early data suggesting downward pressure on code quality, but longitudinal enterprise studies are scarce.

3. **ROI data for enterprise AI coding tools**: Despite widespread adoption, concrete ROI figures (dollars saved per developer, cost per line of AI-generated code, total cost of ownership including review overhead) are largely absent from independent research. Most ROI claims come from vendor sources (GitHub, Amazon, etc.) and should be treated with skepticism.

4. **Client-side case studies in software consultancies**: The case studies found (Walmart, BMW, JPMorgan) are about AI in operations, not about how software development firms use AI to build software for clients. This is a gap Marine could fill with Luby's own experience.

5. **Comparative data across AI coding tools**: Head-to-head independent benchmarks comparing Copilot, Cursor, Amazon Q, Tabnine, and others in enterprise settings are limited. Most comparisons are vendor-funded or based on self-reported developer surveys rather than controlled experiments.

6. **Impact on junior vs. senior developer dynamics**: While some studies note that junior developers see larger productivity gains (27-39% per McKinsey) vs. seniors (8-13%), the implications for team composition, mentoring, and knowledge transfer in an AI-augmented environment are underexplored.
