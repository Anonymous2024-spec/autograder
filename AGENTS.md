# Agent Instructions for AutoGrader

## Project Overview
This is a **React Native Expo** mobile application for automated MCQ grading in university settings. Frontend only (backend is separate Node.js/MySQL). Three user roles route to different dashboards: admin, lecturer (teacher), student.

## Key Commands
- `yarn start` — Start Expo dev server (will prompt for platform: iOS, Android, or web)
- `yarn lint` — Run ESLint (uses `eslint-config-expo`)
- `yarn ios` / `yarn android` / `yarn web` — Start on specific platform directly
- No tests configured; no build step; no formatter configured (use ESLint for style)

## Navigation & Routing
- **Expo Router** with file-based routing in `app/`
- **Three main groups** (layout-enforced):
  - `app/(auth)/login.tsx` — Public login screen
  - `app/(admin)/` — Admin dashboard and screens
  - `app/(lecturer)/` — Lecturer (teacher) dashboard and screens
- **Auth gating** in `app/_layout.tsx:13-27` — Routes unauthenticated users to login, authenticated users to role-specific dashboard
- **Critical:** Role check happens in `_layout.tsx` at line 21-24; student role is not yet routed (see auth context)

## Authentication & State
- **AuthContext** (`context/AuthContext.tsx`) manages login, token, user object
- **Current state:** Demo auth accepts three emails with any password:
  - `admin@gmail.com` → role: "admin"
  - `teacher@gmail.com` → role: "lecturer"
  - `student@gmail.com` → role: "student" (role type added to User interface, but _layout.tsx only routes "admin" or "lecturer")
- **Persistence:** Uses `expo-secure-store` to cache token and user JSON across app restarts
- **To add production auth:** Replace the hardcoded email checks in `AuthContext.login()` (lines 55-102) with real API fetch

## Code Structure
- `components/` — Reusable UI (Button, Input, etc.)
- `constants/` — Design tokens (Colors, FontSize, Spacing, Shadows, Radius)
- `context/` — AuthContext (only auth state; no other global state)
- `hooks/` — Theme utilities only (`use-color-scheme`, `use-theme-color`)
- `assets/` — Images and fonts

## TypeScript & Linting
- `tsconfig.json` extends `expo/tsconfig.base` with strict mode enabled
- Path alias `@/*` maps to root (e.g., `@/components` = `./components`)
- ESLint uses Expo preset; ignore pattern: `dist/*`

## Missing Pieces for Agents
1. **Student dashboard route** — Role "student" exists in auth but not routed in `_layout.tsx`; add `app/(student)/dashboard.tsx` and extend routing logic
2. **No backend integration yet** — API calls are stubbed; see `AuthContext.tsx:95-110` for fetch template
3. **No tests** — No test runner, fixtures, or test files in repo
4. **Camera integration planned** — `expo-camera` in dependencies and plugin config, but not used yet

## Common Gotchas
- **Secure Store limitations on web:** `expo-secure-store` fails silently or is unavailable in web mode; code should handle gracefully
- **Expo Router typing:** `experimentalTypedRoutes` enabled in `app.json:50`; use typed links where possible
- **Role-based redirect:** If adding student flow, update the elif in `_layout.tsx:20-26`
- **Password field:** Currently does nothing in demo auth; required in UI but ignored in login logic
