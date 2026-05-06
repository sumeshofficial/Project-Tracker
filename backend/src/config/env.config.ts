import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.issues.map((issue) => {
    const path = issue.path.join(".");
    return `- ${path}: ${issue.message}`;
  });

  throw new Error(
    `Invalid environment variables:\n${formattedErrors.join("\n")}`
  );
}

export const env = parsedEnv.data;

export type Env = z.infer<typeof envSchema>;
