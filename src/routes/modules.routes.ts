import { Router } from "express";

import { listModulesController } from "../controllers/modules/listModules.controller";
import { findUsersByModuleController } from "../controllers/modules/findUsersByModule.controller";

import {
  verifyAdmPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";
import { verifyInstructorOrAdmPermissionMiddleware } from "../middleware/verifyInstructorOrAdmPermission.middleware";

const modulesRouter = Router();

modulesRouter.get(
  "/",
  verifyTokenMiddleware,
  verifyAdmPermissionMiddleware,
  listModulesController
);
modulesRouter.get(
  "/:id",
  verifyTokenMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  findUsersByModuleController
);

export { modulesRouter };
