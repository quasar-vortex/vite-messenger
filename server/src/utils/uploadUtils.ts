import { v4 as uuid } from "uuid";

import {
  DeleteObjectCommand,
  ListObjectsCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import multer from "multer";
import ms3 from "multer-s3";
import { s3Config } from "../config/env";
import HttpError from "../config/httpError";
import { db } from "../config/db";

export const allowedMimeTypes = {
  audio: [
    "audio/mpeg", // MP3
    "audio/wav", // WAV
    "audio/ogg", // OGG
    "audio/flac", // FLAC
    "audio/aac", // AAC
    "audio/mp4", // MP4 audio
    "audio/webm", // WEBM audio
  ],
  image: [
    "image/jpeg", // JPEG
    "image/png", // PNG
    "image/gif", // GIF
    "image/webp", // WEBP
    "image/bmp", // BMP
    "image/svg+xml", // SVG
    "image/tiff", // TIFF
  ],
  video: [
    "video/mp4", // MP4
    "video/webm", // WEBM
    "video/ogg", // OGG
    "video/quicktime", // MOV
    "video/x-msvideo", // AVI
    "video/x-matroska", // MKV
  ],
};

export type S3StorageFile = {
  size: number; // Size of the file in bytes
  bucket: string; // The bucket used to store the file
  key: string; // The name of the file
  acl: S3ACL; // Access control for the file
  contentType: string; // The mimetype used to upload the file
  metadata: FileMetaData; // The metadata object to be sent to S3
  location: string; // The S3 url to access the file
  etag: string; // The etag of the uploaded file in S3
  contentDisposition?: string; // The contentDisposition used to upload the file (optional)
  storageClass?: string; // The storageClass to be used for the uploaded file in S3 (optional)
  versionId?: string; // The versionId is an optional param returned by S3 for versioned buckets
  contentEncoding?: string; // The contentEncoding used to upload the file (optional)

  fileBody?: Buffer;
};
type FileMetaData = {
  fieldName: string;
  originalName: string;
  size: number;
  mimetype: string;
};
type S3ACL =
  | "private"
  | "public-read"
  | "public-read-write"
  | "aws-exec-read"
  | "authenticated-read"
  | "bucket-owner-read"
  | "bucket-owner-full-control"
  | "log-delivery-write";
export const s3 = new S3Client({
  credentials: {
    accessKeyId: s3Config.key,
    secretAccessKey: s3Config.secret,
  },
  endpoint: s3Config.endpoint,
  region: s3Config.region,
});
export const upload = multer({
  storage: ms3({
    s3,
    bucket: s3Config.bucket,
    contentDisposition: "inline",
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,

        fileType: file.mimetype.split("/")[0].toUpperCase(),
      } as FileMetaData);
    },
    key: (req, file, cb) => {
      cb(null, uuid());
    },
    acl: "public-read" as S3ACL,
    contentType: (req, file, cb) => {
      cb(false, file.mimetype);
    },
  }),
  fileFilter: (req, file, cb) => {
    const { audio, image, video } = allowedMimeTypes;
    const all = [...audio, ...image, ...video];
    if (!all.includes(file.mimetype)) {
      cb(
        new HttpError({
          status: "BAD_REQUEST",
          message: `File type must be one of: ${all.join("|")}`,
        })
      );
      return;
    }
    cb(null, true);
  },
});
export const truncateAllFiles = async () => {
  try {
    console.log("Getting S3 Files...");
    const { Contents: s3Files } = await s3.send(
      new ListObjectsCommand({ Bucket: s3Config.bucket })
    );
    if (s3Files) {
      console.log("Deleting S3 Files...");
      await Promise.all(
        s3Files.map(async (file) => {
          console.log("Deleting File: ", file.Key);
          return await s3.send(
            new DeleteObjectCommand({
              Bucket: s3Config.bucket,
              Key: file.Key,
            })
          );
        })
      );
    }
    console.log("Deleting Database Records");
    await db.file.deleteMany();
  } catch (error) {
    console.log(error);
  }
};

export const deleteObject = async (key: string) => {
  try {
    return s3.send(
      new DeleteObjectCommand({ Bucket: s3Config.bucket, Key: key })
    );
  } catch (error) {
    console.log;
  }
};
