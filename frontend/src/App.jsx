// App.js
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StudentRegister from "./pages/student/StudentRegister";
import StudentLogin from "./pages/student/StudentLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import FeedbackForm from "./pages/student/FeedbackForm";
import AdminFeedbackAnalysis from "./component/AdminFeedbackAnalysis";
import AdminQuestionsPage from "./pages/admin/AdminQuestionsPage";
import AddCourseListForm from "./component/AddCourseListForm"; // ✅ add this line
import homebackground from "./assets/homebackground.png"; // ✅ background image

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Landing Page */}
        <Route
          path="/"
          element={
            <div
              style={{
                backgroundImage: `url(${homebackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <h1
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "30px",
                  color: "#010101",
                  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)",
                }}
              >
                Welcome to Online Course Feedback
              </h1>

              <div style={{ marginTop: "20px" }}>
                <Link to="/student/login">
                  <button
                    style={{
                      marginRight: "20px",
                      padding: "12px 30px",
                      fontSize: "16px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    Student Login
                  </button>
                </Link>
                <Link to="/admin/login">
                  <button
                    style={{
                      padding: "12px 30px",
                      fontSize: "16px",
                      backgroundColor: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    Admin Login
                  </button>
                </Link>
              </div>
            </div>
          }
        />

        {/* ✅ Student Routes */}
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route
          path="/student/feedback/:courseId/:courseType"
          element={<FeedbackForm />}
        />

        {/* ✅ Admin Routes */}
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/addcourselist" element={<AddCourseListForm />} />

        <Route path="/admin/manage-questions" element={<AdminQuestionsPage />} />

        {/* ✅ Admin Feedback Analysis */}
        <Route
          path="/admin/feedback-analysis/:courseId/:courseName/:facultyName"
          element={<AdminFeedbackAnalysis />}
        />
      </Routes>
    </Router>
  );
}

export default App;
