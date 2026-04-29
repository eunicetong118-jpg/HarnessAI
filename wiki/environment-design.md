# Environment Design & Agent Legibility

The primary job of an AI engineer is designing environments that agents can navigate and reason about.

## Repository as the System of Record
- **Legibility**: Everything must be in the repo (Markdown, Code, Schemas). No "tribal knowledge" in Slack/Docs.
- **Progressive Disclosure**: Give a map (`CLAUDE.md` / `index.md`), not a 1000-page manual.
- **Isolated Worktrees**: Boot the app per-branch for agent-driven QA and observability.

## Observability for Agents
- Wiring DOM snapshots, screenshots, and navigation into the agent runtime.
- Exposing logs (LogQL) and metrics (PromQL) to agents so they can verify performance (e.g., "startup < 800ms").
