"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./infrastructure/config/app");
const db_1 = __importDefault(require("./infrastructure/config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, app_1.createServer)();
const port = process.env.PORT || 6000;
(0, db_1.default)().then(() => {
    app === null || app === void 0 ? void 0 : app.listen(port, () => console.log(`Example app listening on port ${port}`));
});
