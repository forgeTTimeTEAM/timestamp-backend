import { Router } from "express";

import {
  createUserController,
  findUsersByGroupController,
  listUsersController,
  findUserProfileController,
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
usersRouter.get("/profile", verifyTokenMiddleware, findUserProfileController);
usersRouter.get("/group/:id", findUsersByGroupController);
usersRouter.patch(
  "/:id",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("ADM"),
  updateUserById
);

export { usersRouter };
