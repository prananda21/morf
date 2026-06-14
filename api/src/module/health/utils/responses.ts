import { apiResponse } from "@/types/api-response.js";
import z from "zod";

export const HEALTH_RESPONSES = apiResponse(
  z.object({
    status: z.string().openapi({ examples: ["ok", "degraded"] }),
    version: z.string().openapi({ examples: ["1.0.0"] }),
    timestamp: z.iso.datetime().openapi({ examples: ["2024-01-01T00:00:00.000Z"] }),
  }),
  "Health check successful",
);
