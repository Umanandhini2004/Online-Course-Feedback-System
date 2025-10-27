import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminRegister = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/register", form);
      Swal.fire("Success", res.data.message, "success");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Registration failed", "error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Admin Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br /><br />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br /><br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default AdminRegister;
