# SwitchKey – Front-End Prototype (Phase 1)

A static, front-end-only prototype for the SwitchKey public site, authentication flow, and platform dashboard. No backend or database connectivity.

## Run locally

1. **Install dependencies** (first time only):

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

3. **Open the app in your browser**  
   The terminal will show a URL such as:
   - `http://localhost:5173/` (default)
   - If that port is in use, Vite will try the next one (e.g. `http://localhost:5174/` or `http://localhost:5175/`).

   Open the URL shown in the terminal in your browser to view the site.

### Optional: API server (Stripe & Escrow.com)

To load real balance and transactions on the Wallet page, run the API server in a **separate terminal**:

```bash
cp .env.example .env
# Edit .env and add STRIPE_SECRET_KEY, ESCROW_EMAIL, ESCROW_API_KEY (see .env.example)

npm run server
```

Keep `npm run dev` running in the first terminal. The dev server proxies `/api` to the backend (port 3001).

## Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/contact` | Contact form |
| `/sign-in` | Sign in → on success goes to dashboard |
| `/sign-up` | Sign up step 1 – basic info |
| `/sign-up/verify-email` | Sign up step 2 – 6-digit code |
| `/sign-up/password` | Sign up step 3 – create password |
| `/sign-up/terms` | Terms & Conditions (new users only); Accept → dashboard |
| `/sign-up/success` | Legacy post-signup (flow now goes via Terms) |

### Platform (requires auth)

| Route | Description |
|-------|-------------|
| `/dashboard` | Dashboard home (welcome, hero, recent projects, activity, task board) |
| `/dashboard?empty=1` | Empty dashboard state (no projects yet) |
| `/dashboard/project/:slug` | Project workspace placeholder (e.g. VideoNow, Tooth Tunes, ZoomBox) |

## Entry logic

- **Path A – Existing user**: Start Here → Sign In → success → Dashboard (no extra screens).
- **Path B – New user**: Start Here → Sign Up (steps 1–3) → Terms & Conditions → Accept and Continue → Dashboard. Terms acceptance is required before platform access.

## Features

- **Public site**: Home (hero, how it works, who it’s for, CTA) and Contact page
- **Auth flow**: Sign in and 3-step sign up with client-side validation; Terms screen for new users
- **Platform**: Sidebar (logo, Home, Create New Project, Projects list, user profile with Profile/Logout)
- **Dashboard**: Welcome message, “Ready for a new project?” hero (Join as Project Owner / Join as Vendor), Recent Projects table, Application Status panel, Activity feed, Kanban task board (To Do, In Progress, Done)
- **Empty state**: When there are no projects, dashboard shows “No projects yet” and “Create New Project”. Use `/dashboard?empty=1` to view it.
- **Design**: Clean, Stripe/Linear-style UI; max content width 1200px; CSS variables for tokens
- **Responsive**: Mobile-friendly public nav (hamburger); platform sidebar fixed; main content scrolls

### Fluid spacing grid

Layout spacing uses viewport-based **spacing grid** tokens on `:root` (`--1024px-spacing-grid-width`, `--1400px-spacing-grid-width`, `--1920px-spacing-grid-width`) and a single active `--spacing-grid-width` that switches formula at **1024px** and **1920px** viewport width. See **`docs/spacing-grid-calculations.md`** for the formulas and example px values at common screen sizes.


## Tech stack

- React 18 + Vite
- React Router
- Plain CSS (no Tailwind)

## Note

This is a prototype. Forms do not call any API; auth and terms acceptance are stored in `sessionStorage`. LinkedIn and email verification are placeholders. “Create New Project” and “Join as…” flows are placeholders for later design.
