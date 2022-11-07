"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoController = void 0;
const deleteVideo_service_1 = require("../../services/videos/deleteVideo.service");
const deleteVideoController = async (req, res) => {
    const id = req.params.id;
    (0, deleteVideo_service_1.deleteVideoService)(id);
    return res.status(204).send();
};
exports.deleteVideoController = deleteVideoController;
