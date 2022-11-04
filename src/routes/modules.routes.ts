import { Router } from "express";

import { listModulesController } from "../controllers/module/modules.controller";
import { findUsersByModuleController } from "../controllers/modules/findUsersByModule.controller";

import { verifyTokenMiddleware } from "../middleware";
import { verifyInstructorOrAdmPermissionMiddleware } from "../middleware/verifyInstructorOrAdmPermission.middleware";

const modulesRouter = Router();

moduleRoutes.get("/", listModulesController);
modulesRouter.get(
  "/:id",
  verifyTokenMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  findUsersByModuleController
);

export { modulesRouter };
