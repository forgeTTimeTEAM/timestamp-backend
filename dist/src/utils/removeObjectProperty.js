"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeObjectProperty = void 0;
const removeObjectProperty = (object, ...keys) => {
    for (let key of keys) {
        delete object[key];
    }
    return object;
};
exports.removeObjectProperty = removeObjectProperty;
