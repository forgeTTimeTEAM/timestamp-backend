import { Router } from "express";

import {
  createUserController,
  findUsersByGroupController,
} from "../controllers/users/UserController";

const userRoutes = Router();

userRoutes.post("/users", createUserController);
userRoutes.get("/users/group/:id", findUsersByGroupController);

export { userRoutes };
