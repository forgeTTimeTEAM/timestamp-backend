"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginStudentMock = exports.userStudentMock = exports.loginAdmMock = exports.userAdmMock = void 0;
const bcryptjs_1 = require("bcryptjs");
exports.userAdmMock = {
    email: "lucas.jozefovicz@mail.com",
    name: "Lucas",
    password: (0, bcryptjs_1.hashSync)("1234", 10),
    role: "ADM",
};
exports.loginAdmMock = {
    email: "lucas.jozefovicz@mail.com",
    password: "1234",
};
exports.userStudentMock = {
    email: "student@mail.com",
    name: "student",
    password: "1234",
    groupId: "",
    moduleId: "",
};
exports.loginStudentMock = {
    email: "student@mail.com",
    password: "1234",
};
