# AGENTS.md

Operating manual for coding agents. Follow these rules to build, test, and contribute safely and consistently.

## 1) Project summary (2–3 lines)
This repository hosts **Meguru Kogeisha** — a Next.js (App Router) web app that visualizes Japanese craft communities and projects. Stack: **Next.js 15**, **TypeScript**, **Tailwind CSS 4**, package manager **pnpm**. Supabase will be added later for auth & data.

## 2) Allowed scope
- Implement UI pages/sections and reusable components.
- Add API Route Handlers under `src/app/api/*` (GET/POST…).
- Wire simple server-side data flows using RSC or Route Handlers.
- Set up basic test/lint/typecheck scaffolding if missing.
- Prepare, but **do not commit**, local `.env` changes (see Secrets).

## 3) Guardrails (read first)
- **Never commit secrets** (API keys, DB URLs). Keep `.env.local` untracked; mirror required keys in `./.env.example`.
- **No destructive scripts** (e.g., `rm -rf`) or breaking env changes.
- **Dependency hygiene**: avoid heavy/unused libs; justify additions in PR.
- **Client vs Server**
  - Prefer **React Server Components**. Use `"use client"` **only** for interactivity.
  - Do **not** import server-only code into client modules. For server-only files add: `import "server-only"`.
- **Styling**: Tailwind-first; keep class lists readable; use responsive/state variants.
- **Accessibility**: labels, focus states, contrast; semantic HTML.
- **DB/Migrations**: Until Supabase lands, **do not** add schema/migrations. When added, include migration + rollback plan in PR.

## 4) Local setup
    pnpm i
    pnpm dev
    # open http://localhost:3000

Node: use active LTS (>= 20). If pnpm is missing:
    corepack enable && corepack prepare pnpm@9 --activate

## 5) Quality gates (must pass pre-commit/PR)
    pnpm lint
    pnpm typecheck
    pnpm build
    pnpm test   # optional until tests exist

### Suggested scripts (add if missing)
    {
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "eslint .",
        "typecheck": "tsc --noEmit",
        "test": "vitest run --reporter=dot"
      }
    }

## 6) Layout conventions
    src/
      app/
        page.tsx            # Home (RSC)
        layout.tsx          # Root layout & metadata
        api/
          <route>/route.ts  # Route Handlers (GET/POST…)
      components/           # Reusable UI (client or server)
      lib/                  # Server utilities (add: import "server-only" when needed)
    public/                 # Static assets

## 7) Patterns

### Data fetching
- Prefer **RSC** server data fetching when possible (no client bundle).
- For client interactions, create a **Route Handler** under `app/api/*` and `fetch` it from the client.
- Avoid mixing server logic into client components.

### Tailwind
- Keep utilities readable and grouped.
- Use variants (`md:`, `hover:`) rather than custom CSS unless necessary.

### Fonts & CSS
- Use `next/font` for fonts; Tailwind v4 works without extra PostCSS config.

## 8) Secrets / env
Create a local env file (untracked):
    .env.local
When Supabase is introduced, expected variables (example):
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
Whenever new envs are required, add empty keys to `/.env.example`.

## 9) Git & PR workflow

### Branching
- Create feature branches from `main`: `feat/<topic>` or `fix/<topic>`.

### Commits (Conventional Commits)
- Examples:
  - `feat: add craft hub header`
  - `fix: repair next/font import path`
  - `chore: bump eslint-config-next`

### Pull Requests
- **Title**: `[web] <short description>`
- **Body must include**:
  - Motivation & scope
  - Screenshots (UI) or API examples
  - Notes on a11y & performance
  - Verification outputs: `pnpm lint && pnpm typecheck && pnpm build`
- Keep PRs small and focused.

## 10) Mini playbooks

### A) New page (RSC)
1. Add `src/app/<slug>/page.tsx` (RSC).
2. Compose UI with Tailwind utilities.
3. `pnpm build` to verify.

### B) Client interaction (button/form)
1. Create a component under `src/components/...` with `"use client"`.
2. If server data is needed, add `src/app/api/<name>/route.ts` and call via `fetch('/api/<name>')`.
3. Validate with `pnpm lint && pnpm typecheck`.

### C) Server utility
1. Place in `src/lib/<area>.ts` with `import "server-only"`.
2. Ensure only server files import it (RSC, Route Handlers).

## 11) Tests (when added)
- Use **Vitest** + **@testing-library/react**.
- Unit tests under `src/**/__tests__/*.test.ts(x)`.

## 12) CI (when added)
- Jobs: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test` (if present). Block merges on failure.

## 13) Housekeeping
- Keep `README.md` human-friendly.
- Keep `AGENTS.md` actionable for agents (commands, rules, guardrails).
- Store specs in `docs/` and link from README. Update `./.env.example` when envs change.