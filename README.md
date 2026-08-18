# A To Z Weld & Build — Business Website

A React (Vite) marketing site for A To Z Weld & Build with a working contact form. Form submissions are emailed to the business owner via a small Node.js/Express backend using Nodemailer.

## Structure

- `/` — React frontend (Vite)
- `/server` — Express backend that sends contact form submissions by email

## Run locally

**1. Backend**

```bash
cd server
npm install
cp .env.example .env
# edit .env with real SMTP credentials (see notes below)
npm run dev
```

Runs on http://localhost:4000.

**2. Frontend** (in a separate terminal)

```bash
npm install
npm run dev
```

Runs on http://localhost:5173 and proxies `/api` requests to the backend.

## Configuring the mailer

Contact form messages are sent to the address set in `TO_EMAIL` (defaults to `atozweldbuild@gmail.com`). To actually send mail, `server/.env` needs real SMTP credentials:

- **Using Gmail as the sender:** enable 2-Step Verification on the sending Gmail account, then create an [App Password](https://myaccount.google.com/apppasswords) and use it as `SMTP_PASS`.
- Any SMTP provider works (Gmail, SendGrid, Mailgun, etc.) — just fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` in `.env`.

Until SMTP is configured, the API returns a clear error instead of failing silently.

## Security

- **CORS** — set `CORS_ORIGIN` in `server/.env` to a comma-separated list of the frontend domain(s) allowed to call the API in production. Left blank, all origins are allowed (fine for local dev only).
- **Rate limiting** — `/api/contact` allows 5 submissions per 15 minutes per IP.
- **Honeypot** — the contact form includes a hidden `company` field; real users never fill it, so submissions with it set are silently discarded (bots).
- **Input limits** — name/email/message are length-capped and the request body is capped at 10kb.
- **Security headers** — `helmet` is applied to all responses.
- Keep `.env` out of git (already covered by `.gitignore`) and rotate the SMTP app password if it's ever exposed.

## Deploying the backend (Render)

A `render.yaml` blueprint is included so Render can set the service up automatically.

1. Push this repo to GitHub (already done — `origin` is set).
2. On [render.com](https://render.com), sign up/log in (free, no card required), then **New +** → **Blueprint**, connect the GitHub account, and select this repo. Render will read `render.yaml` and propose a `a-to-z-weld-and-build-server` web service using the `server/` folder.
   - No `render.yaml`/blueprints available? Create it manually instead: **New +** → **Web Service** → this repo → **Root Directory**: `server`, **Build Command**: `npm install`, **Start Command**: `npm start`, **Plan**: Free.
3. Fill in the env vars Render prompts for: `SMTP_USER`, `SMTP_PASS` (the Gmail App Password), and `CORS_ORIGIN` (your live frontend domain, e.g. `https://atozweldandbuild.com` — can be filled in after step 5 once that domain is known).
4. Deploy. Render gives you a URL like `https://a-to-z-weld-and-build-server.onrender.com`.
   - Free tier spins down after ~15 minutes of inactivity — the first request after a lull takes 30-50s to wake back up. Fine for a low-traffic contact form.

## Deploying the frontend

1. Copy `.env.example` to `.env.production` at the repo root and set `VITE_API_URL` to the Render URL from above.
2. `npm run build` (outputs to `dist/`) and upload `dist/` via FTP/hosting of choice.
3. Once the frontend's live domain is known, set `CORS_ORIGIN` on the Render service to that domain so the backend only accepts requests from it.
