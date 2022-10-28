import { Router } from "express";
import { createUserController } from "../controllers/users/createUserController";

const userRoutes = Router();

userRoutes.post("/users", createUserController);

export { userRoutes };
