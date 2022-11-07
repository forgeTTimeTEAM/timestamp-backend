import { RequestHandler } from "express";

import { updateMarkerService } from "../../services/markers";

const  updateMarkerController: RequestHandler = async (req, res) => {
  const {
    params: { id },
    body,
  } = req;

  await updateMarkerService({ id, bodyPatch: body });

  res.status(201).send();
};

export { updateMarkerController };
