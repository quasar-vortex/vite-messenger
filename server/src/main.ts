import express, { ErrorRequestHandler } from "express";
import { authRouter } from "./routes/authRoutes";
import { appConfig, s3Config } from "./config/env";
import { db } from "./config/db";
import HttpError from "./config/httpError";
import cookieParser from "cookie-parser";
import cors from "cors";
import { truncateAllFiles } from "./utils/uploadUtils";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "*" }));

app.get("/api/v1/health", (req, res, next) => {
  res.sendStatus(200);
});
app.use("/api/v1/auth", authRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: "Internal Error" });
};
app.use(errorHandler);

if (process.argv[2] === "--truncate") {
  (async () => await truncateAllFiles())();
}

const main = async () => {
  try {
    await db.$connect();
    app.listen(appConfig.port, () => console.log("Running On", appConfig.port));
  } catch (error) {
    console.log(error);
    await db.$disconnect();
    process.exit(1);
  }
};

main();