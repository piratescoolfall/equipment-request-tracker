---
name: requirements-reviewer
description: Compare a feature specification with this repository's implementation and report acceptance coverage, gaps, unsupported behavior, data or security concerns, and missing tests with cited evidence. Use for requirements reviews, not implementation work.
---

# Requirements Reviewer

Review the requested feature against its specification. Do not change files, apply fixes, generate snapshots, or save a report unless the user asks. Return the review in chat by default.

## Establish scope and evidence

Read applicable repository instructions and the feature specification, usually in `docs/`. Use the feature and revision the user identifies; if multiple specifications could apply and the choice changes the review, ask which to use.

Extract each acceptance criterion, preserving its identifier or assigning a short label. Distinguish explicit requirements from assumptions and ambiguous wording. Inspect the relevant implementation and existing tests. In this repository, business and storage behavior usually live in `src/request-store.js`, browser behavior in `src/app.js`, and interface structure and styling in `index.html` and `styles.css`.

Trace each criterion to concrete code paths, including validation, persistence, rendering, and error handling where relevant. Cite specification paths and line numbers or section identifiers, and code/test paths with line numbers. Use links when available. Explain how the evidence supports each conclusion; a function name alone is insufficient. For absent behavior, cite the requirement and the relevant implementation location or searched scope rather than inventing a citation to missing code.

Distinguish code inspection, existing test assertions, and behavior actually executed. Do not claim tests passed or browser behavior was verified unless observed. Run checks only when they can preserve files and user data; otherwise describe the check still needed.

## Report

Include all five categories below, explicitly saying when no issue was found in the inspected scope:

- **Satisfied acceptance criteria:** Map each satisfied criterion to specification and implementation evidence. Note whether support is established by inspection, tests, or observed behavior.
- **Gaps:** Identify missing or partial criteria, expected versus implemented behavior, impact, and supporting citations. Mark ambiguous or unverified criteria separately; do not count them as satisfied.
- **Unsupported behavior:** Identify implemented behavior beyond or contrary to the specification and cite both the code and relevant specification scope. Distinguish a conflicting behavior from an addition whose intent needs clarification; do not invent new requirements.
- **Data or security concerns:** Report concrete risks supported by the code. In particular, inspect compatibility with existing locally stored requests, potential data loss, and unsafe rendering of user input. Cite the affected code and specification or repository rule when applicable. Separate observed defects from conditional risks.
- **Tests still needed:** List meaningful missing scenarios with expected outcomes and the criteria or concerns they cover. Cite existing tests when explaining coverage gaps. Include browser or manual checks when automated tests cannot establish the behavior.

Prioritize findings by impact. Close with the review scope, checks actually run and their outcomes, and any evidence limitations. Keep recommendations within the requested feature; reviewing does not authorize implementation changes.
