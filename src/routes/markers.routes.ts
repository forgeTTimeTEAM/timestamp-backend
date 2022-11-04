import { Router } from "express";
import { createMarkerController } from "../controllers/markers";
import {
  verifyAdmPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

const markersRouter = Router();

markersRouter.post(
  "/",
  verifyTokenMiddleware,
  verifyAdmPermissionMiddleware,
  createMarkerController
);

export { markersRouter };
