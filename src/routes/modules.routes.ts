import { Router } from "express";

import {
  listModulesController,
  findUsersByModuleController,
  createModuleController,
} from "../controllers/modules/";

import {
  validateSchemaMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  verifyPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

import { createModuleSchema } from "../schemas/modules";

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
