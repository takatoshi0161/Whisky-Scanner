# Whisky Scanner

Whisky Scanner is a personal MVP for helping home whisky drinkers find their next bottle from something they already liked.

The product direction is:

> 好きだった一本から、次の一本に出会えること

The label scan flow remains available, but OCR is treated as one entry point rather than the main product value. Near-term work should prioritize validating the discovery experience: mood-based recommendations, memory-based recommendations, realistic dummy data, and a home screen that immediately communicates "choose tonight's bottle."

## Current Scope

- Mobile-first whisky recommendation home experience
- Mood-based dummy recommendations
- Last-favorite memory section
- Label image upload flow as a secondary path
- FastAPI backend with health and scan endpoints
- PostgreSQL service for future persistence

## Tech Stack

- Frontend: Next.js 16, React, TypeScript
- Backend: FastAPI, Python 3.12
- Database: PostgreSQL 16
- Local orchestration: Docker Compose

## Repository Structure

```text
.
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |   |-- health.py
|   |   |   `-- scan.py
|   |   |-- core/
|   |   |   `-- config.py
|   |   |-- db/
|   |   |   `-- session.py
|   |   |-- services/
|   |   |   `-- ocr.py
|   |   `-- main.py
|   |-- Dockerfile
|   |-- pyproject.toml
|   `-- requirements.txt
|-- frontend/
|   |-- app/
|   |   |-- globals.css
|   |   |-- home-experience.tsx
|   |   |-- layout.tsx
|   |   |-- page.tsx
|   |   `-- scan-uploader.tsx
|   |-- public/
|   |-- Dockerfile
|   |-- next.config.js
|   |-- package-lock.json
|   |-- package.json
|   `-- tsconfig.json
|-- docs/
|   `-- HANDOFF.md
|-- .env.example
|-- .gitignore
|-- AGENTS.md
|-- docker-compose.yml
`-- README.md
```

## Setup

1. Copy the example environment file.

```powershell
Copy-Item .env.example .env
```

2. Start Docker Desktop.

3. Build and start the services.

```powershell
docker compose up --build
```

4. Open the app and backend health check.

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend health check: [http://localhost:8000/health](http://localhost:8000/health)

## Frontend Commands

Run from `frontend/`.

```powershell
npm install
npm run dev
npm run build
```

## Backend Endpoints

- `GET /health`
  - Confirms API availability
  - Checks database connectivity
- `POST /scan`
  - Accepts one label image
  - Returns OCR text and candidate bottles

## Product Notes

- Do not make OCR accuracy the top-level product story.
- Keep `ScanUploader` available unless a task explicitly asks to replace it.
- Recommendations should lean on cask influence, flavor profile, drinking style, mood, and purchase context before distillery or region.
- Use plain language for beginners and intermediate drinkers.
- Dummy data is acceptable while validating UX.

## Development Notes

- Do not commit directly to `main`.
- Use a descriptive branch for every change.
- Follow Conventional Commits.
- `frontend/package-lock.json` is included so frontend installs are reproducible.
- Next.js is pinned through `package-lock.json`, with a PostCSS override for the current security advisory.
- See `AGENTS.md` for the working agreement and product direction.
