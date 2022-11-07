"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = void 0;
const users_1 = require("../../services/users");
const createUserController = async (req, res) => {
    const user = req.body;
    const createdUser = await (0, users_1.createUserService)(user);
    return res.status(201).json(createdUser);
};
exports.createUserController = createUserController;
