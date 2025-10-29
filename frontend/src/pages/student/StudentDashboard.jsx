import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    program: "",
    dept: "",
    year: "",
    sem: "",
    courseType: "",
  });
  const [courses, setCourses] = useState([]);
  const [student, setStudent] = useState(null);
  const [showCourses, setShowCourses] = useState(false);

  const studentId = localStorage.getItem("studentId");
  const studentRollno = localStorage.getItem("studentRollno");
  const studentName = localStorage.getItem("studentName");

  useEffect(() => {
    if (!studentId) {
      Swal.fire("Error", "Please login first", "error");
      navigate("/student/login");
      return;
    }
    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, navigate]);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`https://online-course-feedback-system-yf47.vercel.app/api/students/${studentId}`);

      setStudent(res.data);
    } catch (err) {
      console.error("fetchStudent error:", err);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilter = async () => {
    try {
      const res = await axios.get("https://online-course-feedback-system-yf47.vercel.app/api/courses", {

        params: filters,
      });
      setCourses(res.data);
      setShowCourses(true);
      // refresh student in case enrollment/available seats changed
      await fetchStudent();
    } catch (err) {
      console.error("applyFilter error:", err);
      Swal.fire("Error", "Could not fetch courses", "error");
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`https://online-course-feedback-system-yf47.vercel.app/api/students/${studentId}/enroll/${courseId}`);

      Swal.fire("Enrolled!", "You have enrolled in this course", "success");
      await fetchStudent();
    } catch (err) {
      console.error("handleEnroll error:", err);
      Swal.fire("Error", err.response?.data?.message || "Enroll failed", "error");
    }
  };

  const handleFeedback = (courseId, courseType, facultyName, courseName) => {
    navigate(`/student/feedback/${courseId}/${courseType}`, {
      state: { facultyName, courseName },
    });
  };
  const isEnrolled = (courseId) => {
    if (!student || !student.enrolledCourses) return null;
    // defensive: enrolledCourses might store courseId as an object or string
    return student.enrolledCourses.find((c) => {
      // if c.courseId is an object with _id
      if (c?.courseId?._id) return c.courseId._id === courseId;
      // if c.courseId is a string id
      if (typeof c?.courseId === "string") return c.courseId === courseId;
      // if enrolled list stores course as direct id
      if (c?._id) return c._id === courseId;
      return false;
    });
  };
 

  // ✅ Logout function
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
        localStorage.removeItem("studentId");
        localStorage.removeItem("studentRollno");
        localStorage.removeItem("studentName");
        Swal.fire("Logged Out", "You have been logged out successfully", "success");
        navigate("/student/login");
      }
    });
  };

  return (
    <div className="student-dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h2 className="dashboard-title">🎓 Student Dashboard</h2>
          {/* ✅ Logout button added here */}
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>

        {/* Student Info Card */}
        <div className="student-info-card">
          <div className="student-info-item">
            <strong>👤 Name:</strong>
            <span>{studentName}</span>
          </div>
          <div className="student-info-item">
            <strong>🆔 Roll Number:</strong>
            <span>{studentRollno}</span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <h3 className="filters-title">🔍 Filter Courses</h3>
          <div className="filters-grid">
            <select
              name="program"
              value={filters.program}
              onChange={handleChange}
              className="filter-select"
            >
              <option value="">Select Program</option>
              <option value="BE">BE</option>
              <option value="BTECH">BTECH</option>
            </select>

            <select
              name="dept"
              value={filters.dept}
              onChange={handleChange}
              className="filter-select"
            >
              <option value="">Select Department</option>
              {["CSE", "IT", "AIDS", "ECE", "EEE", "MECH", "CIVIL"].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              name="year"
              value={filters.year}
              onChange={handleChange}
              className="filter-select"
            >
              <option value="">Select Year</option>
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              name="sem"
              value={filters.sem}
              onChange={handleChange}
              className="filter-select"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              name="courseType"
              value={filters.courseType}
              onChange={handleChange}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="theory">theory</option>
              <option value="integrated">integrated</option>
              <option value="practical">practical</option>
            </select>
          </div>

          <button onClick={applyFilter} className="apply-filter-btn">
            Apply Filter
          </button>
        </div>

        {/* Courses Section */}
        {showCourses && (
          <div className="courses-section">
            <div className="courses-header">
              <h3 className="courses-title">📚 Available Courses</h3>
              <span className="courses-count">{courses.length} Courses</span>
            </div>

            {courses.length === 0 ? (
              <p className="no-courses-message">No courses found matching your criteria.</p>
            ) : (
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Faculty</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => {
                    const enrolled = isEnrolled(c._id);
                    return (
                      <tr key={c._id}>
                        <td data-label="Code">{c.courseCode}</td>
                        <td data-label="Name">{c.courseName}</td>
                        <td data-label="Faculty">
                          {Array.isArray(c.faculty) ? c.faculty.join(", ") : c.faculty}
                        </td>
                        <td data-label="Action">
                          {!enrolled && (
                            <button onClick={() => handleEnroll(c._id)} className="enroll-btn">
                              Enroll
                            </button>
                          )}
                          {enrolled?.status === "enrolled" && (
                            <>
                              {Array.isArray(c.faculty) && c.faculty.length > 1 ? (
                                <select
                                  onChange={(e) =>
                                    handleFeedback(
                                      c._id,
                                      c.courseType,
                                      e.target.value,
                                      c.courseName
                                    )
                                  }
                                  defaultValue=""
                                  className="faculty-select"
                                >
                                  <option value="" disabled>
                                    Select Faculty for Feedback
                                  </option>
                                  {c.faculty.map((f, idx) => (
                                    <option key={idx} value={f}>
                                      {f}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleFeedback(
                                      c._id,
                                      c.courseType,
                                      Array.isArray(c.faculty) ? c.faculty[0] : c.faculty,
                                      c.courseName
                                    )
                                  }
                                  className="feedback-btn"
                                >
                                  Give Feedback
                                </button>
                              )}
                            </>
                          )}
                          {enrolled?.status === "feedback_given" && (
                            <span className="feedback-submitted">✅ Feedback Submitted</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
