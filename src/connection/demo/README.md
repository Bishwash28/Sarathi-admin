# Demo backend

The default. No setup, no `.env`, nothing to configure — this is what runs
if `VITE_BACKEND` is unset or missing entirely.

## What it does

Wraps the sample data in `src/data/*.ts` (Users, Riders, Rides, Bookings,
Payments, Reviews, KYC submissions, Dashboard/Reports numbers) behind the
same `DataProvider` interface every real backend uses, with a small
artificial delay so loading states are visible while you build/demo.

Login accepts one fallback account:
```
Email:    admin@sarathi.com
Password: admin123
```

## When to use it

- Presenting/demoing the panel without depending on any live service
- Building new UI before your backend exists
- A safety net — if `VITE_BACKEND` is set to `supabase`/`mysql`/`mongodb`
  but not yet configured, you can always switch back to `demo` in `.env`
  to keep working

## Switching away from it

Change `VITE_BACKEND` in `.env` to `supabase`, `mysql`, or `mongodb` — see
the README in that backend's folder for what it needs.
