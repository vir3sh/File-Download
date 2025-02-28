import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");

  // Fetch user files
  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://localhost:5000/api/files", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data); // ✅ This is working
        setFiles(res.data); // Add this line to update state
      } catch (error) {
        console.error("Error fetching files", error);
      }
    };

    fetchFiles();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file
  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(
        `File uploaded successfully! Access Code: ${res.data.accessCode}`
      );
      setFiles([...files, res.data]);
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed");
    }
  };

  // Delete file
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/file/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFiles(files.filter((file) => file._id !== id));
      setMessage("File deleted");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // Download file using access code
  const handleDownload = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/download",
        { accessCode },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file");
      document.body.appendChild(link);
      link.click();
      setMessage("Download started");
    } catch (error) {
      console.error("Download failed:", error);
      setMessage("Invalid access code");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>

      {/* File Upload */}
      <div className="mb-6">
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 w-full rounded-md"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mt-2 w-full"
        >
          Upload File
        </button>
      </div>

      {/* File List */}
      <h3 className="text-lg font-semibold mb-2">Your Files</h3>
      <ul className="border rounded-md p-4 bg-gray-100">
        {files.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          files.map((file) => (
            <li
              key={file._id}
              className="flex justify-between items-center bg-white shadow-sm p-2 rounded-md mb-2"
            >
              <span className="truncate">{file.originalName}</span>
              <span className="truncate">{file.accessCode}</span>
              <button
                onClick={() => handleDelete(file._id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      {/* File Download */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Enter Access Code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="border p-2 w-full rounded-md"
        />
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md mt-2 w-full"
        >
          Download File
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <p className="mt-4 text-center text-lg font-semibold text-blue-600">
          {message}
        </p>
      )}
    </div>
  );
};

export default Dashboard;
