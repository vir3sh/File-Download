import { useState } from "react";
import axios from "axios";
import React from "react";
const DownloadFile = () => {
  const [accessCode, setAccessCode] = useState("");

  const handleDownload = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.REACT_APP_API_URL}/download`,
        { accessCode },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Invalid access code");
    }
  };

  return (
    <div>
      <h2>Download File</h2>
      <input
        type="text"
        placeholder="Enter Access Code"
        value={accessCode}
        onChange={(e) => setAccessCode(e.target.value)}
        required
      />
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default DownloadFile;
