import { apiResponse } from "@/types/api-response.js";
import z from "zod";

export const DETECT_RESPONSES = apiResponse(
  z.object({
    detected: z.object({
      mimeType: z
        .string()
        .openapi({ examples: ["image/png", "application/pdf"] }),
      format: z.string().openapi({ examples: ["png", "pdf"] }),
      extension: z.string().openapi({ examples: ["png", "pdf"] }),
      category: z.string().openapi({ examples: ["document", "image"] }),
    }),
    claimed: z.object({
      mimeType: z
        .string()
        .openapi({ examples: ["image/png", "application/pdf"] }),
      filename: z.string().openapi({ examples: ["sample.pdf", "sample.png"] }),
    }),
  }),
  "File detection successful",
);
