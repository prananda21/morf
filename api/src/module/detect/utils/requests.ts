import z from "zod";

export const DETECT_REQUESTS = {
  DETECT: z.object({
    file: z.instanceof(File).openapi({
      type: "string",
      format: "binary",
      description: "The file to detect",
    }),
  }),
};
