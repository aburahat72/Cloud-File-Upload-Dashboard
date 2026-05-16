import { useState, useRef } from "react";
import "./FileUpload.css";

function FileUpload({ onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await onUpload(selectedFile);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="file-upload">
      <h2>Upload a File</h2>
      <p className="upload-hint">
        Supported: images, PDF, TXT, DOC (max 5MB)
      </p>

      <div className="upload-controls">
        <label className="file-input-label">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            disabled={loading}
            className="file-input"
          />
          <span className="file-input-btn">Choose File</span>
          <span className="file-name">
            {selectedFile ? selectedFile.name : "No file selected"}
          </span>
        </label>

        {selectedFile && (
          <span className="file-size">{formatSize(selectedFile.size)}</span>
        )}

        <button
          type="button"
          className="upload-btn"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
        >
          {loading ? "Uploading..." : "Upload to Cloud"}
        </button>
      </div>
    </div>
  );
}

export default FileUpload;
