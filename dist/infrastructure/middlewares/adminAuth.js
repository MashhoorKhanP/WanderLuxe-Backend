"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminRepository_1 = __importDefault(require("../repositories/adminRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminRepo = new adminRepository_1.default();
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.adminJWT;
        if (token) {
            const decoded = jsonwebtoken_1.default.decode(token);
            if (decoded.role === "admin") {
                const admin = yield adminRepo.findByEmail(decoded.email);
                if (admin && decoded.role === "admin") {
                    next();
                }
            }
        }
        else {
            return res.status(401).json({
                success: false,
                result: { success: false, message: "Unauthorized Access" },
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(401).json({
            success: false,
            result: {
                success: false,
                message: "Something went wrong with your authorization",
            },
        });
    }
});
exports.default = adminAuth;
