import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import type { UserInfo } from "@/@types/userInfo";
import { processEnv } from "@/env";
import { AppError } from "@/utils/appError";

export function verifyTokenMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const token = req.cookies["auth-token-cookie"];

	if (!token) {
		throw new AppError("Token not found", 404);
	}

	try {
		const decoded = jwt.verify(
			token,
			processEnv.JWT_SECRET as string,
			(error: unknown, userInfo: unknown) => {
				if (error) {
					throw new AppError("Invalid token", 403);
				}

				req.userInfo = userInfo as UserInfo;
				next();
			},
		);

		return decoded;
	} catch (error) {
		console.error("❌ Error verifying the token:", error);

		throw new AppError("Not authenticated", 401);
	}
}
