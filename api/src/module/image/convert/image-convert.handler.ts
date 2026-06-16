import { OpenAPIHono } from "@hono/zod-openapi";
import { IMAGE_CONVERT_ROUTES } from "./image-convert.routes.js";
import { CONVERT, FROM_BASE64, TO_BASE64 } from "./image-convert.service.js";

export const IMAGE_CONVERT_HANDLER = new OpenAPIHono()
  .openapi(IMAGE_CONVERT_ROUTES.CONVERT, async (c) => {
    const { file } = c.req.valid("form");
    const { quality, to } = c.req.valid("query");
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await CONVERT(buffer, { to, quality });

    return c.body(
      result.buffer.buffer.slice(
        result.buffer.byteOffset,
        result.buffer.byteOffset + result.buffer.byteLength,
      ) as ArrayBuffer,
      200,
      {
        "Content-Type": result.mimeType,
        "Content-Disposition": `attachment; filename="output.${result.format}"`,
      },
    );
  })
  .openapi(IMAGE_CONVERT_ROUTES.FROM_BASE64, async (c) => {
    const { format, base64 } = c.req.valid("json");

    const result = await FROM_BASE64(base64, format);

    return c.body(
      result.buffer.buffer.slice(
        result.buffer.byteOffset,
        result.buffer.byteOffset + result.buffer.byteLength,
      ) as ArrayBuffer,
      200,
      {
        "Content-Type": result.mimeType,
        "Content-Disposition": `attachment; filename="output.${result.format}"`,
      },
    );
  })
  .openapi(IMAGE_CONVERT_ROUTES.TO_BASE64, async (c) => {
    const { file } = c.req.valid("form");

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await TO_BASE64(buffer);

    return c.json(result, 200);
  });
