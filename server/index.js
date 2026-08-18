import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import "dotenv/config";

const app = express();

// Trust the first proxy hop (reverse proxy / load balancer) so req.ip and
// the rate limiter see the real client IP instead of the proxy's.
app.set("trust proxy", 1);

app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin/non-browser requests (no Origin header) and any
      // origin explicitly listed in CORS_ORIGIN. Reject everything else.
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "10kb" }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please try again later." },
});

const PORT = process.env.PORT || 4000;
const TO_EMAIL = process.env.TO_EMAIL || "atozweldbuild@gmail.com";
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  const { name, email, message, company } = req.body || {};

  // Honeypot field: only bots fill this in. Pretend success without sending mail.
  if (company) {
    return res.json({ success: true });
  }

  if (!name || !name.trim() || name.trim().length > MAX_NAME_LENGTH) {
    return res.status(400).json({ error: "A valid name is required." });
  }
  if (
    !email ||
    email.length > MAX_EMAIL_LENGTH ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    /[\r\n]/.test(email)
  ) {
    return res.status(400).json({ error: "A valid email is required." });
  }
  if (!message || !message.trim() || message.trim().length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: "A valid message is required." });
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in server/.env (see .env.example)."
    );
    return res.status(500).json({
      error: "Email sending is not configured on the server yet.",
    });
  }

  // Strip CR/LF before interpolating into headers to prevent header injection.
  const safeName = name.replace(/[\r\n]/g, " ").trim();

  try {
    await transporter.sendMail({
      from: `"A To Z Weld & Build Website" <${process.env.SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New contact form message from ${safeName}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

app.listen(PORT, () => {
  console.log(`A To Z Weld & Build contact server running on port ${PORT}`);
});
