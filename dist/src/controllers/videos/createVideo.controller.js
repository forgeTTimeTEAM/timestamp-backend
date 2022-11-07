"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoController = void 0;
const videos_1 = require("../../services/videos");
const createVideoController = async (req, res) => {
    const video = req.body;
    const groupId = req.user.groupId;
    const createdVideo = await (0, videos_1.createVideoService)(groupId, video);
    return res.status(201).json(createdVideo);
};
exports.createVideoController = createVideoController;
