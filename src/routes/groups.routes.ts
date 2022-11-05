import { Router } from "express";
import { createGroupController } from "../controllers/groups";
import {
  verifyAdmPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

const groupsRouter = Router();

groupsRouter.post(
  "/",
  verifyTokenMiddleware,
  verifyAdmPermissionMiddleware,
  createGroupController
);

export { groupsRouter };
