import { RequestHandler } from "express";

import { updateMarkerService } from "../../services/markers";

const  updateMarkerController: RequestHandler = async (req, res) => {
  const {
    params: { id },
    body,
    user
  } = req;

  const updatemarker = await updateMarkerService({ id, bodyPatch: body }, user);
  res.send(updatemarker);
};

export { updateMarkerController };
