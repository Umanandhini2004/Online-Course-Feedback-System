// FeedbackForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./FeedbackForm.css";

const FeedbackForm = () => {
  const { courseId, courseType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const studentId = localStorage.getItem("studentId");

  // Receive facultyName & courseName from dashboard
  const { facultyName, courseName } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/questions/${courseType}`
        );
        setQuestions(res.data);
      } catch (err) {
        Swal.fire("❌ Error", "Failed to load questions", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [courseType]);

  const handleChange = (qid, qtext, value) => {
    setResponses((prev) => ({
      ...prev,
      [qtext]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!facultyName || !courseName) {
      Swal.fire("⚠ Missing", "Faculty or subject info missing. Go back to dashboard.", "warning");
      return;
    }

    if (Object.keys(responses).length !== questions.length) {
      Swal.fire("⚠ Incomplete", "Please answer all questions", "warning");
      return;
    }

    const formattedResponses = questions.map((q) => ({
      questionId: q._id,
      questionText: q.question,
      answer: responses[q.question],
    }));

    try {
      setSubmitting(true);
      await axios.post("http://localhost:5000/api/feedback", {
        studentId,
        courseId,
        courseType,
        facultyName,
        courseName,
        responses: formattedResponses,
      });

      Swal.fire("✅ Success", "Feedback submitted successfully!", "success").then(() =>
        navigate("/student/dashboard")
      );
    } catch (err) {
      console.error("❌ Feedback submit error:", err.response?.data || err.message);
      Swal.fire("❌ Error", err.response?.data?.message || "Failed to submit feedback", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercentage =
    questions.length > 0 ? (Object.keys(responses).length / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="feedback-form-container">
        <div className="feedback-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>⏳ Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-form-container">
      <div className="feedback-content">
        {/* Header */}
        <div className="feedback-header">
          <h2 className="feedback-title">📋 Feedback Form</h2>
          <div className="course-type-badge">{courseType?.toUpperCase()}</div>

          {courseName && (
            <div className="course-info">
              <span className="course-label">Subject:</span>
              <span className="course-name">{courseName}</span>
            </div>
          )}

          {facultyName && (
            <div className="faculty-info">
              <span className="faculty-label">Faculty:</span>
              <span className="faculty-name">{facultyName}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {Object.keys(responses).length} of {questions.length} questions answered
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="feedback-form">
          {questions.map((q, index) => (
            <div key={q._id} className="question-card">
              <p className="question-text">
                <span className="question-number">{index + 1}.</span> {q.question}
              </p>

              <div className="options-container">
                {["Excellent", "Good", "Average", "Poor", "Very Poor"].map((opt) => (
                  <div key={opt} className="radio-option">
                    <input
                      type="radio"
                      id={`${q._id}-${opt}`}
                      name={q._id}
                      value={opt}
                      onChange={() => handleChange(q._id, q.question, opt)}
                      required
                    />
                    <label htmlFor={`${q._id}-${opt}`} className="radio-label">
                      {opt}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" disabled={submitting} className="submit-button">
            <span className="submit-button-content">
              {submitting && <span className="button-spinner"></span>}
              {submitting ? "Submitting Feedback..." : "Submit Feedback"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
