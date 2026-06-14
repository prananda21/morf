import { OpenAPIHono } from "@hono/zod-openapi";
import { FORMAT_ROUTES } from "./format.routes.js";

export const FORMAT_HANDLER = new OpenAPIHono().openapi(
  FORMAT_ROUTES.FORMATS,
  async (c) => {},
);
