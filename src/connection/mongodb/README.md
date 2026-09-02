# MongoDB backend

Same situation as MySQL: a browser can't talk to MongoDB directly, so this
backend needs a small Express + Mongoose API between the frontend and the
database. `c_server.example.js` + `models.example.js` in this folder are
a ready-to-run starting point.

## 1. Set up MongoDB

Use a local MongoDB instance or a free MongoDB Atlas cluster — either
way, you just need a connection URI.

## 2. Run the example API server

```bash
mkdir sarathi-server && cd sarathi-server
npm init -y
npm install express mongoose cors jsonwebtoken bcrypt dotenv
cp ../src/connection/mongodb/c_server.example.js server.js
cp ../src/connection/mongodb/models.example.js models.js
cp ../src/connection/mongodb/.env.example .env
# edit .env with your MongoDB URI
node server.js
```

This is a **separate Node process** from the Vite frontend — run it in
its own terminal, and keep it running while you use the admin panel.

**Create your one admin account** manually (there's no signup UI) — it's
a normal User document with `role: "Admin"`, not a separate model. E.g.
with a one-off script:
```js
const bcrypt = require("bcrypt");
const { User } = require("./models");
await User.create({
  name: "Admin User",
  email: "admin@sarathi.com",
  role: "Admin",
  status: "Active",
  passwordHash: await bcrypt.hash("yourpassword", 10),
});
```

## 3. Point the frontend at it

In the frontend's `.env`:
```
VITE_BACKEND=mongodb
VITE_API_BASE_URL=http://localhost:4000/api
```

Restart `npm run dev`. The login screen shows **"Connected — MongoDB"**
and `src/connection/mongodb/provider.ts` starts making real requests
instead of warning in the console.

## What's ready-made vs. what you customize

- `provider.ts` — the frontend side, already complete, calls a fixed set
  of REST endpoints. Shouldn't need changes unless you rename an
  endpoint.
- `c_server.example.js` + `models.example.js` — **these are the files
  you customize.** The `/api/dashboard` and `/api/reports` handlers are
  stubs — write your own aggregation pipelines there. Everything else is
  a working `find()`.

## Note on KYC documents

`imageUrl` in the KYC document sub-schema should point to a private file
store (e.g. an S3 bucket with signed URLs), not a publicly guessable
path — rider ID documents shouldn't be reachable by anyone with the URL
pattern.
