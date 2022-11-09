import { Router } from "express";

import {
  createUserController,
  loginUserController,
  findUsersByGroupController,
  listUsersController,
  findUserProfileController,
  findUserController,
  deleteUserController,
  updateUserByIdController,
} from "../controllers/users";

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
  updateUserByIdController
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
