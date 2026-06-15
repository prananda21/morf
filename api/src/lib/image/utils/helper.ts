import type { WatermarkPosition } from "./type.js";

export const hexToRgba = (
  hex: string,
  opacity: number,
): { r: number; g: number; b: number; alpha: number } => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const alpha = Math.round(opacity * 255);
  return { r, g, b, alpha };
};

export const getWatermarkGravity = (position: WatermarkPosition): string => {
  const map: Record<WatermarkPosition, string> = {
    center: "centre",
    "top-left": "northwest",
    "top-right": "northeast",
    "bottom-left": "southwest",
    "bottom-right": "southeast",
  };
  return map[position];
};
