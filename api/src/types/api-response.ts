import z from "zod";

export type ApiResponse<T> = {
  data: T;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: {
    code: string;
    detail: unknown;
  };
};

export const apiResponse = <T extends z.ZodType>(data: T, message: string) =>
  z.object({
    data,
    message: z.literal(message),
    meta: z
      .object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
      })
      .optional(),
    error: z
      .object({
        code: z.string(),
        detail: z.unknown(),
      })
      .optional(),
  });
