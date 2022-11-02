import { Router } from "express";
import {
  createUserController,
  findUsersByGroupController,
} from "../controllers/users";

const usersRouter = Router();

usersRouter.post("/", createUserController);
usersRouter.get("/group/:id", findUsersByGroupController);

export { usersRouter };
