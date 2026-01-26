# AI Project Instructions

## Project Summary
- News application with a Node.js/Express backend and a Next.js frontend.
- PostgreSQL database managed with Sequelize ORM.
- Authentication uses JWT and bcryptjs.

## Key Docs to Read First
- README.md (project setup and API overview)
- doc/PROJECT_SUMMARY.md
- doc/ARCHITECTURE.md
- doc/SECURITY.md
- doc/DEPLOYMENT.md
- doc/API_TESTING.md

## Repository Structure
- Backend source: `src/` (Express routes, controllers, models, middleware).
- Frontend source: `app/` and `components/` (Next.js App Router).
- Shared utilities: `lib/`.
- Documentation: `doc/`.

## Common Commands
```bash
# Install dependencies
npm install

# Backend (API) server
npm run dev
npm start

# Frontend (Next.js)
npm run frontend
npm run frontend:build
npm run frontend:start

# Tests (Jest)
npm test
```

## Environment Notes
- Copy `.env.example` to `.env` and fill in PostgreSQL + JWT settings.
- API runs on `http://localhost:3000`.
- Frontend runs on `http://localhost:3001`.
- `NEXT_PUBLIC_API_URL` should point to the API server.

## AI Workflow Guidance
- Use the docs above to avoid asking setup or structure questions repeatedly.
- Prefer minimal, surgical changes and follow existing patterns in code.
- Do not add new dependencies unless absolutely necessary.
