import { OpenAPIHono } from "@hono/zod-openapi";
import { DOC_ROUTES } from "./doc.routes.js";

export const DOC_HANDLER = new OpenAPIHono()
  .openapi(DOC_ROUTES.CSV_TO_JSON, async (c) => {
    const { file } = c.req.valid("form");
    const { delimiter, header } = c.req.valid("query");
  })
  .openapi(DOC_ROUTES.CSV_TO_XLSX, async (c) => {
    const { file } = c.req.valid("form");
    const { delimiter, sheetName } = c.req.valid("query");
  })
  .openapi(DOC_ROUTES.DOCX_TO_HTML, async (c) => {
    const { file } = c.req.valid("form");
  })
  .openapi(DOC_ROUTES.DOCX_TO_PDF, async (c) => {
    const { file } = c.req.valid("form");
  })
  .openapi(DOC_ROUTES.DOCX_TO_TEXT, async (c) => {
    const { file } = c.req.valid("form");
  })
  .openapi(DOC_ROUTES.JSON_TO_CSV, async (c) => {
    const { file } = c.req.valid("form");
    const { delimiter } = c.req.valid("query");
  })
  .openapi(DOC_ROUTES.XLSX_TO_CSV, async (c) => {
    const { file } = c.req.valid("form");
    const { sheet, delimiter } = c.req.valid("query");
  })
  .openapi(DOC_ROUTES.XLSX_TO_JSON, async (c) => {
    const { file } = c.req.valid("form");
    const { sheet, header } = c.req.valid("query");
  });
