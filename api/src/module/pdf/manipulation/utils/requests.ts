import z from "zod";

const pdfFile = z.instanceof(File).openapi({
  type: "string",
  format: "binary",
  description: "The PDF file",
});

const pages = z
  .string()
  .openapi({ description: "Comma-separated page numbers or ranges", examples: ["1,3,5-8"] });

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

export const PDF_MANIPULATION_REQUESTS = {
  MERGE: z.object({
    files: z.array(z.instanceof(File)).openapi({
      type: "array",
      items: { type: "string", format: "binary" },
      description: "PDF files to merge (minimum 2)",
    }),
  }),

  SPLIT: z.object({
    file: pdfFile,
    pages: pages.openapi({ description: "Comma-separated page ranges e.g. 1-3,5,7-9", examples: ["1-3,5,7-9"] }),
  }),

  COMPRESS: z.object({
    file: pdfFile,
    quality: z
      .union([z.literal("low"), z.literal("medium"), z.literal("high")])
      .default("medium")
      .openapi({ description: "Compression level", examples: ["medium", "high"] }),
  }),

  ROTATE: z.object({
    file: pdfFile,
    degrees: z
      .union([z.literal(90), z.literal(180), z.literal(270)])
      .default(90)
      .openapi({ description: "Rotation degrees", examples: [90, 180] }),
    pages: pages.optional().openapi({ description: "Pages to rotate (omit for all)", examples: ["1,3,5"] }),
  }),

  EXTRACT_PAGES: z.object({
    file: pdfFile,
    pages,
  }),

  WATERMARK: z.object({
    file: pdfFile,
    watermark: z.instanceof(File).optional().openapi({
      type: "string",
      format: "binary",
      description: "Watermark image file (optional, use either this or text)",
    }),
    text: z.string().optional().openapi({ description: "Watermark text", examples: ["CONFIDENTIAL"] }),
    opacity: z.coerce.number().min(0).max(1).default(0.3).openapi({ examples: [0.3] }),
    position,
    fontSize: z.coerce.number().int().min(1).default(48).openapi({ examples: [48] }),
    color: z.string().default("#FF0000").openapi({ description: "Hex color", examples: ["#FF0000"] }),
  }),

  ENCRYPT: z.object({
    file: pdfFile,
    password: z.string().min(1).openapi({ description: "Password to protect the PDF", examples: ["mysecretpassword"] }),
  }),

  DECRYPT: z.object({
    file: pdfFile,
    password: z.string().min(1).openapi({ description: "Current password of the PDF", examples: ["mysecretpassword"] }),
  }),

  METADATA: z.object({
    file: pdfFile,
  }),
};
