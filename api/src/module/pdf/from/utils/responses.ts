import z from "zod";

export const PDF_FROM_RESPONSES = {
  TO_PDF: z.instanceof(Blob).openapi({
    type: "string",
    format: "binary",
    description: "PDF file output",
  }),
};
