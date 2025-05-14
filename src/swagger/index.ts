import z from "zod";

import swaggerUi from "swagger-ui-express";

import {
	OpenAPIRegistry,
	OpenApiGeneratorV3,
	extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";

import { loginPath, logoutPath, mePath } from "@/swagger/paths/authPath";
import {
	createUserPath,
	getUserByIdPath,
	getUsersPath,
	removeUserPath,
	updateUserPath,
} from "@/swagger/paths/userPath";
import { loginRequestSchema } from "@/swagger/schemas/authSchema";
import {
	getUsersListSchema,
	userCreateSchema,
	userRemoveSchema,
	userUpdateSchema,
} from "@/swagger/schemas/userSchema";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "authCookie", {
	type: "apiKey",
	in: "cookie",
	name: "auth-token-cookie",
});

// /auth paths
registry.registerPath(loginPath);
registry.registerPath(logoutPath);
registry.registerPath(mePath);

// /user paths
registry.registerPath(getUsersPath);
registry.registerPath(getUserByIdPath);
registry.registerPath(createUserPath);
registry.registerPath(updateUserPath);
registry.registerPath(removeUserPath);

// /auth schemas
registry.register("login", loginRequestSchema);

// /user schemas
registry.register("getUsersList", getUsersListSchema);
registry.register("userCreate", userCreateSchema);
registry.register("userUpdate", userUpdateSchema);
registry.register("userRemove", userRemoveSchema);

const generator = new OpenApiGeneratorV3(registry.definitions);

const swaggerDocument = generator.generateDocument({
	openapi: "3.1.0",
	info: {
		version: "1.0.0",
		title: "Users Manager API",
		description: "API documentation to handle users manager api requests",
	},
	servers: [{ url: "http://localhost:4000" }],
});

export { registry, swaggerDocument, swaggerUi };
