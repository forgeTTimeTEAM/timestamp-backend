import { Router } from "express";

import {
    createVideoController,
    updateVideoController,
    deleteVideoController
} from "../controllers/videos";

import {
    verifyInstructorOrAdmPermissionMiddleware,
    verifyTokenMiddleware,
} from "../middleware";

const videosRouter = Router();

videosRouter.post(
    "/",
    verifyTokenMiddleware,
    verifyInstructorOrAdmPermissionMiddleware,
    createVideoController
);
videosRouter.patch(
    "/:id",
    verifyTokenMiddleware,
    verifyInstructorOrAdmPermissionMiddleware,
    updateVideoController
);
videosRouter.delete(
    "/:id",
    verifyTokenMiddleware,
    verifyInstructorOrAdmPermissionMiddleware,
    deleteVideoController
);

export { videosRouter };
