import { createRoute } from "@hono/zod-openapi";
import z from "zod";
import { IMAGE_CONVERT_REQUESTS } from "./utils/requests.js";
import { IMAGE_CONVERT_RESPONSES } from "./utils/responses.js";

export const IMAGE_CONVERT_ROUTES = {
  CONVERT: createRoute({
    method: "post",
    path: "/image/convert",
    tags: ["Image Convert"],
    summary: "Converts an image from one format to another.",
    description: "Converts an uploaded image to the target format specified in the query. Supports png, jpeg, webp, gif, bmp, and tiff. Quality applies to lossy formats only.",
    request: {
      query: IMAGE_CONVERT_REQUESTS.CONVERT.pick({ to: true, quality: true }),
      body: {
        content: {
          "multipart/form-data": {
            schema: IMAGE_CONVERT_REQUESTS.CONVERT.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "image/webp": { schema: IMAGE_CONVERT_RESPONSES.CONVERT } },
        headers: z.object({
          "Content-Disposition": z
            .string()
            .openapi({ example: 'attachment; filename="output.webp"' }),
        }),
        description: "Converted image file",
      },
    },
  }),

  TO_BASE64: createRoute({
    method: "post",
    path: "/image/to/base64",
    tags: ["Image Convert"],
    summary: "Converts an image file to a Base64-encoded string.",
    description: "Encodes an uploaded image as a Base64 string. Returns the encoded data along with MIME type, format, and file size.",
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: IMAGE_CONVERT_REQUESTS.TO_BASE64 },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: {
          "application/json": { schema: IMAGE_CONVERT_RESPONSES.TO_BASE64 },
        },
        description: "Base64-encoded image",
      },
    },
  }),

  FROM_BASE64: createRoute({
    method: "post",
    path: "/image/from/base64",
    tags: ["Image Convert"],
    summary: "Converts a Base64 string back to an image file.",
    description: "Decodes a Base64-encoded image string and returns the binary image file in the specified output format (png, jpeg, or webp).",
    request: {
      body: {
        content: {
          "application/json": { schema: IMAGE_CONVERT_REQUESTS.FROM_BASE64 },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: {
          "image/png": { schema: IMAGE_CONVERT_RESPONSES.FROM_BASE64 },
        },
        headers: z.object({
          "Content-Disposition": z
            .string()
            .openapi({ example: 'attachment; filename="output.png"' }),
        }),
        description: "Decoded image file",
      },
    },
  }),
};
