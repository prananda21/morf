import { createRoute } from "@hono/zod-openapi";
import { FORMAT_RESPONSES } from "./utils/responses.js";

export const FORMAT_ROUTES = {
  FORMATS: createRoute({
    method: "get",
    path: "/format",
    tags: ["Format"],
    summary: "Get Available Format",
    description:
      "Returns all supported input and output formats grouped by category.",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: FORMAT_RESPONSES,
          },
        },
        description: "Format check success",
      },
    },
  }),
};
