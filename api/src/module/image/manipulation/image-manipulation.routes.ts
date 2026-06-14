import { createRoute } from "@hono/zod-openapi";
import z from "zod";
import { IMAGE_MANIPULATION_REQUESTS } from "./utils/requests.js";
import { IMAGE_MANIPULATION_RESPONSES } from "./utils/responses.js";

const binaryImageResponse = (filename: string, description: string) => ({
  200: {
    content: { "image/png": { schema: IMAGE_MANIPULATION_RESPONSES.RESIZE } },
    headers: z.object({
      "Content-Disposition": z
        .string()
        .openapi({ example: `attachment; filename="${filename}"` }),
    }),
    description,
  },
});

export const IMAGE_MANIPULATION_ROUTES = {
  RESIZE: createRoute({
    method: "post",
    path: "/image/resize",
    tags: ["Image Manipulation"],
    summary: "Resizes an image to specified dimensions.",
    description: "Resizes an image to the given width and height. The fit param controls how the image is scaled: cover (crop to fill), contain (letterbox), fill (stretch), inside, or outside.",
    request: {
      query: IMAGE_MANIPULATION_REQUESTS.RESIZE.pick({
        width: true,
        height: true,
        fit: true,
      }),
      body: {
        content: {
          "multipart/form-data": {
            schema: IMAGE_MANIPULATION_REQUESTS.RESIZE.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: binaryImageResponse("resized.png", "Resized image file"),
  }),

  COMPRESS: createRoute({
    method: "post",
    path: "/image/compress",
    tags: ["Image Manipulation"],
    summary: "Compresses an image to reduce file size.",
    description: "Reduces image file size using lossy compression. Response headers include original size, compressed size, and compression ratio.",
    request: {
      query: IMAGE_MANIPULATION_REQUESTS.COMPRESS.pick({ quality: true }),
      body: {
        content: {
          "multipart/form-data": {
            schema: IMAGE_MANIPULATION_REQUESTS.COMPRESS.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: {
          "image/jpeg": { schema: IMAGE_MANIPULATION_RESPONSES.COMPRESS },
        },
        headers: z.object({
          "Content-Disposition": z
            .string()
            .openapi({ example: 'attachment; filename="compressed.jpg"' }),
          "X-Original-Size": z.string().openapi({ example: "2048000" }),
          "X-Compressed-Size": z.string().openapi({ example: "512000" }),
          "X-Compression-Ratio": z.string().openapi({ example: "75%" }),
        }),
        description: "Compressed image file",
      },
    },
  }),

  CROP: createRoute({
    method: "post",
    path: "/image/crop",
    tags: ["Image Manipulation"],
    summary: "Crops an image to a specified region.",
    description: "Crops the image to the rectangular region defined by left, top, width, and height. Returns 400 if the requested region exceeds the image dimensions.",
    request: {
      query: IMAGE_MANIPULATION_REQUESTS.CROP.pick({
        left: true,
        top: true,
        width: true,
        height: true,
      }),
      body: {
        content: {
          "multipart/form-data": {
            schema: IMAGE_MANIPULATION_REQUESTS.CROP.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: binaryImageResponse("cropped.png", "Cropped image file"),
  }),

  ROTATE: createRoute({
    method: "post",
    path: "/image/rotate",
    tags: ["Image Manipulation"],
    summary: "Rotates an image by a specified degree.",
    description: "Rotates an image by the given degrees. Use 90, 180, or 270 for lossless rotation, or any value for free rotation with a configurable background fill color.",
    request: {
      query: IMAGE_MANIPULATION_REQUESTS.ROTATE.pick({
        degrees: true,
        background: true,
      }),
      body: {
        content: {
          "multipart/form-data": {
            schema: IMAGE_MANIPULATION_REQUESTS.ROTATE.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: binaryImageResponse("rotated.png", "Rotated image file"),
  }),

  GRAYSCALE: createRoute({
    method: "post",
    path: "/image/grayscale",
    tags: ["Image Manipulation"],
    summary: "Converts an image to grayscale.",
    description: "Removes all color information from the image and returns a grayscale version in the same format.",
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: IMAGE_MANIPULATION_REQUESTS.GRAYSCALE,
          },
        },
        required: true,
      },
    },
    responses: binaryImageResponse("grayscale.png", "Grayscale image file"),
  }),

  FLIP: createRoute({
    method: "post",
    path: "/image/flip",
    tags: ["Image Manipulation"],
    summary: "Flips an image horizontally or vertically.",
    description: "Mirrors the image along the specified axis. Use axis=h for horizontal (left-right) or axis=v for vertical (top-bottom).",
    request: {
      query: IMAGE_MANIPULATION_REQUESTS.FLIP.pick({ axis: true }),
      body: {
        content: {
          "multipart/form-data": {
            schema: IMAGE_MANIPULATION_REQUESTS.FLIP.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: binaryImageResponse("flipped.png", "Flipped image file"),
  }),

  WATERMARK: createRoute({
    method: "post",
    path: "/image/watermark",
    tags: ["Image Manipulation"],
    summary: "Adds a text watermark to an image.",
    description: "Overlays a text watermark on the image at the specified position. Supports opacity, font size, and hex color customization.",
    request: {
      query: IMAGE_MANIPULATION_REQUESTS.WATERMARK.pick({
        text: true,
        opacity: true,
        position: true,
        fontSize: true,
        color: true,
      }),
      body: {
        content: {
          "multipart/form-data": {
            schema: IMAGE_MANIPULATION_REQUESTS.WATERMARK.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: binaryImageResponse("watermarked.png", "Watermarked image file"),
  }),

  METADATA: createRoute({
    method: "post",
    path: "/image/metadata",
    tags: ["Image Manipulation"],
    summary: "Returns metadata and EXIF data from an image.",
    description: "Reads image properties (format, dimensions, color space, DPI) and EXIF data (camera make/model, GPS, exposure) without modifying the file. exif will be null if no EXIF data is present.",
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: IMAGE_MANIPULATION_REQUESTS.METADATA,
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: {
          "application/json": { schema: IMAGE_MANIPULATION_RESPONSES.METADATA },
        },
        description: "Image metadata and EXIF data",
      },
    },
  }),
};
