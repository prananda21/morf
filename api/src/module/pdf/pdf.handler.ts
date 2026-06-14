import { OpenAPIHono } from "@hono/zod-openapi";
import { PDF_FROM_HANDLER } from "./from/pdf-from.handler.js";
import { PDF_MANIPULATION_HANDLER } from "./manipulation/pdf-manipulation.handler.js";
import { PDF_TO_HANDLER } from "./to/pdf-to.handler.js";

export const PDF_HANDLER = new OpenAPIHono()
  .route("/", PDF_FROM_HANDLER)
  .route("/", PDF_MANIPULATION_HANDLER)
  .route("/", PDF_TO_HANDLER);
