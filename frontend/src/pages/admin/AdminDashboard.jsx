import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AddCourseListForm from '../../component/AddCourseListForm';

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    program: "",
    dept: "",
    year: "",
    sem: "",
    courseCode: "",
    courseName: "",
    courseType: "",
    faculty: [""],
  });

  const [courses, setCourses] = useState([]);
  const [editId, setEditId] = useState(null);

  const [filters, setFilters] = useState({
    program: "",
    dept: "",
    year: "",
    sem: "",
    type: "",
    search: "",
  });

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get("https://online-course-feedback-system-yf47.vercel.app/api/courses");

      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFacultyChange = (index, value) => {
    const newFaculty = [...form.faculty];
    newFaculty[index] = value;
    setForm({ ...form, faculty: newFaculty });
  };

  const addFacultyField = () => {
    setForm({ ...form, faculty: [...form.faculty, ""] });
  };

  const resetForm = () => {
    setForm({
      program: "",
      dept: "",
      year: "",
      sem: "",
      courseCode: "",
      courseName: "",
      courseType: "",
      faculty: [""],
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
       await axios.put(`https://online-course-feedback-system-yf47.vercel.app/api/courses/${editId}`, form);

        Swal.fire("Updated!", "Course updated successfully", "success");
      } else {
        await axios.post("https://online-course-feedback-system-yf47.vercel.app/api/courses", form);

        Swal.fire("Added!", "Course added successfully", "success");
      }
      resetForm();
      fetchCourses();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Operation failed",
        "error"
      );
    }
  };

  const handleEdit = (course) => {
    setForm({
      program: course.program,
      dept: course.dept,
      year: course.year,
      sem: course.sem,
      courseCode: course.courseCode,
      courseName: course.courseName,
      courseType: course.courseType,
      faculty: course.faculty,
    });
    setEditId(course._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      Swal.fire("Deleted!", "Course removed", "success");
      fetchCourses();
    } catch (err) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      program: "",
      dept: "",
      year: "",
      sem: "",
      type: "",
      search: "",
    });
  };

  const filteredCourses = courses.filter((c) => {
    return (
      (filters.program === "" || c.program === filters.program) &&
      (filters.dept === "" || c.dept === filters.dept) &&
      (filters.year === "" || String(c.year) === String(filters.year)) &&
      (filters.sem === "" || String(c.sem) === String(filters.sem)) &&
      (filters.type === "" || c.courseType === filters.type) &&
      (filters.search === "" ||
        c.courseName.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  // Logout function
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("adminId");
        localStorage.removeItem("adminName");

        Swal.fire("Logged Out", "You have been logged out successfully", "success");
        navigate("/admin/login");
      }
    });
  };

  return (
    <div className="admin-dashboard">
      {/* Header with buttons */}
      <div className="admin-header">
        <h2>📚 Admin Dashboard</h2>
        <div className="header-buttons">
          <button
            className="manage-questions-btn"
            onClick={() => navigate("/admin/manage-questions")}
          >
            📝 Manage Feedback Questions
          </button>
          <button
            className="upload-courses-btn"
            onClick={() => {
              document
                .getElementById("upload-course-section")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            📘 Upload Course List
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-container">
        <h3>🔍 Filter Courses</h3>
        <div className="filter-row">
          <select
            name="program"
            value={filters.program}
            onChange={handleFilterChange}
          >
            <option value="">Select Program</option>
            <option>BE</option>
            <option>BTECH</option>
          </select>

          <select name="dept" value={filters.dept} onChange={handleFilterChange}>
            <option value="">Select Department</option>
            {["CSE", "IT", "AIDS", "ECE", "EEE", "MECH", "CIVIL"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <select name="year" value={filters.year} onChange={handleFilterChange}>
            <option value="">Select Year</option>
            {[1, 2, 3, 4].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          <select name="sem" value={filters.sem} onChange={handleFilterChange}>
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="theory">Theory</option>
            <option value="integrated">Integrated</option>
            <option value="practical">Practical</option>
          </select>

          <input
            type="text"
            name="search"
            placeholder="Search Course Name..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />

          <button className="apply-btn">Apply Filter</button>
          <button className="reset-btn" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      {/* Add / Edit Course Form */}
      <form onSubmit={handleSubmit}>
        <select name="program" value={form.program} onChange={handleChange} required>
          <option value="">Select Program</option>
          <option>BE</option>
          <option>BTECH</option>
        </select>

        <select name="dept" value={form.dept} onChange={handleChange} required>
          <option value="">Select Department</option>
          {["CSE", "IT", "AIDS", "ECE", "EEE", "MECH", "CIVIL"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <select name="year" value={form.year} onChange={handleChange} required>
          <option value="">Select Year</option>
          {[1, 2, 3, 4].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <select name="sem" value={form.sem} onChange={handleChange} required>
          <option value="">Select Sem</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <input
          name="courseCode"
          placeholder="Course Code"
          value={form.courseCode}
          onChange={handleChange}
          required
        />
        <input
          name="courseName"
          placeholder="Course Name"
          value={form.courseName}
          onChange={handleChange}
          required
        />

        <select
          name="courseType"
          value={form.courseType}
          onChange={handleChange}
          required
        >
          <option value="">Select Course Type</option>
          <option value="theory">Theory</option>
          <option value="integrated">Integrated</option>
          <option value="practical">Practical</option>
        </select>

        {form.faculty.map((f, i) => (
          <input
            key={i}
            placeholder={`Faculty ${i + 1}`}
            value={f}
            onChange={(e) => handleFacultyChange(i, e.target.value)}
            required
          />
        ))}

        <button type="button" onClick={addFacultyField} className="add-faculty-btn">
          + Add Faculty
        </button>

        <button type="submit">{editId ? "Update Course" : "Add Course"}</button>
        {editId && (
          <button type="button" onClick={resetForm} className="cancel-btn">
            Cancel Edit
          </button>
        )}
      </form>

      {/* Course Table */}
      <h3>📖 Courses</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Program</th>
              <th>Dept</th>
              <th>Year</th>
              <th>Sem</th>
              <th>Code</th>
              <th>Name</th>
              <th>Type</th>
              <th>Faculty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((c) => (
              <tr key={c._id}>
                <td>{c.program}</td>
                <td>{c.dept}</td>
                <td>{c.year}</td>
                <td>{c.sem}</td>
                <td>{c.courseCode}</td>
                <td>{c.courseName}</td>
                <td>{c.courseType}</td>
                <td>{c.faculty.join(", ")}</td>
                <td className="action-cell">
                  <button onClick={() => handleEdit(c)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="delete-btn">
                    Delete
                  </button>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        navigate(
                          `/admin/feedback-analysis/${c._id}/${encodeURIComponent(
                            c.courseName
                          )}/${encodeURIComponent(e.target.value)}`
                        );
                      }
                    }}
                    className="faculty-select"
                  >
                    <option value="">👨‍🏫 View Feedback by Faculty</option>
                    {c.faculty.map((f, i) => (
                      <option key={i} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AddCourseListForm */}
      <div id="upload-course-section" className="bg-white rounded-lg shadow-md p-6 mb-8">
  <h2 className="text-xl font-semibold mb-4">📘 Upload Course List</h2>
  <AddCourseListForm />
</div>

    </div>
  );
};

export default AdminDashboard;
