import { OpenAPIHono } from "@hono/zod-openapi";
import { IMAGE_CONVERT_HANDLER } from "./convert/image-convert.handler.js";
import { IMAGE_MANIPULATION_HANDLER } from "./manipulation/image-manipulation.handler.js";

export const IMAGE_HANDLER = new OpenAPIHono()
  .route("/", IMAGE_CONVERT_HANDLER)
  .route("/", IMAGE_MANIPULATION_HANDLER);
