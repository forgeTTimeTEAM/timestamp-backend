"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileController = void 0;
const users_1 = require("../../services/users");
const getUserProfileController = async (req, res) => {
    const userFound = await (0, users_1.getUserProfileService)(req.user.id);
    return res.status(200).json(userFound);
};
exports.getUserProfileController = getUserProfileController;
