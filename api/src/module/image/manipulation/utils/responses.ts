import { apiResponse } from "@/types/api-response.js";
import z from "zod";

const binaryImage = (description: string) =>
  z.instanceof(Blob).openapi({ type: "string", format: "binary", description });

export const IMAGE_MANIPULATION_RESPONSES = {
  RESIZE: binaryImage("Resized image file"),
  COMPRESS: binaryImage("Compressed image file"),
  CROP: binaryImage("Cropped image file"),
  ROTATE: binaryImage("Rotated image file"),
  GRAYSCALE: binaryImage("Grayscale image file"),
  FLIP: binaryImage("Flipped image file"),
  WATERMARK: binaryImage("Watermarked image file"),
  METADATA: apiResponse(
    z.object({
      format: z.string().openapi({ examples: ["jpeg", "png"] }),
      width: z.number().openapi({ examples: [4032] }),
      height: z.number().openapi({ examples: [3024] }),
      channels: z.number().openapi({ examples: [3, 4] }),
      colorSpace: z.string().openapi({ examples: ["sRGB"] }),
      hasAlpha: z.boolean().openapi({ examples: [false] }),
      fileSize: z.number().openapi({ examples: [3145728] }),
      dpi: z.number().openapi({ examples: [72] }),
      exif: z
        .object({
          make: z.string().nullable().openapi({ examples: ["Apple"] }),
          model: z.string().nullable().openapi({ examples: ["iPhone 15 Pro"] }),
          dateTaken: z.string().nullable().openapi({ examples: ["2026-01-10T08:30:00.000Z"] }),
          gps: z
            .object({
              latitude: z.number().openapi({ examples: [-8.6705] }),
              longitude: z.number().openapi({ examples: [115.2126] }),
            })
            .nullable(),
          exposureTime: z.string().nullable().openapi({ examples: ["1/120"] }),
          fNumber: z.number().nullable().openapi({ examples: [1.8] }),
          iso: z.number().nullable().openapi({ examples: [64] }),
        })
        .nullable(),
    }),
    "Image metadata retrieved successfully",
  ),
};
