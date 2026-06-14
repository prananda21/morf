import { apiResponse } from "@/types/api-response.js";
import z from "zod";

const binaryPdf = (description: string) =>
  z.instanceof(Blob).openapi({ type: "string", format: "binary", description });

export const PDF_MANIPULATION_RESPONSES = {
  MERGE: binaryPdf("Merged PDF file"),
  SPLIT: z.instanceof(Blob).openapi({ type: "string", format: "binary", description: "ZIP archive of split PDF files" }),
  COMPRESS: binaryPdf("Compressed PDF file"),
  ROTATE: binaryPdf("Rotated PDF file"),
  EXTRACT_PAGES: binaryPdf("PDF with extracted pages"),
  WATERMARK: binaryPdf("Watermarked PDF file"),
  ENCRYPT: binaryPdf("Encrypted PDF file"),
  DECRYPT: binaryPdf("Decrypted PDF file"),
  METADATA: apiResponse(
    z.object({
      title: z.string().nullable().openapi({ examples: ["Annual Report 2025"] }),
      author: z.string().nullable().openapi({ examples: ["John Doe"] }),
      subject: z.string().nullable().openapi({ examples: ["Finance"] }),
      keywords: z.array(z.string()).openapi({ examples: [["report", "finance"]] }),
      creator: z.string().nullable().openapi({ examples: ["Microsoft Word"] }),
      producer: z.string().nullable().openapi({ examples: ["Adobe PDF Library"] }),
      createdAt: z.string().nullable().openapi({ examples: ["2025-01-15T09:30:00.000Z"] }),
      modifiedAt: z.string().nullable().openapi({ examples: ["2025-03-20T14:00:00.000Z"] }),
      pageCount: z.number().openapi({ examples: [12] }),
      fileSize: z.number().openapi({ examples: [204800] }),
      version: z.string().openapi({ examples: ["1.7"] }),
      encrypted: z.boolean().openapi({ examples: [false] }),
    }),
    "PDF metadata retrieved successfully",
  ),
};
