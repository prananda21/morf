import { OpenAPIHono } from "@hono/zod-openapi";
import { HEALTH_ROUTES } from "./health.routes.js";
import { HEALTH } from "./health.service.js";

export const HEALTH_HANDLER = new OpenAPIHono().openapi(
  HEALTH_ROUTES.DETECT,
  async (c) => {
    const result = await HEALTH();

    return c.json(result, 200);
  },
);
