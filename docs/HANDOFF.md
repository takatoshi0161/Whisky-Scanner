# Handoff

## Purpose

This repository is now the active workspace for Whisky Scanner work.

Whisky Scanner should be developed as a next-bottle discovery experience for home whisky drinkers, not as an OCR-first scanner app. The key product promise is:

> 好きだった一本から、次の一本に出会えること

## Current Product Direction

- Lead with helping users choose tonight's bottle.
- Use remembered favorites, mood, drinking style, taste, and purchase context to suggest the next bottle.
- Keep label scanning as a secondary entry point under a "ラベルから探す" style flow.
- Explain recommendations in plain everyday language.
- Optimize for UX validation before investing in OCR accuracy or precise bottle matching.

## Current Repository State

- Frontend: Next.js app in `frontend/`
- Backend: FastAPI app in `backend/`
- Database: PostgreSQL via `docker-compose.yml`
- Active product guidance: `AGENTS.md`
- Current home experience entry point: `frontend/app/home-experience.tsx`
- Existing scan flow: `frontend/app/scan-uploader.tsx`

## Important Constraints

- Do not commit directly to `main`.
- Create a branch for every change.
- Preserve the existing `ScanUploader` flow unless the task explicitly asks to replace it.
- Keep changes scoped.
- Prefer readable implementation and realistic dummy data over premature backend/API work.

## Near-Term Priorities

1. Fix any remaining mojibake in frontend user-facing strings.
2. Verify the Next.js build.
3. Improve the home screen so the first viewport immediately communicates "choose tonight's bottle."
4. Make mood-based recommendations feel realistic enough for UX testing.
5. Add memory-based recommendation flow from a liked bottle.
6. Keep scan/OCR below the primary discovery experience.

## Known Issues

- Japanese strings may appear mojibake-corrupted in PowerShell output unless UTF-8 output is enabled. The frontend source files are valid UTF-8 as of this handoff.
- The current OCR flow is still an MVP/dummy entry point.
- Recommendation data is local dummy data and should be treated as UX validation material.

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

## Validation Checklist

For documentation-only changes:

- Review rendered Markdown.
- Confirm `git diff` only includes intended docs changes.

For frontend changes:

- Run `npm run build` from `frontend/`.
- Check the app at `http://localhost:3000`.
- Include screenshots in PRs for UI changes.

Latest validation:

- `npm install` from `frontend/`
- `npm audit` from `frontend/` found 0 vulnerabilities
- `npm run build` from `frontend/` passed on Next.js 16.2.4

For backend changes:

- Run the relevant backend tests or start Docker Compose and check `GET /health`.

## PR Template

Every PR should target `main` unless requested otherwise.

```markdown
## Summary

## What changed

## Validation

## Screenshot
```
