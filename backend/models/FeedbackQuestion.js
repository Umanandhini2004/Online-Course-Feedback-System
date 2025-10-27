// models/FeedbackQuestion.js
const mongoose = require("mongoose");

const feedbackQuestionSchema = new mongoose.Schema({
  courseType: {
    type: String,
    enum: ["theory", "practical", "integrated"],
    required: true,
  },
  question: { type: String, required: true },
});

module.exports = mongoose.model("FeedbackQuestion", feedbackQuestionSchema);
