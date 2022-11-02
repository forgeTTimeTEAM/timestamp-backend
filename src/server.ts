import "dotenv/config";

import express from "express";
import "express-async-errors";

import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});

export { app };
