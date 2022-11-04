import { Router } from "express";
import {
    createVideoController,
    deleteVideoController,
} from "../controllers/videos";

import { verifyTokenMiddleware } from "../middleware";

const videosRouter = Router();

videosRouter.post("/", verifyTokenMiddleware, createVideoController);
videosRouter.patch("/:id", verifyTokenMiddleware, deleteVideoController);

export { videosRouter };
