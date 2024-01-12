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
class UserController {
    constructor(userUseCase, GenerateEmail, GenerateOTP, SocketManager, chatUseCase) {
        this.userUseCase = userUseCase;
        this.GenerateEmail = GenerateEmail;
        this.GenerateOTP = GenerateOTP;
        this.SocketManager = SocketManager;
        this.chatUseCase = chatUseCase;
    }
    signUp(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyUser = yield this.userUseCase.signUp(req.body.email, req.body.mobile);
                if (((_a = verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.data) === null || _a === void 0 ? void 0 : _a.message) &&
                    typeof verifyUser.data.message === "object" &&
                    "createdAt" in verifyUser.data.message) {
                    return res.status(verifyUser.status).json({
                        success: true,
                        result: Object.assign({}, verifyUser.data),
                    });
                }
                if (verifyUser && verifyUser.data) {
                    if (verifyUser.data.status === true && req.body.isGoogle) {
                        let user = yield this.userUseCase.verifyUser(req.body);
                        if (user) {
                            res.status(user.status).json(Object.assign({}, user.data));
                        }
                    }
                    else if (verifyUser.data.status === true) {
                        req.app.locals.userData = req.body;
                        const otp = this.GenerateOTP.generateOtp();
                        req.app.locals.otp = otp;
                        this.GenerateEmail.sendMail(req.body.email, otp);
                        setTimeout(() => {
                            req.app.locals.otp = null;
                        }, 2 * 60000);
                        res.status(verifyUser.status).json(verifyUser.data);
                    }
                    else {
                        res.status(400).json({
                            success: false,
                            result: Object.assign({}, (verifyUser.data || {})), // Ensure that verifyUser.data is defined
                        });
                    }
                }
                else {
                    res.status(400).json({ success: false, result: {} });
                }
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    googleSignUp(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyUser = yield this.userUseCase.googleSignUp(req.body.email);
                if (((_a = verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.data) === null || _a === void 0 ? void 0 : _a.message) &&
                    typeof verifyUser.data.message === "object" &&
                    "createdAt" in verifyUser.data.message) {
                    return res.status(verifyUser.status).json({
                        success: true,
                        result: Object.assign({}, verifyUser.data),
                    });
                }
                if (verifyUser && verifyUser.data) {
                    if (verifyUser.data.status === true && req.body.isGoogle) {
                        let user = yield this.userUseCase.verifyUser(req.body);
                        if (user) {
                            res.status(user.status).json(Object.assign({}, user.data));
                        }
                    }
                }
                else {
                    res.status(400).json({
                        success: false,
                        data: { message: "You have been blocked by Admin" },
                    });
                }
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    userVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isForgotPassword = req.query.forgotPassword;
                if (isForgotPassword === "false") {
                    if (req.body.otp.otp === req.app.locals.otp) {
                        const user = yield this.userUseCase.verifyUser(req.app.locals.userData);
                        if (user) {
                            req.app.locals.userData = null;
                            req.app.locals.otp = null;
                            res.status(user.status).json(user.data);
                        }
                    }
                    else {
                        res.status(400).json({
                            success: false,
                            data: {
                                message: "Invalid otp",
                            },
                        });
                    }
                }
                else {
                    if (req.body.otp.otp === req.app.locals.otp) {
                        const user = yield this.userUseCase.verifyForgotPasswordUser(req.app.locals.forgotPasswordData, isForgotPassword);
                        if (user) {
                            req.app.locals.userData = null;
                            req.app.locals.otp = null;
                            res.status(user.status).json(user.data);
                        }
                    }
                    else {
                        res.status(400).json({
                            success: false,
                            data: {
                                message: "Invalid otp",
                            },
                        });
                    }
                }
            }
            catch (error) {
                const typedError = error;
                res.status(400).json(typedError.message);
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = this.GenerateOTP.generateOtp();
                req.app.locals.otp = otp;
                this.GenerateEmail.sendMail(req.app.locals.userData.email, otp);
                setTimeout(() => {
                    req.app.locals.otp = this.GenerateOTP.generateOtp();
                }, 3 * 6000);
                res.status(200).json({
                    message: "Otp has been sent!(/backend/userController/resendOtp)",
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json(typedError.message);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userUseCase.login(req.body);
                if (user.data.token) {
                    res.cookie("userJWT", user.data.token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        sameSite: "none",
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                    });
                }
                res.status(user.status).json({
                    success: true,
                    result: Object.assign({}, user.data),
                });
            }
            catch (error) {
                const typedError = error;
                console.error("Error setting cookie:", typedError);
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const updatedUser = yield this.userUseCase.updateProfile(userId, req.body);
                res.status(200).json({
                    success: true,
                    result: Object.assign({}, updatedUser.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    addRemoveFromWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId, userId } = req.body;
                const result = yield this.userUseCase.addRemoveFromWishlist(hotelId, userId);
                res.status(result.status).json({
                    success: true,
                    result: Object.assign({}, result.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, currentPassword, newPassword } = req.body;
                const result = yield this.userUseCase.updatePassword(userId, currentPassword, newPassword);
                res.status(result.status).json({
                    success: true,
                    result: Object.assign({}, result.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newPassword } = req.body;
                req.app.locals.forgotPasswordData = req.body;
                const verifiedUser = yield this.userUseCase.forgotPassword(email, newPassword);
                if (verifiedUser.data.status === true) {
                    req.app.locals.userData = req.body;
                    const otp = this.GenerateOTP.generateOtp();
                    req.app.locals.otp = otp;
                    this.GenerateEmail.sendMail(req.body.email, otp);
                    setTimeout(() => {
                        req.app.locals.otp = null;
                    }, 2 * 60000);
                    res.status(verifiedUser.status).json(verifiedUser.data);
                }
                else {
                    res.status(400).json({
                        success: false,
                        result: Object.assign({}, (verifiedUser.data || {})), // Ensure that verifyUser.data is defined
                    });
                }
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    addMoneyToWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.app.locals.wallet = req.body;
                const payment = yield this.userUseCase.addMoneyToWallet(req.body);
                if (payment) {
                    return res.status(payment.status).json({
                        success: true,
                        result: Object.assign({}, payment.data),
                    });
                }
                else {
                    res.status(400).json({ success: false, result: {} });
                }
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    walletWebhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const localData = req.app.locals.wallet;
                let transactionId;
                let receiptUrl;
                if (req.body.type === "charge.succeeded") {
                    transactionId = req.body.data.object.payment_intent;
                    receiptUrl = req.body.data.object.receipt_url;
                }
                const confirmPayment = yield this.userUseCase.confirmWalletPayment(req);
                if (confirmPayment) {
                    const added = yield this.userUseCase.addMoney(localData, transactionId);
                    req.app.locals.updatedWalletData = added.data.message;
                    let messageData = JSON.parse(JSON.stringify(added.data.message));
                    this.SocketManager.io.emit("message", messageData);
                    return res.status(added.status).json({
                        success: true,
                        result: Object.assign({}, added.data),
                    });
                }
                else {
                    res.status(400).json({ success: false, result: {} });
                }
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    getUpdatedUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const updatedUser = yield this.userUseCase.getUpdatedUser(userId);
                res.status(200).json({
                    success: true,
                    result: Object.assign({}, updatedUser.data),
                });
            }
            catch (error) {
                const typedError = error;
                res.status(400).json({ success: false, error: typedError.message });
            }
        });
    }
    //Chat
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
                const conversations = yield this.chatUseCase.getConversations(req.params.userId);
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
exports.default = UserController;
