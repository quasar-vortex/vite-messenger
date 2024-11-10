import express, { ErrorRequestHandler } from "express";
import { authRouter } from "./routes/authRoutes";
import { appConfig } from "./config/env";
import { db } from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import { truncateAllFiles } from "./utils/uploadUtils";
import logger from "./config/logger";
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.get("/api/v1/health", (req, res, next) => {
  res.sendStatus(200);
});
app.use("/api/v1/auth", authRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res
    .status(err?.statusCode || 500)
    .json({ message: err?.message || "Internal Error" });
};
app.use(errorHandler);

if (process.argv[2] === "--truncate") {
  (async () => await truncateAllFiles())();
}

const main = async () => {
  try {
    logger.info("Connecting to database.");
    await db.$connect();
    app.listen(appConfig.port, () =>
      logger.info("Running On", { port: appConfig.port })
    );
  } catch (error) {
    logger.error("App Crashed", error);
    await db.$disconnect();
    process.exit(1);
  }
};

main();
