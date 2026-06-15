import { OpenAPIHono } from "@hono/zod-openapi";
import { IMAGE_MANIPULATION_ROUTES } from "./image-manipulation.routes.js";
import {
  COMPRESS,
  CROP,
  FLIP,
  GRAYSCALE,
  METADATA,
  RESIZE,
  ROTATE,
  WATERMARK,
} from "./image-manipulation.service.js";

export const IMAGE_MANIPULATION_HANDLER = new OpenAPIHono()
  .openapi(IMAGE_MANIPULATION_ROUTES.COMPRESS, async (c) => {
    const { file } = c.req.valid("form");
    const { quality } = c.req.valid("query");

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await COMPRESS(buffer, { quality });

    return c.body(
      result.buffer.buffer.slice(
        result.buffer.byteOffset,
        result.buffer.byteOffset + result.buffer.byteLength,
      ) as ArrayBuffer,
      200,
      {
        "Content-Type": result.mimeType,
        "Content-Disposition": `attachment; filename="compressed.${file.name.split(".").pop()}"`,
        "X-Original-Size": String(result.originalSize),
        "X-Compressed-Size": String(result.compressedSize),
        "X-Compression-Ratio": result.compressionRatio,
      },
    );
  })
  .openapi(IMAGE_MANIPULATION_ROUTES.CROP, async (c) => {
    const { file } = c.req.valid("form");
    const { left, top, width, height } = c.req.valid("query");

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await CROP(buffer, { height, width, left, top });

    return c.body(
      result.buffer.slice(
        result.byteOffset,
        result.byteOffset + result.buffer.byteLength,
      ) as ArrayBuffer,
      200,
      {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="cropped.${file.name.split(".").pop()}"`,
      },
    );
  })
  .openapi(IMAGE_MANIPULATION_ROUTES.FLIP, async (c) => {
    const { file } = c.req.valid("form");
    const { axis } = c.req.valid("query");

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await FLIP(buffer, axis);

    return c.body(
      result.buffer.slice(
        result.byteOffset,
        result.byteOffset + result.buffer.byteLength,
      ) as ArrayBuffer,
      200,
      {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="cropped.${file.name.split(".").pop()}"`,
      },
    );
  })
  .openapi(IMAGE_MANIPULATION_ROUTES.GRAYSCALE, async (c) => {
    const { file } = c.req.valid("form");

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await GRAYSCALE(buffer);

    return c.body(
      result.buffer.slice(
        result.byteOffset,
        result.byteOffset + result.buffer.byteLength,
      ) as ArrayBuffer,
      200,
      {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="cropped.${file.name.split(".").pop()}"`,
      },
    );
  })
  .openapi(IMAGE_MANIPULATION_ROUTES.METADATA, async (c) => {
    const { file } = c.req.valid("form");

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await METADATA(buffer);

    return c.json(result, 200);
  })
  .openapi(IMAGE_MANIPULATION_ROUTES.RESIZE, async (c) => {
    const { file } = c.req.valid("form");
    const { width, height, fit } = c.req.valid("query");

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await RESIZE(buffer, { width, height, fit });

    return c.body(
      result.buffer.slice(
        result.byteOffset,
        result.byteOffset + result.buffer.byteLength,
      ) as ArrayBuffer,
      200,
      {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="cropped.${file.name.split(".").pop()}"`,
      },
    );
  })
  .openapi(IMAGE_MANIPULATION_ROUTES.ROTATE, async (c) => {
    const { file } = c.req.valid("form");
    const { degrees, background } = c.req.valid("query");

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await ROTATE(buffer, { degrees, background });

    return c.body(
      result.buffer.slice(
        result.byteOffset,
        result.byteOffset + result.buffer.byteLength,
      ) as ArrayBuffer,
      200,
      {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="cropped.${file.name.split(".").pop()}"`,
      },
    );
  })
  .openapi(IMAGE_MANIPULATION_ROUTES.WATERMARK, async (c) => {
    const { file } = c.req.valid("form");
    const { position, text, fontSize, opacity, color } = c.req.valid("query");

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await WATERMARK(buffer, {
      position,
      text,
      fontSize,
      opacity,
      color,
    });

    return c.body(
      result.buffer.slice(
        result.byteOffset,
        result.byteOffset + result.buffer.byteLength,
      ) as ArrayBuffer,
      200,
      {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="cropped.${file.name.split(".").pop()}"`,
      },
    );
  });
