import { apiResponse } from "@/types/api-response.js";
import z from "zod";

const binaryImage = (description: string) =>
  z.instanceof(Blob).openapi({ type: "string", format: "binary", description });

export const IMAGE_CONVERT_RESPONSES = {
  CONVERT: binaryImage("Converted image file"),
  TO_BASE64: apiResponse(
    z.object({
      base64: z.string().openapi({ examples: ["iVBORw0KGgoAAAANSUhEUgAA..."] }),
      mimeType: z.string().openapi({ examples: ["image/png"] }),
      format: z.string().openapi({ examples: ["png"] }),
      size: z.number().openapi({ examples: [204800] }),
    }),
    "Image converted to base64 successfully",
  ),
  FROM_BASE64: binaryImage("Image file decoded from base64"),
};
