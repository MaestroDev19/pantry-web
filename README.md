## Pantry Web App

Next.js 14 App Router frontend for the Pantry application. This project provides the authenticated web experience for managing household pantries, built to pair with the Pantry FastAPI + Supabase backend.

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
- Registration page at `/register` with:
  - Name, email, password, and confirm password fields
  - Shared typography and form primitives
- Global layout with Nunito Sans font and Tailwind CSS styling
- Shared typography and UI primitives (`components/ui` and `components/typography`)

**Planned**

- Wire login and registration to Supabase auth using server actions and `next-safe-action`
- Authenticated app shell for pantry items, recipes, shopping lists, and preferences
- Household switching and sharing flows

### Tech Stack

- **Framework**: Next.js 14 App Router (React Server Components first)
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

Typical variables (to be populated once Supabase integration is wired in):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

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
  layout.tsx          # Root layout, global font + shell
  (auth)/
    page.tsx          # Login route (`/`)
    register/
      page.tsx        # Registration route (`/register`)

components/
  pages/
    login-form.tsx    # Login form (client component, RHF + Zod)
    signup-form.tsx   # Signup form UI
  typography.tsx      # Shared typography primitives (H1–H4, body, etc.)
  ui/
    button.tsx        # Button primitive (variants + sizes)
    card.tsx          # Card layout primitives
    input.tsx         # Styled input field
    field.tsx         # Higher-level form layout + error helpers
    label.tsx         # Accessible label wrapper
    separator.tsx     # Horizontal/vertical separator
```

This structure follows Next.js App Router conventions and keeps auth, shared components, and UI primitives clearly separated.

### Key Routes

- `/` – Login page
  - Renders brand header and `LoginForm`
  - Validates email and password using Zod schema
- `/register` – Registration page
  - Reuses brand header
  - Renders `SignupForm` with name, email, password, and confirm password fields

Additional routes for pantry items, recipes, and shopping lists will be added under `app/` as the domain UI grows.

### Auth Flows

Current behavior:

- Login form:
  - Uses React Hook Form with Zod for client-side validation
  - Calls a local handler (placeholder for Supabase-backed auth)
- Signup form:
  - Collects basic profile and credential information
  - Placeholder submit handler, ready to be wired to a server action

Planned behavior:

- Use `next-safe-action` to wrap server actions for login/signup
- Integrate with Supabase SSR helpers based on official guidance
- Redirect authenticated users into an application shell for pantry management

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
