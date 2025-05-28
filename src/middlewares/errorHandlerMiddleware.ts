import type {
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response,
} from "express";
import { ZodError } from "zod";

import { AppError } from "@/utils/appError";

export const errorHandlerMiddleware: ErrorRequestHandler = (
	err,
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (err instanceof ZodError) {
		res.status(400).json({
			message: "Zod validation failed",
			errors: err.errors.map((e) => ({
				path: e.path.join("."),
				message: e.message,
			})),
		});
		return;
	}

	if (err instanceof AppError) {
		res.status(err.statusCode).json({ message: err.message });
		return;
	}

	res.status(500).json({ message: "Internal server error" });
};
