// StudentLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./StudentLogin.css";

const StudentLogin = () => {
  const [form, setForm] = useState({ rollno: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("https://online-course-feedback-system-hr9d.vercel.app/api/student/login", form);
      // ✅ Store MongoDB _id
      localStorage.setItem("studentId", res.data.student._id);
      localStorage.setItem("studentRollno", res.data.student.rollno);
      localStorage.setItem("studentName", res.data.student.name);
      Swal.fire("Welcome", res.data.message, "success");
      navigate("/student/dashboard");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="student-login-container">
      <div className="login-card">
        <div className="icon-wrapper">
          <svg
            className="student-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        <h2 className="login-title">Student Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              name="rollno"
              placeholder="Roll Number"
              value={form.rollno}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner">⟳</span>
                <span className="button-content">Logging in...</span>
              </>
            ) : (
              <span className="button-content">Login</span>
            )}
          </button>
        </form>
         <p style={{ marginTop: "20px" }}>
        Don't have an account? <Link to="/student/register">Register here</Link>
      </p>
      </div>
    </div>
  );
};

export default StudentLogin;
