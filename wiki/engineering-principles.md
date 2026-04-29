# Agent-First Engineering Principles

Principles for building software with 0 lines of human-written code.

## Invariants over Micromanagement
- Enforce **Strict Boundaries**: Unidirectional layering (Types -> Repo -> Service -> UI).
- **Custom Lints**: Use agents to write linters that inject remediation instructions into the context of other agents.
- **Garbage Collection**: Regular background tasks to prune "AI slop" and refactor suboptimal patterns.

## Development Philosophy
- **Parse, Don't Validate**: Ensure data shapes are correct at system boundaries.
- **Boring Technology**: Favor composable, stable, and well-represented techs (React, FastAPI, SQLite).
- **Merge Fast**: In high-throughput agent environments, corrections are cheap; waiting is expensive.
