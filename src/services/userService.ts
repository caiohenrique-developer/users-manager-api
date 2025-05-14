import type { User } from "../../generated/prisma";

import { AppError } from "@/utils/appError";
import { comparePassword, encryptPassword } from "@/utils/encryptPassword";
import { prisma } from "@/utils/prisma";

interface CreateUserServiceProps extends Omit<User, "id"> {}

interface UpdateUserServiceProps extends Partial<CreateUserServiceProps> {}

async function getUserListService(): Promise<
	(Omit<User, "password"> & { password: undefined })[]
> {
	const users = await prisma.user.findMany({ orderBy: { name: "desc" } });

	if (!users) {
		throw new AppError("Users not found", 404);
	}

	const userList = users.map((user) => ({ ...user, password: undefined }));

	return userList;
}

async function getUserByIdService(
	id: string,
): Promise<(Omit<User, "password"> & { password: undefined }) | null> {
	const user = await prisma.user.findUnique({ where: { id } });

	if (!user) {
		throw new AppError("User not found", 404);
	}

	return { ...user, password: undefined };
}

async function createUserService({
	name,
	email,
	password,
	role,
}: CreateUserServiceProps): Promise<
	(Omit<User, "password"> & { password: undefined }) | null
> {
	const existingUser = await prisma.user.findUnique({ where: { email } });

	if (existingUser) {
		throw new AppError("User with this email already exists", 409);
	}

	const createUser: CreateUserServiceProps = {
		name,
		email,
		password: await encryptPassword(password),
		role,
	};

	const createdUser = await prisma.user.create({ data: createUser });

	if (!createdUser) {
		throw new AppError("Error creating user", 500);
	}

	return { ...createdUser, password: undefined };
}

async function updateUserService(
	id: string,
	data: UpdateUserServiceProps,
): Promise<(Omit<User, "password"> & { password: undefined }) | null> {
	const user = await prisma.user.findUnique({ where: { id } });

	if (!user) {
		throw new AppError("User not found", 404);
	}

	const fieldsToCompare: (keyof UpdateUserServiceProps)[] = [
		"name",
		"email",
		"role",
	];

	let hasDifference = fieldsToCompare.some(
		(key) => data[key] && data[key] !== user[key],
	);

	if (data.password) {
		const isSamePassword = await comparePassword(data.password, user.password);

		if (!isSamePassword) hasDifference = true;
	}

	if (hasDifference) {
		const { name, email, password, role } = data;

		const encryptedPassword = await encryptPassword(password as string);

		const updateUser: UpdateUserServiceProps = {
			name,
			email,
			password: encryptedPassword,
			role,
		};

		const updatedUser = await prisma.user.update({
			where: { id },
			data: updateUser,
		});

		if (!updatedUser) {
			throw new AppError("Error updating user", 500);
		}

		return { ...updatedUser, password: undefined };
	}

	throw new AppError("User is up to date", 200);
}

async function deleteUserService(id: string): Promise<void> {
	const userExists = await prisma.user.findUnique({ where: { id } });

	if (userExists) {
		await prisma.user.delete({ where: { id } });

		return;
	}

	throw new AppError("User not found", 404);
}

export {
	createUserService,
	deleteUserService,
	getUserByIdService,
	getUserListService,
	updateUserService,
};
