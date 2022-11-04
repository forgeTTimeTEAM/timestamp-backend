import { RequestHandler } from "express";
import { IVideoRequest } from "../../interfaces/videos";

import { createVideoService } from "../../services/videos";

const createVideoController: RequestHandler = async (req, res) => {
    const video: IVideoRequest = req.body;
    const groupId = req.user.groupId;

    const createdVideo = await createVideoService(groupId!, video);

    return res.status(201).json(createdVideo);
};

export { createVideoController };