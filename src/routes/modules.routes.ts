import { Router } from "express";

import { listModulesController } from "../controllers/modules/listModules.controller";
import { findUsersByModuleController } from "../controllers/modules/findUsersByModule.controller";

import {
  verifyAdmPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";
import { verifyInstructorOrAdmPermissionMiddleware } from "../middleware/verifyInstructorOrAdmPermission.middleware";
import { validateSchemaMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  verifyPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

import { createModuleSchema } from "../schemas/modules";
import { createModuleController } from "../controllers/modules/createModule.controller";

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

modulesRouter.post(
  "/",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("ADM"),
  validateSchemaMiddleware(createModuleSchema),
  createModuleController
);

export { modulesRouter };
