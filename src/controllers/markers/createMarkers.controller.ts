import { Request, Response } from "express";
import { createMarkers } from "../../services/markers/index";

const createMarkerController = async (req: Request, res: Response) => {
  const { marks, videoId } = req.body;
  const groupId = req.user.groupId;

  const response = await createMarkers({ marks, videoId, groupId });

  return res.status(201).json(response);
};

export { createMarkerController };
