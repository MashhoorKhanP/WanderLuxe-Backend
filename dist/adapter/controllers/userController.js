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
    constructor(userUseCase, GenerateEmail, GenerateOTP) {
        this.userUseCase = userUseCase;
        this.GenerateEmail = GenerateEmail;
        this.GenerateOTP = GenerateOTP;
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyUser = yield this.userUseCase.signUp(req.body.email);
                if (verifyUser.data.status === true && req.body.isGoogle) {
                    let user = yield this.userUseCase.verifyUser(req.body);
                    res.status(user.status).json(user.data);
                }
                else if (verifyUser.data.status === true) {
                    req.app.locals.userData = req.body;
                    const otp = this.GenerateOTP.generateOtp();
                    req.app.locals.otp = otp;
                    this.GenerateEmail.sendMail(req.body.email, otp);
                    console.log(otp);
                    setTimeout(() => {
                        req.app.locals.otp = this.GenerateOTP.generateOtp();
                    }, 3 * 60000);
                    res.status(verifyUser.status).json(verifyUser.data);
                }
                else {
                    res.status(verifyUser.status).json(verifyUser.data);
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = UserController;
