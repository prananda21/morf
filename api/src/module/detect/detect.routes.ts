import { createRoute } from "@hono/zod-openapi";
import { DETECT_REQUESTS } from "./utils/requests.js";
import { DETECT_RESPONSES } from "./utils/responses.js";

export const DETECT_ROUTES = {
  DETECT: createRoute({
    method: "post",
    path: "/detect",
    tags: ["Detect"],
    summary: "Detect file type from uploaded file",
    description:
      "Detects the real file type from its binary content (not just the extension or MIME type sent by the client).",
    request: {
      body: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: DETECT_REQUESTS.DETECT,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: DETECT_RESPONSES,
          },
        },
        description: "File Detection Success",
      },
    },
  }),
};
