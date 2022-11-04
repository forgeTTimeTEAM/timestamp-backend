import { Router } from "express";
import { createMarkerController } from "../controllers/markers";
import {
  verifyAdmPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

const markers = Router();

markers.post(
  "/",
  verifyTokenMiddleware,
  verifyAdmPermissionMiddleware,
  createMarkerController
);

export { markers };
