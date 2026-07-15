# FD Welding — Business Website

A React (Vite) marketing site for FD Welding with a working contact form. Form submissions are emailed to the business owner via a small Node.js/Express backend using Nodemailer.

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

## Deploying

- Build the frontend with `npm run build` (outputs to `dist/`) and upload via FTP/hosting of choice.
- Run the backend (`server/`) on any Node host, with the same `.env` variables set as environment variables.
- Point the frontend's `/api` requests at the deployed backend URL (update the proxy target or add a reverse proxy in production).
