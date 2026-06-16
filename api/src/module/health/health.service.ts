import type { ApiResponse } from "@/types/api-response.js";

type HealthData = {
  status: string;
  version: string;
  timestamp: string;
};

export const HEALTH = async (): Promise<ApiResponse<HealthData>> => {
  return {
    data: {
      status: "ok",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    },
    message: "Health check successful",
  };
};
