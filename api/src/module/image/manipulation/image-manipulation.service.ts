import { IMAGE_SERVICE } from "@/lib/image/index.js";
import type {
  CompressResult,
  MetadataResult,
  ResizeOptions,
  RotateOptions,
  WatermarkOptions,
} from "@/lib/image/utils/interface.js";
import type { FlipAxis } from "@/lib/image/utils/type.js";
import type { ApiResponse } from "@/types/api-response.js";

export const RESIZE = async (
  buffer: Buffer,
  options: ResizeOptions,
): Promise<Buffer> => {
  return IMAGE_SERVICE.resizeImage(buffer, options);
};

export const COMPRESS = async (
  buffer: Buffer,
  options: { quality?: number },
): Promise<CompressResult> => {
  return IMAGE_SERVICE.compressImage(buffer, options);
};

export const CROP = async (
  buffer: Buffer,
  options: { left: number; top: number; width: number; height: number },
): Promise<Buffer> => {
  return IMAGE_SERVICE.cropImage(buffer, options);
};

export const ROTATE = async (
  buffer: Buffer,
  options: RotateOptions,
): Promise<Buffer> => {
  return IMAGE_SERVICE.rotateImage(buffer, options);
};

export const GRAYSCALE = async (buffer: Buffer): Promise<Buffer> => {
  return IMAGE_SERVICE.grayscaleImage(buffer);
};

export const FLIP = async (
  buffer: Buffer,
  axis: FlipAxis,
): Promise<Buffer> => {
  return IMAGE_SERVICE.flipImage(buffer, axis);
};

export const WATERMARK = async (
  buffer: Buffer,
  options: WatermarkOptions,
): Promise<Buffer> => {
  return IMAGE_SERVICE.watermarkImage(buffer, options);
};

export const METADATA = async (
  buffer: Buffer,
): Promise<ApiResponse<MetadataResult>> => {
  const result = await IMAGE_SERVICE.getImageMetadata(buffer);
  return { data: result, message: "Image metadata retrieved successfully" };
};
