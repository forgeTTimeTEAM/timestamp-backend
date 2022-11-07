import { RequestHandler } from "express";

import { createMarker } from "../../services/markers/index";

const createMarkerController: RequestHandler = async (req, res) => {
  const { marks, videoId } = req.body;
  const groupId = req.user.groupId;

  const createdMarker = await createMarker({ marks, videoId, groupId });

  return res.status(201).json(createdMarker);
};

export { createMarkerController };
