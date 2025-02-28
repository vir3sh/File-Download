import { useState } from "react";
import React from "react";

const DownloadFile = () => {
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"; // Using VITE_API_URL

  const handleDownload = () => {
    if (!accessCode.trim()) {
      setMessage("Please enter an access code");
      return;
    }

    // Create a form dynamically
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${apiUrl}/download`;
    form.target = "_blank"; // Open in new tab to handle download properly

    // Add hidden input for accessCode
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "accessCode";
    input.value = accessCode;
    form.appendChild(input);

    // Append form to body, submit, and remove it
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    setMessage("Download initiated");
  };

  return (
    <div className="download-container">
      <h2>Download File</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter Access Code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          required
        />
        <button onClick={handleDownload}>Download</button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default DownloadFile;
