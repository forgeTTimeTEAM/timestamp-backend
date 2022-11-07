import { Router } from "express";

import {
  createMarkerController,
  deleteMarkerController,
  updateMarkerController,
} from "../controllers/markers";

import {
  verifyInstructorOrAdmPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

const markersRouter = Router();

markersRouter.post(
  "/",
  verifyTokenMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  createMarkerController
);
markersRouter.delete(
  "/:id",
  verifyTokenMiddleware,
  verifyInstructorOrAdmPermissionMiddleware,
  deleteMarkerController
);
export { markersRouter };
