import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadFile,
  getAllFiles,
  deleteFile,
} from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getAllFiles);
router.delete("/:id", deleteFile);

export default router;
