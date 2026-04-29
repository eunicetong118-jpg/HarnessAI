# Multi-Agent Architectures

Moving beyond solo agents to specialized loops for higher quality and reliability.

## Planner-Generator-Evaluator (GAN-inspired)
1. **Planner**: Expands simple prompts into comprehensive specs and design languages.
2. **Generator**: Implements features in "sprints" or increments.
3. **Evaluator (QA)**: Critically reviews output using tools (e.g., Playwright/Puppeteer) to find real bugs.

## Feedback Loops
- **The Sprint Contract**: Generator and Evaluator negotiate what "done" looks like before coding.
- **Adversarial Evaluation**: Separating the "doer" from the "judge" to overcome LLM over-confidence/leniency.
- **Subjective Grading**: Turning "taste" into concrete criteria (Design Quality, Originality, Craft, Functionality).
