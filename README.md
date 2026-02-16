## Pantry Web App

Next.js 16 App Router frontend for the Pantry application. This project provides the authenticated web experience for managing household pantries, built to pair with the Pantry FastAPI + Supabase backend.

### Table of Contents

- **Overview**
- **Current Status**
- **Tech Stack**
- **Prerequisites**
- **Setup**
- **Running the App**
- **Project Structure**
- **Key Routes**
- **Auth Flows**
- **Development Guidelines**

### Overview

Pantry Web is a modern, type-safe frontend that allows users to:

- **Sign in and sign up** to their Pantry account
- **View and manage pantry-related UI** (household items, recipes, shopping lists – planned)
- **Integrate with Supabase-backed auth and data** via server actions

The app is designed to mirror the backend domain model (pantry items, recipes, shopping lists, households, and user preferences) and to provide a clean, mobile-first UI.

### Current Status

**Implemented**

- Login page at `/` with:
  - Email + password form
  - Zod + React Hook Form validation
  - Shadcn UI components for layout and fields
  - Supabase-backed login via server action `signInWithEmailPasswordAction` (no API route)
- Registration page at `/register` with:
  - Name, email, password fields
  - Shared typography and form primitives
  - Server action-powered signup using `signUpFormAction` and Supabase auth
- Auth types and initial state in `app/(auth)/auth-types.ts`; server actions in `app/(auth)/actions.ts`
- Auth confirmation route at `app/auth/confirm/route.ts` for email verification
- Auth proxy configured with `proxy.ts` and `lib/supabase/proxy.ts` using `supabase.auth.getClaims()` to keep sessions in sync
- Global layout with Nunito Sans font and Tailwind CSS styling
- Shared typography and UI primitives (`components/ui` and `components/typography`)
- Authenticated dashboard shell under `/dashboard`:
  - `app/dashboard/layout.tsx` enforces Supabase auth, ensures user profile and household membership (`checkForHouseholdMembership`), and renders `SidebarProvider` with `AppSidebar` and `SidebarInset`
  - Collapsible sidebar: `AppSidebar` (with `NavMain`, `NavUser`), `SiteHeader` with `SidebarTrigger` (toggle open/close), and nav links to Home, Pantry, Recipes, Shopping Lists, Household via Next.js `Link`
  - `app/dashboard/page.tsx` shows the pantry overview with `SectionCards`, `ChartAreaInteractive`, and recipe/activity cards
- Hook `hooks/use-supabase-user.ts` for client-side user state

**Planned**

- Migrate auth actions to `next-safe-action` for stronger type safety
- Expand the dashboard with real pantry data (items, recipes, shopping lists, preferences)
- Household switching and sharing flows

### Tech Stack

- **Framework**: Next.js 16 App Router (React Server Components first)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui-style primitives, Radix UI, custom `components/ui/*`
- **Forms**: React Hook Form + Zod
- **Font**: Google `Nunito Sans` via `next/font`
- **Package Manager**: Bun (lockfile present)

### Prerequisites

- **Node.js / Bun**:
  - Node 20+ recommended
  - Bun installed (`bun -v`)
- **Backend**:
  - Pantry Server running locally or deployed (FastAPI + Supabase)
  - Supabase project configured (for future auth/data integration)

### Setup

From the `my-app` directory:

```bash
# Install dependencies (preferred)
bun install
```

Create a `.env.local` file for frontend configuration (values to be aligned with the backend and Supabase setup):

```bash
cp .env.example .env.local  # if present
# otherwise create .env.local manually
```

Typical variables:

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` – Supabase anon/publishable key
- `NEXT_PUBLIC_PANTRY_API_URL` – Backend API base URL (e.g. `http://127.0.0.1:8000`) for household creation and other API calls

### Running the App

Start the development server:

```bash
bun dev
```

Then open `http://localhost:3000` in your browser.

### Project Structure

Relevant frontend directories:

```text
app/
  layout.tsx              # Root layout, global font + shell
  (auth)/
    actions.ts            # Server actions: signIn, signUp, signUpFormAction
    auth-types.ts         # AuthActionResult type and INITIAL_AUTH_ACTION_RESULT
    page.tsx              # Login route (`/`)
    register/
      page.tsx            # Registration route (`/register`)
  auth/
    confirm/
      route.ts            # Auth confirmation (e.g. email verification)
  dashboard/
    layout.tsx            # Auth-protected shell: SidebarProvider, AppSidebar, household check
    page.tsx              # Pantry overview (SectionCards, chart, recipe cards)
    settings/
      page.tsx            # Placeholder for dashboard settings

components/
  app-sidebar.tsx         # Dashboard sidebar (NavMain, NavUser, collapsible)
  nav-main.tsx            # Sidebar nav links (Quick Add + Link to Home, Pantry, Recipes, etc.)
  nav-user.tsx            # Sidebar footer user menu
  site-header.tsx         # Dashboard header with SidebarTrigger (client)
  section-cards.tsx       # Dashboard section cards
  chart-area-interactive.tsx
  data-table.tsx
  layouts/
    dashboard-header.tsx  # Shared dashboard header (title, subtitle, user, primary action)
  dashboard/
    pantry-stat-card.tsx # Reusable stat card for pantry metrics
  pages/
    login-form.tsx        # Login form (client, RHF + Zod, signInWithEmailPasswordAction)
    signup-form.tsx       # Signup form UI + useActionState(signUpFormAction)
  typography.tsx          # Shared typography primitives (H1–H4, body, etc.)
  ui/
    button.tsx, card.tsx, input.tsx, field.tsx, label.tsx, separator.tsx
    sidebar.tsx           # SidebarProvider, Sidebar, SidebarTrigger, etc.
    sonner.tsx, toaster.tsx

hooks/
  use-supabase-user.ts    # Client hook for Supabase user state
  use-mobile.ts           # Breakpoint for sidebar (sheet vs collapsible)

lib/
  auth/
    checks/
      actions.ts    # ensureUserProfile, checkForHouseholdMembership (RLS-safe)
    utils.ts        # Auth utilities
  data/
    actions.ts      # Data fetching server actions
    types.ts        # Data interfaces (Profile, Household, etc.)
    recipe.ts       # Recipe fetch helpers
  supabase/
    client.ts, server.ts, proxy.ts
  copy/
    pantry-dashboard.ts   # Copy for pantry dashboard text

proxy.ts                  # Next.js proxy: updateSession, matcher
```

This structure follows Next.js App Router conventions and keeps auth, shared components, and UI primitives clearly separated.

### Key Routes

- `/` – Login page
  - Renders brand header and `LoginForm`
  - Validates email and password using Zod schema
  - Submits via `signInWithEmailPasswordAction` server action (no API route)
- `/register` – Registration page
  - Reuses brand header
  - Renders `SignupForm` with name, email, and password fields
  - Submits via Next.js `<Form />` and `useActionState` to `signUpFormAction`
- `/dashboard` – Authenticated pantry overview
  - Protected by Supabase via `app/dashboard/layout.tsx` and the global proxy; ensures user profile and household membership (creates default household via API if needed)
  - Sidebar: collapsible/offcanvas with nav links (Home, Pantry, Recipes, Shopping Lists, Household) and header trigger; `SiteHeader` is a client component so `SidebarTrigger` receives sidebar context
  - Main content: section cards, interactive chart, and recipe/activity cards

Additional routes for pantry items, recipes, and shopping lists live under `/pantry`, `/recipes`, `/shopping-lists`, `/household` (linked from the sidebar).

### Auth Flows

Current behavior:

- Login form:
  - Uses React Hook Form with Zod for client-side validation
  - Builds `FormData` from values and calls `signInWithEmailPasswordAction` server action directly
  - Server action validates with Zod and calls `supabase.auth.signInWithPassword`; on success redirects to `/dashboard`
- Signup form:
  - Collects name, email, and password
  - Uses `<Form />` + `useActionState` to call `signUpFormAction`
  - Server action validates input with Zod and calls `supabase.auth.signUp`
- Supabase proxy:
  - `proxy.ts` routes all relevant requests through `updateSession` in `lib/supabase/proxy.ts`
  - Proxy uses `supabase.auth.getClaims()` to keep auth tokens refreshed and safe to read in server components

Planned behavior:

- Use `next-safe-action` to wrap server actions for login/signup and future mutations
- Extend the dashboard shell to include pantry items, recipes, shopping lists, and household management

### Development Guidelines

- Use **React Server Components** by default in `app/` pages and layouts
- Keep **client components** small and focused (forms, interactive widgets)
- Use **TypeScript** everywhere with explicit types for public functions
- Prefer shared primitives from:
  - `components/ui/*` for low-level UI
  - `components/typography.tsx` for headings and text
- Keep forms consistent:
  - `react-hook-form` + `@hookform/resolvers/zod`
  - Zod schemas colocated with the form when possible

For backend details and domain logic, see the Pantry Server README (FastAPI project). This frontend is intentionally kept thin, delegating business logic and data consistency to the backend API.

### Recent Updates

- **Dashboard shell**:
  - Collapsible sidebar with `SidebarProvider`, `AppSidebar`, `NavMain` (Next.js `Link` for each nav item), and `NavUser`. Header uses `SiteHeader` (client component) with `SidebarTrigger` so the toggle works within the sidebar context.
  - Dashboard layout runs `checkForHouseholdMembership`; if the Supabase RLS policy triggers infinite recursion (code `42P17`), the app treats it as existing membership and does not block the dashboard.
- **Data & auth**:
  - Profile creation and household check in `lib/auth/checks/actions.ts`; data types in `lib/data/types.ts`. Backend household creation uses `NEXT_PUBLIC_PANTRY_API_URL`.
- **Auth**:
  - Logout via `signOutAction` in `app/(auth)/actions.ts`.
- **Supabase**:
  - RLS fix for `household_members` (no recursion): use policy `household_members_select_own` with `USING (user_id = auth.uid())`. Migration: `server/supabase/migrations/20260216000000_household_members_rls_fix.sql`.
