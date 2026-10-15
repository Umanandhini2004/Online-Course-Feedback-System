import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminLogin.css";

const AdminRegister = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/register", form);
      Swal.fire("Success", res.data.message, "success");
      setForm({ name: "", email: "", password: "" });
      navigate("/admin/login");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Registration failed", "error");
    }
  };

  return (
<<<<<<< HEAD
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Admin Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br /><br />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br /><br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br /><br />
        <button type="submit">Register</button>
      </form>
      <p className="login-link">
        Already have an account?{" "}
        <Link to="/admin/login">Login here</Link>
      </p>
=======
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-badge">🔐 ADMIN ACCESS</div>
        <div className="admin-icon-wrapper">
          <svg className="admin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v-1a6 6 0 00-12 0v1m-2 4h16l-2 8H6l-2-8zm8 0v4" />
          </svg>
        </div>
        <h2 className="admin-login-title">Create Admin Account</h2>
        <p className="admin-login-subtitle">Set up secure access to the admin dashboard</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label className="admin-form-label">👤 Admin Name</label>
            <input className="admin-input-field" name="name" placeholder="Enter admin name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">✉️ Official Email</label>
            <input className="admin-input-field" name="email" type="email" placeholder="name@nec.edu.in" value={form.email} onChange={handleChange} required />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">🔒 Password</label>
            <input className="admin-input-field" name="password" type="password" placeholder="Create a secure password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="admin-login-button">
            <span className="admin-button-content">Create Admin Account</span>
          </button>
        </form>

        <p className="admin-register-link">
          Already have an admin account?{" "}
          <Link to="/admin/login">Login here</Link>
        </p>
      </div>
>>>>>>> 1ee73bc (Updated code)
    </div>
  );
};

export default AdminRegister;
