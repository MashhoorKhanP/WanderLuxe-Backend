"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const userRoute_1 = __importDefault(require("../routes/userRoute"));
const adminRoute_1 = __importDefault(require("../routes/adminRoute"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_1 = require("../services/socket");
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
dotenv_1.default.config();
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)({
            origin: '*',
            credentials: true,
        }));
        app.options("*", (0, cors_1.default)());
        app.use(express_1.default.json({ limit: "10mb" }));
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
        app.use((0, cookie_parser_1.default)());
        const httpServer = http_1.default.createServer(app);
        const repository = new userRepository_1.default();
        const socket = new socket_1.SocketManager(httpServer, repository);
        app.use("/api/user", userRoute_1.default);
        app.use("/api/admin", adminRoute_1.default);
        // // Handle 404 Not Found
        app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));
        // return app;
        return httpServer;
    }
    catch (error) {
        const err = error;
        console.log(err.message);
    }
};
exports.createServer = createServer;
