const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
<<<<<<< HEAD
const serverless = require("serverless-http");
=======
const dns = require("node:dns");
>>>>>>> 1ee73bc (Updated code)

dotenv.config();
const app = express();

// Atlas uses an SRV record. Prefer configured DNS servers when the local
// resolver cannot resolve MongoDB SRV records.
const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);
dns.setServers(dnsServers);

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB error:", err));

// Routes
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const studentRoutes = require("./routes/student");
const feedbackQuestionRoutes = require("./routes/feedbackQuestion");
const feedbackRoutes = require("./routes/feedback");
const courseUploadRoute = require("./routes/courseUpload");

// Use routes
app.use("/api", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", studentRoutes);
app.use("/api", feedbackQuestionRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", courseUploadRoute);

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("Backend is running successfully on Vercel 🚀");
});

<<<<<<< HEAD
// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
=======

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
>>>>>>> 1ee73bc (Updated code)
