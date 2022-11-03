import { Router } from "express";
import {
  createUserController,
  findUsersByGroupController,
} from "../controllers/users";
import { loginUserController } from "../controllers/users/loginUser.controller";

const usersRouter = Router();

usersRouter.post("/", createUserController);
usersRouter.get("/group/:id", findUsersByGroupController);
usersRouter.post("/login", loginUserController);

export { usersRouter };
