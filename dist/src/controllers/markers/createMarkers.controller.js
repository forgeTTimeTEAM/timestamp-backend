"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkerController = void 0;
const index_1 = require("../../services/markers/index");
const createMarkerController = async (req, res) => {
    const { marks, videoId } = req.body;
    const groupId = req.user.groupId;
    const response = await (0, index_1.createMarkers)({ marks, videoId, groupId });
    return res.status(201).json(response);
};
exports.createMarkerController = createMarkerController;
