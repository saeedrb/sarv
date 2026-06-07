import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().trim().min(1).default("/api"),
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1).default("Base Project"),
});

const parsedEnv = publicEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

if (!parsedEnv.success) {
  throw new Error(
    `Invalid public environment variables: ${z.prettifyError(parsedEnv.error)}`,
  );
}

export const env = parsedEnv.data;
