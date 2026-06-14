import { CONFIG } from "@/config.js";
import pino from "pino";

const serviceName = CONFIG.SERVICE_NAME ?? "morf-api";
const environment = CONFIG.ENVIRONMENT ?? "development";
const logLevel =
  process.env.LOG_LEVEL ?? (environment === "production" ? "info" : "debug");
const isProduction = environment === "production";

/**
 * Shared application logger.
 *
 * Production logs are emitted as structured JSON so they can be shipped
 * directly to log processors. Development and local logs use an interactive
 * console format for easier debugging.
 *
 * Sensitive fields are redacted by default because this service manages
 * secrets and API keys.
 */
export const logger = pino({
  base: {
    environment,
    service: serviceName,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  level: logLevel,
  redact: {
    censor: "[REDACTED]",
    paths: [
      "authorization",
      "apiKey",
      "api_key",
      "password",
      "secret",
      "token",
      "value",
      "encryptedValue",
      "headers.authorization",
      "req.headers.authorization",
      "request.headers.authorization",
    ],
  },
  serializers: {
    error: pino.stdSerializers.err,
    err: pino.stdSerializers.err,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isProduction
    ? undefined
    : {
        options: {
          colorize: true,
          ignore: "pid,hostname,environment,service",
          messageFormat: "[{service}] {msg}",
          translateTime: "SYS:standard",
        },
        target: "pino-pretty",
      },
});

/**
 * Creates a child logger scoped to a single request or operation.
 */
export const createRequestLogger = (requestId: string) =>
  logger.child({ requestId });
