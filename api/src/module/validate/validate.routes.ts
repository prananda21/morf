import { createRoute } from "@hono/zod-openapi";
import { VALIDATE_REQUESTS } from "./utils/requests.js";
import { VALIDATE_RESPONSES } from "./utils/responses.js";

export const VALIDATE_ROUTES = {
  PDF: createRoute({
    method: "post",
    path: "/validate/pdf",
    tags: ["Validate"],
    summary: "Check if PDF is valid / corrupted",
    description:
      "Deeply inspects a PDF to check if it's valid, readable, corrupted, or password-protected.",
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: VALIDATE_REQUESTS.PDF,
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: VALIDATE_RESPONSES.PDF,
          },
        },
        description: "Validate PDF successful",
      },
    },
  }),

  IMAGE: createRoute({
    method: "post",
    path: "/validate/image",
    tags: ["Validate"],
    summary: "Check if image is valid",
    description: "Checks if an image file is valid and returns its properties.",
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: VALIDATE_REQUESTS.IMAGE,
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: VALIDATE_RESPONSES.IMAGE,
          },
        },
        description: "Validate Image successful",
      },
    },
  }),
};
