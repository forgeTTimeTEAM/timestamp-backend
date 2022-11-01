import { Router } from "express";
import {
  createUserController,
  findManyUserController,
} from "../controllers/users/UserController";

const userRoutes = Router();

userRoutes.post("/users", createUserController);
userRoutes.get("/users", findManyUserController);

export { userRoutes };
