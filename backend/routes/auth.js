const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Student = require("../models/Student");

const router = express.Router();

/* --------- ADMIN REGISTER --------- */
router.post("/admin/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (!email.endsWith("@nec.edu.in"))
      return res.status(400).json({ message: "Email must end with @nec.edu.in" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashed });
    await newAdmin.save();

    res.json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* --------- ADMIN LOGIN --------- */
router.post("/admin/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const admin = await Admin.findOne({ name });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Admin login successful", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* --------- STUDENT REGISTER --------- */
router.post("/student/register", async (req, res) => {
  try {
    console.log("📥 Incoming Student Data:", req.body);
    const { name, rollno, email, password } = req.body;

    if (!name || !rollno || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (!email.endsWith("@nec.edu.in"))
      return res.status(400).json({ message: "Email must end with @nec.edu.in" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    const existing = await Student.findOne({ rollno });
    if (existing) return res.status(400).json({ message: "Student already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newStudent = new Student({ name, rollno, email, password: hashed });

    await newStudent.save();

    res.json({ message: "Student registered successfully" });
  }  catch (err) {
  console.error("❌ Student Register Error (full):", err);
  res.status(500).json({
    message: "Server error",
    error: err.message,
    details: err.errors || err,
  });
}

});


/* --------- STUDENT LOGIN --------- */
router.post("/student/login", async (req, res) => {
  try {
    const { rollno, password } = req.body;
    const student = await Student.findOne({ rollno });
    if (!student) return res.status(400).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Student login successful", student });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
