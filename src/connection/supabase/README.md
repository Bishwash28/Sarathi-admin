# Supabase backend

Connects the admin panel directly to Supabase (**PostgreSQL** + Auth) —
no separate API server needed, since Supabase's client library is designed
to be called safely from the browser (protected by Row Level Security).

## 1. Switch the app to this backend

In `.env` (copy from `.env.example` if you haven't):
```
VITE_BACKEND=supabase
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
Find the URL/key in the Supabase dashboard → Project Settings → API.

## 2. Create the one admin account

Supabase dashboard → Authentication → Users → Add user. There's no public
admin signup page in this app on purpose — admins are provisioned by hand.
**Copy the generated user ID** (the UUID shown on that user's row) — you
need it in step 3.

## 3. Run this schema (SQL Editor)

There's **no separate `admins` table** — an admin is just a row in the
same `users` table riders and passengers live in, with `role = 'Admin'`.
The admin panel's own login checks that role directly.

```sql
-- Core users table. id matches the Supabase Auth user id directly
-- (1-to-1 with auth.users), so there's no separate join table needed.
create table users (
  id uuid primary key references auth.users(id),
  name text not null,
  email text not null,
  phone text,
  role text check (role in ('Rider', 'Passenger', 'Admin')) not null,
  rating numeric default 0,
  status text check (status in ('Active', 'Pending', 'Suspended')) default 'Active',
  vehicle text,          -- riders only
  license_no text,       -- riders only
  docs_verified boolean default false, -- riders only
  joined_date timestamptz default now()
);

-- insert the row for the admin account you created in step 2
insert into users (id, name, email, role, status)
values ('paste-the-user-id-here', 'Admin User', 'admin@sarathi.com', 'Admin', 'Active');

create table rides (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid references users(id),
  rider_name text,
  route text,
  date_time timestamptz,
  seats int,
  fare numeric,
  status text check (status in ('Active', 'Ongoing', 'Completed', 'Cancelled')) default 'Active'
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references rides(id),
  passenger_id uuid references users(id),
  passenger_name text,
  route text,
  date_time timestamptz,
  payment text check (payment in ('Paid', 'Pending', 'Refunded')) default 'Pending',
  status text check (status in ('Confirmed', 'Pending', 'Completed', 'Cancelled')) default 'Pending'
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  amount numeric,
  method text,
  transaction_id text,
  date_time timestamptz,
  status text check (status in ('Completed', 'Pending', 'Failed')) default 'Pending'
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  reviewer_id uuid references users(id),
  reviewee_id uuid references users(id),
  rating int,
  comment text,
  created_at timestamptz default now(),
  status text check (status in ('Active', 'Flagged')) default 'Active'
);

create table kyc_submissions (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid references users(id),
  status text check (status in ('Pending', 'Verified', 'Rejected')) default 'Pending',
  submitted_at timestamptz default now(),
  reviewed_by uuid references users(id), -- the admin who reviewed it
  reviewed_at timestamptz
);

create table kyc_documents (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references kyc_submissions(id) on delete cascade,
  label text not null,
  storage_path text not null -- path in a PRIVATE Storage bucket, not a public URL
);
```

**Row Level Security — enable this on every table above:**
```sql
alter table users enable row level security;

-- Admins can read every row
create policy "Admins can read all users"
  on users for select
  using (exists (
    select 1 from users AS requester
    where requester.id = auth.uid() and requester.role = 'Admin'
  ));

-- A rider/passenger can read their own row
create policy "Users can read their own row"
  on users for select
  using (auth.uid() = id);
```
Repeat the "admins can read all rows" policy (adjusted per table) for
`rides`, `bookings`, `payments`, `reviews`, `kyc_submissions`, and
`kyc_documents` — otherwise any signed-in rider/passenger could read
every other user's data through the same client library. **This is the
most important security step — don't skip it.**

## 4. Dashboard/Reports aggregates

`getDashboardData()` and `getReportsData()` call `supabase.rpc(...)` —
Postgres functions you write once your tables have real data, since these
need aggregation (counts, sums, grouped-by-day) that's easiest to do in
SQL rather than pulling every row into the browser. Until you write those
functions, these two calls return empty datasets rather than crashing —
you'll see zeroed charts, which is expected.

## 5. KYC document images

Store actual rider documents in a **private** Storage bucket (not public)
and generate a signed URL per document when the admin opens the review
modal — `getKycSubmissions()` currently expects the join to already
include a usable `imageUrl`; add that signed-URL step there once you wire
Storage in.

## Where the code lives

`src/connection/supabase/provider.ts` — every method already calls the
real Supabase client; nothing here is a stub waiting to be written except
the two RPC function names in step 4.
