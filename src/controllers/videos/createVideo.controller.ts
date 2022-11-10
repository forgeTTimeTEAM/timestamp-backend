import { RequestHandler } from "express";
import { IVideoCreateParams } from "../../interfaces/videos";

import { createVideoService } from "../../services/videos";

const createVideoController: RequestHandler = async (req, res) => {
    const createVideoRequest: IVideoCreateParams = {
        video: req.body,
        groupId: req.user.groupId!,
        userRole: req.user.role,
    };

    const createdVideo = await createVideoService(createVideoRequest);

    return res.status(201).json(createdVideo);
};

export { createVideoController };
