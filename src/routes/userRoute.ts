import { Router } from "express";

import {
	createUserController,
	deleteUserController,
	getUserByIdController,
	getUserListController,
	updateUserController,
} from "../controllers/userController";

const userRoute = Router();

userRoute.get("/", getUserListController);
userRoute.get("/:id", getUserByIdController);
userRoute.post("/create", createUserController);
userRoute.put("/:id/update", updateUserController);
userRoute.delete("/:id/remove", deleteUserController);

export { userRoute };
