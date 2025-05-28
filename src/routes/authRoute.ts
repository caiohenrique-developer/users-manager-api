import { Router } from "express";

import {
	loginController,
	logoutController,
	meController,
} from "@/controllers/authController";

const authRoute = Router();

authRoute.post("/login", loginController);
authRoute.post("/logout", logoutController);
authRoute.get("/me", meController);

export { authRoute };
