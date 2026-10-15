import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";
import "../pages/admin/AdminDashboard.css";


const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://online-course-feedback-system-hr9d.vercel.app/api");

const AddCourseListForm = ({ onUploadComplete }) => {
  const [courseFile, setCourseFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addedCourses, setAddedCourses] = useState([]);
  const [existingCourses, setExistingCourses] = useState([]);
  const courseFileInputRef = useRef(null);

  // Handle file selection
  const handleCourseFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const isSupportedFile =
        selectedFile.name.toLowerCase().endsWith(".csv") ||
        selectedFile.name.toLowerCase().endsWith(".xlsx") ||
        selectedFile.name.toLowerCase().endsWith(".xls") ||
        selectedFile.type === "text/csv" ||
        selectedFile.type === "application/vnd.ms-excel" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (!isSupportedFile) {
        toast.error("Please upload a CSV or Excel file");
        return;
      }
      setCourseFile(selectedFile);
    }
  };

  // Upload CSV file
  const handleCourseFileUpload = async (e) => {
    e.preventDefault();

    if (!courseFile) {
      toast.error("Please select a course CSV file before uploading.");
      return;
    }

    try {
      let uploadFile = courseFile;
      const fileName = courseFile.name.toLowerCase();

      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        const workbook = XLSX.read(await courseFile.arrayBuffer(), {
          type: "array",
        });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        if (!firstSheet) {
          throw new Error("The Excel workbook does not contain a worksheet");
        }

        uploadFile = new File(
          [XLSX.utils.sheet_to_csv(firstSheet)],
          `${courseFile.name.replace(/\.(xlsx|xls)$/i, "")}.csv`,
          { type: "text/csv" }
        );
      }

      const formData = new FormData();
      formData.append("csvFile", uploadFile);

      const response = await fetch(`${API_BASE_URL}/upload-coursebatch`, {

        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload course list");

      const data = await response.json();
      toast.success(data.message);

      // Expect backend to send arrays with full course details
      setAddedCourses(data.success || []);
      setExistingCourses(data.error || []);
      setShowModal(true);
      onUploadComplete?.();

      setCourseFile(null);
      if (courseFileInputRef.current) courseFileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to upload course file. Please try again.");
    }
  };

const renderTable = (courses) => (
  <table className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden text-gray-700">
    <thead className="bg-blue-100 text-blue-900">
      <tr>
        <th className="border border-gray-200 px-4 py-2">Program</th>
        <th className="border border-gray-200 px-4 py-2">Dept</th>
        <th className="border border-gray-200 px-4 py-2">Year</th>
        <th className="border border-gray-200 px-4 py-2">Sem</th>
        <th className="border border-gray-200 px-4 py-2">Course Code</th>
        <th className="border border-gray-200 px-4 py-2">Course Name</th>
        <th className="border border-gray-200 px-4 py-2">Course Type</th>
        <th className="border border-gray-200 px-4 py-2">Faculty</th>
      </tr>
    </thead>
    <tbody className="bg-white">
      {courses.map((course, i) => (
        <tr key={i} className="hover:bg-blue-50">
          <td className="border border-gray-600 px-4 py-2">{course.program}</td>
          <td className="border border-gray-600 px-4 py-2">{course.dept}</td>
          <td className="border border-gray-600 px-4 py-2">{course.year}</td>
          <td className="border border-gray-600 px-4 py-2">{course.sem}</td>
          <td className="border border-gray-600 px-4 py-2">{course.courseCode}</td>
          <td className="border border-gray-600 px-4 py-2">{course.courseName}</td>
          <td className="border border-gray-600 px-4 py-2">{course.courseType}</td>
          <td className="border border-gray-600 px-4 py-2">{course.faculty ? course.faculty.join(", ") : ""}</td>
        </tr>
      ))}
    </tbody>
  </table>
);


  return (
    <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-8 border border-blue-100">
      <form onSubmit={handleCourseFileUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course CSV File</label>
          <div
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
            onClick={() => courseFileInputRef.current.click()}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-3 text-blue-500" />
              <p className="mb-1 text-sm text-gray-500">
                {courseFile ? courseFile.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500">CSV, XLS, or XLSX (MAX. 10MB)</p>
            </div>
            <input
              ref={courseFileInputRef}
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={handleCourseFileChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Upload Course List
        </button>
      </form>
       {/* Modal for results */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-30 z-50">
    <div className="bg-blue-50 text-gray-700 rounded-lg shadow-2xl p-8 max-w-6xl w-[90%] overflow-x-auto">
      {/* Title */}
      <h3 className="text-2xl font-semibold mb-6 text-blue-900 text-center">Upload Results</h3>

      {/* Existing Courses */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2 text-gray-700">Already Existing Courses:</h4>
        {existingCourses.length > 0 ? (
          renderTable(existingCourses)
        ) : (
          <p className="text-gray-500">No duplicates found.</p>
        )}
      </div>

      {/* Newly Added Courses */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2 text-gray-700">Newly Added Courses:</h4>
        {addedCourses.length > 0 ? (
          renderTable(addedCourses)
        ) : (
          <p className="text-gray-500">No new courses added.</p>
        )}
      </div>

      <button
        onClick={() => setShowModal(false)}
        className="w-full px-4 py-2 bg-white text-blue-900 font-semibold rounded-md hover:bg-gray-200"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default AddCourseListForm;    

