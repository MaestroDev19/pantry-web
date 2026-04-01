# 🥗 Pantry Web Application

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4+-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Auth/DB-3ECF8E?style=for-the-badge&logo=supabase)

Welcome to the **Pantry Web Application** frontend repository! This is a modern, type-safe, and highly responsive web application built to help users manage their household pantries, discover recipes based on their inventory, and seamlessly generate shopping lists.

Designed as the graphical interface for the Pantry FastAPI Backend, this application leverages the power of Next.js App Router, React Server Components (RSC), and Supabase to deliver a fast, secure, and intuitive user experience.

---

## 📑 Table of Contents

1. [System Architecture & Tech Stack](#system-architecture--tech-stack)
2. [Core Features & Roadmap](#core-features--roadmap)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation & Setup](#installation--setup)
   - [Environment Configuration](#environment-configuration)
4. [Project Structure](#project-structure)
5. [Authentication Architecture](#authentication-architecture)
6. [Component Library & Styling](#component-library--styling)
7. [Development Guidelines](#development-guidelines)
8. [Data Fetching & State Management](#data-fetching--state-management)

---

## 🏗️ System Architecture & Tech Stack

Pantry Web is built on a modern, React-centric stack focusing on performance, developer experience, and maintainability.

- **Framework**: [Next.js (App Router)](https://nextjs.org/docs/app) - Utilizing Server Components for fast initial loads and SEO, and Client Components for rich interactivity.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Strict typing across the entire codebase to catch errors at compile time.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first styling with a custom OKLCH color system defined in `globals.css` for vibrant, consistent theming (including flawless Dark Mode support).
- **UI Architecture**: [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/) - Accessible, unstyled primitives combined with Tailwind for a bespoke but standardized component library.
- **Form Handling**: [@tanstack/react-form](https://tanstack.com/form/latest) paired with [Zod](https://zod.dev/) for robust, type-safe client and server validation.
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth) - Session refresh and protected routes use `proxy.ts` (Next.js 16 request proxy) with `lib/supabase/proxy.ts`, plus secure Server Actions.
- **Package Manager**: [Bun](https://bun.sh/) - For lightning-fast dependency resolution and script execution.

---

## 🕒 Current Status

Pantry Web has completed its foundational UI layout and Authentication systems. 
- **Active Sprint Focus**: Constructing the frontend logic and UI layers for the Dashboard and Shopping List features using mocked component data. 
- **Next Milestone**: Data fetching integration with the Python backend to connect the UI pieces developed (Pantry Health, Items By Category, Chef ACE Suggestions, and Shopping Lists) with their live data counterparts.

---

## ✨ Core Features & Roadmap

### ✅ Currently Implemented
- **Robust Authentication**: Secure login, registration, and email verification flows seamlessly integrated with Supabase.
- **PKCE Password Management**: Full password reset email flows utilizing secure PKCE exchanges.
- **Protected Dashboard Shell**: A responsive sidebar/header layout (`app/dashboard/layout.tsx`) that acts as the control center, verifying auth and household membership automatically.
- **Pantry Health Dashboard**: Visual overviews of pantry status, including expiration warnings, fresh item counts, and recent activity trackers.
- **Account & Profile Management**: Password reset and update flows under `app/auth/`; full account settings UI is planned.
- **Responsive UI Foundations**: A complete suite of reusable UI components ranging from sophisticated Charts (`recharts`) to mobile-friendly Drawers.

### 🚧 WIP / Planned
- **Shopping List Generator**: AI-assisted (`Chef ACE`) and manual grocery list creation based on current pantry depletion.
- **Pantry Inventory Management**: Full CRUD capabilities for adding, scanning, tracking, and removing household ingredients.
- **Culinary AI Integration (Chef ACE)**: Daily recipe suggestions specifically tailored to utilizing ingredients before they expire.
- **Household Sharing**: Granular controls for inviting roommates or family members to a shared pantry instance.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local development machine:
1. **Node.js** (v20+ recommended)
2. **Bun** (`curl -fsSL https://bun.sh/install | bash`)
3. A running instance of the **Pantry FastAPI Backend**.
4. A configured **Supabase Project** (for Auth and Database access).

### Installation & Setup

Clone the frontend repository and install dependencies using Bun to ensure the `bun.lockb` lockfile is respected.

```bash
# Clone the repository
git clone <repository-url>
cd pantry

# Install all dependencies reliably and fast
bun install
```

### Environment Configuration

The application requires specific environment variables to communicate with Supabase and your Python backend.

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Populate `.env.local` with your specific keys:

```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key

# Backend API Configuration
# Points to your FastAPI server handling the core business logic
NEXT_PUBLIC_PANTRY_API_URL=http://127.0.0.1:8000

# Next.js specific
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Starting the Server

Run the development server with Hot Module Replacement (HMR):

```bash
bun dev
```
Navigate to `http://localhost:3000` to view the application.

---

## 📂 Project Structure

Pantry Web utilizes a feature-based folder structure heavily organized around the Next.js App Router paradigm.

```text
app/
 ├── (auth)/                  # Route group for unauthenticated flows
 │   ├── layout.tsx
 │   ├── page.tsx             # Login
 │   └── signup/              # Registration
 ├── auth/                    # Auth callbacks (OTP confirm, password flows)
 │   └── confirm/
 ├── dashboard/               # Authenticated shell (nav, household status)
 │   ├── layout.tsx
 │   ├── page.tsx             # Dashboard overview
 │   ├── pantry/              # Pantry UI
 │   ├── recipes/             # Recipes placeholder / future Chef ACE
 │   └── shopping-list/       # Shopping list
 ├── globals.css
 └── layout.tsx               # Root layout, fonts, providers

components/
 ├── auth/
 ├── dash/
 ├── nav.tsx                  # Dashboard navigation
 └── ui/

lib/
 ├── checks/                  # Profile & household checks
 ├── supabase/                # SSR / browser clients; proxy session helper
 └── ...

proxy.ts                      # Next.js 16 proxy entry (session refresh, auth redirects)
```

---

## 🔐 Authentication Architecture

Authentication is a critical layer of the Pantry app, deeply integrated with Supabase.

1. **Proxy pre-flight**: `proxy.ts` runs on matched routes and delegates to `lib/supabase/proxy.ts` to refresh Supabase cookies and redirect unauthenticated users away from protected areas.
2. **Dashboard layout**: `app/dashboard/layout.tsx` loads user profile data via `getDashboardData()` and shows a banner when household setup cannot complete (e.g. missing `NEXT_PUBLIC_PANTRY_API_URL` or API errors). It does not redirect solely for missing household; the banner explains next steps.
3. **PKCE Password Flow**: 
   - User requests a reset -> Supabase emails a secure magic link.
   - User clicks link -> Redirects to our Next.js app, which exchanges the code for a session.
   - User is redirected to `/auth/update-password` to securely input their new credentials using the active browser session.

---

## 🎨 Component Library & Styling

We hold front-end aesthetics to a very high standard. 

- **Styling Paradigm**: Utility classes via Tailwind CSS are the standard. Inline `style={{}}` tags should be strictly avoided unless calculating dynamic geometry (like charts).
- **Color System**: The project uses **OKLCH** color values defined in `app/globals.css`. By leveraging OKLCH, our primary, secondary, and accent colors maintain perceived lightness consistency across both Light and Dark themes.
- **shadcn/ui**: All base components (Buttons, Inputs, Cards, Dropdowns) live in `components/ui/`. If a component needs to be altered globally, change its definition in `components/ui/`. 
- **Icons**: [Lucide React](https://lucide.dev/) and [@tabler/icons-react](https://tabler.io/icons) are the standard icon libraries. Avoid importing external SVGs if an existing icon suffices.

---

## 🛠️ Development Guidelines

To ensure velocity and maintainability, adhere to the following principles when contributing:

1. **Server Components First**: By default, everything in `app/` should be a Server Component. Only add `"use client";` at the top of a file when you strictly require React state (`useState`), lifecycle hooks (`useEffect`), or browser-only APIs.
2. **Push Interactivity Down the Tree**: If a page needs state, don't make the entire page a Client Component. Create a smaller child widget (e.g., `components/dash/chef-ace-card.tsx`), mark *that* as `"use client"`, and import it into your Server Component page.
3. **Strict Validation**: All external boundaries must be typed. Use Zod schemas in `lib/validations/` for form inputs *and* for parsing data returned from the Python API backend.
4. **Error Handling**: Use React Error Boundaries natively through Next.js `error.tsx` files. Server Actions should return standardized objects (e.g., `{ success: false, error: "Message" }`) rather than relying purely on throwing exceptions.

---

## 📡 Data Fetching & State Management

- **Database Reads**: For user configuration and direct database reads, we utilize the `@supabase/ssr` server client directly in Server Components.
- **API Writes / Complex Logic**: For high-level business logic (like AI recipe generation or assigning items to new households), we dispatch requests to the **FastAPI Backend**, using the user's Supabase JWT in the `Authorization` header to authenticate the system-to-system call. 
- **State**: Global state managers (Redux/Zustand) are intentionally omitted. We rely on Next.js App Router for caching and server state, and localized React state context for isolated UI features.
