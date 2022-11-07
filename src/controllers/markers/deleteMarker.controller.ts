import { RequestHandler } from "express";

import { deleteMarkerService } from "../../services/markers";

const deleteMarkersController: RequestHandler = async (req, res) => {
  const {
    params: { id },
    user: { id: userId },
  } = req;

  await deleteMarkerService(id, userId);

  res.status(204).send();
};

export { deleteMarkersController };
