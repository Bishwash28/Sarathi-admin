# SARATHI Admin Panel

React + Vite + TypeScript + Tailwind CSS (v4) admin dashboard for SARATHI.
Runs entirely on demo data out of the box, and switches to a real backend
— Supabase, MySQL, or MongoDB — with a **one-line `.env` change**, not a
rewrite. No page component ever imports a database client directly; they
all go through one shared interface.

## Getting started

```bash
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`). You'll land on
`/login` — sign in with the fallback demo credentials shown on screen:
```
Email:    admin@sarathi.com
Password: admin123
```

Everything works immediately: all 10 pages, search/filter/pagination,
edit/suspend/delete actions, KYC document review — all running on sample
data. No setup required for this part.

## How the "connect any backend" part works

```
src/features/*.tsx  →  useProviderQuery()  →  dataProvider  →  src/connection/index.ts
                                                                        │
                                              picks ONE of these, based on .env:
                                                                        │
                              ┌──────────┬───────────┬─────────┬───────┴──────┐
                              │   demo   │  supabase │  mysql  │   mongodb    │
                              └──────────┴───────────┴─────────┴──────────────┘
```

Every page calls `useProviderQuery((p) => p.getUsers())` (etc.) instead of
importing data directly. `src/connection/index.ts` reads `VITE_BACKEND`
from `.env` and hands back whichever backend implementation matches —
`demo` if unset. That's the entire switch. Pages, components, hooks, and
theming never change no matter which backend is active.

## File naming — how to tell what to touch

| Prefix / marker | Meaning |
|---|---|
| `r_` | **Remove later.** Demo/sample data files — `src/data/r_*.ts`. Only imported by `src/connection/demo/provider.ts`. Delete the whole `src/data/` folder once you're not using the demo backend anymore. |
| `c_` | **Change this / this is what you run.** The two example backend servers (`src/connection/mysql/c_server.example.js`, `src/connection/mongodb/c_server.example.js`) and the auth store (`src/store/c_authStore.ts`, worth knowing about even though you likely won't edit it). |
| *(no prefix)* | Stable — components, hooks, types, the `connection/` provider files themselves. Not meant to change per-backend. |

## Connecting a real backend

**Pick one** — each has its own folder with a complete, self-contained
setup guide:

- **[`src/connection/supabase/README.md`](src/connection/supabase/README.md)** —
  easiest option. Supabase's database is **PostgreSQL** under the hood;
  the admin panel talks to it directly from the browser (via the `anon`
  key + Row Level Security), no separate server needed. There's no
  separate admins table — an admin is just a row in the same `users`
  table riders/passengers live in, with `role = 'Admin'`. Steps: create
  one Supabase Auth account, run some SQL, add two env vars.
- **[`src/connection/mysql/README.md`](src/connection/mysql/README.md)** —
  browsers can't talk to MySQL directly, so this includes a ready-to-run
  example Express API (`c_server.example.js`) plus `schema.sql`. You run
  that server as its own process alongside the frontend.
- **[`src/connection/mongodb/README.md`](src/connection/mongodb/README.md)** —
  same idea as MySQL: a ready-to-run example Express + Mongoose API
  (`c_server.example.js` + `models.example.js`), run as its own process.

Whichever you pick, the last step is always the same — set it in `.env`:
```
VITE_BACKEND=supabase   # or: mysql / mongodb
```
Restart `npm run dev`. The login page's status banner flips from yellow
("not configured — using fallback login") to green ("Connected —
{Backend}"), and every page starts pulling real data instead of the `r_`
sample files.

## Account lifecycle (why there's no "Add User" button)

Riders and passengers are **never created from the admin panel**:
- **Passengers** register directly from the mobile app.
- **Riders** register from the app too, then are automatically added here
  once their KYC documents are approved on the **KYC Verification** page.

The admin panel's role on Users/Riders/Passengers is Edit,
**Suspend/Reactivate** (the ban icon — for rule violations), and Remove
— not creation.

**The admin account itself** works the same way across all three real
backends: there's **no separate admins table/model**. An admin is just a
row in the same users table/collection, with `role = 'Admin'` — the
login check queries that role directly rather than joining to another
table. See each backend's README under `src/connection/` for the exact
schema and how to create that one account by hand (there's intentionally
no admin signup page anywhere in the app).

## What's actually functional (not just visual)

- Every page's search box, status filter, and pagination are wired to
  real state (`src/hooks/useTableState.ts`), and initial data comes from
  `dataProvider` (`src/hooks/useProviderQuery.ts`) — so switching
  backends changes what actually loads.
- **Users / Riders / Passengers** — Edit, Suspend/Reactivate, and Delete
  work against local state seeded from that fetch, with confirmation
  dialogs and toast feedback.
- **Rides** — View opens a detail modal; non-completed rides can be
  cancelled (with confirmation).
- **Bookings / Payments** — View opens a read-only detail modal.
- **Reviews** — clicking a comment opens the full review with a Remove
  action.
- **Riders → KYC link** — a rider with unverified docs shows a clickable
  "Pending — Review" badge; clicking it jumps to `/kyc?rider=<id>` and
  auto-opens that rider's document review modal.
- **Dashboard date range** (Today/7D/30D/YTD) re-fetches from the
  provider per range.
- **Toasts** — every action shows a bottom-right confirmation.

**Important scope note:** fetching (the initial page load) goes through
the provider and genuinely changes per backend. Edit/Suspend/Delete/
Approve actions are still **local-state only** — they update what you see
immediately, for a working demo feel, but don't call a write endpoint.
Each backend's README and the `TODO` comment in `KycVerification.tsx`'s
`updateStatus()` show exactly where to add the real write call per
action; the pattern is identical for the other pages' edit/delete
handlers.

## KYC Verification

`/kyc` lists rider document submissions as cards (Pending/Verified/
Rejected). Clicking one opens a modal with every uploaded document and
Approve/Reject buttons. Suggested schema (SQL shown, same idea for
MySQL/MongoDB — see each backend's README):
```sql
create table kyc_submissions (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid references auth.users(id),
  status text check (status in ('Pending', 'Verified', 'Rejected')) default 'Pending',
  submitted_at timestamptz default now()
);

create table kyc_documents (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references kyc_submissions(id) on delete cascade,
  label text not null,
  storage_path text not null  -- path in a PRIVATE storage bucket, not public
);
```

## Theming

`src/index.css` defines the brand palette as CSS custom properties —
change one value, the whole panel updates:
```css
--color-bg: #FFFFFF;           /* background */
--color-sidebar: #FFF5F5;      /* surface */
--color-accent: #C8102E;       /* primary */
--color-secondary: #8F1025;    /* secondary */
--color-accent-soft: #F04B5F;  /* accent */
--color-text-primary: #3B0A12; /* textPrimary */
--color-accent-muted: #8B6870; /* textMuted */
--color-positive: #2E9B62;     /* success */
--color-negative: #D62839;     /* error */
--color-warning: #E9A23B;      /* warning */
```
`src/theme/chartColors.ts` mirrors this palette as literal hex values,
since Recharts (SVG) needs real color strings, not CSS variables — keep
the two in sync if you change the palette.

## Project structure

```
sarathi-admin/
├── .env.example                  copy to .env — VITE_BACKEND is the switch
├── src/
│   ├── connection/                 🔌 all backend logic lives here
│   │   ├── index.ts                  picks the active provider from VITE_BACKEND
│   │   ├── types.ts                  the DataProvider interface every backend implements
│   │   ├── demo/provider.ts           uses the r_ sample data, always available
│   │   ├── supabase/                  provider.ts + README.md (direct-from-browser)
│   │   ├── mysql/                     provider.ts + README.md + schema.sql + c_server.example.js
│   │   └── mongodb/                   provider.ts + README.md + models.example.js + c_server.example.js
│   ├── data/                       🔧 r_*.ts — demo data, only used by connection/demo
│   ├── store/c_authStore.ts        login/logout, calls dataProvider — backend-agnostic
│   ├── hooks/
│   │   ├── useProviderQuery.ts       fetch-through-the-active-backend hook, used by every page
│   │   └── useTableState.ts          search/filter/pagination logic, shared by every list page
│   ├── theme/chartColors.ts        hex palette for charts
│   ├── context/ToastContext.tsx    global toast notifications
│   ├── components/
│   │   ├── layout/                   Sidebar, Topbar, DashboardLayout, ProtectedRoute
│   │   └── ui/                       DataTable, ListPageCard, FormModal, DetailModal, ConfirmDialog, etc.
│   ├── features/                    one folder per page — none of these import a backend directly
│   ├── types/                       nav.ts, entities.ts
│   └── App.tsx                      routes — /login is public, everything else behind ProtectedRoute
```
