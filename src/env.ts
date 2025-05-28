import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number(),
	FRONT_URL: z.string().url(),
	JWT_SECRET: z.string(),
	NODE_ENV: z.enum(["development", "production"]),
	DATABASE_URL: z.string().url(),
});

const { data, success, error } = envSchema.safeParse(process.env);

if (!success) {
	console.error("❌ Invalid environment variables:", error.format());
	throw new Error("Invalid environment variables");
}

export const processEnv = data as z.infer<typeof envSchema>;
