const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// ✅ Add Course
router.post("/courses", async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({ message: "Course added successfully", course: newCourse });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get All Courses with optional filters
router.get("/courses", async (req, res) => {
  try {
    const { program, dept, year, sem, courseType } = req.query;
    const filter = {};
    if (program) filter.program = program;
    if (dept) filter.dept = dept;
    if (year) filter.year = Number(year);
    if (sem) filter.sem = Number(sem);
    if (courseType) filter.courseType = courseType;

    const courses = await Course.find(filter);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update Course
router.put("/courses/:id", async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Course updated", course: updatedCourse });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete Course
router.delete("/courses/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get faculties for a specific course (for frontend dropdown)
router.get("/courses/:courseId/faculties", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course.faculty || []); // return the array of faculty names
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
