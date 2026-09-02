# MySQL backend

Unlike Supabase, a browser **can't** talk to MySQL directly — there's no
MySQL driver that runs in client-side JavaScript, and even if there were,
shipping database credentials to the browser would be a security hole. So
this backend needs two things running, not one:

1. **This frontend** (the Vite app you're already running)
2. **A small Express API** that sits between the frontend and MySQL —
   `c_server.example.js` in this folder is a ready-to-run starting point

## 1. Set up the database

```bash
mysql -u root -p < schema.sql
```

This creates the `sarathi` database and every table the example server
and `provider.ts` expect. Adjust column types/names if your real schema
differs — just keep `provider.ts` and the server in sync with whatever
you change.

## 2. Run the example API server

```bash
mkdir sarathi-server && cd sarathi-server
npm init -y
npm install express mysql2 cors jsonwebtoken bcrypt dotenv
cp ../src/connection/mysql/c_server.example.js server.js
cp ../src/connection/mysql/.env.example .env
# edit .env with your DB host/user/password
node server.js
```

This is a **separate Node process** from the Vite frontend — run it in
its own terminal, and keep it running while you use the admin panel.

**Create your one admin account** manually (there's no signup UI). It's a
normal row in `users` with `role = 'Admin'` — not a separate table:
```sql
INSERT INTO users (id, name, email, role, password_hash, status)
VALUES ('U-ADMIN', 'Admin User', 'admin@sarathi.com', 'Admin', '$2b$10$...', 'Active');
-- generate the hash with: node -e "console.log(require('bcrypt').hashSync('yourpassword', 10))"
```

## 3. Point the frontend at it

In the frontend's `.env`:
```
VITE_BACKEND=mysql
VITE_API_BASE_URL=http://localhost:4000/api
```

Restart `npm run dev`. The login screen shows **"Connected — MySQL"** and
`src/connection/mysql/provider.ts` starts making real requests instead of
warning in the console.

## What's ready-made vs. what you customize

- `provider.ts` — the frontend side, already complete, calls a fixed set
  of REST endpoints. You shouldn't need to touch this unless you rename
  an endpoint.
- `c_server.example.js` — **this is the file you customize.** The
  `/api/dashboard` and `/api/reports` handlers are stubs (aggregate
  queries are specific to your data, so write your own `SUM`/`COUNT`
  queries there). Everything else is a working `SELECT *`.
- `schema.sql` — adjust to match whatever you actually build.

## Note on KYC documents

`image_url` in `kyc_documents` should point to a private file store
(e.g. an S3 bucket with signed URLs), not a publicly guessable path —
rider ID documents shouldn't be reachable by anyone with the URL pattern.
