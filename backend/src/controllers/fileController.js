import { appendFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import File from "../models/File.js";
import { uploadToS3, deleteFromS3 } from "../services/s3Service.js";

const __dbgDir = dirname(fileURLToPath(import.meta.url));
const __dbgLog = join(__dbgDir, "../../../debug-4715d3.log");

const dbgLog = (payload) => {
  try {
    appendFileSync(__dbgLog, `${JSON.stringify(payload)}\n`);
  } catch {
    /* ignore */
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    // #region agent log
    dbgLog({
      sessionId: "4715d3",
      location: "fileController.js:uploadFile",
      message: "upload handler entry",
      data: {
        hasFile: Boolean(req.file),
        contentType: req.headers["content-type"],
        bodyKeys: req.body ? Object.keys(req.body) : [],
        fileField: req.file
          ? {
              originalname: req.file.originalname,
              size: req.file.size,
              mimetype: req.file.mimetype,
            }
          : null,
      },
      timestamp: Date.now(),
      hypothesisId: "B",
    });
    // #endregion
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided. Please select a file to upload.",
      });
    }

    const { key, publicUrl } = await uploadToS3(req.file);

    const savedFile = await File.create({
      filename: req.file.originalname,
      s3Url: publicUrl,
      s3Key: key,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: savedFile,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFiles = async (req, res, next) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    await deleteFromS3(file.s3Key);
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
