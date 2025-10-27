const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  program: { type: String, enum: ["BE", "BTECH"], required: true },
  dept: { type: String, enum: ["CSE", "IT", "AIDS", "ECE", "EEE", "MECH", "CIVIL"], required: true },
  year: { type: Number, enum: [1, 2, 3, 4], required: true },
  sem: { type: Number, enum: [1,2,3,4,5,6,7,8], required: true },
  courseCode: { type: String, required: true },
  courseName: { type: String, required: true },
  courseType: { type: String, enum: ["theory", "integrated", "practical"], required: true },
  faculty: [{ type: String, required: true }], // multiple faculty possible
});

module.exports = mongoose.model("Course", courseSchema);
