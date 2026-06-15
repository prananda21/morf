import { OpenAPIHono } from "@hono/zod-openapi";
import { DETECT_ROUTES } from "./detect.routes.js";

export const DETECT_HANDLER = new OpenAPIHono().openapi(
  DETECT_ROUTES.DETECT,
  async (c) => {
    const { file } = c.req.valid("form");
  },
);
