# AGENTS.md

## Project Direction

Whisky Scanner is not primarily an OCR scanner app.

The core value is:

> 好きだった一本から、次の一本に出会えること

OCR is only one possible entry point. It can help users identify a bottle from a label, but the product should not be designed around OCR accuracy as the main experience.

The app should help users remember what they liked, understand why they liked it, and find a next bottle that fits tonight's mood, taste preference, drinking style, and purchase context.

## Target Users

- Beginner to intermediate whisky drinkers
- People who enjoy whisky at home
- People who want help choosing what to buy next
- People who may not know distillery names, regions, or technical tasting vocabulary yet

The product should avoid assuming deep whisky knowledge. Use plain language first, and expert details only when they help the decision.

## Product Principles

- Lead with the next-bottle discovery experience.
- Treat OCR as one entry point, not the core value.
- Prioritize home drinking and purchase support, not only bar-specific use cases.
- Help users move from "I liked this" to "I might like this next."
- Make recommendations explainable in everyday language.
- Optimize for UX validation before OCR precision.

## Recommendation Logic Priorities

Similarity should not be based mainly on distillery.

When suggesting a next bottle, prioritize:

- Cask influence
- Aroma and flavor profile
- Drinking style, such as neat, highball, with food, or after dinner
- User mood, such as relaxing, smoky, celebratory, adventurous, or pairing with a meal
- Price and purchase accessibility when relevant

Distillery, region, age statement, and brand are useful supporting signals, but they should not dominate the recommendation experience.

## Current Product Priority

The current priority is UX validation, not OCR accuracy.

Near-term work should focus on:

- Clarifying the home screen experience
- Testing whether users understand the value immediately
- Improving mood-based and memory-based recommendation flows
- Keeping the label scan flow available as a secondary path
- Making dummy data realistic enough to evaluate the user journey

OCR quality, image preprocessing, and bottle matching precision can be improved later after the core discovery experience feels right.

## Development Rules

- Do not commit directly to `main`.
- Create a feature branch for every change.
- Use descriptive branch names.
  - Feature work: `feature/...`
  - Documentation work: `docs/...`
  - Bug fixes: `fix/...`
- Keep changes scoped to the task.
- Do not remove existing user-facing flows unless explicitly requested.
- Preserve the existing `ScanUploader` flow unless the task specifically asks to replace it.
- Prefer simple, readable implementation over premature abstraction.
- Use dummy data when validating UX before backend/API work is necessary.

## Commit Rules

Use Conventional Commits.

Examples:

- `feat(frontend): add whisky journey home mock`
- `fix(api): handle empty scan uploads`
- `docs: add agent development guidelines`
- `refactor(frontend): simplify recommendation card data`

## Pull Request Rules

Every PR should target `main` unless the user explicitly says otherwise.

Every PR description should include:

```markdown
## Summary

## What changed

## Validation

## Screenshot
```

Use the sections as follows:

- `Summary`: Briefly explain the user-facing purpose of the change.
- `What changed`: List the main files or behaviors changed.
- `Validation`: Include commands run, local URLs checked, or reasons validation could not be completed.
- `Screenshot`: Include a screenshot for UI changes, or write `N/A` for non-UI changes.

## UI / UX Guidance

- Design mobile-first.
- Prefer dark, premium whisky-inspired UI.
- Make the first screen immediately communicate that the app helps choose tonight's bottle.
- Keep development-only connection status small and low-priority.
- Do not let scanner language dominate the top-level product experience.
- Put label/OCR flows below the primary discovery experience, such as in a "ラベルから探す" section.

## Collaboration Notes

When working with planning or UX guidance from ChatGPT, align implementation with the updated product direction above.

If older docs or code refer to the app mainly as an OCR scanner, treat that as legacy MVP framing unless the user says otherwise.
