# Clean Code Standards

Standards for human-readable and agent-maintainable code.

## Core Principles
- **SRP (Single Responsibility)**: One function, one job. Split if "and" is needed to describe.
- **DRY (Don't Repeat Yourself)**: Single authoritative representation of knowledge.
- **KISS/YAGNI**: Simplest solution. No speculative abstractions.
- **Law of Demeter**: Talk only to immediate collaborators. No long chains (`a.b.c.d`).

## Implementation Rules
- **Naming**: Intent-revealing nouns for vars, verb phrases for functions, predicates for booleans.
- **Functions**: < 20 lines. Max 3 parameters (use options object if more). Return early (guard clauses).
- **Structure**: Related code physically close. File length < 300 lines.
- **Comments**: Explain *why*, not *what*. Use only as last resort.

## Testing
- **AAA Pattern**: Arrange, Act, Assert.
- **Naming**: `should_behavior_when_scenario`.
- **Scope**: One logical assertion per test. Test behavior/contracts, not details.

## Agent-Specific Rules
- **Intentional Naming**: Rename over commenting.
- **Aggressive Extraction**: If it can be named, make it a function.
- **Zero Dead Code**: Delete unused imports/vars/functions immediately.
- **Boy Scout Rule**: Leave file cleaner than found.
