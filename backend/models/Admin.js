const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return v.endsWith("@nec.edu.in");
      },
      message: "Email must be a nec.edu.in address",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Must be at least 8 characters, include at least one special character
        // and at least one letter or number
        return /^(?=.*[A-Za-z0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(v);
      },
      message:
        "Password must be at least 8 characters long and contain at least one special character",
    },
  },
});

module.exports = mongoose.model("Admin", adminSchema, "admin");

