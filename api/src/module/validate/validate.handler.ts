import { OpenAPIHono } from "@hono/zod-openapi";
import { VALIDATE_ROUTES } from "./validate.routes.js";

export const VALIDATE_HANDLER = new OpenAPIHono()
  .openapi(VALIDATE_ROUTES.IMAGE, async (c) => {
    const { file } = c.req.valid("form");
  })
  .openapi(VALIDATE_ROUTES.PDF, async (c) => {
    const { file } = c.req.valid("form");
  });
