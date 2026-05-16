import { useState } from "react";
import FileUpload from "./components/FileUpload.jsx";
import FileList from "./components/FileList.jsx";
import useFiles from "./hooks/useFiles.js";
import "./App.css";

function App() {
  const { files, loading, error, uploadFile, deleteFile, refreshFiles } =
    useFiles();
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpload = async (file) => {
    setSuccessMessage("");
    try {
      await uploadFile(file);
      // #region agent log
      fetch("http://127.0.0.1:7584/ingest/1b8602bd-572b-40e2-9a81-f27f2de6585e", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "4715d3",
        },
        body: JSON.stringify({
          sessionId: "4715d3",
          location: "App.jsx:handleUpload",
          message: "upload handler success path",
          data: { fileName: file?.name },
          timestamp: Date.now(),
          hypothesisId: "D",
        }),
      }).catch(() => {});
      // #endregion
      setSuccessMessage("File uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      // #region agent log
      fetch("http://127.0.0.1:7584/ingest/1b8602bd-572b-40e2-9a81-f27f2de6585e", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "4715d3",
        },
        body: JSON.stringify({
          sessionId: "4715d3",
          location: "App.jsx:handleUpload",
          message: "upload handler error path",
          data: { fileName: file?.name, errorMessage: err?.message },
          timestamp: Date.now(),
          hypothesisId: "D",
        }),
      }).catch(() => {});
      // #endregion
    }
  };

  const handleDelete = async (id) => {
    setSuccessMessage("");
    await deleteFile(id);
    setSuccessMessage("File deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Cloud File Upload Dashboard</h1>
        <p>Upload files to AWS S3 and manage them from one place</p>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {successMessage && (
        <div className="success-banner">{successMessage}</div>
      )}

      <section className="card">
        <FileUpload onUpload={handleUpload} loading={loading} />
      </section>

      <section className="card">
        <FileList
          files={files}
          loading={loading}
          onDelete={handleDelete}
          onRefresh={refreshFiles}
        />
      </section>
    </div>
  );
}

export default App;
