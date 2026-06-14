import { OpenAPIHono } from "@hono/zod-openapi";
import { IMAGE_CONVERT_ROUTES } from "./image-convert.routes.js";

export const IMAGE_CONVERT_HANDLER = new OpenAPIHono()
  .openapi(IMAGE_CONVERT_ROUTES.CONVERT, async (c) => {})
  .openapi(IMAGE_CONVERT_ROUTES.FROM_BASE64, async (c) => {})
  .openapi(IMAGE_CONVERT_ROUTES.TO_BASE64, async (c) => {});
