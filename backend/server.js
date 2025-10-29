const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const serverless = require("serverless-http");

dotenv.config();
const app = express();

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

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
