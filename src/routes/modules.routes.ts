import { Router } from "express";

import { listModulesController } from "../controllers/modules/listModules.controller";
import { findUsersByModuleController } from "../controllers/modules/findUsersByModule.controller";
import { createModuleController } from "../controllers/modules/createModule.controller";

import { createModuleSchema } from "../schemas/modules";

import {
  validateSchemaMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  verifyPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

const modulesRouter = Router();

modulesRouter.get(
  "/",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("ADM"),
  listModulesController
);

modulesRouter.get(
  "/:id",
  verifyTokenMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  findUsersByModuleController
);

modulesRouter.post(
  "/",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("ADM"),
  validateSchemaMiddleware(createModuleSchema),
  createModuleController
);

export { modulesRouter };
