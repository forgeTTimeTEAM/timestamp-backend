import { RequestHandler } from "express";

import { createMarkerServices } from "../../services/markers/index";

const createMarkerController: RequestHandler = async (req, res) => {
  const { marks, videoId } = req.body;
  const groupId = req.user.groupId;

  const createdMarker = await createMarkerServices({ marks, videoId, groupId });
  return res.status(201).json(createdMarker);
};

export { createMarkerController };
