import type { FitOption, ImageFormat, WatermarkPosition } from "./type.js";

export interface ConvertOptions {
  to: ImageFormat;
  quality?: number; // 1-100, default 70
}

export interface ResizeOptions {
  width: number;
  height: number;
  fit?: FitOption; // default 'cover'
}

export interface CompressOptions {
  quality?: number; // 1-100, default 70
}

export interface CropOptions {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface RotateOptions {
  degrees: number;
  background?: string; // hex color, default "#ffffff"
}

export interface WatermarkOptions {
  text: string;
  opacity?: number; // 0.0-1.0, default 0.5
  position?: WatermarkPosition; // default "center"
  fontSize?: number; // default 36
  color?: string; // hex, default "#ffffff"
}

export interface ConvertResult {
  buffer: Buffer;
  mimeType: string;
  format: ImageFormat;
}

export interface Base64Result {
  base64: string;
  mimeType: string;
  format: string;
  size: number;
}

export interface MetadataResult {
  format: string;
  width: number;
  height: number;
  channels: number;
  colorSpace: string;
  hasAlpha: boolean;
  fileSize: number;
  dpi: number;
  exif: {
    make: string | null;
    model: string | null;
    dateTaken: string | null;
    gps: { latitude: number; longitude: number } | null;
    exposureTime: string | null;
    fNumber: number | null;
    iso: number | null;
  } | null;
}

export interface CompressResult {
  buffer: Buffer;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: string;
}
