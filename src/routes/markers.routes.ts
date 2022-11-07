import { Router } from "express";

import {
  createMarkerController,
  deleteMarkerController,
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

<<<<<<< HEAD
=======
markersRouter.delete(
  "/:id",
  verifyTokenMiddleware,
  verifyPermissionMiddleware("INSTRUCTOR"),
  deleteMarkerController
);

>>>>>>> develop
export { markersRouter };
