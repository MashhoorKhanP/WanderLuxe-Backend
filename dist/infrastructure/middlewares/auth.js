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
const google_auth_library_1 = require("google-auth-library");
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const userRepo = new userRepository_1.default();
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const googleToken = (token === null || token === void 0 ? void 0 : token.length) > 1000;
        if (googleToken) {
            const ticket = yield client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const userPayload = payload;
            req.user = {
                _id: userPayload === null || userPayload === void 0 ? void 0 : userPayload.sub,
                firstName: userPayload === null || userPayload === void 0 ? void 0 : userPayload.given_name,
                lastName: userPayload === null || userPayload === void 0 ? void 0 : userPayload.family_name,
                email: userPayload === null || userPayload === void 0 ? void 0 : userPayload.email,
                profileImage: userPayload === null || userPayload === void 0 ? void 0 : userPayload.picture,
            };
        }
        else {
            // To do: verify our custom jwt token
            let token;
            token = req.cookies.userJWT;
            if (token) {
                const decoded = jsonwebtoken_1.default.decode(token);
                if (decoded.role === "user") {
                    const user = yield userRepo.findById(decoded._id);
                    if (user && decoded.role === "user") {
                        req.userId = user._id;
                        if (user.isBlocked) {
                            return res.status(401).json({
                                success: false,
                                result: {
                                    success: false,
                                    message: "You have been blocked by admin!",
                                },
                            });
                        }
                        else {
                            next();
                        }
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
exports.default = auth;
