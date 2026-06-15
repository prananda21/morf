import { OpenAPIHono } from "@hono/zod-openapi";
import { PDF_MANIPULATION_ROUTES } from "./pdf-manipulation.routes.js";

export const PDF_MANIPULATION_HANDLER = new OpenAPIHono()
  .openapi(PDF_MANIPULATION_ROUTES.COMPRESS, async (c) => {
    const { file } = c.req.valid("form");
    const { quality } = c.req.valid("query");
  })
  .openapi(PDF_MANIPULATION_ROUTES.DECRYPT, async (c) => {
    const { file } = c.req.valid("form");
  })
  .openapi(PDF_MANIPULATION_ROUTES.ENCRYPT, async (c) => {
    const { file } = c.req.valid("form");
  })
  .openapi(PDF_MANIPULATION_ROUTES.EXTRACT_PAGES, async (c) => {
    const { file } = c.req.valid("form");
    const { pages } = c.req.valid("query");
  })
  .openapi(PDF_MANIPULATION_ROUTES.MERGE, async (c) => {
    const { files } = c.req.valid("form");
  })
  .openapi(PDF_MANIPULATION_ROUTES.METADATA, async (c) => {
    const { file } = c.req.valid("form");
  })
  .openapi(PDF_MANIPULATION_ROUTES.ROTATE, async (c) => {
    const { file } = c.req.valid("form");
    const { degrees, pages } = c.req.valid("query");
  })
  .openapi(PDF_MANIPULATION_ROUTES.SPLIT, async (c) => {
    const { file } = c.req.valid("form");
    const { pages } = c.req.valid("query");
  })
  .openapi(PDF_MANIPULATION_ROUTES.WATERMARK, async (c) => {
    const { file } = c.req.valid("form");
    const { opacity, position, fontSize, color, text } = c.req.valid("query");
  });
