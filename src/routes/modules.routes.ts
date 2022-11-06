import { Router } from "express";

import { listModulesController } from "../controllers/modules/listModules.controller";
import { findUsersByModuleController } from "../controllers/modules/findUsersByModule.controller";

import {
  validateSchemaMiddleware,
  verifyAdmPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";
import { verifyInstructorOrAdmPermissionMiddleware } from "../middleware/verifyInstructorOrAdmPermission.middleware";
import { createModuleSchema } from "../schemas/modules";
import { createModuleController } from "../controllers/modules/createModule.controller";

const modulesRouter = Router();

modulesRouter.post(
  "/",
  verifyTokenMiddleware,
  verifyAdmPermissionMiddleware,
  validateSchemaMiddleware(createModuleSchema),
  createModuleController
);
modulesRouter.get("/", listModulesController);
modulesRouter.get(
  "/:id",
  verifyTokenMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  findUsersByModuleController
);

export { modulesRouter };
