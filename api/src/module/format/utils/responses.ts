import { apiResponse } from "@/types/api-response.js";
import z from "zod";

export const FORMAT_RESPONSES = apiResponse(
  z.object({
    pdf: z.object({
      input: z.literal("pdf").openapi({ examples: ["pdf"] }),
      output: z
        .union([
          z.literal("png"),
          z.literal("jpeg"),
          z.literal("webp"),
          z.literal("docx"),
          z.literal("html"),
          z.literal("txt"),
        ])
        .openapi({ examples: ["png", "docx"] }),
    }),
    image: z.object({
      input: z
        .union([
          z.literal("png"),
          z.literal("jpeg"),
          z.literal("webp"),
          z.literal("gif"),
          z.literal("bmp"),
          z.literal("tiff"),
        ])
        .openapi({ examples: ["png", "jpeg"] }),
      output: z
        .union([
          z.literal("png"),
          z.literal("jpeg"),
          z.literal("webp"),
          z.literal("gif"),
          z.literal("bmp"),
          z.literal("tiff"),
          z.literal("pdf"),
        ])
        .openapi({ examples: ["webp", "pdf"] }),
    }),
    document: z.object({
      input: z
        .union([
          z.literal("docx"),
          z.literal("xlsx"),
          z.literal("csv"),
          z.literal("json"),
          z.literal("html"),
          z.literal("txt"),
        ])
        .openapi({ examples: ["docx", "csv"] }),
      output: z
        .union([
          z.literal("pdf"),
          z.literal("txt"),
          z.literal("html"),
          z.literal("csv"),
          z.literal("json"),
          z.literal("xlsx"),
        ])
        .openapi({ examples: ["pdf", "txt"] }),
    }),
  }),
  "Get Available Format successful",
);
