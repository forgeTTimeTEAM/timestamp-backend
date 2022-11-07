"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markers = void 0;
const express_1 = require("express");
const markers_1 = require("../controllers/markers");
const middleware_1 = require("../middleware");
const markers = (0, express_1.Router)();
exports.markers = markers;
markers.post("/", middleware_1.verifyTokenMiddleware, middleware_1.verifyAdmPermissionMiddleware, markers_1.createMarkerController);
