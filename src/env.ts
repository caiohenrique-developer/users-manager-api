import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(4000),
	FRONT_URL: z.string().url().default("http://localhost:5173"),
	JWT_SECRET: z.string().default("JWT Secret"),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	DATABASE_URL: z
		.string()
		.url()
		.default("mongodb://USERNAME:PASSWORD@HOST:PORT/DATABASE"),
});

const { data, success, error } = envSchema.safeParse(process.env);

if (!success) {
	console.error("❌ Invalid environment variables:", error.format());
	throw new Error("Invalid environment variables");
}

export const processEnv = data as z.infer<typeof envSchema>;
