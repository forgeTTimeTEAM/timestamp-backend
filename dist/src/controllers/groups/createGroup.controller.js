"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupController = void 0;
const groups_1 = require("../../services/groups");
const createGroupController = async (req, res) => {
    const group = await (0, groups_1.createGroupService)(req.body);
    return res.status(201).json(group);
};
exports.createGroupController = createGroupController;
