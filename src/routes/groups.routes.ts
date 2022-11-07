import { Router } from "express";
import { createGroupController } from "../controllers/groups";
import { findGroupByIdController } from "../controllers/groups/findGroupById.controller";
import { listGroupsController } from "../controllers/groups/listGroups.controller";
import {
  verifyInstructorOrAdmPermissionMiddleware,
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

groupsRouter.get(
  "/:id",
  verifyTokenMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  findGroupByIdController
);

export { groupsRouter };
