"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
app_1.app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
});
