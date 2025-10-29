// AdminFeedbackAnalysis.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import "./AdminFeedbackAnalysis.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const AdminFeedbackAnalysis = () => {
  const { courseId, courseName, facultyName } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbackAnalysis = async () => {
      try {
        let url = `https://online-course-feedback-system-yf47.vercel.app/api/feedback/analysis/${courseId}`;

        if (facultyName) {
          url += `?faculty=${encodeURIComponent(facultyName)}`;
        }

        const response = await axios.get(url);
        if (response.data.message === "No feedback yet") {
          setFeedbackData(null);
        } else {
          setFeedbackData(response.data);
        }
      } catch (err) {
        setError("Error loading feedback analysis");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackAnalysis();
  }, [courseId, facultyName]);

  // CSV Download
  const downloadCSV = () => {
    if (!feedbackData) return;

    const { summary, totalResponses } = feedbackData;
    const headers = [
      "Question",
      "Excellent",
      "Good",
      "Average",
      "Poor",
      "Very Poor",
      "Average Rating",
    ];

    const rows = Object.entries(summary).map(([question, ratings]) => {
      const total =
        (ratings.Excellent || 0) +
        (ratings.Good || 0) +
        (ratings.Average || 0) +
        (ratings.Poor || 0) +
        (ratings["Very Poor"] || 0);

      const weighted =
        (ratings.Excellent || 0) * 5 +
        (ratings.Good || 0) * 4 +
        (ratings.Average || 0) * 3 +
        (ratings.Poor || 0) * 2 +
        (ratings["Very Poor"] || 0) * 1;

      const avg = total > 0 ? (weighted / total).toFixed(2) : "0";

      return [
        question,
        ratings.Excellent || 0,
        ratings.Good || 0,
        ratings.Average || 0,
        ratings.Poor || 0,
        ratings["Very Poor"] || 0,
        avg,
      ];
    });

    const csvContent = [
      [`Course Name: ${decodeURIComponent(courseName)}`],
      [`Faculty Name: ${decodeURIComponent(facultyName || "All Faculty")}`],
      [`Total Responses: ${totalResponses}`],
      [],
      headers,
      ...rows,
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    link.href = url;
    link.setAttribute(
      "download",
      `Feedback_Analysis_${facultyName || "All"}_${timestamp}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading)
    return (
      <div className="loading-container">
        ⏳ Loading feedback analysis...
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        {error}
      </div>
    );

  if (!feedbackData)
    return (
      <div className="no-feedback-container">
        📭 No feedback available {facultyName ? `for ${facultyName}` : "for this course"} yet.
      </div>
    );

  const questionLabels = Object.keys(feedbackData.summary);
  const ratingOptions = ["Excellent", "Good", "Average", "Poor", "Very Poor"];
  const colors = [
    "rgba(75, 192, 192, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(255, 99, 132, 0.7)",
    "rgba(153, 102, 255, 0.7)",
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, font: { size: 11 } },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Responses", font: { size: 12 } },
        ticks: { precision: 0, stepSize: 1 },
      },
      x: {
        title: { display: true, text: "Ratings", font: { size: 12 } },
        ticks: { font: { size: 11 } },
      },
    },
  };

  return (
    <div className="feedback-analysis-container">
      <h2 className="feedback-header">
        📊 Feedback Analysis
      </h2>
      <p className="feedback-info">
        <b>Course:</b> {decodeURIComponent(courseName)}
      </p>
      <p className="feedback-info">
        <b>Faculty:</b> {decodeURIComponent(facultyName || "All Faculty")}
      </p>
      <p className="feedback-total">
        Total Responses: <b>{feedbackData.totalResponses}</b>
      </p>

      <div className="charts-container">
        {questionLabels.map((question, index) => {
          const data = {
            labels: ratingOptions,
            datasets: [
              {
                label: question,
                data: ratingOptions.map(
                  (rating) => feedbackData.summary[question][rating] || 0
                ),
                backgroundColor: colors,
                borderRadius: 5,
              },
            ],
          };

          return (
            <div key={index} className="chart-card">
              <h3 className="chart-title">
                {question}
              </h3>
              <div className="chart-wrapper">
                <Bar data={data} options={chartOptions} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="download-button-container">
        <button onClick={downloadCSV} className="download-button">
          ⬇ Download CSV
        </button>
      </div>
    </div>
  );
};

export default AdminFeedbackAnalysis;
