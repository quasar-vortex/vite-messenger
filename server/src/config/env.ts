import dotenv from "dotenv";

dotenv.config();

export const accessConfig = {
  expiresIn: "15m",
  secret: process.env.JWT_ACCESS_SECRET!,
};

export const refreshConfig = {
  expiresIn: "7d",
  secret: process.env.JWT_REFRESH_SECRET!,
};
type AppConfig = {
  port: number;
  node_env: "development" | "production";
};
export const appConfig: AppConfig = {
  port: parseInt(process.env.PORT || "5000"),
  node_env: (
    process.env.NODE_ENV || "development"
  ).toLocaleLowerCase() as AppConfig["node_env"],
};

export const s3Config = {
  endpoint: process.env.S3_ENDPOINT as string,
  bucket: process.env.S3_BUCKET_NAME as string,
  region: process.env.S3_REGION as string,
  key: process.env.S3_ACCESS_KEY as string,
  secret: process.env.S3_SECRET_KEY as string,
};
