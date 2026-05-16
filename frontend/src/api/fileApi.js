import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getFiles = async () => {
  const response = await api.get("/files");
  // #region agent log
  fetch("http://127.0.0.1:7584/ingest/1b8602bd-572b-40e2-9a81-f27f2de6585e", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "4715d3",
    },
    body: JSON.stringify({
      sessionId: "4715d3",
      location: "fileApi.js:getFiles",
      message: "getFiles response shape",
      data: {
        status: response.status,
        topLevelKeys: response.data ? Object.keys(response.data) : [],
        dataArrayLength: Array.isArray(response.data?.data)
          ? response.data.data.length
          : null,
        dataType: typeof response.data?.data,
      },
      timestamp: Date.now(),
      hypothesisId: "C",
    }),
  }).catch(() => {});
  // #endregion
  return response.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const uploadHeaders = {
    "Content-Type": "multipart/form-data",
  };
  // #region agent log
  fetch("http://127.0.0.1:7584/ingest/1b8602bd-572b-40e2-9a81-f27f2de6585e", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "4715d3",
    },
    body: JSON.stringify({
      sessionId: "4715d3",
      location: "fileApi.js:uploadFile:before",
      message: "upload request prepared",
      data: {
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
        uploadContentType: uploadHeaders["Content-Type"],
        apiBaseURL: API_URL,
      },
      timestamp: Date.now(),
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion

  try {
    const response = await api.post("/files/upload", formData, {
      headers: uploadHeaders,
    });
    // #region agent log
    fetch("http://127.0.0.1:7584/ingest/1b8602bd-572b-40e2-9a81-f27f2de6585e", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "4715d3",
      },
      body: JSON.stringify({
        sessionId: "4715d3",
        location: "fileApi.js:uploadFile:success",
        message: "upload response ok",
        data: {
          status: response.status,
          success: response.data?.success,
          message: response.data?.message,
        },
        timestamp: Date.now(),
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    return response.data;
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
        location: "fileApi.js:uploadFile:error",
        message: "upload request failed",
        data: {
          status: err.response?.status,
          responseMessage: err.response?.data?.message,
          axiosMessage: err.message,
          hasResponse: Boolean(err.response),
        },
        timestamp: Date.now(),
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    throw err;
  }
};

export const deleteFile = async (id) => {
  const response = await api.delete(`/files/${id}`);
  return response.data;
};
