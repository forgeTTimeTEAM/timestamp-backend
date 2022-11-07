import { Router } from "express";

import {
  createMarkerController,
  deleteMarkersController,
} from "../controllers/markers";

import {
  verifyPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

const markersRouter = Router();

markersRouter.post(
  "/",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("ADM"),
  createMarkerController
);

markersRouter.delete(
  "/:id",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("INSTRUCTOR"),
  deleteMarkersController
);

export { markersRouter };
