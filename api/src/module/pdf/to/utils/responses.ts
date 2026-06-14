import { apiResponse } from "@/types/api-response.js";
import z from "zod";

const binaryFile = (description: string) =>
  z.instanceof(Blob).openapi({
    type: "string",
    format: "binary",
    description,
  });

export const PDF_TO_RESPONSES = {
  PDF_TO_IMAGE: binaryFile("Image file converted from PDF page"),
  PDF_TO_TEXT: apiResponse(
    z.object({
      text: z.string().openapi({ examples: ["This is the extracted text content from the PDF..."] }),
      pageCount: z.number().openapi({ examples: [5] }),
      characterCount: z.number().openapi({ examples: [4821] }),
    }),
    "Text extracted successfully",
  ),
  PDF_TO_DOCX: binaryFile("DOCX file converted from PDF"),
  PDF_TO_HTML: binaryFile("HTML file converted from PDF"),
};
