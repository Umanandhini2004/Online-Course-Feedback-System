const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Course = require("../models/Course");

// Get all courses (admin-created)
router.get("/students/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student profile (with enrolled courses)
router.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("enrolledCourses.courseId");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enroll in a course
router.post("/students/:id/enroll/:courseId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const already = student.enrolledCourses.find(c => c.courseId.toString() === req.params.courseId);
    if (already) return res.status(400).json({ message: "Already enrolled" });

    student.enrolledCourses.push({ courseId: req.params.courseId });
    await student.save();

    res.json({ message: "Enrolled successfully", student });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update feedback status
router.put("/students/:id/feedback/:courseId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const course = student.enrolledCourses.find(c => c.courseId.toString() === req.params.courseId);
    if (!course) return res.status(400).json({ message: "Not enrolled in this course" });

    course.status = "feedback_given";
    await student.save();

    res.json({ message: "Feedback submitted", student });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
