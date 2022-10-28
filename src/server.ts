import "dotenv/config";
import "express-async-errors";
import express from "express";
import { userRoutes } from "./routes/user.routes";
import errorMiddleware from "./middleware/errors.middleware";

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});

export { app };
