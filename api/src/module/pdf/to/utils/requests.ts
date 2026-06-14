import z from "zod";

export const PDF_TO_REQUESTS = {
  PDF_TO_IMAGE: z.object({
    file: z.instanceof(File).openapi({
      type: "string",
      format: "binary",
      description: "The PDF file to convert",
    }),
    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1)
      .openapi({
        description: "Page number to convert",
        examples: [1],
      }),
    format: z
      .union([z.literal("png"), z.literal("jpeg"), z.literal("webp")])
      .default("png")
      .openapi({
        description: "Output image format",
        examples: ["png", "jpeg"],
      }),
    dpi: z.coerce
      .number()
      .int()
      .min(1)
      .default(150)
      .openapi({
        description: "Resolution in dots per inch",
        examples: [150],
      }),
  }),
  PDF_TO_TEXT: z.object({
    file: z.instanceof(File).openapi({
      type: "string",
      format: "binary",
      description: "The PDF file to convert",
    }),
  }),
  PDF_TO_DOCX: z.object({
    file: z.instanceof(File).openapi({
      type: "string",
      format: "binary",
      description: "The PDF file to convert",
    }),
  }),
  PDF_TO_HTML: z.object({
    file: z.instanceof(File).openapi({
      type: "string",
      format: "binary",
      description: "The PDF file to convert",
    }),
  }),
};
