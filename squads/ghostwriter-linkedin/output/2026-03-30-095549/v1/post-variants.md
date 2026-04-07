# Variantes do Post — Gardin / Claude Code / EN / Medium

---

## Variante A — Contrarian (The Productivity Paradox)

Most engineers miss this about Claude Code.

Your team is merging 98% more pull requests.

And your code review times just went up 91%.

I've reviewed hundreds of codebases over the past year where teams adopted AI coding agents. The pattern is always the same.

Individual output skyrockets. Developers complete 21% more tasks. PRs pile up. Everyone feels faster.

Then you check the DORA metrics.

Deployment frequency? Flat.
Lead time? Flat.
Change failure rate? Flat.

The real problem isn't the code. It's everything downstream of it.

Planning didn't get faster. Design reviews didn't get faster. QA didn't get faster. And now your senior engineers are drowning in reviews they didn't ask for.

The METR study confirmed what I've been seeing firsthand: developers estimated they were 20% faster. They were actually 19% slower on real-world tasks.

3 things I tell CTOs before they scale AI coding agents:

1. Measure the pipeline, not the developer. DORA metrics tell the real story.
2. Budget 2x for code review capacity. More PRs means more review load.
3. Treat the agent as infrastructure, not a hack. MCP, subagents, governance. That's layers to architect, not a plugin to install.

Capability without architecture is just faster chaos.

What's the first bottleneck your team hit after adopting AI coding agents?

#ClaudeCode #EngineeringLeadership #AIAgents #SoftwareArchitecture #DevProductivity

---

## Variante B — Architecture Deep-Dive (The 5-Layer Stack)

The architectural decision that changed everything about how we use Claude Code.

We stopped treating it as a developer tool.

We started treating it as infrastructure.

I've spent months building multi-agent systems on top of Claude Code. Most teams I talk to are using layer 1. There are 5.

Here's the stack most CTOs don't know exists:

1. MCP (Model Context Protocol). The connectivity layer. Apple adopted it in Xcode 26.3. OpenAI added it to ChatGPT. It's not Anthropic-specific anymore. It's the TCP/IP of AI tooling.

2. Skills. Task-specific knowledge modules. Your agent doesn't need to figure out LinkedIn formatting from scratch every time. You teach it once, it knows forever.

3. Agent. The primary worker. Claude Code in your terminal. This is where most teams stop. Mistake.

4. Subagents. Parallel independent workers. Research happening in the background while the main agent writes. 3x throughput, same context window.

5. Agent Teams. Coordinated multi-agent workflows. Different specialists handling different parts of a complex task. This is where it gets architectural.

115,000 developers use Claude Code today. Processing 195 million lines weekly.

Most are on layer 1.

The ones building on all 5 are solving problems that weren't cost-effective 6 months ago. 27% of Claude-assisted work at Anthropic is tasks that wouldn't have been done at all otherwise.

Which layer is your team on?

#ClaudeCode #SoftwareArchitecture #MCP #AIAgents #EngineeringLeadership
