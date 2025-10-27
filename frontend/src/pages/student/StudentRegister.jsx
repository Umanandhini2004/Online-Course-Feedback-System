// StudentRegister.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./StudentRegister.css";

const StudentRegister = () => {
  const [form, setForm] = useState({ 
    name: "", 
    rollno: "", 
    email: "", 
    password: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Calculate password strength
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength("");
    } else if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (password.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:5000/api/student/register", form);
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: res.data.message,
        confirmButtonColor: "#10b981",
      });
      setForm({ name: "", rollno: "", email: "", password: "" });
      setPasswordStrength("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="student-register-container">
      <div className="register-card">
        {/* Icon */}
        <div className="register-icon-wrapper">
          <svg
            className="register-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>

        {/* Header */}
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join us today! Fill in your details below</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* Name Field */}
          <div className="form-group-register">
            <label className="form-label">
              <span>👤</span> Full Name
            </label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="input-field-register"
                required
              />
            </div>
          </div>

          {/* Roll Number Field */}
          <div className="form-group-register">
            <label className="form-label">
              <span>🎓</span> Roll Number
            </label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
              <input
                name="rollno"
                type="text"
                placeholder="Enter your roll number"
                value={form.rollno}
                onChange={handleChange}
                className="input-field-register"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group-register">
            <label className="form-label">
              <span>📧</span> Email Address
            </label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="input-field-register"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group-register">
            <label className="form-label">
              <span>🔒</span> Password
            </label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                className="input-field-register"
                required
              />
            </div>
            
            {/* Password Strength Indicator */}
            {passwordStrength && (
              <>
                <div className="password-strength">
                  <div className={`password-strength-bar strength-${passwordStrength}`}></div>
                </div>
                <p className={`password-strength-text strength-${passwordStrength}-text`}>
                  {passwordStrength === "weak" && "Weak password"}
                  {passwordStrength === "medium" && "Medium strength"}
                  {passwordStrength === "strong" && "Strong password"}
                </p>
              </>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="register-button"
            disabled={isSubmitting}
          >
            <span className="button-content-register">
              {isSubmitting && <span className="register-spinner"></span>}
              {isSubmitting ? "Creating Account..." : "Register"}
            </span>
          </button>
        </form>

        {/* Login Link */}
        <p className="login-link">
          Already have an account?{" "}
          <Link to="/student/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;