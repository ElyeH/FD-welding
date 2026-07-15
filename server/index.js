import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const TO_EMAIL = process.env.TO_EMAIL || "atozweldbuild@gmail.com";

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

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required." });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
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

  try {
    await transporter.sendMail({
      from: `"FD Welding Website" <${process.env.SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New contact form message from ${name}`,
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
  console.log(`FD Welding contact server running on port ${PORT}`);
});
