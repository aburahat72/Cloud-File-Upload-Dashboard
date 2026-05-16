import LoadingSpinner from "./LoadingSpinner.jsx";
import "./FileList.css";

function FileList({ files, loading, onDelete, onRefresh }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (mimeType) => mimeType?.startsWith("image/");

  return (
    <div className="file-list">
      <div className="file-list-header">
        <h2>Uploaded Files</h2>
        <button
          type="button"
          className="refresh-btn"
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {loading && files.length === 0 ? (
        <LoadingSpinner message="Loading files..." />
      ) : files.length === 0 ? (
        <p className="empty-state">No files uploaded yet. Upload your first file above.</p>
      ) : (
        <ul className="files-grid">
          {files.map((file) => (
            <li key={file._id} className="file-item">
              {isImage(file.mimeType) && (
                <img
                  src={file.s3Url}
                  alt={file.filename}
                  className="file-preview"
                />
              )}
              <div className="file-info">
                <p className="file-title" title={file.filename}>
                  {file.filename}
                </p>
                <p className="file-meta">
                  {formatSize(file.size)} · {formatDate(file.uploadDate)}
                </p>
                <div className="file-actions">
                  <a
                    href={file.s3Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-link"
                  >
                    View
                  </a>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => onDelete(file._id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileList;
