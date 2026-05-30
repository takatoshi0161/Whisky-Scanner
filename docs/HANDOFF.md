# Whisky-Scanner Handoff v2.0

## Purpose

This repository is the active workspace for Whisky-Scanner.

Whisky-Scanner is not primarily a label-reading app. It should be developed as a next-bottle discovery experience for home whisky drinkers. The key product promise is:

> 好きだった一本から、次の一本に出会えること

OCR is one entry point. The core product value is helping users remember what they liked, understand why they liked it, and find a next bottle that fits tonight's mood, taste preference, drinking style, and purchase context.

## Current Product Direction

- Lead with the next-bottle recommendation experience.
- Keep label scanning as a secondary entry point under a "ラベルから探す" style flow.
- Explain recommendations in plain everyday language.
- Treat region, distillery, age, and brand as supporting signals, not the center of the experience.
- Optimize for UX validation before investing in OCR precision.
- Avoid designing the app around OCR accuracy as the primary value.

## Current MVP State

Completed:

- OCR API flow.
- OCR candidate matching MVP v1.
- Image compression before OCR upload.
- Recommendation display for the main bottle experience.
- Taste Profile direction input.
- Region helper descriptions.
- Whisky-Scanner recommendation style guide v1.0 reflected in local data.

Continuing improvement:

- Recommendation UX polish.
- OCR candidate quality checks.
- Recommendation vocabulary organization.
- Taste Profile weighting design.
- Reducing moments where the UI feels like a review database.

## Recommendation UX

Recommendation is not a review, score, or answer key. It should feel like:

> 詳しい友人が自然に勧める感じ

The user should feel:

> 詳しいレビューを読んだ

less than:

> 次に飲む方向が少し見えた

Avoid:

- Evaluation.
- Scoring.
- Declaring the right answer.
- Overly expert-only language.
- Excessive poetic copy.
- Review-database tone.

Detail screen information order:

1. `region`
2. `TASTE`
3. `NEXT BOTTLE`
4. `Taste Profile`

## Region Handling

Region should not be removed, but it should not be the main actor.

Use region as supporting information for choosing the next bottle. Region helper text should be short, tentative, and useful as a clue for taste or atmosphere. It should support the recommendation and `TASTE` sections, not compete with them.

Avoid turning region into a database table or whisky encyclopedia section.

## Taste Profile

Taste Profile is not a rating form. It is direction input for growing future recommendations.

Prompt:

> この一本、次も選びたい？

Choices:

- また飲みたい
- たまになら
- 別のタイプ

Internal values:

- `want_again`
- `occasionally`
- `different_type`

Existing localStorage save and restore behavior should be preserved.

## Recommendation Data Operation

Recommendation copy, UX wording, and user-facing product language are product design assets.

When finalized recommendation copy is provided by the user or ChatGPT:

- Use the provided text as the source of truth.
- Do not create new recommendation copy unless explicitly asked.
- Do not rewrite, paraphrase, shorten, or expand finalized copy.
- If copy length or display fit is a concern, keep the copy unchanged and note the concern in the PR.

Codex should focus on:

- Adding provided copy to data structures.
- Wiring copy into the correct UI locations.
- Preserving fallback behavior for missing copy.
- UI adjustment and bug fixes.

## OCR Direction

OCR is an entry point, not the core value.

Do not treat Whisky-Scanner as an OCR accuracy competition. Near-term OCR work should prioritize keeping the journey usable and interpreting OCR results well enough for MVP validation.

Current framing:

> OCR精度改善ではなく、OCR結果解釈の改善フェーズ

## OCR Candidate Matching MVP v1

Completed OCR/data work includes:

- OCR API route.
- Vercel OCR API availability fixes.
- User-facing OCR failure handling.
- Upload image compression.
- OCR/API failure separation.
- String-based candidate scoring.
- Bounding box visual score correction.

Related issues:

- `#60` Lagavulin / Port Ellen string scoring.
- `#62` OCR bounding box correction for main-label-like text.

Current candidate scoring uses a lightweight combination of:

- Distillery name match.
- Keyword match.
- Bottle name match.
- Age statement match.
- Visual score from OCR bounding boxes when available.

Bounding box correction is intended to lightly prefer text that looks more like main label information:

- Larger text.
- More centered text.
- Wider text.

It should remain a correction to string scoring, not an AI classifier or a Lagavulin-specific hardcode.

Confirmed result:

- Lagavulin 8 real-device check now recognizes Lagavulin instead of incorrectly prioritizing Port Ellen.

If further improvement is needed, the next phase can consider deeper OCR structure analysis, but do not jump to fullTextAnnotation analysis, AI classification, or major image preprocessing unless explicitly scoped.

## Confirmed Bottles

Recommendation display has been checked on real smartphone flow for:

- Arran 10
- Bowmore 12
- Talisker 10
- Glenfarclas 12
- Glenfiddich 12
- The Macallan 12
- Benromach 10

Current UX finding:

- Recommendation copy captures bottle direction well.
- It reads as a next-bottle suggestion rather than a review.
- The `region` -> `TASTE` -> `NEXT BOTTLE` -> `Taste Profile` flow feels natural.

## Current Repository State

- Frontend: Next.js app in `frontend/`
- Backend: FastAPI app in `backend/`
- Database: PostgreSQL via `docker-compose.yml`
- Active product guidance: `AGENTS.md`
- Current home experience entry point: `frontend/app/home-experience.tsx`
- Existing scan flow: `frontend/app/scan-uploader.tsx`
- OCR API route: `frontend/app/api/ocr/route.ts`
- OCR matching logic: `frontend/app/lib/ocr-distillery.ts`
- Distillery data: `frontend/app/data/distilleries.ts`
- Recommendation data: `frontend/app/data/bottle-recommendations.ts`

## Local Startup

Copy environment variables:

```powershell
Copy-Item .env.example .env
```

Start all services:

```powershell
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/health

For frontend-only validation, run commands from `frontend/`.

## Vercel Deployment Notes

Deploy the frontend as a Vercel project with `frontend/` as the Root Directory.

Vercel project settings:

- Framework Preset: Next.js
- Root Directory: `frontend`
- Build Command: `npm run build`
- Install Command: `npm install`

Google Vision OCR authentication should use Environment Variables only in Vercel:

- `GOOGLE_APPLICATION_CREDENTIALS_JSON`
  - Required and preferred.
  - Paste the full service account JSON value.
  - Must include `client_email`, `private_key`, and `project_id`.
  - Escaped `\n` sequences in `private_key` are normalized by the OCR API route.
- `GOOGLE_CLOUD_PROJECT`
  - Optional if the JSON already includes `project_id`.
  - Use only when overriding the Google Cloud project is necessary.

Optional fallback variables:

- `GOOGLE_CLOUD_CLIENT_EMAIL`
- `GOOGLE_CLOUD_PRIVATE_KEY`

Do not configure Vercel OCR with `GOOGLE_APPLICATION_CREDENTIALS` or a local `key.json` path. Vercel does not provide that local credential file, and `frontend/app/api/ocr/route.ts` requires JSON or explicit service account fields when running in Vercel.

For OCR failures on Vercel, inspect Function Logs for `[OCR]` entries. They include the credential source and private key format flags, but do not print credential values.

## Development Operation

- Do not commit directly to `main`.
- Create a branch for every change.
- Use descriptive branch names:
  - Feature work: `feature/...`
  - Bug fixes: `fix/...`
  - Documentation work: `docs/...`
- Open a Pull Request for every change.
- Pull Requests should target `main` unless explicitly requested otherwise.
- Do not create Draft PRs unless the user explicitly asks for a draft.
- Do not merge PRs without explicit user confirmation.
- Use Conventional Commits.
- Keep changes scoped to the task.
- Preserve the existing `ScanUploader` flow unless the task explicitly asks to replace it.
- Prefer readable implementation and realistic local data over premature backend/API work.

## Screenshot Policy

Screenshots are useful but not mandatory for every PR.

If screenshot capture is unstable in the development environment:

- Do not block the PR on screenshots.
- Put `N/A` in the PR screenshot section.
- Note that visual confirmation should be performed after Vercel deployment on a real smartphone.

For UI-related changes, still validate build success and, where applicable, route/page response or key text/HTML presence.

## Reporting

Daily development reports should be written in chat unless the user explicitly asks to create or update a repository file.

The report format is managed outside the repository workflow, so the user does not need to restate the format every time. The important content is:

- What moved forward for the MVP.
- Current state.
- Known issues.
- Next phase.
- Next action candidates.

## Validation Checklist

For documentation-only changes:

- Review the Markdown structure.
- Confirm `git diff` only includes intended documentation changes.

For frontend changes:

- Run `npm run build` or `npm.cmd run build` from `frontend/`.
- Check the app at `http://localhost:3000` when a local dev server is relevant.
- For UI changes, validate route/page response or key text/HTML presence when screenshots are not reliable.
- Use real smartphone confirmation on Vercel Preview when local screenshots are unstable.

Latest known frontend validation:

- `npm install` from `frontend/`
- `npm audit` from `frontend/` found 0 vulnerabilities
- `npm run build` from `frontend/` passed on Next.js 16.2.4

For backend changes:

- Run the relevant backend tests, or start Docker Compose and check `GET /health`.

## Known Issues and Next Phase

Known issues:

- OCR candidate quality still needs continued real-device checks across more bottle labels.
- Recommendation copy length and firmness may need tuning after additional smartphone review.
- `TASTE` and region card information density may need adjustment.
- Mood and recommendation vocabulary need further organization.
- Taste Profile weighting is not yet designed beyond direction input.

Next phase candidates:

- Continue checking OCR candidate matching with real labels and monitor/secondary-device images.
- Expand recommendation UX validation beyond the currently checked bottles.
- Organize mood and direction vocabulary.
- Design how Taste Profile values affect future recommendations.
- Continue reducing UI moments that feel like review posting, ranking, or database browsing.

## PR Template

Every PR should target `main` unless requested otherwise.

```markdown
## Summary

## What changed

## Validation

## Screenshot
```
