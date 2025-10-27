import React from "react";
import { useNavigate } from "react-router-dom";
import AdminQuestions from "../../component/AdminQuestion";
import "./AdminQuestionsPage.css";

const AdminQuestionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2 className="title">📝 Manage Feedback Questions</h2>

      <button
        onClick={() => navigate("/admin/dashboard")}
        className="back-button"
      >
        ⬅ Back to Dashboard
      </button>

      <AdminQuestions />
    </div>
  );
};

export default AdminQuestionsPage;