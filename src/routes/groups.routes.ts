import { Router } from "express";
import { createGroupController } from "../controllers/groups";
import { verifyTokenMiddleware } from "../middleware";

const groupsRouter = Router();

groupsRouter.post("/", verifyTokenMiddleware, createGroupController);

export { groupsRouter };
