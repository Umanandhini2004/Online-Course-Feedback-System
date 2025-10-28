// AdminLogin.jsx
import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [form, setForm] = useState({ name: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", form);
      Swal.fire({
        icon: "success",
        title: "Welcome Admin!",
        text: res.data.message,
        confirmButtonColor: "#1e3a8a",
      });
      localStorage.setItem("adminName", res.data.admin.name);
      navigate("/admin/dashboard");
      setForm({ name: "", password: "" });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Invalid credentials",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        {/* Admin Badge */}
        <div className="admin-badge">🔐 ADMIN ACCESS</div>

        {/* Icon */}
        <div className="admin-icon-wrapper">
          <svg
            className="admin-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        {/* Header */}
        <h2 className="admin-login-title">Admin Portal</h2>
        <p className="admin-login-subtitle">
          Secure access to administrative dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          {/* Name Field */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              <span>👤</span> Admin Name
            </label>
            <div className="admin-input-wrapper">
              <svg
                className="admin-input-icon"
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
                placeholder="Enter admin name"
                value={form.name}
                onChange={handleChange}
                className="admin-input-field"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              <span>🔒</span> Password
            </label>
            <div className="admin-input-wrapper">
              <svg
                className="admin-input-icon"
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
                placeholder="Enter secure password"
                value={form.password}
                onChange={handleChange}
                className="admin-input-field"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="admin-login-button"
            disabled={isLoading}
          >
            <span className="admin-button-content">
              {isLoading && <span className="admin-spinner"></span>}
              {isLoading ? "Authenticating..." : "Login to Dashboard"}
            </span>
          </button>
        </form>

        {/* Security Notice */}
        <div className="security-notice">
          <p className="security-notice-text">
            <svg
              className="security-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            This is a restricted area. Unauthorized access is prohibited.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default AdminLogin;
