import { OpenAPIHono } from "@hono/zod-openapi";
import { PDF_FROM_ROUTES } from "./pdf-from.routes.js";

export const PDF_FROM_HANDLER = new OpenAPIHono()
  .openapi(PDF_FROM_ROUTES.DOCX_TO_PDF, async (c) => {})
  .openapi(PDF_FROM_ROUTES.HTML_TO_PDF, async (c) => {})
  .openapi(PDF_FROM_ROUTES.IMAGE_TO_PDF, async (c) => {})
  .openapi(PDF_FROM_ROUTES.TEXT_TO_PDF, async (c) => {});
