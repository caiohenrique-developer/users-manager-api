import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { processEnv } from "./env";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import { route } from "./routes";
import { swaggerDocument, swaggerUi } from "./swagger";

const app = express();

app.use(cors({ origin: processEnv.FRONT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(route);
app.use(errorHandlerMiddleware);

export { app };
