import z from "zod";

const imageFile = z.instanceof(File).openapi({
  type: "string",
  format: "binary",
  description: "The image file",
});

const imageFormat = z.union([
  z.literal("png"),
  z.literal("jpeg"),
  z.literal("webp"),
  z.literal("gif"),
  z.literal("tiff"),
]);

export const IMAGE_CONVERT_REQUESTS = {
  CONVERT: z.object({
    file: imageFile,
    to: imageFormat.openapi({
      description: "Target format",
      examples: ["webp", "png"],
    }),
    quality: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(80)
      .openapi({
        description: "Output quality for lossy formats",
        examples: [80],
      }),
  }),

  TO_BASE64: z.object({
    file: imageFile,
  }),

  FROM_BASE64: z.object({
    base64: z
      .string()
      .min(1)
      .openapi({
        description: "Base64-encoded image data",
        examples: ["iVBORw0KGgoAAAANSUhEUgAA..."],
      }),
    format: z
      .union([z.literal("png"), z.literal("jpeg"), z.literal("webp")])
      .openapi({ description: "Output format", examples: ["png", "jpeg"] }),
  }),
};
