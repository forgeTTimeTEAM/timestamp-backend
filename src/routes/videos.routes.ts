import { Router } from "express";

import {
    createVideoController,
    deleteVideoController,
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
    deleteVideoController
);

export { videosRouter };
