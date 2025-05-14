import type { Request, Response } from "express";

import { UserRoleEnum } from "@/@types/userInfo";
import {
	createUserService,
	deleteUserService,
	getUserByIdService,
	getUserListService,
	updateUserService,
} from "@/services/userService";
import {
	userCreateSchema,
	userIDSchema,
	userUpdateSchema,
} from "@/swagger/schemas/userSchema";

async function getUserListController(req: Request, res: Response) {
	const userList = await getUserListService();

	res.status(200).json({ message: "User list found", data: userList });
}

async function getUserByIdController(req: Request, res: Response) {
	const { error, success, data } = userIDSchema.safeParse(req.params);

	if (!success) {
		res.status(400).json({ message: error.flatten().fieldErrors });
		return;
	}

	const { id } = data;

	const user = await getUserByIdService(id);

	res.status(200).json({ message: "User found", data: user });
}

async function createUserController(req: Request, res: Response) {
	const { error, success, data } = userCreateSchema.safeParse(req.body);

	if (!success) {
		res.status(400).json({ message: error.flatten().fieldErrors });
		return;
	}

	const { name, email, password, role } = data;

	if (!name || !email || !password || !role) {
		res.status(400).json({
			message: "Name, email, password and role are required to create a user",
		});
		return;
	}

	if (!Object.values(UserRoleEnum).includes(role as UserRoleEnum)) {
		res.status(400).json({ message: "Invalid role" });
		return;
	}

	const user = await createUserService({ name, email, password, role });

	res.status(201).json({ message: "User created", data: user });
}

async function updateUserController(req: Request, res: Response) {
	const {
		error: reqParamsError,
		success: reqParamsSuccess,
		data: reqParamsData,
	} = userIDSchema.safeParse(req.params);
	const {
		error: reqBodyError,
		success: reqBodySuccess,
		data: reqBodyData,
	} = userUpdateSchema.safeParse(req.body);

	if (!reqParamsSuccess || !reqBodySuccess) {
		res.status(400).json({
			message:
				reqParamsError?.flatten().fieldErrors ||
				reqBodyError?.flatten().fieldErrors,
		});
		return;
	}

	const { id } = reqParamsData;
	const { name, email, password, role } = reqBodyData;

	const user = await updateUserService(id, { name, email, password, role });

	res.status(200).json({ message: "User updated", data: user });
}

async function deleteUserController(req: Request, res: Response) {
	const { error, success, data } = userIDSchema.safeParse(req.params);

	if (!success) {
		res.status(400).json({ message: error.flatten().fieldErrors });
		return;
	}

	const { id } = data;

	await deleteUserService(id);

	res.status(204).json({ message: "User removed" });
}

export {
	createUserController,
	deleteUserController,
	getUserByIdController,
	getUserListController,
	updateUserController,
};
