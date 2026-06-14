import { OpenAPIHono } from "@hono/zod-openapi";
import { PDF_MANIPULATION_ROUTES } from "./pdf-manipulation.routes.js";

export const PDF_MANIPULATION_HANDLER = new OpenAPIHono()
  .openapi(PDF_MANIPULATION_ROUTES.COMPRESS, async (c) => {})
  .openapi(PDF_MANIPULATION_ROUTES.DECRYPT, async (c) => {})
  .openapi(PDF_MANIPULATION_ROUTES.ENCRYPT, async (c) => {})
  .openapi(PDF_MANIPULATION_ROUTES.EXTRACT_PAGES, async (c) => {})
  .openapi(PDF_MANIPULATION_ROUTES.MERGE, async (c) => {})
  .openapi(PDF_MANIPULATION_ROUTES.METADATA, async (c) => {})
  .openapi(PDF_MANIPULATION_ROUTES.ROTATE, async (c) => {})
  .openapi(PDF_MANIPULATION_ROUTES.SPLIT, async (c) => {})
  .openapi(PDF_MANIPULATION_ROUTES.WATERMARK, async (c) => {});
