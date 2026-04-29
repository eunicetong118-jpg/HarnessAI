# Agent Harnesses

A harness is the infrastructure that enables LLMs to perform long-running, complex tasks across multiple context windows.

## Core Components
- **Initializer Agent**: Sets up environment, product spec, and initial scaffolding.
- **Coding Agent**: Makes incremental progress, feature-by-feature.
- **Context Management**:
    - **Compaction**: Summarizing history in-place.
    - **Context Resets**: Starting fresh with a structured handoff artifact (fixes "context anxiety").

## Capabilities & Tools
- **Planning**: `write_todos` tool for structured task tracking.
- **Virtual Filesystem**:
    - `ls`, `read_file` (multimodal: PDF, images, video), `write_file`, `edit_file`, `glob`, `grep`.
    - Declarative **Permissions**: `allow`/`deny` by glob patterns.
- **Code Execution**: `execute` tool in sandbox backends.
- **Human-in-the-loop**: `interrupt_on` parameter to pause for approval on specific tools.
- **Skills**: Modular workflows (`SKILL.md`) with progressive disclosure.
- **Memory**: Persistent context via `AGENTS.md` / `CLAUDE.md`.
