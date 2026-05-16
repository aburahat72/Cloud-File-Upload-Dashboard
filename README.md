# Cloud File Upload Dashboard

A full-stack MERN application that uploads files to **AWS S3**, stores metadata in **MongoDB Atlas**, and displays them in a clean React dashboard. Built for learning cloud storage, REST APIs, and modern deployment (Vercel + Render).

## Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Frontend   | React, Vite, Axios            |
| Backend    | Node.js, Express, Multer      |
| Database   | MongoDB Atlas (Mongoose)      |
| Storage    | AWS S3 (AWS SDK v3)           |
| Deployment | Vercel (frontend), Render (API) |

---

## Project Structure

```
cloud-file-upload-dashboard/
├── frontend/                 # React + Vite client
│   ├── public/               # Static assets (favicon, etc.)
│   ├── src/
│   │   ├── api/              # Axios API calls to backend
│   │   ├── components/       # Reusable UI (upload, list, spinner)
│   │   ├── hooks/            # Custom React hooks (useFiles)
│   │   ├── App.jsx           # Main layout and page logic
│   │   └── main.jsx          # React entry point
│   ├── .env.example          # Frontend env template
│   └── vercel.json           # SPA routing for Vercel
│
├── backend/                  # Express REST API
│   ├── server.js             # App entry — starts server & DB
│   └── src/
│       ├── app.js            # Express app, CORS, routes mount
│       ├── config/           # DB & S3 client setup
│       ├── models/           # Mongoose schemas (File)
│       ├── controllers/      # Request handlers (upload, list, delete)
│       ├── routes/           # API route definitions
│       ├── middleware/       # Multer upload + error handler
│       └── services/         # S3 upload/delete logic
│
└── README.md
```

### Folder explanations

| Folder / File | Purpose |
|---------------|---------|
| `frontend/src/api` | Centralizes HTTP calls with Axios so components stay UI-focused. |
| `frontend/src/components` | Presentational pieces: file picker, file grid, loading spinner. |
| `frontend/src/hooks` | `useFiles` manages fetch/upload/delete state and errors. |
| `backend/src/config` | Connects MongoDB and configures the AWS S3 client once. |
| `backend/src/models` | Defines the `File` schema (filename, S3 URL, upload date). |
| `backend/src/controllers` | Business logic: validate input, call S3, save to DB. |
| `backend/src/routes` | Maps URLs like `POST /api/files/upload` to controllers. |
| `backend/src/middleware` | Multer parses multipart uploads; error handler formats API errors. |
| `backend/src/services` | Reusable S3 `PutObject` / `DeleteObject` operations. |

---

## Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- AWS account with S3 bucket and IAM user

### 1. Clone and install dependencies

```bash
cd cloud-file-upload-dashboard

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment variables

**Backend** — copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/cloud-file-upload
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
CLIENT_URL=http://localhost:5173
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. AWS S3 setup

1. Create an S3 bucket (e.g. `my-cloud-uploads`).
2. Create an IAM user with `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` on that bucket.
3. For **public read** of uploaded files, add a bucket policy (adjust bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

4. Disable "Block all public access" only if you need public URLs (or use presigned URLs in production).

### 4. MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Add your IP to Network Access (or `0.0.0.0/0` for development).
3. Create a database user and copy the connection string into `MONGODB_URI`.

### 5. Run locally

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## API Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/health`       | Health check             |
| GET    | `/api/files`        | List all uploaded files  |
| POST   | `/api/files/upload` | Upload file (multipart)  |
| DELETE | `/api/files/:id`    | Delete file from S3 + DB |

---

## Important Code Sections

### MongoDB model (`backend/src/models/File.js`)

Stores `filename`, `s3Url`, `s3Key`, `mimeType`, `size`, and `uploadDate` for each upload.

### S3 upload (`backend/src/services/s3Service.js`)

Uses AWS SDK v3 `PutObjectCommand` to upload the file buffer from Multer, then builds the public URL:

`https://<bucket>.s3.<region>.amazonaws.com/<key>`

### File upload flow

1. User selects a file in React → `FormData` sent via Axios.
2. Multer (`memoryStorage`) receives the file in the controller.
3. `s3Service.uploadToS3` pushes to S3.
4. Mongoose saves metadata to MongoDB.
5. Frontend refreshes the file list.

### Error handling (`backend/src/middleware/errorHandler.js`)

Catches Multer size errors, invalid file types, and generic server errors with consistent JSON responses.

---

## Deployment

### Backend on Render

1. Push the repo to GitHub.
2. On [render.com](https://render.com), create a **Web Service**.
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `.env.example`.
7. Set `CLIENT_URL` to your Vercel frontend URL after deploying.

### Frontend on Vercel

1. Import the GitHub repo on [vercel.com](https://vercel.com).
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable: `VITE_API_URL=https://your-render-app.onrender.com/api`

Redeploy both after updating URLs so CORS allows your Vercel domain.

---

## Resume Highlights

- Built a **full-stack MERN** app with **AWS S3** cloud storage and **MongoDB Atlas**.
- Implemented **REST APIs** with **Multer** multipart uploads and **MVC** architecture.
- Configured **CORS**, environment-based config, and **Vercel + Render** deployment.

---

## License

MIT
