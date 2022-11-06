import { Router } from "express";
import { createGroupController } from "../controllers/groups";
import { listGroupsController } from "../controllers/groups/listGroups.controller";
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
groupsRouter.get(
  "/",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("ADM"),
  listGroupsController
);

export { groupsRouter };
