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
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(res.data);
      } catch (error) {
        console.error("Error fetching files:", error);
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
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>

      {/* File Upload */}
      <div className="mb-4">
        <input type="file" onChange={handleFileChange} className="border p-2" />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white p-2 ml-2"
        >
          Upload
        </button>
      </div>

      {/* File List */}
      <h3 className="text-lg font-semibold">Your Files</h3>
      <ul>
        {files.map((file) => (
          <li key={file._id} className="flex justify-between p-2 border-b">
            {file.originalName}
            <button
              onClick={() => handleDelete(file._id)}
              className="bg-red-500 text-white p-1"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* File Download */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter Access Code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={handleDownload}
          className="bg-green-500 text-white p-2 ml-2"
        >
          Download
        </button>
      </div>

      {/* Message Display */}
      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </div>
  );
};

export default Dashboard;
