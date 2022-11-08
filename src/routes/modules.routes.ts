import { Router } from "express";

import {
  listModulesController,
  findUsersByModuleController,
  createModuleController,
} from "../controllers/modules/";

import {
  validateSchemaMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  verifyAdmPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

import { createModuleSchema } from "../schemas/modules";

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
  verifyAdmPermissionMiddleware,
  validateSchemaMiddleware(createModuleSchema),
  createModuleController
);

export { modulesRouter };
