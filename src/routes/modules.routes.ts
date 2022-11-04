import { Router } from "express";
import { findUsersByModuleController } from "../controllers/modules/findUsersByModule.controller";

import { verifyTokenMiddleware } from "../middleware";

const modulesRouter = Router();

modulesRouter.get("/:id", verifyTokenMiddleware, findUsersByModuleController);

export { modulesRouter };
