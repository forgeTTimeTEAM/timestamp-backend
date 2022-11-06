import { Router } from "express";
import { createMarkerController } from "../controllers/markers";
import { deleteMarkersController } from "../controllers/markers/deleteMarkers.controller";
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
