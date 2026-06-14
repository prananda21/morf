import { createRoute } from "@hono/zod-openapi";
import { HEALTH_RESPONSES } from "./utils/responses.js";

export const HEALTH_ROUTES = {
  DETECT: createRoute({
    method: "get",
    path: "/health",
    tags: ["Health"],
    summary: "Health check",
    description: "Simple check to confirm the API is alive and running.",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: HEALTH_RESPONSES,
          },
        },
        description: "Health check success",
      },
    },
  }),
};
