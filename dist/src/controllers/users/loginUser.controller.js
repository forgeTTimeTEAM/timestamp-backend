"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserController = void 0;
const loginUser_service_1 = require("../../services/users/loginUser.service");
const loginUserController = async (req, res) => {
    const { body } = req;
    const token = await (0, loginUser_service_1.loginUserService)(body);
    return res.status(200).json({ token });
};
exports.loginUserController = loginUserController;
