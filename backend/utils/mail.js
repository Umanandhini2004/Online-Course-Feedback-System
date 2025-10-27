// utils/mailer.js
const nodemailer = require("nodemailer");
const Admin = require("../models/Admin"); // for optional admin-from-db

const createTransporter = async () => {
  // read from env
  const { MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER, MAIL_PASS } = process.env;

  if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) {
    throw new Error("Mail configuration is missing in .env");
  }

  // create transporter
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: MAIL_SECURE === "true" || MAIL_SECURE === true, // accept string or bool
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });

  // verify transporter (optional)
  try {
    await transporter.verify();
    // console.log("✅ Mail transporter verified");
  } catch (err) {
    console.warn("⚠️ Mail transporter verification failed:", err.message);
  }

  return transporter;
};

/**
 * sendFeedbackReceivedMail
 * options:
 *   - studentEmail (required)
 *   - studentName (optional)
 *   - courseName (optional)
 *   - facultyName (optional)
 *   - adminFromEmail (optional) - if omitted we fallback to MAIL_USER or Admin from DB
 */
const sendFeedbackReceivedMail = async ({
  studentEmail,
  studentName,
  courseName,
  facultyName,
  adminFromEmail // optional
}) => {
  if (!studentEmail) throw new Error("studentEmail is required");

  const transporter = await createTransporter();

  // choose from-address:
  let fromAddress = process.env.MAIL_USER; // default from env
  // if ADMIN_EMAIL provided in env override
  if (process.env.ADMIN_EMAIL) fromAddress = process.env.ADMIN_EMAIL;

  // optional: fetch admin email from DB (if adminFromEmail not provided)
  if (!adminFromEmail) {
    try {
      const admin = await Admin.findOne().select("email -_id").lean();
      if (admin && admin.email) fromAddress = admin.email;
    } catch (err) {
      // ignore DB errors and use the env value
    }
  } else {
    fromAddress = adminFromEmail;
  }

  const subject = `Thanks for submitting feedback${courseName ? " — " + courseName : ""}`;
  const html = `
    <p>Hi ${studentName || "Student"},</p>
    <p>Thank you for completing feedback${courseName ? ` for <b>${courseName}</b>` : ""}${facultyName ? ` (Faculty: ${facultyName})` : ""}.</p>
    <p>Your feedback helps us improve teaching and course quality.</p>
    <p>Regards,<br/>NEC</p>
  `;

  const mailOptions = {
    from: fromAddress,
    to: studentEmail,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = { sendFeedbackReceivedMail };
