import z from "zod";

const imageFile = z.instanceof(File).openapi({
  type: "string",
  format: "binary",
  description: "The image file",
});

const position = z
  .union([
    z.literal("center"),
    z.literal("top-left"),
    z.literal("top-right"),
    z.literal("bottom-left"),
    z.literal("bottom-right"),
  ])
  .default("center")
  .openapi({ examples: ["center", "top-left"] });

export const IMAGE_MANIPULATION_REQUESTS = {
  RESIZE: z.object({
    file: imageFile,
    width: z.coerce.number().int().min(1).openapi({ description: "Target width in pixels", examples: [800] }),
    height: z.coerce.number().int().min(1).openapi({ description: "Target height in pixels", examples: [600] }),
    fit: z
      .union([
        z.literal("cover"),
        z.literal("contain"),
        z.literal("fill"),
        z.literal("inside"),
        z.literal("outside"),
      ])
      .default("cover")
      .openapi({ description: "Resize strategy", examples: ["cover", "contain"] }),
  }),

  COMPRESS: z.object({
    file: imageFile,
    quality: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(70)
      .openapi({ description: "Output quality 1-100", examples: [70] }),
  }),

  CROP: z.object({
    file: imageFile,
    left: z.coerce.number().int().min(0).openapi({ description: "X offset from left edge in pixels", examples: [100] }),
    top: z.coerce.number().int().min(0).openapi({ description: "Y offset from top edge in pixels", examples: [50] }),
    width: z.coerce.number().int().min(1).openapi({ description: "Width of crop region in pixels", examples: [400] }),
    height: z.coerce.number().int().min(1).openapi({ description: "Height of crop region in pixels", examples: [300] }),
  }),

  ROTATE: z.object({
    file: imageFile,
    degrees: z.coerce
      .number()
      .openapi({ description: "Rotation degrees (90/180/270 or free)", examples: [90, 180] }),
    background: z.string().default("#ffffff").openapi({ description: "Background fill color for free rotation", examples: ["#ffffff"] }),
  }),

  GRAYSCALE: z.object({
    file: imageFile,
  }),

  FLIP: z.object({
    file: imageFile,
    axis: z
      .union([z.literal("h"), z.literal("v")])
      .openapi({ description: "h for horizontal, v for vertical", examples: ["h", "v"] }),
  }),

  WATERMARK: z.object({
    file: imageFile,
    text: z.string().openapi({ description: "Watermark text", examples: ["CONFIDENTIAL"] }),
    opacity: z.coerce.number().min(0).max(1).default(0.5).openapi({ examples: [0.5] }),
    position,
    fontSize: z.coerce.number().int().min(1).default(36).openapi({ examples: [36] }),
    color: z.string().default("#ffffff").openapi({ description: "Hex color of watermark text", examples: ["#ffffff"] }),
  }),

  METADATA: z.object({
    file: imageFile,
  }),
};
