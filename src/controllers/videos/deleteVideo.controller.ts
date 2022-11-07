import { RequestHandler } from "express";

import { deleteVideoService } from "../../services/videos/deleteVideo.service";

const deleteVideoController: RequestHandler = async (req, res) => {
  await deleteVideoService(req.params.id);

  return res.status(204).send();
};

export { deleteVideoController };
