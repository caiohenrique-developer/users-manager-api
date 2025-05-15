import type { Request } from "express";
import jwt from "jsonwebtoken";

import { processEnv } from "../env";
import { AppError } from "../utils/appError";

import type { User } from "../../generated/prisma";

interface GenerateTokenProps extends Omit<User, "password"> {}

function generateToken({ id, name, email, role }: GenerateTokenProps): string {
	const token = jwt.sign(
		{ id, name, email, role },
		processEnv.JWT_SECRET as string,
		{ expiresIn: "1h" },
	);

	if (!token) {
		throw new AppError("Token not found", 404);
	}

	return token;
}

function verifyToken(req: Request) {
	const token = req.cookies["auth-token-cookie"];

	if (!token) {
		throw new AppError("Token not found", 404);
	}

	try {
		const decoded = jwt.verify(token, processEnv.JWT_SECRET);

		return decoded;
	} catch (error) {
		console.error("❌ Error verifying the token:", error);

		throw new AppError("Not authenticated", 401);
	}
}

export { generateToken, verifyToken };
