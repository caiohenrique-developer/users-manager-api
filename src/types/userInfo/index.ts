import type { User } from "../../../generated/prisma";

enum UserRoleEnum {
	user = "USER",
	admin = "ADMIN",
}

type UserInfo = Omit<User, "password"> & { iat: number; exp: number };

export { UserRoleEnum, type UserInfo };
