import { Router } from "express";
import { createGroupController } from "../controllers/groups";
import {
  verifyPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

const groupsRouter = Router();

groupsRouter.post(
  "/",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("ADM"),
  createGroupController
);

export { groupsRouter };
