import { OpenAPIHono } from "@hono/zod-openapi";
import { DOC_ROUTES } from "./doc.routes.js";

export const DOC_HANDLER = new OpenAPIHono()
  .openapi(DOC_ROUTES.CSV_TO_JSON, async (c) => {})
  .openapi(DOC_ROUTES.CSV_TO_XLSX, async (c) => {})
  .openapi(DOC_ROUTES.DOCX_TO_HTML, async (c) => {})
  .openapi(DOC_ROUTES.DOCX_TO_PDF, async (c) => {})
  .openapi(DOC_ROUTES.DOCX_TO_TEXT, async (c) => {})
  .openapi(DOC_ROUTES.JSON_TO_CSV, async (c) => {})
  .openapi(DOC_ROUTES.XLSX_TO_CSV, async (c) => {})
  .openapi(DOC_ROUTES.XLSX_TO_JSON, async (c) => {});
