import type { ImageFormat } from "./type.js";

export const FORMAT_MIME: Record<ImageFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  tiff: "image/tiff",
} as const;

export const SUPPORTED_FORMATS: ImageFormat[] = [
  "png",
  "jpeg",
  "webp",
  "gif",
  "tiff",
] as const;
