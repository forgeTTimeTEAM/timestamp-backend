import { Router } from "express";

import { listModulesController } from "../controllers/modules/listModules.controller";
import { findUsersByModuleController } from "../controllers/modules/findUsersByModule.controller";

import {
  validateSchemaMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  verifyPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";
import { createModuleSchema } from "../schemas/modules";
import { createModuleController } from "../controllers/modules/createModule.controller";

const modulesRouter = Router();

modulesRouter.post(
  "/",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("ADM"),
  validateSchemaMiddleware(createModuleSchema),
  createModuleController
);
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

export { modulesRouter };
