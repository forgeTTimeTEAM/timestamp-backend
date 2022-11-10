import { RequestHandler } from "express";
import { IVideoUpdateParams } from "../../interfaces/videos";

import { deleteVideoService } from "../../services/videos";

const deleteVideoController: RequestHandler = async (req, res) => {
    const deleteVideoRequest: IVideoUpdateParams = {
      videoId: req.params.id,
      video: req.body,
      groupId: req.user.groupId!,
      userRole: req.user.role
    }
    await deleteVideoService(deleteVideoRequest)

  return res.status(204).send();
};

export { deleteVideoController };
