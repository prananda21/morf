import { OpenAPIHono } from "@hono/zod-openapi";
import { PDF_TO_ROUTES } from "./pdf-to.routes.js";

export const PDF_TO_HANDLER = new OpenAPIHono()
  .openapi(PDF_TO_ROUTES.PDF_TO_DOCX, async (c) => {})
  .openapi(PDF_TO_ROUTES.PDF_TO_HTML, async (c) => {})
  .openapi(PDF_TO_ROUTES.PDF_TO_IMAGE, async (c) => {})
  .openapi(PDF_TO_ROUTES.PDF_TO_TEXT, async (c) => {});
