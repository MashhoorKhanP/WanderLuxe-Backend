"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./infrastructure/config/app");
const db_1 = __importDefault(require("./infrastructure/config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, app_1.createServer)();
const port = process.env.PORT || 6000;
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    // methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    // allowedHeaders: "X-Requested-With, Content-Type, Authorization",
    credentials: true,
}));
app.options("*", (0, cors_1.default)());
(0, db_1.default)().then(() => {
    app === null || app === void 0 ? void 0 : app.listen(port, () => console.log(`Example app listening on port ${port}`));
});
