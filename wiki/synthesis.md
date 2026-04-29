# Synthesis: Building the 0-Line Repository

Synthesis of principles and architectures for autonomous agent-first development.

## The Paradigm Shift
Engineering moves from **writing code** to **designing environments**. The human engineer builds the feedback loops and invariants that allow agents to operate reliably.

## Architectural Pillars
1. **Agent Legibility**: The repository is the single source of truth. If a decision or pattern isn't in the repo (Markdown/Code), it doesn't exist for the agent.
2. **Strict Invariants**: Enforce boundaries (e.g., unidirectional layering) via mechanical checks (linters/tests). This prevents architectural drift in high-throughput environments.
3. **Continuous Iteration (Ralph Wiggum)**: Use loops and hooks to keep agents working until goals are met.
4. **Adversarial QA**: Separate the generator from the evaluator. Use browser automation (Playwright/Puppeteer) to verify behavior end-to-end.

## Key Workflows
- **Ingest**: Compiling raw documents into a structured wiki to avoid re-deriving knowledge.
- **Context Management**: Balance between compaction (continuity) and resets (clean slate to fix "context anxiety").
- **Garbage Collection**: Automated background tasks to prune "AI slop" and maintain code quality standards.

## Goal: The 1/10th Speedup
By providing agents with a "map" (structured docs) and tools to verify their own work, throughput can increase from ~0.5 PRs/day to 3.5+ PRs/day per human driver.
