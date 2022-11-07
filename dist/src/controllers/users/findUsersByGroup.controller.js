"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUsersByGroupController = void 0;
const users_1 = require("../../services/users");
const findUsersByGroupController = async (req, res) => {
    const { id } = req.params;
    const users = await (0, users_1.findUsersByGroupService)(id);
    return res.status(200).json(users);
};
exports.findUsersByGroupController = findUsersByGroupController;
