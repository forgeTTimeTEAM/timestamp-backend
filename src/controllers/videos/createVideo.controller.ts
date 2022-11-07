import { RequestHandler } from "express";

import { createVideoService } from "../../services/videos";

const createVideoController: RequestHandler = async (req, res) => {
  const createdVideo = await createVideoService(req.user.groupId!, req.body);

  return res.status(201).json(createdVideo);
};

export { createVideoController };
