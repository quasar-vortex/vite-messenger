import pino from "pino";

// Create a logger instance with custom configuration
const isProd = process.env.NODE_ENV?.toLocaleLowerCase() === "production";
const logger = pino({
  level: isProd ? "info" : "debug",
  transport: isProd
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard", // Adds timestamps in a readable format
        },
      }
    : undefined,
});

export default logger;
