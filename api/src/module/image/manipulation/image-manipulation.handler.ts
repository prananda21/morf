import { OpenAPIHono } from "@hono/zod-openapi";
import { IMAGE_MANIPULATION_ROUTES } from "./image-manipulation.routes.js";

export const IMAGE_MANIPULATION_HANDLER = new OpenAPIHono()
  .openapi(IMAGE_MANIPULATION_ROUTES.COMPRESS, async (c) => {})
  .openapi(IMAGE_MANIPULATION_ROUTES.CROP, async (c) => {})
  .openapi(IMAGE_MANIPULATION_ROUTES.FLIP, async (c) => {})
  .openapi(IMAGE_MANIPULATION_ROUTES.GRAYSCALE, async (c) => {})
  .openapi(IMAGE_MANIPULATION_ROUTES.METADATA, async (c) => {})
  .openapi(IMAGE_MANIPULATION_ROUTES.RESIZE, async (c) => {})
  .openapi(IMAGE_MANIPULATION_ROUTES.ROTATE, async (c) => {})
  .openapi(IMAGE_MANIPULATION_ROUTES.WATERMARK, async (c) => {});
