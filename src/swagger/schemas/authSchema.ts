import z from "zod";

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const loginRequestSchema = z.object({
	email: z
		.string()
		.email({ message: "Invalid email address" })
		.openapi({ example: "admin@spsgroup.com.br" }),
	password: z
		.string()
		.min(1, { message: "Password must be at least 1 characters long" })
		.max(4, { message: "Password must be at most 4 characters long" })
		.openapi({ example: "1234" }),
});

const loginResponse201Schema = z.object({
	message: z.string().openapi({ example: "Login successful" }),
	data: z.object({ email: z.string().email() }),
});

const loginResponse400Schema = z.object({
	message: z.string().openapi({ example: "Zod validation failed" }),
	errors: z.array(
		z.union([
			z.object({
				path: z.string().openapi({ example: "email" }),
				message: z.string().openapi({ example: "Required" }),
			}),
			z.object({
				path: z.string().openapi({ example: "password" }),
				message: z
					.string()
					.openapi({ example: "Password must be at least 1 characters long" }),
			}),
		]),
	),
});

const meResponse200Schema = z.object({
	message: z.string().openapi({ example: "Authenticated" }),
	data: z.object({
		id: z.string(),
		name: z.string().openapi({ example: "admin" }),
		email: z.string().email(),
		role: z.enum(["ADMIN", "USER"]),
		iat: z.number(),
		exp: z.number(),
	}),
});

export {
	loginRequestSchema,
	loginResponse201Schema,
	loginResponse400Schema,
	meResponse200Schema,
};
