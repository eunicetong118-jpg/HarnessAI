# Clean Code Instructions for Claude

## Philosophy

Clean code is code that is easy to read, understand, modify, and maintain. It is written for humans first, machines second. The guiding principle comes from Robert C. Martin ("Uncle Bob"): *"Clean code reads like well-written prose."*

Code is read far more often than it is written. Every naming decision, every function boundary, every comment is a communication act — to your future self, to your teammates, and to the AI agents working alongside you.

---

## Core Theories & Principles

### 1. Single Responsibility Principle (SRP)
Every function, class, or module should do **one thing** and do it well. If you need the word "and" to describe what something does, it should be split.

> Theory: Cohesion should be high within a unit and coupling should be low between units (Larry Constantine, 1968). This reduces the blast radius of change.

### 2. DRY — Don't Repeat Yourself
Every piece of knowledge should have a **single, authoritative representation** in the codebase (Hunt & Thomas, *The Pragmatic Programmer*). Duplication is the root of maintenance bugs.

### 3. KISS — Keep It Simple, Stupid
Prefer the simplest solution that works. Complexity is the enemy of reliability. Avoid over-engineering for hypothetical future requirements.

### 4. YAGNI — You Aren't Gonna Need It
Do not implement features or abstractions until they are concretely needed. Speculative generality creates dead code and cognitive overhead.

### 5. Law of Demeter (Principle of Least Knowledge)
A unit should only talk to its immediate collaborators. Avoid chains like `a.getB().getC().doSomething()` — this creates tight coupling.

---

## Naming Conventions

- **Variables**: use nouns that reveal intent (`userAge`, not `x` or `val`)
- **Booleans**: use predicates (`isActive`, `hasPermission`, `canEdit`)
- **Functions**: use verb phrases that describe the action (`fetchUserById`, `calculateTotal`)
- **Classes**: use singular nouns (`UserRepository`, not `Users`)
- **Constants**: use SCREAMING_SNAKE_CASE for true constants (`MAX_RETRIES`)
- Avoid abbreviations unless they are universally understood (`url`, `id`, `html`)
- Names should be searchable and pronounceable

---

## Function Guidelines

- Functions should be **short** — ideally under 20 lines
- Functions should do **one thing** at one level of abstraction
- Limit parameters to **3 or fewer**; use an options object if more are needed
- Avoid side effects that aren't obvious from the function's name
- Return early to reduce nesting (guard clauses)
- Prefer pure functions where possible (same input → same output, no side effects)

```js
// Bad
function process(data, flag, mode, callback, retries) { ... }

// Good
function processPayment({ amount, currency, retries = 3 }) { ... }
```

---

## Code Structure & Formatting

- **Vertical distance**: related code should be physically close; callers above callees
- **Consistent indentation**: use the project's linter/formatter (Prettier, Black, gofmt) — never override manually
- **One concept per line**: avoid cramming multiple operations on one line
- **Blank lines** separate logical sections within a function; use them intentionally
- **File length**: if a file exceeds ~300 lines, consider splitting by responsibility

---

## Comments

Comments are a last resort, not a crutch. The best comment is a well-named function or variable.

**Write comments when:**
- Explaining *why* a non-obvious decision was made (not *what*)
- Documenting public APIs (JSDoc, docstrings)
- Warning about known gotchas or side effects

**Never write comments that:**
- Restate what the code already clearly says
- Are left-over TODOs without a ticket/owner
- Explain bad code instead of fixing it

```python
# Bad: redundant comment
i = i + 1  # increment i

# Good: explains the why
# Offset by 1 because the API uses 1-based pagination
page = index + 1
```

---

## Error Handling

- Handle errors at the **right level of abstraction** — don't swallow exceptions silently
- Use specific error types, not generic `Error` or `Exception`
- Fail fast and loudly in development; fail gracefully in production
- Do not use error handling for control flow
- Always clean up resources (use `finally`, `defer`, context managers)

---

## Code Smells to Avoid

| Smell | Problem | Fix |
|---|---|---|
| Long method | Hard to test and reason about | Extract smaller functions |
| Magic numbers/strings | Unclear intent | Extract named constants |
| Deep nesting (3+ levels) | Cognitive overload | Use guard clauses, extract functions |
| God class/function | Does too much | Split by responsibility |
| Shotgun surgery | One change requires edits in many places | Consolidate related logic |
| Feature envy | A function uses another class's data more than its own | Move the function |
| Dead code | Unused variables, functions, imports | Delete it — version control remembers |

---

## Testing Standards

- Tests are **first-class citizens** — they document behavior and enable refactoring
- Follow **AAA**: Arrange → Act → Assert
- One logical assertion per test
- Test names describe the scenario: `should_return_null_when_user_not_found`
- Avoid testing implementation details; test behavior and contracts
- Aim for fast, isolated unit tests; minimize integration test surface area

---

## Instructions for the Agent

When writing or modifying code, you **must** follow these rules:

1. **Name everything with intent.** If a name requires a comment to explain it, rename it instead.
2. **Extract functions aggressively.** If a block of code can be named, it should be a function.
3. **Never leave dead code.** Remove unused variables, imports, and functions.
4. **Handle all errors explicitly.** Never swallow exceptions or return silent nulls without documentation.
5. **Write the simplest solution first.** Optimize only when there is a measured need.
6. **Respect the existing style.** Match the formatting, naming, and structure of the surrounding codebase.
7. **Leave the codebase cleaner than you found it.** Apply the Boy Scout Rule: always improve something small when you touch a file.
8. **Write a test if you add behavior.** New logic without a test is unverified logic.
9. **Avoid magic values.** Extract all literals into named constants or configuration.
10. **Think about the reader.** Before submitting code, ask: *"Would a developer unfamiliar with this project understand this in 30 seconds?"*
