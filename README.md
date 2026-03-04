## Pantry Web App

Next.js App Router frontend for the Pantry application. This project provides the authenticated web experience for managing household pantries, built to pair with the Pantry FastAPI + Supabase backend.

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

- Auth group under `app/(auth)`:
  - Login page at `/` rendering `LoginForm` from `components/auth/login.tsx`
  - Signup page at `/signup` rendering `SignupForm` from `components/auth/signup.tsx`
  - Shared `AuthLayout` in `app/(auth)/layout.tsx` for branding and centered card layout
- Email confirmation route at `app/auth/confirm/route.ts` using Supabase OTP verification
- Supabase client helpers in `lib/supabase/{client,server,proxy}.ts`
- Auth checks in `lib/checks/{profile,household}.ts`
- Dashboard under `/dashboard`:
  - `app/dashboard/layout.tsx` (auth-protected shell, sidebar + header)
  - `app/dashboard/page.tsx` (section cards, expiration table, data table)
  - `app/dashboard/account/page.tsx` (Account Settings: profile card, email/name, password section)
- Shared dashboard components in `components/dashboard/*`
- Reusable UI primitives in `components/ui/*` (button, card, input, field, drawer, dialog, etc.)
- Utility helpers in `lib/utils.ts` (e.g. `cn`)
- Responsive hook `hooks/use-mobile.ts` for mobile breakpoints

**Planned**

- Expand the dashboard with real pantry data (items, recipes, shopping lists, preferences)
- Household switching and sharing flows

### Tech Stack

- **Framework**: Next.js App Router (React Server Components first)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui-style primitives, Radix UI, custom `components/ui/*`
- **Forms**: `@tanstack/react-form` + Zod
- **Font**: Google `Nunito Sans` via `next/font`
- **Package Manager**: Bun (lockfile present)

### Prerequisites

- **Node.js / Bun**:
  - Node 20+ recommended
  - Bun installed (`bun -v`)
- **Backend**:
  - Pantry Server running locally or deployed (FastAPI + Supabase)
  - Supabase project configured (for auth and data)

### Setup

From the project root:

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
  layout.tsx              # Root layout, global font + Toaster
  (auth)/
    layout.tsx            # Shared auth layout (brand + centered card)
    page.tsx              # Login route (`/`)
    signup/
      page.tsx            # Signup route (`/signup`)
  auth/
    confirm/
      route.ts            # Auth confirmation (email verification via Supabase)
    reset-password/
      page.tsx            # Request password reset email (Supabase PKCE flow)
    update-password/
      page.tsx            # Change password after email link redirect
  dashboard/
    layout.tsx            # Auth-protected shell: sidebar, header, checks
    page.tsx              # Pantry overview (section cards, expiration + data table)
    data.json             # Mock dashboard data for the main table

components/
  app-sidebar.tsx         # Dashboard sidebar (NavMain, NavUser, collapsible)
  nav-main.tsx            # Sidebar nav links
  nav-user.tsx            # Sidebar footer user menu
  site-header.tsx         # Dashboard header with sidebar trigger
  dashboard/
    data-table.tsx        # Main pantry data table
    expiration-table.tsx  # Upcoming expiration list
    section-cards.tsx     # Dashboard summary cards
  auth/
    login.tsx             # Login form (client, TanStack React Form + Zod)
    signup.tsx            # Signup form (client)
    confirm.tsx           # Confirmation messaging
  ui/
    button.tsx, card.tsx, input.tsx, field.tsx, label.tsx, separator.tsx
    drawer.tsx, dialog.tsx, dropdown-menu.tsx, table.tsx, tabs.tsx, checkbox.tsx
    sidebar.tsx, sheet.tsx, tooltip.tsx, calendar.tsx, popover.tsx, etc.

hooks/
  use-mobile.ts           # Breakpoint hook for responsive sidebar

lib/
  config.ts               # App configuration constants
  dashboard.ts            # Dashboard data fetching & helpers
  auth-errors.ts          # Auth error mapping
  session.ts              # Session helpers
  checks/
    profile.ts            # ensureUserProfile logic
    household.ts          # checkForHouseholdMembership logic
  supabase/
    client.ts             # Supabase client for client components
    server.ts             # Supabase client for server components
    proxy.ts              # Supabase session update proxy helpers
  dal/
    auth.ts               # Auth-related DAL helpers
  validations/
    auth.ts               # Zod schemas for auth forms
    pantry.ts             # Zod schemas for pantry-related data
  utils.ts                # Shared utilities (e.g. `cn`)

proxy.ts                  # Next.js middleware-style proxy: updateSession, matcher
```

This structure follows Next.js App Router conventions and keeps auth, shared components, and UI primitives clearly separated.

### Key Routes

- `/` – Login page
  - Renders `LoginForm` from `components/auth/login.tsx`
  - Validates email and password using a Zod-based `loginSchema`
  - Submits via a Supabase-backed auth flow
- `/signup` – Signup page
  - Renders `SignupForm` from `components/auth/signup.tsx`
  - Validates name, email, and password with Zod
  - Calls Supabase signup via server-side helpers
- `/auth/confirm` – Email confirmation
  - Handles Supabase email OTP verification
  - Ensures profile and household membership, then redirects to `/dashboard`
- `/dashboard` – Authenticated pantry overview
  - Protected by Supabase; ensures user profile and household membership
  - Sidebar with navigation and user menu
  - Main content: section cards, expiration table, and data table

Additional routes for pantry items, recipes, and shopping lists can be added under `/pantry`, `/recipes`, `/shopping-lists`, `/household` using the existing dashboard shell.

### Auth Flows

Current behavior:

#### Login & Signup

- **Login form**:
  - Uses `@tanstack/react-form` with Zod for client-side validation
  - Calls a Supabase-backed login helper and redirects to `/dashboard` on success
- **Signup form**:
  - Collects name, email, and password
  - Validates with Zod
  - Calls Supabase `auth.signUp` via server-side helpers
- **Supabase proxy**:
  - `proxy.ts` routes relevant requests through helpers in `lib/supabase/proxy.ts`
  - Proxy keeps auth tokens refreshed and safe to read in server components

#### Password Reset (Supabase PKCE)

- **Trigger reset**:
  - From `/dashboard/account`, the **Change Password** button links to `/auth/reset-password`
  - `app/auth/reset-password/page.tsx` collects the user&apos;s email and calls:
    - `supabase.auth.resetPasswordForEmail(email, { redirectTo: NEXT_PUBLIC_SITE_URL + "/auth/update-password" })`
  - `NEXT_PUBLIC_SITE_URL` must be set and `/auth/update-password` must be allowed in Supabase Auth → Redirect URLs
- **Complete reset**:
  - After the email link is clicked, Supabase redirects to `/auth/update-password` with a short-lived auth code (PKCE flow)
  - `app/auth/update-password/page.tsx` is a client page that:
    - Uses the browser Supabase client (`lib/supabase/client.ts`)
    - Calls `supabase.auth.updateUser({ password: "<new-password>" })`
    - Redirects back to `/dashboard/account` on success

This follows Supabase&apos;s recommended PKCE password reset flow ([Password-based Auth docs](https://supabase.com/docs/guides/auth/passwords?queryGroups=flow&flow=pkce#resetting-a-password)).

Planned behavior:

- Extend the dashboard shell to include pantry items, recipes, shopping lists, and household management

### Development Guidelines

- Use **React Server Components** by default in `app/` pages and layouts
- Keep **client components** small and focused (forms, interactive widgets)
- Use **TypeScript** everywhere with explicit types for public functions
- Prefer shared primitives from `components/ui/*` for low-level UI
- Keep forms consistent with Zod schemas colocated near the form logic when possible

For backend details and domain logic, see the Pantry Server README (FastAPI project). This frontend is intentionally kept thin, delegating business logic and data consistency to the backend API.
