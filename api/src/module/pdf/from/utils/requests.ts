import z from "zod";

const pdfFile = z.instanceof(File).openapi({
  type: "string",
  format: "binary",
  description: "The file to convert to PDF",
});

const pageSize = z
  .union([z.literal("a4"), z.literal("letter"), z.literal("legal")])
  .default("a4")
  .openapi({ description: "Output page size", examples: ["a4", "letter"] });

export const PDF_FROM_REQUESTS = {
  IMAGE_TO_PDF: z.object({
    file: pdfFile,
    fit: z
      .union([z.literal("cover"), z.literal("contain"), z.literal("fill")])
      .default("cover")
      .openapi({
        description: "How the image fits the page",
        examples: ["cover", "contain"],
      }),
    pageSize,
  }),

  DOCX_TO_PDF: z.object({
    file: pdfFile,
  }),

  HTML_TO_PDF: z.object({
    file: pdfFile,
    pageSize,
    margin: z.coerce
      .number()
      .int()
      .min(0)
      .default(20)
      .openapi({ description: "Page margin in pixels", examples: [20] }),
    orientation: z
      .union([z.literal("portrait"), z.literal("landscape")])
      .default("portrait")
      .openapi({
        description: "Page orientation",
        examples: ["portrait", "landscape"],
      }),
  }),

  TEXT_TO_PDF: z.object({
    file: pdfFile,
    fontSize: z.coerce
      .number()
      .int()
      .min(1)
      .default(12)
      .openapi({ description: "Font size in pt", examples: [12] }),
    fontFamily: z
      .union([
        z.literal("helvetica"),
        z.literal("courier"),
        z.literal("times"),
      ])
      .default("helvetica")
      .openapi({
        description: "Font family",
        examples: ["helvetica", "times"],
      }),
    pageSize,
  }),
};
