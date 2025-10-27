const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

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
app.use("/api", authRoutes);

const courseRoutes = require("./routes/course");
app.use("/api", courseRoutes);

const studentRoutes = require("./routes/student");
app.use("/api", studentRoutes);

const feedbackQuestionRoutes = require("./routes/feedbackQuestion");
app.use("/api", feedbackQuestionRoutes);

const feedbackRoutes = require("./routes/feedback");
app.use("/api", feedbackRoutes);

// ✅ Import routes
const courseUploadRoute = require("./routes/courseUpload");

// ✅ Use the route
app.use("/api", courseUploadRoute);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));