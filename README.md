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

## Deploying

- Build the frontend with `npm run build` (outputs to `dist/`) and upload via FTP/hosting of choice.
- Run the backend (`server/`) on any Node host, with the same `.env` variables set as environment variables (including `CORS_ORIGIN` pointed at your live frontend domain).
- Point the frontend's `/api` requests at the deployed backend URL (update the proxy target or add a reverse proxy in production).
