import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client, { S3_BUCKET } from "../config/s3.js";

export const uploadToS3 = async (file) => {
  const key = `uploads/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  const region = process.env.AWS_REGION;
  const publicUrl = `https://${S3_BUCKET}.s3.${region}.amazonaws.com/${key}`;

  return { key, publicUrl };
};

export const deleteFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
};
