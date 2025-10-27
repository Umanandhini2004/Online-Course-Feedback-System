const express = require("express");
const router = express.Router();
const FeedbackResponse = require("../models/FeedbackResponse");
const Student = require("../models/Student"); // ✅ import Student model
const { sendFeedbackReceivedMail } = require("../utils/mail");

// ✅ Save feedback and send confirmation mail
router.post("/feedback", async (req, res) => {
  try {
    console.log("📩 Received feedback body:", req.body);
    const {
      studentId,
      studentEmail: emailFromReq,
      studentName,
      courseId,
      courseType,
      courseName,
      facultyName,
      responses,
    } = req.body;

    // Validate required fields
    if (!studentId || !courseId || !responses)
      return res.status(400).json({ message: "Missing required fields" });

    // Save feedback in DB
    const feedback = new FeedbackResponse({
      studentId,
      courseId,
      courseType,
      courseName,
      facultyName,
      responses,
    });
    await feedback.save();
    console.log("✅ Feedback saved in DB");

    // Fetch student email from DB if not provided
    let studentEmail = emailFromReq;
    let studentNameToUse = studentName;

    if (!studentEmail) {
      const student = await Student.findById(studentId).select("email name").lean();
      if (student) {
        studentEmail = student.email;
        studentNameToUse = studentNameToUse || student.name;
      }
    }

    // ✅ Send confirmation email if we have an email
    if (studentEmail) {
      try {
        await sendFeedbackReceivedMail({
          studentEmail,
          studentName: studentNameToUse,
          courseName,
          facultyName,
        });
        console.log("📩 Feedback confirmation mail sent to:", studentEmail);
      } catch (err) {
        console.error("⚠️ Failed to send confirmation mail:", err.message);
      }
    } else {
      console.warn("⚠️ studentEmail not found, mail not sent");
    }

    res.status(201).json({ message: "Feedback saved successfully", feedback });
  } catch (err) {
    console.error("❌ Error in /feedback:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get feedback analysis by course + optional faculty
router.get("/feedback/analysis/:courseId", async (req, res) => {
  try {
    const { faculty } = req.query;
    const courseId = req.params.courseId;

    const filter = { courseId };
    if (faculty) filter.facultyName = faculty;

    const feedbacks = await FeedbackResponse.find(filter);
    if (!feedbacks.length) return res.json({ message: "No feedback yet" });

    const summary = {};
    feedbacks.forEach((fb) => {
      fb.responses.forEach((r) => {
        if (!summary[r.questionText]) {
          summary[r.questionText] = {
            Excellent: 0,
            Good: 0,
            Average: 0,
            Poor: 0,
            "Very Poor": 0,
          };
        }
        if (summary[r.questionText][r.answer] !== undefined)
          summary[r.questionText][r.answer]++;
      });
    });

    const csvData = Object.entries(summary).map(([question, ratings]) => ({
      Question: question,
      ...ratings,
    }));

    res.json({
      totalResponses: feedbacks.length,
      facultyName: faculty || "All Faculty",
      summary,
      csvData,
    });
  } catch (err) {
    console.error("❌ Error in /feedback/analysis:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
