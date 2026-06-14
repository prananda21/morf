import { OpenAPIHono } from "@hono/zod-openapi";
import { HEALTH_ROUTES } from "./health.routes.js";

export const HEALTH_HANDLER = new OpenAPIHono().openapi(
  HEALTH_ROUTES.DETECT,
  async (c) => {},
);
