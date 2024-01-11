"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("../routes/userRoute"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)());
        app.use('/api/user', userRoute_1.default);
        return app;
    }
    catch (error) {
        const err = error;
        console.log(err.message);
    }
};
exports.createServer = createServer;
