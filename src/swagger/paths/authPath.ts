import { z } from "zod";

import type { RouteConfig } from "@asteasolutions/zod-to-openapi";

import {
	loginRequestSchema,
	loginResponse201Schema,
	loginResponse400Schema,
	meResponse200Schema,
} from "../../swagger/schemas/authSchema";

const loginPath: RouteConfig = {
	tags: ["Auth"],
	method: "post",
	path: "/auth/login",
	summary: "Login",
	description: "User login authentication",
	request: {
		body: { content: { "application/json": { schema: loginRequestSchema } } },
	},
	responses: {
		201: {
			headers: {
				"Set-Cookie": {
					description: "JWT token set in cookie",
					schema: {
						type: "string",
						example:
							"auth-token-cookie=jwt-token-here; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600",
					},
				},
			},
			description: "Login successful",
			content: { "application/json": { schema: loginResponse201Schema } },
		},
		400: {
			description: "Zod validation failed",
			content: { "application/json": { schema: loginResponse400Schema } },
		},
	},
};

const logoutPath: RouteConfig = {
	tags: ["Auth"],
	method: "post",
	path: "/auth/logout",
	summary: "Logout",
	description: "User logout authentication",
	responses: {
		200: {
			headers: {
				"Set-Cookie": {
					description: "Clears the auth-token-cookie",
					schema: {
						type: "string",
						example:
							"auth-token-cookie=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
					},
				},
			},
			description: "Logout successful",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string().openapi({ example: "Logout successful" }),
					}),
				},
			},
		},
		500: {
			description: "Internal server error",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string().openapi({ example: "Internal server error" }),
					}),
				},
			},
		},
	},
};

const mePath: RouteConfig = {
	tags: ["Auth"],
	method: "get",
	path: "/auth/me",
	summary: "Me",
	description: "Verify if the user is authenticated",
	responses: {
		200: {
			description: "Authenticated",
			content: { "application/json": { schema: meResponse200Schema } },
		},
		401: {
			description: "Not authenticated",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string().openapi({ example: "Not authenticated" }),
					}),
				},
			},
		},
	},
};

export { loginPath, logoutPath, mePath };
