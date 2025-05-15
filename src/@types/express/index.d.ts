import type { UserInfo } from "../../types/userInfo";

declare module "express-serve-static-core" {
	interface Request {
		userInfo?: UserInfo;
	}
}
