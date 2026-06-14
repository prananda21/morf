import { apiResponse } from "@/types/api-response.js";
import z from "zod";

const binaryFile = (description: string) =>
  z.instanceof(Blob).openapi({ type: "string", format: "binary", description });

export const DOC_RESPONSES = {
  DOCX_TO_PDF: binaryFile("PDF file converted from DOCX"),
  DOCX_TO_TEXT: apiResponse(
    z.object({
      text: z.string().openapi({ examples: ["Extracted text content from the Word document..."] }),
      wordCount: z.number().openapi({ examples: [1240] }),
      characterCount: z.number().openapi({ examples: [7850] }),
    }),
    "Text extracted from DOCX successfully",
  ),
  DOCX_TO_HTML: binaryFile("HTML file converted from DOCX"),
  XLSX_TO_CSV: binaryFile("CSV file converted from XLSX"),
  XLSX_TO_JSON: apiResponse(
    z.object({
      sheet: z.string().openapi({ examples: ["Sheet1"] }),
      rowCount: z.number().openapi({ examples: [100] }),
      data: z.array(z.record(z.string(), z.unknown())).openapi({
        examples: [[{ name: "Alice", age: 30, city: "Bali" }]],
      }),
    }),
    "XLSX converted to JSON successfully",
  ),
  CSV_TO_XLSX: binaryFile("XLSX file converted from CSV"),
  CSV_TO_JSON: apiResponse(
    z.object({
      rowCount: z.number().openapi({ examples: [50] }),
      data: z.array(z.record(z.string(), z.unknown())).openapi({
        examples: [[{ name: "Alice", age: "30", city: "Bali" }]],
      }),
    }),
    "CSV converted to JSON successfully",
  ),
  JSON_TO_CSV: binaryFile("CSV file converted from JSON"),
};
