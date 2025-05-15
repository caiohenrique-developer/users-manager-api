import { app } from "./app";
import { processEnv } from "./env";

app.listen(processEnv.PORT, () =>
	console.log("💻 Server is running on port:", processEnv.PORT),
);
