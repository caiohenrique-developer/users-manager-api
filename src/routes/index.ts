import { Router } from "express";

import { verifyTokenMiddleware } from "@/middlewares/verifyTokenMiddleware";
import { authRoute } from "@/routes/authRoute";
import { userRoute } from "@/routes/userRoute";

const route = Router();

route.use("/auth", authRoute);
route.use("/users", verifyTokenMiddleware, userRoute);

export { route };
