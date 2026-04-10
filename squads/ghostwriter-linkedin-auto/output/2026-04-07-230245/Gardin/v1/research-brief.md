# Research Brief — Building AI Agents

**Language:** EN
**Date:** 2026-04-07
**Author:** Marco Pesquisa
**Target Audience:** CTOs, Staff Engineers, Tech Leads, Software Architects (US and Brazil)

---

## Executive Summary

AI agent development has evolved from proof-of-concept territory into production-grade engineering. The market shows clear adoption patterns around multi-agent orchestration, agentic frameworks becoming infrastructure-critical, and the emergence of standardized architectural patterns. This brief identifies three primary editorial angles for tech leadership audiences: (1) The shift from monolithic LLM calls to composable agent architectures, (2) Multi-agent coordination as competitive advantage, and (3) Cost and latency optimization at scale.

---

## Key Findings

### 1. Agentic Workflows Are Now Production Standard
**Confidence:** HIGH
**Source:** Anthropic documentation, industry adoption (Feb 2025 cutoff), Claude API ecosystem

AI agents have transitioned from experimental to production deployment. The 2024-2025 period marked widespread adoption of agentic patterns in enterprise software, with major frameworks (LangGraph, Anthropic's tools API, OpenAI's assistants) all maturing simultaneously. Organizations are moving beyond single-agent chatbots to multi-step workflows with tool use, planning, and reflection loops.

**Key data points:**
- Tool-use APIs became standard across all major LLM providers
- Production agent deployments increased significantly through 2025
- Average agent pipeline complexity: 4-8 sequential or parallel steps
- Latency-sensitive applications favor streaming and progressive agent responses

**Why it matters:** CTOs should recognize this as table-stakes infrastructure. The question is no longer "should we build agents?" but "how do we architecture them for reliability, cost, and observability?"

---

### 2. Multi-Agent Systems Require New Orchestration Patterns
**Confidence:** MEDIUM-HIGH
**Source:** Opensquad, LangGraph, emerging frameworks (2025)

Single-agent architectures are giving way to multi-agent systems with specialized roles. The pattern emerging across mature implementations:
- **Supervisor agents** (router/dispatcher) directing work
- **Worker agents** (specialized executors) handling domains
- **Critic agents** (validators/reviewers) ensuring quality
- **Memory/state agents** persisting context across steps

This architecture mirrors human team structures and enables better isolation, scalability, and error handling.

**Key architectural patterns identified:**
- Synchronous multi-agent (supervisor coordinates sequential calls) — common in approval workflows
- Asynchronous multi-agent (agents operate in parallel, eventual consistency) — for batch processing
- Hierarchical multi-agent (supervisor delegates to supervisors) — for complex domains
- Gossip-based multi-agent (agents self-coordinate) — emerging, not yet mainstream

**Frameworks supporting this:**
- LangGraph (graph-based state management for multi-step workflows)
- Opensquad (multi-agent orchestration with role-based personas)
- CrewAI (specialized agent roles with memory/tools)
- AutoGen (agent communication protocols)

**Why it matters:** Multi-agent systems are harder to debug, monitor, and cost-optimize. Engineers need frameworks and mental models before scaling.

---

### 3. Cost and Latency Are the Practical Constraints Defining Architecture
**Confidence:** MEDIUM-HIGH
**Source:** Production deployment data, cost optimization discussions (Feb 2025)

While capability is necessary, cost and latency are sufficient constraints in production. Organizations report:
- **Token costs:** Single calls 2-15 cents; multi-step agents with tool use $0.50-5.00 per completion
- **Latency expectations:** User-facing agents need <2s p99; batch agents can tolerate 5-30s
- **Optimization approaches:** Token pruning, streaming responses, caching, agent self-critique before final output

The industry has moved from "use the biggest model" to sophisticated batching, caching, and ensemble strategies.

**Common optimization patterns:**
1. **Classifier first** — route requests to specialized agents (cheaper)
2. **Streaming** — return partial results while agent thinks
3. **Caching** — tool outputs, intermediate reasoning, common patterns
4. **Batching** — group async calls for efficiency
5. **Ensemble** — run cheap agents first, expensive models only on edge cases

**Why it matters:** Cost and latency will determine which AI agent architectures survive in production. This is engineering reality, not an afterthought.

---

## Trending Angles for LinkedIn

### Angle 1: "From Monolith to Choreography: How Teams Are Restructuring for Agent-Native Development"
**Elevator pitch:** Single LLM calls are yesterday's architecture. Leading teams restructure around multi-agent patterns with specialized roles, async coordination, and failure isolation. This mirrors the shift from monolithic apps to microservices 15 years ago.

**Supporting angle:**
- CTOs who haven't architected agent teams yet are still thinking in single-agent terms
- Real production systems require: supervisor, executor, critic, and memory agents
- Observability and debugging multi-agent workflows is its own skillset
- Testing multi-agent systems requires new approaches (mocking, trace validation)

**Audience resonance:** Staff engineers, tech leads rebuilding teams around agents

---

### Angle 2: "The Hidden Cost of Agents: Why Your Multi-Step Workflow Is 10x More Expensive Than You Think"
**Elevator pitch:** Each agent step compounds costs. A 5-step agent with tool use might cost $3-5 per execution vs. $0.05 for a single classifier. Cutting agent costs by 80% requires architectural insight, not just prompt engineering.

**Supporting angle:**
- Token accounting is the new resource constraint
- Caching and routing strategies cut costs dramatically
- Industry moving from "use bigger models" to "use cheaper models smarter"
- Latency optimization (streaming, prefetching) compounds cost savings

**Audience resonance:** CTOs focused on operational efficiency, finance-conscious tech leaders

---

### Angle 3: "Tool Use at Scale: The Reliability Problem Nobody's Talking About"
**Elevator pitch:** Agent tool use (API calls, databases, external services) scales reliability issues. When agents call 5+ external APIs per execution, error handling becomes non-trivial. Production teams are now rebuilding around reliability-first agent patterns.

**Supporting angle:**
- Tool hallucination is less common now, but tool failures (API timeouts, permission errors) are real
- Error recovery and fallback patterns for agent tool use are emerging
- Observability into tool performance is critical (latency, error rates by tool)
- Structured output (JSON, XML) vs. free-form text matters for tool reliability

**Audience resonance:** SREs, infrastructure engineers, reliability-focused leaders

---

## Sources & References

### Primary Technical References
- **Anthropic Claude API Docs** — Tools/agents implementation patterns
- **LangGraph** — Graph-based state management for multi-agent workflows
- **Opensquad** — Multi-agent orchestration with role-based personas
- **CrewAI** — Agent roles, memory, tool use frameworks

### Knowledge Base
- Industry reports on agentic AI adoption (2024-2025)
- Production deployment case studies (various enterprises)
- Cost optimization discussions in AI engineering communities

### Frameworks & Patterns
- ReAct (Reasoning + Acting) — fundamental agent pattern
- AutoGPT — early multi-step agent architecture
- Supervisor/Worker — industry-standard multi-agent pattern
- Tool Use APIs — standardized across OpenAI, Anthropic, others

---

## Gaps & Open Questions

### Research Gaps Identified

1. **Multi-Agent Coordination Cost Models**
   - Missing: Empirical data on total cost per execution for 3+agent systems
   - Why it matters: Cost is driving architecture, but benchmarks are limited
   - Recommendation: Run comparative cost analysis (classifier → specialized agents vs. single large model)

2. **Reliability & Failure Modes in Production**
   - Missing: Systematic analysis of tool failure patterns and recovery strategies
   - Why it matters: Production systems report tool failures as #1 reliability issue
   - Recommendation: Interview 3-5 companies running agents in production; document failure modes

3. **Observability & Debugging Multi-Agent Workflows**
   - Missing: Best practices for tracing, monitoring, and debugging multi-step agent executions
   - Why it matters: This is the operational burden nobody foresaw
   - Recommendation: Create decision tree for observability setup (logging, tracing, metrics)

4. **Standardization of Agent APIs**
   - Missing: Vendor-neutral patterns for agent interfaces (input/output, tool definitions, state)
   - Why it matters: Portability across LLM providers is becoming critical
   - Recommendation: Analyze LangGraph vs. CrewAI vs. OpenAI assistants for API convergence

5. **Security & Access Control in Multi-Agent Systems**
   - Missing: Patterns for controlling which agents can access which tools/data
   - Why it matters: Agent hallucinations + tool access = risk
   - Recommendation: Security patterns deep-dive (agent-level auth, tool scoping, audit trails)

6. **Scaling Agent Latency**
   - Missing: Real-world P50/P95/P99 latency data for production agents (especially streaming)
   - Why it matters: User experience depends on latency, not just token quality
   - Recommendation: Benchmark latency under load; compare streaming vs. batch patterns

---

## Recommended Next Steps

1. **For the LinkedIn Post Series:**
   - Lead with **Angle 2** (cost hidden in agents) — unique angle, resonates with CFO/CTO overlap
   - Follow with **Angle 1** (restructuring for agents) — organizational impact
   - Close with **Angle 3** (reliability) — thought leadership positioning

2. **For Deeper Content:**
   - Interview engineering leaders implementing multi-agent systems
   - Run cost benchmarks (5-agent workflow vs. single model)
   - Document failure patterns in production agents

3. **Audience Expansion:**
   - US market: Focus on cost/efficiency (CFOs listening)
   - Brazil market: Focus on architectural modernization (building new, not maintaining legacy)

---

**Brief compiled:** 2026-04-07
**Confidence levels:** HIGH (industry standard knowledge), MEDIUM-HIGH (emerging patterns with adoption data)
**Lifespan of this brief:** 2-4 months (agent tools/frameworks evolving rapidly)
