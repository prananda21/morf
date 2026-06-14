import z from "zod";

export const VALIDATE_REQUESTS = {
  PDF: z.object({
    file: z.instanceof(File).openapi({
      type: "string",
      format: "binary",
      description: "The file to validate",
    }),
  }),
  IMAGE: z.object({
    file: z.instanceof(File).openapi({
      type: "string",
      format: "binary",
      description: "The file to validate",
    }),
  }),
};
