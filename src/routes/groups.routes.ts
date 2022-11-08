import { Router } from "express";

import {
  createGroupController,
  listGroupsController,
  findGroupByIdController,
} from "../controllers/groups";

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

groupsRouter.get(
  "/",
  verifyTokenMiddleware,
  verifyAdmPermissionMiddleware,
  listGroupsController
);

groupsRouter.get(
  "/:id",
  verifyTokenMiddleware,
  verifyAdmPermissionMiddleware,
  findGroupByIdController
);

export { groupsRouter };
