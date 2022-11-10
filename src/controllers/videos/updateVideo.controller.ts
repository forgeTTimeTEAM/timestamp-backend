import { RequestHandler } from "express";
import { IVideoUpdateParams } from "../../interfaces/videos";

import { updateVideoService } from "../../services/videos";

const updateVideoController: RequestHandler = async (req, res) => {
    const updateVideoRequest: IVideoUpdateParams = {
        videoId: req.params.id,
        video: req.body,
        groupId: req.user.groupId!,
        userRole: req.user.role,
    };

    const updatedVideo = await updateVideoService(updateVideoRequest);

    return res.status(200).json(updatedVideo);
};

export { updateVideoController };
