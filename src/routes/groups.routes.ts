import { Router } from "express";

import {
  createGroupController,
  listGroupsController,
  findGroupByIdController,
} from "../controllers/groups";

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

groupsRouter.get(
  "/:id",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("ADM"),
  findGroupByIdController
);

export { groupsRouter };
