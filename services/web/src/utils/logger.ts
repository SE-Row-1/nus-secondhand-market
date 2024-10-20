import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

export const logger =
  process.env.NODE_ENV === "production"
    ? createProductionLogger()
    : createDevelopmentLogger();

function createDevelopmentLogger() {
  return createLogger({
    transports: [new transports.Console()],
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf(
        ({ level, message, timestamp }) =>
          `${timestamp} - ${level} - ${message}`,
      ),
    ),
  });
}

function createProductionLogger() {
  return createLogger({
    transports: [
      new transports.DailyRotateFile({
        dirname: "logs",
        filename: "%DATE%",
        extension: ".log",
        maxFiles: "14d",
      }),
    ],
    format: format.combine(format.timestamp(), format.json()),
  });
}
