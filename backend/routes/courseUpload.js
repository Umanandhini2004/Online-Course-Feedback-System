const express = require("express");
const router = express.Router();
const multer = require("multer");
const Course = require("../models/Course");
const csv = require("csv-parser");
const { Readable } = require("stream");

const upload = multer(); // store in memory

// ✅ Helper to parse CSV buffer
function parseCsvFile(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer.toString());
    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

// ✅ Bulk Course Upload
router.post("/upload-coursebatch", upload.single("csvFile"), async (req, res) => {
  const success = [];
  const error = [];

  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const parsedData = await parseCsvFile(req.file.buffer);

    for (const row of parsedData) {
      const {
        Program,
        Dept,
        Year,
        Sem,
        CourseCode,
        CourseName,
        CourseType,
        Faculty1,
        Faculty2,
        Faculty3,
      } = row;

      if (!Program || !Dept || !Year || !Sem || !CourseCode || !CourseName || !CourseType) {
        error.push({
          program: Program || "",
          dept: Dept || "",
          year: Year || "",
          sem: Sem || "",
          courseCode: CourseCode || "",
          courseName: CourseName || "",
          courseType: CourseType || "",
          faculty: [Faculty1, Faculty2, Faculty3].filter(Boolean),
          message: "Missing required fields",
        });
        continue;
      }

      const existing = await Course.findOne({ courseCode: CourseCode });
      if (existing) {
        error.push({
          program: existing.program,
          dept: existing.dept,
          year: existing.year,
          sem: existing.sem,
          courseCode: existing.courseCode,
          courseName: existing.courseName,
          courseType: existing.courseType,
          faculty: existing.faculty || [],
          message: "Course already exists",
        });
        continue;
      }

      const facultyList = [Faculty1, Faculty2, Faculty3].filter(Boolean);

      const newCourse = new Course({
        program: Program,
        dept: Dept,
        year: Number(Year),
        sem: Number(Sem),
        courseCode: CourseCode,
        courseName: CourseName,
        courseType: CourseType.toLowerCase(),
        faculty: facultyList,
      });

      await newCourse.save();

      success.push({
        program: Program,
        dept: Dept,
        year: Number(Year),
        sem: Number(Sem),
        courseCode: CourseCode,
        courseName: CourseName,
        courseType: CourseType.toLowerCase(),
        faculty: facultyList,
      });
    }

    res.status(200).json({
      message: "Course batch uploaded successfully",
      success,
      error,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Failed to upload course batch", error: err.message });
  }
});

module.exports = router;
