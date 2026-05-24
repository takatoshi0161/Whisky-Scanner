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

## Copy and Recommendation Text Rules

Recommendation copy, UX wording, and user-facing product language should be treated as product design assets, not implementation filler.

When the user or ChatGPT provides finalized copy for recommendations, bottle descriptions, Taste Profile labels, feedback messages, or UX microcopy:

- Use the provided text as the source of truth.
- Do not create new recommendation copy unless explicitly asked.
- Do not rewrite, paraphrase, shorten, or expand finalized copy on your own.
- If the provided copy seems too long, unclear, duplicated, or difficult to implement, keep it unchanged and note the concern in the Pull Request description.
- Only make copy changes when the user explicitly asks for copywriting, wording adjustment, or fallback text creation.

For implementation tasks, Codex should focus on:

- Adding provided copy to data structures.
- Wiring copy into the correct UI locations.
- Preserving existing fallback behavior for missing copy.
- Reporting any display, overflow, or duplication concerns without changing the copy unilaterally.

This is especially important for Whisky Scanner because recommendation tone should stay aligned with the product direction: a knowledgeable friend helping the user find the next bottle, not a review database, ranking system, or generic whisky encyclopedia.

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
- Do not push implementation or documentation changes directly to `main`.
- Do not merge a working branch into `main` before a Pull Request is created.
- Create a Pull Request after implementation is complete.
- Wait for explicit user confirmation before merging any Pull Request.
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

Pull Requests are mandatory for all changes. Even when the user asks to
"merge to main" or "push to main", first create a working branch and Pull
Request, then wait for the user's confirmation before merging.

Pull Requests should be opened as regular ready-for-review PRs by default.
Do not create Draft PRs unless the user explicitly asks for a draft.

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
- `Validation`: Include commands run, local URLs checked, route/page response checks, key text or HTML checks, or reasons validation could not be completed.
- `Screenshot`: Screenshots are not required for every PR. Include one when it is reliable and useful, or write `N/A` for non-UI changes.
  - When screenshot capture is unstable in the development environment, skip screenshot attachment.
  - In that case, note in the PR that visual confirmation will be performed after Vercel deployment on a real smartphone.
  - For UI-related changes, still validate build success and, where applicable, route/page response or key text/HTML presence.

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

## Reporting Rules

When the user asks for a daily development report, use:

- `docs/templates/daily-report.md`

Fill the report based on available git history, PR history, issue references, and current conversation context.

Daily development reports should be provided in the chat response unless the user explicitly asks to create or update a repository file.

Do not add daily report files to the repository by default. The template is a reporting format reference, not an instruction to persist reports under `docs/` or any other directory.
