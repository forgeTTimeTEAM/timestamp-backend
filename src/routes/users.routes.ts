import { Router } from "express";
import {
  createUserController,
  findUsersByGroupController,
  getUserProfileController,
} from "../controllers/users";

import { loginUserController } from "../controllers/users/loginUser.controller";

import { verifyTokenMiddleware } from "../middleware";

const usersRouter = Router();

usersRouter.post("/", createUserController);
usersRouter.post("/login", loginUserController);
usersRouter.get("/profile", verifyTokenMiddleware, getUserProfileController);
usersRouter.get("/group/:id", findUsersByGroupController);

export { usersRouter };
