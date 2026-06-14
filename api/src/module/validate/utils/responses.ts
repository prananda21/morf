import { apiResponse } from "@/types/api-response.js";
import z from "zod";

export const VALIDATE_RESPONSES = {
  PDF: apiResponse(
    z.object({
      valid: z.boolean().openapi({ examples: [true, false] }),
      pageCount: z.number().openapi({ examples: [5] }),
      encrypted: z.boolean().openapi({ examples: [false] }),
      version: z.string().openapi({ examples: ["1.7"] }),
      fileSize: z.number().openapi({ examples: [204800] }),
      issues: z.array(z.string()).openapi({ examples: [[]] }),
    }),
    "File validation successful",
  ),
  IMAGE: apiResponse(
    z.object({
      valid: z.boolean().openapi({ examples: [true, false] }),
      format: z.string().openapi({ examples: ["png", "jpeg"] }),
      width: z.number().openapi({ examples: [1920] }),
      height: z.number().openapi({ examples: [1080] }),
      channels: z.number().openapi({ examples: [4] }),
      colorSpace: z.string().openapi({ examples: ["sRGB"] }),
      hasAlpha: z.boolean().openapi({ examples: [true] }),
      fileSize: z.number().openapi({ examples: [512000] }),
      issues: z.array(z.string()).openapi({ examples: [[]] }),
    }),
    "Image validation successful",
  ),
};
