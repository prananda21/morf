import exifReader from "exif-reader";
import sharp from "sharp";
import { FORMAT_MIME, SUPPORTED_FORMATS } from "./utils/const.js";
import type {
  Base64Result,
  CompressOptions,
  CompressResult,
  ConvertOptions,
  ConvertResult,
  CropOptions,
  MetadataResult,
  ResizeOptions,
  RotateOptions,
  WatermarkOptions,
} from "./utils/interface.js";
import type { FlipAxis, ImageFormat } from "./utils/type.js";
import { getWatermarkGravity, hexToRgba } from "./utils/helper.js";

/**
 * Converts an image from one format to another.
 */
export const convertImage = async (
  buffer: Buffer,
  options: ConvertOptions,
): Promise<ConvertResult> => {
  const { to, quality = 80 } = options;

  if (!SUPPORTED_FORMATS.includes(to)) {
    throw new Error(`Unsupported target format: ${to}`);
  }

  const instance = sharp(buffer);

  if (to === "gif") {
    instance.gif();
  } else {
    instance.toFormat(to as "jpeg" | "webp" | "png" | "tiff", { quality });
  }

  const output = await instance.toBuffer();

  return {
    buffer: output,
    mimeType: FORMAT_MIME[to],
    format: to,
  };
};

/**
 * Converts an image file to a Base64-encoded string.
 */
export const imageToBase64 = async (buffer: Buffer): Promise<Base64Result> => {
  const metadata = await sharp(buffer).metadata();
  const format = (metadata.format as ImageFormat) ?? "png";
  const mimeType = FORMAT_MIME[format] ?? "image/png";

  return {
    base64: buffer.toString("base64"),
    mimeType,
    format,
    size: buffer.byteLength,
  };
};

/**
 * Converts a Base64 string back to an image file.
 */
export async function base64ToImage(
  base64: string,
  format: ImageFormat,
): Promise<ConvertResult> {
  if (!SUPPORTED_FORMATS.includes(format)) {
    throw new Error(`Unsupported format: ${format}`);
  }

  const buffer = Buffer.from(base64, "base64");

  // Validate the buffer is actually an image
  await sharp(buffer).metadata();

  return {
    buffer,
    mimeType: FORMAT_MIME[format],
    format,
  };
}

/**
 * Resizes an image to specified dimensions.
 */
export async function resizeImage(
  buffer: Buffer,
  options: ResizeOptions,
): Promise<Buffer> {
  const { width, height, fit = "cover" } = options;

  return sharp(buffer).resize({ width, height, fit }).toBuffer();
}

/**
 * Compresses an image to reduce file size.
 */
export async function compressImage(
  buffer: Buffer,
  options: CompressOptions = {},
): Promise<CompressResult> {
  const { quality = 70 } = options;
  const originalSize = buffer.byteLength;

  const metadata = await sharp(buffer).metadata();
  const format = (metadata.format as ImageFormat) ?? "jpeg";

  const instance = sharp(buffer);

  if (format === "jpeg") {
    instance.jpeg({ quality, mozjpeg: true });
  } else if (format === "webp") {
    instance.webp({ quality });
  } else if (format === "png") {
    instance.png({ quality, compressionLevel: 9 });
  } else if (format === "tiff") {
    instance.tiff({ quality });
  }

  const compressed = await instance.toBuffer();
  const compressedSize = compressed.byteLength;
  const saved = Math.round(
    ((originalSize - compressedSize) / originalSize) * 100,
  );

  return {
    buffer: compressed,
    mimeType: FORMAT_MIME[format],
    originalSize,
    compressedSize,
    compressionRatio: `${saved}%`,
  };
}

/**
 * Crops an image to a specified region.
 */
export async function cropImage(
  buffer: Buffer,
  options: CropOptions,
): Promise<Buffer> {
  const { left, top, width, height } = options;

  // Validate crop region fits within image bounds
  const metadata = await sharp(buffer).metadata();
  const imgWidth = metadata.width ?? 0;
  const imgHeight = metadata.height ?? 0;

  if (left + width > imgWidth || top + height > imgHeight) {
    throw new Error(
      JSON.stringify({
        message: "Crop region exceeds image dimensions",
        imageWidth: imgWidth,
        imageHeight: imgHeight,
        requestedRegion: { left, top, width, height },
      }),
    );
  }

  return sharp(buffer).extract({ left, top, width, height }).toBuffer();
}

/**
 * Rotates an image by a specified degree.
 */
export async function rotateImage(
  buffer: Buffer,
  options: RotateOptions,
): Promise<Buffer> {
  const { degrees, background = "#ffffff" } = options;

  return sharp(buffer).rotate(degrees, { background }).toBuffer();
}

/**
 * Converts an image to grayscale.
 */
export async function grayscaleImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).grayscale().toBuffer();
}

/**
 * Flips an image horizontally or vertically.
 */
export async function flipImage(
  buffer: Buffer,
  axis: FlipAxis,
): Promise<Buffer> {
  const instance = sharp(buffer);

  if (axis === "h") {
    instance.flop(); // horizontal = mirror on Y axis
  } else {
    instance.flip(); // vertical = mirror on X axis
  }

  return instance.toBuffer();
}

/**
 * Adds a text watermark overlay to an image.
 */
export async function watermarkImage(
  buffer: Buffer,
  options: WatermarkOptions,
): Promise<Buffer> {
  const {
    text,
    opacity = 0.5,
    position = "center",
    fontSize = 36,
    color = "#ffffff",
  } = options;

  const metadata = await sharp(buffer).metadata();
  const imgWidth = metadata.width ?? 800;
  const imgHeight = metadata.height ?? 600;

  const { r, g, b, alpha } = hexToRgba(color, opacity);

  // Build an SVG text overlay
  const svgOverlay = `
    <svg width="${imgWidth}" height="${imgHeight}" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="50%"
        font-size="${fontSize}"
        font-family="sans-serif"
        fill="rgba(${r}, ${g}, ${b}, ${opacity})"
        text-anchor="middle"
        dominant-baseline="middle"
        transform="rotate(-30, ${imgWidth / 2}, ${imgHeight / 2})"
      >${text}</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svgOverlay);
  const gravity = getWatermarkGravity(position);

  return sharp(buffer)
    .composite([{ input: svgBuffer, gravity, blend: "over" }])
    .toBuffer();
}

/**
 * Returns metadata and EXIF data from an image.
 */
export async function getImageMetadata(
  buffer: Buffer,
): Promise<MetadataResult> {
  const metadata = await sharp(buffer).metadata();

  return {
    format: metadata.format ?? "unknown",
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    channels: metadata.channels ?? 0,
    colorSpace: metadata.space ?? "unknown",
    hasAlpha: metadata.hasAlpha ?? false,
    fileSize: buffer.byteLength,
    dpi: metadata.density ?? 0,
    exif: metadata.exif ? parseExif(metadata.exif) : null,
  };
}

const dmsToDecimal = ([deg, min, sec]: number[]) => deg + min / 60 + sec / 3600;

const parseExif = (exifBuffer: Buffer): MetadataResult["exif"] => {
  try {
    const data = exifReader(exifBuffer);
    const image = data.Image ?? {};
    const photo = data.Photo ?? {};
    const gpsData = data.GPSInfo;

    const exposureTime = photo.ExposureTime as number | undefined;
    const exposure =
      exposureTime != null ? `1/${Math.round(1 / exposureTime)}` : null;

    const lat = gpsData?.GPSLatitude as number[] | undefined;
    const lon = gpsData?.GPSLongitude as number[] | undefined;

    return {
      make: (image.Make as string) ?? null,
      model: (image.Model as string) ?? null,
      dateTaken: (photo.DateTimeOriginal as Date)?.toISOString() ?? null,
      gps:
        lat && lon
          ? { latitude: dmsToDecimal(lat), longitude: dmsToDecimal(lon) }
          : null,
      exposureTime: exposure,
      fNumber: (photo.FNumber as number) ?? null,
      iso: (photo.ISOSpeedRatings as number) ?? null,
    };
  } catch {
    return null;
  }
};
