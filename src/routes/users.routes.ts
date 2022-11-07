import { Router } from "express";

import {
  createUserController,
  findUsersByGroupController,
  listUsersController,
  getUserProfileController,
} from "../controllers/users";

import { loginUserController } from "../controllers/users/loginUser.controller";
import { updateUserById } from "../controllers/users/updateUserById.controller";

import {
  verifyPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

const usersRouter = Router();

usersRouter.post("/", createUserController);
usersRouter.post("/login", loginUserController);
usersRouter.get(
  "",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("ADM"),
  listUsersController
);
usersRouter.get("/profile", verifyTokenMiddleware, getUserProfileController);
usersRouter.get("/group/:id", findUsersByGroupController);
usersRouter.patch("/:id", updateUserById);

export { usersRouter };
