import z from "zod";

import type { NextFunction, Request, Response } from "express";

import { processEnv } from "@/env";
import { loginService } from "@/services/authService";
import { verifyToken } from "@/utils/tokenGenerator";

const loginCredentialsSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(1, { message: "Password must be at least 1 characters long" })
		.max(4, { message: "Password must be at most 4 characters long" }),
});

async function loginController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { error, success, data } = loginCredentialsSchema.safeParse(req.body);

	if (!success) return next(error);

	const { email, password } = data;

	try {
		const { email: resEmail, token } = await loginService({ email, password });

		res.status(201).cookie("auth-token-cookie", token, {
			path: "/",
			httpOnly: true,
			secure: processEnv.NODE_ENV === "production", // HTTPS only in prod
			sameSite: "lax",
			maxAge: 60 * 60 * 1000, // 1 hora
		});

		res
			.status(201)
			.json({ message: "Login successful", data: { email: resEmail } });
	} catch (error) {
		console.error("🚨", error);
		next(error);
	}
}

function logoutController(req: Request, res: Response) {
	res.clearCookie("auth-token-cookie", {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "strict",
	});

	res.status(200).json({ message: "Logout successful" });
}

function meController(req: Request, res: Response) {
	const user = verifyToken(req);

	res.status(200).json({ message: "Authenticated", data: user });
}

export { loginController, logoutController, meController };
