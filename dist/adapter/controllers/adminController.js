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
Object.defineProperty(exports, "__esModule", { value: true });
class AdminController {
    constructor(adminUseCase, chatUseCase) {
        this.adminUseCase = adminUseCase;
        this.chatUseCase = chatUseCase;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.adminUseCase.login(req.body);
                if (admin.data.token) {
                    res.cookie("adminJWT", admin.data.token, {
                        httpOnly: true,
                        sameSite: "none",
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                    });
                }
                res.status(admin.status).json({
                    success: true,
                    result: Object.assign({}, admin.data),
                });
            }
            catch (error) {
                const typedError = error;
                console.error("Error setting cookie:", typedError);
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.adminUseCase.getUsers();
                res.status(users.status).json({
                    success: true,
                    result: Object.assign({}, users.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    updateUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const { isVerified, isBlocked } = req.body;
                const updatedUser = yield this.adminUseCase.updateUser(userId, isVerified, isBlocked);
                res.status(updatedUser.status).json({
                    success: true,
                    result: { updatedUser },
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    newConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const members = [req.body.senderId, req.body.receiverId];
                const existing = yield this.chatUseCase.checkExisting(members);
                if (!(existing === null || existing === void 0 ? void 0 : existing.length)) {
                    const conversation = yield this.chatUseCase.newConversation(members);
                    res.status(200).json({
                        success: true,
                        result: Object.assign({}, conversation.data),
                    });
                }
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    getConversations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield this.chatUseCase.getConversations(req.params.conversationId);
                res.status(200).json({
                    success: true,
                    result: Object.assign({}, conversations.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    addMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.chatUseCase.addMessage(Object.assign({}, req.body));
                res.status(200).json({
                    success: true,
                    result: Object.assign({}, messages.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.chatUseCase.getMessages(req.params.conversationId);
                res.status(200).json({
                    success: true,
                    result: Object.assign({}, messages.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
}
exports.default = AdminController;
