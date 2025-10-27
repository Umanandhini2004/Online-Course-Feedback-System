// routes/feedbackQuestion.js
const express = require("express");
const router = express.Router();
const FeedbackQuestion = require("../models/FeedbackQuestion");

// ✅ Add Question
router.post("/questions", async (req, res) => {
  try {
    const { courseType, question } = req.body;
    const newQ = new FeedbackQuestion({ courseType, question });
    await newQ.save();
    res.json({ message: "Question added", question: newQ });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get Questions by Course Type
router.get("/questions/:courseType", async (req, res) => {
  try {
    const questions = await FeedbackQuestion.find({ courseType: req.params.courseType });
    res.json(questions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Update Question
router.put("/questions/:id", async (req, res) => {
  try {
    const updated = await FeedbackQuestion.findByIdAndUpdate(
      req.params.id,
      { question: req.body.question },
      { new: true }
    );
    res.json({ message: "Updated", question: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete Question
router.delete("/questions/:id", async (req, res) => {
  try {
    await FeedbackQuestion.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
