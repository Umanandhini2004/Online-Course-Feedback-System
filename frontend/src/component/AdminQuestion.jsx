import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminQuestion.css";

const AdminQuestions = () => {
  const [courseType, setCourseType] = useState("theory");
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`https://online-course-feedback-system-yf47.vercel.app/api/questions/${courseType}`);

      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [courseType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
         await axios.put(`https://online-course-feedback-system-yf47.vercel.app/api/questions/${editId}`, { question });

        Swal.fire("Updated!", "Question updated", "success");
      } else {
        await axios.post("https://online-course-feedback-system-yf47.vercel.app/api/questions", { courseType, question });

        Swal.fire("Added!", "Question added", "success");
      }
      setQuestion("");
      setEditId(null);
      fetchQuestions();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleEdit = (q) => {
    setQuestion(q.question);
    setEditId(q._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://online-course-feedback-system-yf47.vercel.app/api/questions/${id}`);
      Swal.fire("Deleted!", "Question removed", "success");
      fetchQuestions();
    } catch (err) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <div className="admin-questions-container">
      <h2>Manage Questions</h2>

      <div className="course-type-selector">
        <label>Select Course Type</label>
        <select value={courseType} onChange={(e) => setCourseType(e.target.value)}>
          <option value="theory">Theory</option>
          <option value="practical">Practical</option>
          <option value="integrated">Integrated</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="question-form">
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <div className="form-buttons">
          <button type="submit">{editId ? "Update" : "Add"}</button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setQuestion("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="questions-section">
        <h3>Questions ({questions.length})</h3>
        {questions.length === 0 ? (
          <div className="empty-state">No questions found for this course type.</div>
        ) : (
          <ul className="questions-list">
            {questions.map((q) => (
              <li key={q._id} className="question-item">
                <span className="question-text">{q.question}</span>
                <div className="question-actions">
                  <button className="edit-btn" onClick={() => handleEdit(q)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(q._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminQuestions;
