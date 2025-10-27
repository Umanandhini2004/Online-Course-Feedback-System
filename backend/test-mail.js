// test-mail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

async function testMail() {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ Mail transporter verified successfully");

    // Send a test mail
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER, // send to yourself first
      subject: "Test Email",
      text: "This is a test email from your Node.js app.",
    });

    console.log("📩 Test email sent successfully!");
  } catch (err) {
    console.error("❌ Mail error:", err.message);
  }
}

testMail();
