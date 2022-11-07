"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsRouter = void 0;
const express_1 = require("express");
const groups_1 = require("../controllers/groups");
const middleware_1 = require("../middleware");
const groupsRouter = (0, express_1.Router)();
exports.groupsRouter = groupsRouter;
groupsRouter.post("/", middleware_1.verifyTokenMiddleware, middleware_1.verifyAdmPermissionMiddleware, groups_1.createGroupController);
