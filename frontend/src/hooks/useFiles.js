import { useState, useEffect, useCallback } from "react";
import * as fileApi from "../api/fileApi.js";

const useFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshFiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fileApi.getFiles();
      const nextFiles = result.data || [];
      // #region agent log
      fetch("http://127.0.0.1:7584/ingest/1b8602bd-572b-40e2-9a81-f27f2de6585e", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "4715d3",
        },
        body: JSON.stringify({
          sessionId: "4715d3",
          location: "useFiles.js:refreshFiles",
          message: "files state after fetch",
          data: {
            resultKeys: result ? Object.keys(result) : [],
            filesCount: nextFiles.length,
            usedFallbackEmpty: !result?.data,
          },
          timestamp: Date.now(),
          hypothesisId: "C",
        }),
      }).catch(() => {});
      // #endregion
      setFiles(nextFiles);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load files. Is the server running?"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  const uploadFile = async (file) => {
    setLoading(true);
    setError("");
    try {
      await fileApi.uploadFile(file);
      await refreshFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id) => {
    setLoading(true);
    setError("");
    try {
      await fileApi.deleteFile(id);
      await refreshFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete file.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    loading,
    error,
    uploadFile,
    deleteFile,
    refreshFiles,
  };
};

export default useFiles;
