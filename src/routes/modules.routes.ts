import { Router } from "express";
import { listModulesController } from "../controllers/module/modules.controller";

const moduleRoutes = Router();

moduleRoutes.get("/", listModulesController);

export { moduleRoutes };
