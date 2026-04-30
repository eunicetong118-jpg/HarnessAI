# Clean Code Principles
- Follow clean code principles (DRY, KISS, SOLID).
- Strictly follow `raw/Cashback website requirement` for instructions and folder structure.
- Present alternative proposals for decision before implementation.

# LLM Wiki Schema (Karpathy Methodology)

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

## Structure
- `raw/`: Immutable source documents (articles, papers, notes).
- `wiki/`: LLM-maintained knowledge base.
- `wiki/index.md`: Map of all wiki pages.
- `wiki/log.md`: Chronological log of ingests and queries.

## Rules
- LLM owns `wiki/`. Human reads, LLM writes.
- Every ingest must update `index.md` and `log.md`.
- Interlink pages heavily.
- Maintain entity pages, concept pages, and synthesis pages.
- **Do not create a project-level sub-folder (e.g. `rebate-portal/`). Keep the project files at the root of the repository.**

## Workflows

### Ingest
1. Read source from `raw/`.
2. Extract key info.
3. Create/update relevant pages in `wiki/`.
4. Update `wiki/index.md` with page links and summaries.
5. Append entry to `wiki/log.md` with `## [YYYY-MM-DD] ingest | Title`.

### Query
1. Consult `wiki/index.md` to find relevant pages.
2. Synthesize answer from wiki pages.
3. If new insight found, file back into `wiki/` as a new page.

### Lint
- Check for contradictions.
- Find orphan pages.
- Identify data gaps.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
