import { Router } from "express";
import { createGroupController } from "../controllers/groups";

const groupsRouter = Router();

groupsRouter.post("/", createGroupController);

export { groupsRouter };
