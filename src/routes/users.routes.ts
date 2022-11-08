import { Router } from "express";

import {
  createUserController,
  findUsersByGroupController,
  listUsersController,
  findUserProfileController,
  findUserController,
  deleteUserController,
} from "../controllers/users";

import { loginUserController } from "../controllers/users/loginUser.controller";
import { updateUserById } from "../controllers/users/updateUserById.controller";

import {
  verifyAdmPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

const usersRouter = Router();

usersRouter.post("/", createUserController);
usersRouter.post("/login", loginUserController);
usersRouter.get(
  "",
  verifyTokenMiddleware,
  verifyAdmPermissionMiddleware,
  listUsersController
);
usersRouter.get("/profile", verifyTokenMiddleware, findUserProfileController);
usersRouter.get("/group/:id", findUsersByGroupController);
usersRouter.patch(
  "/:id",
  verifyTokenMiddleware,
  verifyAdmPermissionMiddleware,
  updateUserById
);
usersRouter.get(
  "/:id",
  verifyTokenMiddleware,
  verifyAdmPermissionMiddleware,
  findUserController
);
usersRouter.delete(
  "/:id",
  verifyTokenMiddleware,
  verifyAdmPermissionMiddleware,
  deleteUserController
);

export { usersRouter };
