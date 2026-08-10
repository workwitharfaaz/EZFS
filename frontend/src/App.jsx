import React, { useState } from "react";
import axios from "axios";
import "./style.css";

function App() {
  const [file, setFile] = useState(null);
  const [uploadCode, setUploadCode] = useState("");
  const [downloadCode, setDownloadCode] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const backend = "https://sfs-backend-b3li.onrender.com";

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    const form = new FormData();
    form.append("file", file);

    const res = await axios.post(`${backend}/upload`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        const percent = Math.round((evt.loaded * 100) / evt.total);
        setUploadProgress(percent);
      },
    });

    setUploadCode(res.data.code);
    setUploadProgress(100);
  };

  const handleDownload = async () => {
    if (!downloadCode) return alert("Enter a code.");

    const res = await axios.get(`${backend}/download/${downloadCode}`, {
      responseType: "blob",
      onDownloadProgress: (evt) => {
        const percent = Math.round((evt.loaded * 100) / evt.total);
        setDownloadProgress(percent);
      },
    });

    const fileName = res.headers["x-filename"] || "downloaded_file";
    const fileURL = URL.createObjectURL(res.data);

    const a = document.createElement("a");
    a.href = fileURL;
    a.download = fileName;
    a.click();

    setDownloadProgress(100);
  };

  return (
    <div className="page">
      <div className="card pastel-card">

        <h1 className="title pastel-title">EZFS – Fast File Sharing</h1>

        <p className="pastel-text">
          Share files instantly between any two devices using a simple
          6-digit code. No login required. Works on all devices.
        </p>

        {/* SEND FILE */}
        <div className="section">
          <h2 className="pastel-heading">Send File</h2>

          <label htmlFor="fileInput" className="pastel-btn select-file-btn">
            📁 Select File
          </label>

          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="pastel-btn action-btn" onClick={handleUpload}>
            ⬆️ Upload
          </button>

          {uploadProgress > 0 && (
            <div className="progress-container pastel-progress">
              <div
                className="progress-bar pastel-bar"
                style={{ width: uploadProgress + "%" }}
              ></div>
              <span>{uploadProgress}%</span>
            </div>
          )}

          {uploadCode && (
            <p className="code-box pastel-code">
              Code: <span>{uploadCode}</span>
            </p>
          )}
        </div>

        <div className="divider"></div>

        {/* RECEIVE FILE */}
        <div className="section">
          <h2 className="pastel-heading">Receive File</h2>

          <input
            className="input-box pastel-input"
            type="text"
            placeholder="Enter 6-digit code"
            value={downloadCode}
            onChange={(e) => setDownloadCode(e.target.value)}
          />

          <button className="pastel-btn action-btn" onClick={handleDownload}>
            ⬇️ Download
          </button>

          {downloadProgress > 0 && (
            <div className="progress-container pastel-progress">
              <div
                className="progress-bar pastel-bar"
                style={{ width: downloadProgress + "%" }}
              ></div>
              <span>{downloadProgress}%</span>
            </div>
          )}
        </div>

        {/* SEO CONTENT */}
        <div className="seo-section">
          <h2 className="pastel-heading">About EZFS</h2>
          <p className="pastel-text">
            EZFS is a simple file-sharing tool using a 6-digit code to transfer
            files instantly. Works on mobile and desktop. No account required. Since the backend is hosted for free it needs sometime before it can become active. Should be active in about 1 to 2 minutes after uploading if didn't work please upload again.
          </p>

          <h3 className="pastel-sub">Features</h3>
          <ul className="pastel-list">
            <li>Fast uploads and downloads</li>
            <li>Secure temporary storage</li>
            <li>No login or signup</li>
            <li>Works on all devices</li>
          </ul>

          <h3 className="pastel-sub">How It Works</h3>
          <p className="pastel-text">
            Select a file → upload → get a code → share → download.
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;
