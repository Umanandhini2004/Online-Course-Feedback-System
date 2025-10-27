const mongoose = require("mongoose");

const feedbackResponseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  courseName: { type: String, required: true },
  courseType: { type: String, enum: ["theory", "practical", "integrated"], required: true },
  facultyName: { type: String, required: true }, // ✅ New field
  responses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "FeedbackQuestion" },
      questionText: String,
      answer: { type: String, enum: ["Excellent", "Good", "Average", "Poor", "Very Poor"] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FeedbackResponse", feedbackResponseSchema);
