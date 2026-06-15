import { IMAGE_SERVICE } from "@/lib/image/index.js";
import type {
  Base64Result,
  ConvertResult,
} from "@/lib/image/utils/interface.js";
import type { ImageFormat } from "@/lib/image/utils/type.js";
import type { ApiResponse } from "@/types/api-response.js";

export const CONVERT = async (
  buffer: Buffer,
  options: { to: ImageFormat; quality?: number },
): Promise<ConvertResult> => {
  return IMAGE_SERVICE.convertImage(buffer, options);
};

export const TO_BASE64 = async (
  buffer: Buffer,
): Promise<ApiResponse<Base64Result>> => {
  const result = await IMAGE_SERVICE.imageToBase64(buffer);
  return { data: result, message: "Image converted to base64 successfully" };
};

export const FROM_BASE64 = async (
  base64: string,
  format: ImageFormat,
): Promise<ConvertResult> => {
  return IMAGE_SERVICE.base64ToImage(base64, format);
};
