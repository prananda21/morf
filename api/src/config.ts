import z from "zod";
import { config } from "dotenv";

const configSchema = z.object({
  SERVICE_NAME: z.literal("morf-api").default("morf-api"),
  ENVIRONMENT: z
    .union([z.literal("development"), z.literal("production")])
    .default("development"),
});

type Config = z.infer<typeof configSchema>;

const loadConfig = (): Config => {
  config();
  const result = configSchema.safeParse(process.env);

  if (!result.success) {
    console.error("⚠️ Invalid or missing environment variables:");
    for (const error of result.error.issues) {
      console.error(`  - ${error.path.join(".")}: ${error.message}`);
    }
    console.error(
      "\n💡 Please check your .env file and ensure all required variables are set correctly.",
    );
    process.exit(1);
  }

  return result.data;
};

export const CONFIG: Config = loadConfig();
